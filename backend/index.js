const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sequelize, User } = require("./models");
const cors = require("cors");
const axios = require("axios"); // ← TAMBAHKAN INI untuk camera stream
require("dotenv").config();

const mqttClient = require("./mqtt");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = process.env.JWT_SECRET || "SUPER_SECRET_JWT_UBAH_INI";

// ==========================================
// 🏠 HOME ROUTE
// ==========================================
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Smart-Train Backend API - Real-time MQTT Data",
    endpoints: {
      auth: ["/auth/register", "/auth/login", "/auth/user/:id"],
      train: [
        "/train/latest",
        "/train/realtime",
        "/train-speed/history",
        "/train/location (NEW - from MQTT)",
        "/train/segment (NEW - from MQTT)"
      ],
      palang: ["/palang", "/palang/update"],
      camera: ["/camera", "/camera/update", "/camera/stream (NEW - Live Stream)"], // ← UPDATE INI
    },
  });
});

// ==========================================
// 🔐 AUTHENTICATION ROUTES
// ==========================================

// Register
app.post("/auth/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !name || !password) {
    return res
      .status(400)
      .json({ message: "Email, name, and password are required" });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      name,
      password: hashedPassword,
    });

    console.log("✅ User created successfully! ID:", newUser.id);
    res.status(201).json({ message: "Register success" });
  } catch (error) {
    console.error("❌ REGISTRATION ERROR:", error);
    res.status(500).json({ message: "Register failed" });
  }
});

// Login
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Email not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      accessToken: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("❌ LOGIN ERROR:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

// Get User by ID
app.get("/auth/user/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("❌ GET USER ERROR:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ==========================================
// 🚆 TRAIN SPEED ROUTES
// ==========================================

// Get Latest Train Speed (Rata-rata) dari DATABASE
app.get("/train/latest", async (req, res) => {
  try {
    const [rows] = await sequelize.query(
      "SELECT * FROM train_speed ORDER BY id DESC LIMIT 1"
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get Train Speed History (Rata-rata) untuk GRAFIK dari DATABASE
app.get("/train-speed/history", async (req, res) => {
  const { filter } = req.query;

  let condition = "";

  switch (filter) {
    case "1m":
      condition =
        "created_at >= NOW() - INTERVAL 1 MINUTE AND DATE(created_at) = CURDATE()";
      break;
    case "5m":
      condition =
        "created_at >= NOW() - INTERVAL 5 MINUTE AND DATE(created_at) = CURDATE()";
      break;
    case "10m":
      condition =
        "created_at >= NOW() - INTERVAL 10 MINUTE AND DATE(created_at) = CURDATE()";
      break;
    case "30m":
      condition =
        "created_at >= NOW() - INTERVAL 30 MINUTE AND DATE(created_at) = CURDATE()";
      break;
    default:
      condition =
        "created_at >= NOW() - INTERVAL 5 MINUTE AND DATE(created_at) = CURDATE()";
  }

  try {
    const [rows] = await sequelize.query(`
      SELECT speed, created_at
      FROM train_speed
      WHERE ${condition}
      ORDER BY created_at ASC
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB Error" });
  }
});

// Get Realtime Train Speed untuk GRAFIK dari DATABASE
app.get("/train/realtime", async (req, res) => {
  try {
    const [rows] = await sequelize.query(`
      SELECT 
        segment,
        speed,
        DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at
      FROM train_speed_realtime
      ORDER BY id DESC
      LIMIT 30
    `);

    res.json(rows.reverse());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB Error" });
  }
});

// ==========================================
// 📍 TRAIN LOCATION (NEW - dari MQTT in-memory)
// ==========================================
app.get("/train/location", (req, res) => {
  try {
    const locationData = mqttClient.getLocationData();
    
    if (!locationData || !locationData.titik || locationData.titik === "Unknown") {
      return res.json({
        titik: "Unknown",
        message: "Waiting for MQTT data...",
        timestamp: null
      });
    }

    res.json(locationData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching location data" });
  }
});

// ==========================================
// 🚆 TRAIN SEGMENT SPEED (NEW - dari MQTT in-memory)
// ==========================================
app.get("/train/segment", (req, res) => {
  try {
    const segmentData = mqttClient.getSegmentData();
    
    if (!segmentData || !segmentData.id) {
      return res.json({
        id: null,
        speed: null,
        message: "Waiting for MQTT data...",
        timestamp: null
      });
    }

    res.json(segmentData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching segment data" });
  }
});

// ==========================================
// 🚧 PALANG (BARRIER) ROUTES
// ==========================================

// Get Latest Palang Status
app.get("/palang", async (req, res) => {
  try {
    const [rows] = await sequelize.query(
      "SELECT * FROM palang ORDER BY id DESC LIMIT 1"
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No palang data found" });
    }

    res.json([rows[0]]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Update Palang Status via MQTT
app.post("/palang/update", (req, res) => {
  const { status } = req.body;

  console.log(`📤 Publishing palang status: ${status}`);
  mqttClient.publish("smartTrain/barrier", JSON.stringify({ status }));

  res.json({ success: true });
});

// ==========================================
// 📸 CAMERA ROUTES
// ==========================================

// Get Latest Camera Status
app.get("/camera", async (req, res) => {
  try {
    const [rows] = await sequelize.query(
      "SELECT * FROM camera ORDER BY id DESC LIMIT 1"
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No camera data found" });
    }

    res.json([rows[0]]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Update Camera Status via MQTT
app.post("/camera/update", (req, res) => {
  const { status } = req.body;

  console.log(`📤 Publishing camera status: ${status}`);
  mqttClient.publish("smartTrain/camera", JSON.stringify({ status }));

  res.json({ success: true });
});

// ==========================================
// 📹 CAMERA STREAM (NEW - Live Stream Relay)
// ==========================================
// ← TAMBAHKAN ENDPOINT BARU INI
app.get("/camera/stream", async (req, res) => {
  const CAMERA_URL = process.env.CAMERA_URL || "http://192.168.1.187/stream";
  
  try {
    console.log(`📹 Relaying camera stream from ${CAMERA_URL}`);
    
    // Fetch stream dari ESP32-CAM
    const response = await axios({
      method: 'get',
      url: CAMERA_URL,
      responseType: 'stream',
      timeout: 30000 // 30 seconds
    });

    // Set headers untuk MJPEG stream
    res.setHeader('Content-Type', 'multipart/x-mixed-replace; boundary=frame');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Connection', 'close');

    // Pipe stream ke response
    response.data.pipe(res);

    // Handle stream errors
    response.data.on('error', (error) => {
      console.error('❌ Camera stream error:', error.message);
      res.end();
    });

    // Handle client disconnect
    req.on('close', () => {
      console.log('🔌 Client disconnected from camera stream');
      response.data.destroy();
    });

  } catch (error) {
    console.error('❌ Camera stream relay error:', error.message);
    res.status(503).json({ 
      error: 'Camera stream unavailable',
      message: error.message 
    });
  }
});

// ==========================================
// 🚀 START SERVER
// ==========================================
const PORT = process.env.PORT || 5000;

sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connected!");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
      console.log("📡 MQTT client initialized and listening...");
      console.log("💾 Real-time data: Location & Segment (in-memory)");
      console.log("💾 Database data: Speed History, Realtime, Palang, Camera");
      console.log("📹 Camera stream relay: READY"); // ← TAMBAH LOG INI
    });
  })
  .catch((err) => {
    console.error("❌ Unable to connect to database:", err);
  });