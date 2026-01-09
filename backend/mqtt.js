// ==========================================
// 🔧 Konfigurasi MQTT HiveMQ Cloud
// IN-MEMORY VERSION - Data real-time tanpa simpan database
// ==========================================
const mqtt = require("mqtt");
const { sequelize } = require("./models");

// MQTT Broker Configuration
const mqttServer = "mqtts://9e108cb03c734f0394b0f0b49508ec1e.s1.eu.hivemq.cloud:8883";
const mqttUser = "Device02";
const mqttPass = "Device02";

// Topics
const topicSpeedometer = "smartTrain/speedometer";
const topicTelemetry = "smartTrain/Telemetry_batch";
const topicLocation = "smartTrain/location";
const topicBarrier = "smartTrain/barrier";
const topicCamera = "smartTrain/camera";

// ==========================================
// 🧠 IN-MEMORY STORAGE (tidak di database)
// ==========================================
let currentLocation = { titik: "Unknown", timestamp: null };
let currentSegmentSpeed = { id: null, speed: null, timestamp: null };

// Export untuk diakses dari index.js
module.exports.getLocationData = () => currentLocation;
module.exports.getSegmentData = () => currentSegmentSpeed;

// ==========================================
// 🧠 Cache & Queue System
// ==========================================
const lastRealtimeCache = new Map();
let barrierQueue = Promise.resolve();
let cameraQueue = Promise.resolve();

let isBarrierProcessing = false;
let isCameraProcessing = false;

let lastBarrierStatus = null;
let lastCameraStatus = null;

// ==========================================
// 🚀 MQTT Connect
// ==========================================
const mqttClient = mqtt.connect(mqttServer, {
  username: mqttUser,
  password: mqttPass,
  reconnectPeriod: 5000,
});

mqttClient.on("connect", () => {
  console.log("📡 Terhubung ke HiveMQ!");
  mqttClient.subscribe(
    [topicSpeedometer, topicTelemetry, topicLocation, topicBarrier, topicCamera],
    (err) => {
      if (!err) {
        console.log("✅ Subscribe berhasil:");
        console.log(" - " + topicSpeedometer);
        console.log(" - " + topicTelemetry);
        console.log(" - " + topicLocation);
        console.log(" - " + topicBarrier);
        console.log(" - " + topicCamera);
      }
    }
  );
});

// ==========================================
// 📥 MQTT Message Handler
// ==========================================
mqttClient.on("message", async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    const timestamp = new Date();

    // ======================================================
    // 🚆 SPEEDOMETER
    // ======================================================
    if (topic === topicSpeedometer) {
      // Tipe "segmen" - SIMPAN DI MEMORY SAJA
      if (data.tipe === "segmen") {
        const segmentId = data.id;
        const speed = data.kecepatan_s;

        // Update in-memory storage
        currentSegmentSpeed = {
          id: segmentId,
          speed: speed,
          timestamp: timestamp
        };

        console.log(`📊 SEGMEN ${segmentId} → ${speed} cm/s (in-memory only)`);
      }
      // Tipe "rata_rata" - SIMPAN KE DATABASE
      else if (data.tipe === "rata_rata") {
        const avgSpeed = data.kecepatan_r;

        console.log(`📥 RATA-RATA → ${avgSpeed} cm/s`);

        try {
          await sequelize.query(
            "INSERT INTO train_speed (speed, created_at) VALUES (?, ?)",
            {
              replacements: [avgSpeed, timestamp],
            }
          );
          console.log("💾 RATA-RATA tersimpan ke DB!");
        } catch (err) {
          console.error("❌ Error insert rata-rata:", err);
        }
      }

      return;
    }

    // ======================================================
    // 🚆 TELEMETRY_BATCH - SIMPAN KE DATABASE
    // ======================================================
    if (topic === topicTelemetry) {
      if (!data.speed || typeof data.speed !== "object") return;

      const secondBucket = Math.floor(Date.now() / 1000);
      const createdAt = new Date(secondBucket * 1000);

      const inserts = [];

      for (const [segment, speedRaw] of Object.entries(data.speed)) {
        const speed = Number(speedRaw);
        if (Number.isNaN(speed)) continue;

        const cacheKey = `${segment}_${secondBucket}`;

        if (lastRealtimeCache.has(cacheKey)) continue;

        lastRealtimeCache.set(cacheKey, true);
        inserts.push([segment, speed, createdAt]);
      }

      if (inserts.length === 0) return;

      try {
        await sequelize.query(
          `INSERT INTO train_speed_realtime (segment, speed, created_at) VALUES ?`,
          {
            replacements: [inserts],
          }
        );

        console.log(`📈 Telemetry saved: ${inserts.length} segments`);
      } catch (err) {
        console.error("❌ Telemetry insert error:", err);
      }

      return;
    }

    // ======================================================
    // 📍 LOCATION - SIMPAN DI MEMORY SAJA
    // ======================================================
    if (topic === topicLocation) {
      const titik = data.titik;

      // Update in-memory storage
      currentLocation = {
        titik: titik,
        timestamp: timestamp
      };

      console.log(`📍 LOCATION: ${titik} (in-memory only)`);
      return;
    }

    // ======================================================
    // 🚧 BARRIER (PALANG) - SIMPAN KE DATABASE
    // ======================================================
    if (topic === topicBarrier) {
      const currentStatus = data.status;

      console.log(`📥 BARRIER request received: ${currentStatus}`);

      if (isBarrierProcessing) {
        console.log(`⚠️ BARRIER: Already processing, request IGNORED`);
        return;
      }

      barrierQueue = barrierQueue.then(async () => {
        isBarrierProcessing = true;

        try {
          await new Promise((resolve) => setTimeout(resolve, 50));

          if (currentStatus === lastBarrierStatus) {
            console.log(
              `⚠️ BARRIER: Status sama dengan cache (${currentStatus}), SKIP`
            );
            return;
          }

          const [lastRecord] = await sequelize.query(
            "SELECT status FROM palang ORDER BY id DESC LIMIT 1 FOR UPDATE"
          );

          if (
            lastRecord.length > 0 &&
            lastRecord[0].status === currentStatus
          ) {
            console.log(
              `⚠️ BARRIER: Status sama dengan DB (${currentStatus}), SKIP`
            );
            lastBarrierStatus = currentStatus;
            return;
          }

          console.log(
            `🚧 BARRIER: Insert status ${currentStatus} at ${timestamp.toISOString()}`
          );

          await sequelize.query(
            "INSERT INTO palang (status, created_at, updated_at) VALUES (?, ?, ?)",
            {
              replacements: [currentStatus, timestamp, timestamp],
            }
          );

          console.log("💾 BARRIER inserted successfully!");
          lastBarrierStatus = currentStatus;
        } catch (err) {
          console.error("❌ BARRIER queue error:", err);
        } finally {
          isBarrierProcessing = false;
        }
      });

      return;
    }

    // ======================================================
    // 📸 CAMERA - SIMPAN KE DATABASE
    // ======================================================
    if (topic === topicCamera) {
      const currentStatus = data.status;

      console.log(`📥 CAMERA request received: ${currentStatus}`);

      if (isCameraProcessing) {
        console.log(`⚠️ CAMERA: Already processing, request IGNORED`);
        return;
      }

      cameraQueue = cameraQueue.then(async () => {
        isCameraProcessing = true;

        try {
          await new Promise((resolve) => setTimeout(resolve, 50));

          if (currentStatus === lastCameraStatus) {
            console.log(
              `⚠️ CAMERA: Status sama dengan cache (${currentStatus}), SKIP`
            );
            return;
          }

          const [lastRecord] = await sequelize.query(
            "SELECT status FROM camera ORDER BY id DESC LIMIT 1 FOR UPDATE"
          );

          if (
            lastRecord.length > 0 &&
            lastRecord[0].status === currentStatus
          ) {
            console.log(
              `⚠️ CAMERA: Status sama dengan DB (${currentStatus}), SKIP`
            );
            lastCameraStatus = currentStatus;
            return;
          }

          console.log(
            `📸 CAMERA: Insert status ${currentStatus} at ${timestamp.toISOString()}`
          );

          await sequelize.query(
            "INSERT INTO camera (status, created_at, updated_at) VALUES (?, ?, ?)",
            {
              replacements: [currentStatus, timestamp, timestamp],
            }
          );

          console.log("💾 CAMERA inserted successfully!");
          lastCameraStatus = currentStatus;
        } catch (err) {
          console.error("❌ CAMERA queue error:", err);
        } finally {
          isCameraProcessing = false;
        }
      });

      return;
    }
  } catch (err) {
    console.error("⚠️ Error parsing MQTT message:", err);
    console.error("Topic:", topic);
    console.error("Message:", message.toString());
  }
});

// ==========================================
// 🔌 Error & Close Handlers
// ==========================================
mqttClient.on("error", (err) => {
  console.error("❌ MQTT Error:", err);
});

mqttClient.on("close", () => {
  console.log("🔌 MQTT Connection closed");
});

module.exports = mqttClient;