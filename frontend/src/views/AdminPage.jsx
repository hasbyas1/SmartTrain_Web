import React, { useState, useEffect } from "react";
import Sidebar from "../components/AdminSidebar";
import Navbar from "../components/AdminNavbar";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useMQTT } from "../hooks/useMQTT";

const API_URL = process.env.REACT_APP_API_URL || "http://192.168.1.71:4000";


// MQTT Topics (constant untuk prevent reconnect loop)
const MQTT_TOPICS = [
  "smartTrain/speedometer",
  "smartTrain/location",
  "smartTrain/camera/ip"
];

export default function AdminDashboard() {
  // States untuk data
  const [speedHistory, setSpeedHistory] = useState([]); // History rata-rata untuk grafik
  const [realtimeSpeed, setRealtimeSpeed] = useState([]); // Realtime untuk grafik
  const [trainLocation, setTrainLocation] = useState({ titik: "Unknown" }); // Keberadaan kereta - DARI MQTT
  const [segmentSpeed, setSegmentSpeed] = useState({ id: null, speed: null }); // Kecepatan per segmen - DARI MQTT
  const [palangStatus, setPalangStatus] = useState("Loading...");
  const [palangLoading, setPalangLoading] = useState(false);
  const [cameraIP, setCameraIP] = useState(null);
  const [showFeed, setShowFeed] = useState(false);
  const [cameraStatus, setCameraStatus] = useState("Loading...");
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState(false);


  // States UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFilter, setTimeFilter] = useState("1m");

  // ==========================================
  // 📡 MQTT CONNECTION - untuk Kecepatan Per Segmen & Keberadaan Kereta
  // ==========================================
  const { messages: mqttMessages, isConnected: isMQTTConnected } = useMQTT(MQTT_TOPICS);

  // Update cameraIP ketika ada message dari MQTT topic camera/ip
  useEffect(() => {
    const msg = mqttMessages["smartTrain/camera/ip"];
    if (msg && msg.ip) {
      // SAMA SEPERTI MOBILE: Langsung set apapun yang diterima!
      setCameraIP(msg.ip);
      console.log("📷 Camera IP from MQTT:", msg.ip);
    }
  }, [JSON.stringify(mqttMessages["smartTrain/camera/ip"])]);

  // AUTO-RETRY: Check IP setiap 3 detik sampai dapat IP valid
  useEffect(() => {
    if (cameraStatus === "Aktif" && (cameraIP === "waiting..." || cameraIP === "offline" || !cameraIP)) {
      const interval = setInterval(() => {
        const msg = mqttMessages["smartTrain/camera/ip"];
        console.log("🔄 Auto-checking IP... Current:", msg?.ip || "null");
        if (msg && msg.ip && msg.ip !== "waiting..." && msg.ip !== "offline") {
          setCameraIP(msg.ip);
          console.log("✅ Got valid IP:", msg.ip);
        }
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [cameraStatus, cameraIP, mqttMessages]);

  // Update trainLocation ketika ada message dari MQTT topic location
  useEffect(() => {
    const msg = mqttMessages["smartTrain/location"];
    if (msg) {
      // Gunakan timestamp baru setiap message agar state selalu update
      setTrainLocation({ ...msg, _ts: Date.now() });
      console.log("📍 Train Location updated from MQTT:", msg);
    }
  }, [JSON.stringify(mqttMessages["smartTrain/location"])]);

  // Update segmentSpeed ketika ada message dari MQTT topic speedometer dengan tipe 'segmen'
  useEffect(() => {
    const data = mqttMessages["smartTrain/speedometer"];
    if (data && data.tipe === "segmen") {
      // Tambahkan _ts agar setiap message baru pasti update
      setSegmentSpeed({
        id: data.id,
        speed: data.kecepatan_s,
        timestamp: new Date().toISOString(),
        _ts: Date.now()
      });
      console.log("📊 Segment Speed updated from MQTT:", data);
    }
  }, [JSON.stringify(mqttMessages["smartTrain/speedometer"])]);

  // ==========================================
  // 📡 FETCH DATA FROM API
  // ==========================================

  // Fetch Speed History (Rata-rata untuk grafik)
  const fetchSpeedHistory = async (filter = "1m") => {
    try {
      const response = await axios.get(
        `${API_URL}/train-speed/history?filter=${filter}`
      );
      
      // Format data untuk recharts
      const formattedData = response.data.map((item) => ({
        time: new Date(item.created_at).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        }),
        speed: parseFloat(item.speed) || 0,
        timestamp: new Date(item.created_at).getTime()
      }));
      
      setSpeedHistory(formattedData);
    } catch (err) {
      console.error("Error fetching speed history:", err);
    }
  };

  // Fetch Realtime Speed (untuk grafik realtime)
  const fetchRealtimeSpeed = async () => {
    try {
      const response = await axios.get(`${API_URL}/train/realtime`);
      
      // Format data untuk recharts
      // Group by time dan aggregate speeds
      const dataMap = {};
      
      response.data.forEach((item) => {
        const time = new Date(item.created_at).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        });
        
        if (!dataMap[time]) {
          dataMap[time] = {
            time: time,
            speed: 0,
            count: 0,
            timestamp: new Date(item.created_at).getTime()
          };
        }
        
        dataMap[time].speed += parseFloat(item.speed) || 0;
        dataMap[time].count += 1;
      });
      
      // Calculate average and sort by timestamp
      const formattedData = Object.values(dataMap)
        .map(item => ({
          time: item.time,
          speed: item.count > 0 ? item.speed / item.count : 0,
          timestamp: item.timestamp
        }))
        .sort((a, b) => a.timestamp - b.timestamp);
      
      // Pastikan ada minimal 1 data point (bisa 0 cm/s)
      if (formattedData.length === 0) {
        formattedData.push({
          time: new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
          }),
          speed: 0,
          timestamp: Date.now()
        });
      }
      
      setRealtimeSpeed(formattedData);
    } catch (err) {
      console.error("Error fetching realtime speed:", err);
      // Set default data point jika error
      setRealtimeSpeed([{
        time: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        }),
        speed: 0,
        timestamp: Date.now()
      }]);
    }
  };

  // ❌ DIHAPUS: Fetch Train Location - SEKARANG DARI MQTT LANGSUNG
  // ❌ DIHAPUS: Fetch Segment Speed - SEKARANG DARI MQTT LANGSUNG

  // Fetch Palang Status
  const fetchPalangStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/palang`);
      if (response.data && response.data.length > 0) {
        setPalangStatus(response.data[0].status);
      }
    } catch (err) {
      console.error("Error fetching palang status:", err);
      setPalangStatus("Error");
    }
  };

  // Fetch Camera Status
  const fetchCameraStatus = async () => {
    try {
      const response = await axios.get(`${API_URL}/camera`);
      if (response.data && response.data.length > 0) {
        setCameraStatus(response.data[0].status);
        setCameraError(false);
      }
    } catch (err) {
      console.error("Error fetching camera status:", err);
      setCameraStatus("Error");
    }
  };

  // Update Palang Status
  const updatePalangStatus = async (newStatus) => {
    setPalangLoading(true); // Start loading
    
    try {
      await axios.post(`${API_URL}/palang/update`, {
        status: newStatus,
      });
      setTimeout(() => fetchPalangStatus(), 500);
      
      // Cooldown 11 detik
      setTimeout(() => {
        setPalangLoading(false);
      }, 11000); // 11 detik
      
    } catch (err) {
      console.error("Error updating palang:", err);
      alert("Gagal mengupdate status palang");
      setPalangLoading(false); // Reset jika error
    }
  };

  // Update Camera Status
  const updateCameraStatus = async (newStatus) => {
    setCameraLoading(true); // Start loading
  
    try {
      await axios.post(`${API_URL}/camera/update`, {
        status: newStatus,
      });
      setCameraError(false);
      setTimeout(() => fetchCameraStatus(), 500);
      
      // Cooldown 1 detik
      setTimeout(() => {
        setCameraLoading(false);
      }, 1000); // 1 detik
      
    } catch (err) {
      console.error("Error updating camera:", err);
      alert("Gagal mengupdate status camera");
      setCameraLoading(false); // Reset jika error
    }
  };

  // ==========================================
  // 🔄 AUTO REFRESH DATA
  // ==========================================

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchSpeedHistory(timeFilter),
          fetchRealtimeSpeed(),
          // ❌ DIHAPUS: fetchTrainLocation() - SEKARANG DARI MQTT
          // ❌ DIHAPUS: fetchSegmentSpeed() - SEKARANG DARI MQTT
          fetchPalangStatus(),
          fetchCameraStatus(),
        ]);
        setError(null);
      } catch (err) {
        setError("Gagal memuat data");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();

    // Auto refresh every 3 seconds
    const interval = setInterval(() => {
      fetchSpeedHistory(timeFilter); // Refresh grafik rata-rata
      fetchRealtimeSpeed(); // Refresh grafik realtime
      // ❌ DIHAPUS: fetchTrainLocation() - SEKARANG DARI MQTT REAL-TIME
      // ❌ DIHAPUS: fetchSegmentSpeed() - SEKARANG DARI MQTT REAL-TIME
      fetchPalangStatus(); // Refresh palang
      fetchCameraStatus(); // Refresh camera
    }, 3000);

    return () => clearInterval(interval);
  }, [timeFilter]); // Re-run when filter changes

  // ==========================================
  // 🎨 RENDER UI
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#EB2525] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="md:ml-72 flex flex-col flex-1">
        <Navbar />

        <main className="p-4 md:p-6 lg:p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Dashboard Monitoring
            </h1>
            <p className="text-gray-600 mt-1">Real-time data SmartTrain</p>
          </div>

          {/* Top Grid: 4 Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            {/* Card: Kecepatan Per Segmen (dari MQTT) */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Kecepatan Per Segmen
                </h3>
                <div className="bg-blue-100 p-3 rounded-full">
                  <i className="fa fa-tachometer text-blue-600 text-xl"></i>
                </div>
              </div>
              <div className="text-center">
                {segmentSpeed && segmentSpeed.id ? (
                  <>
                    <div className="text-sm text-gray-500 mb-2">
                      Segmen {segmentSpeed.id}
                    </div>
                    <div className="text-4xl font-bold text-blue-600">
                      {segmentSpeed.speed ? segmentSpeed.speed.toFixed(2) : "0.00"} cm/s
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-sm text-gray-500 mb-2">
                      Waiting...
                    </div>
                    <div className="text-4xl font-bold text-gray-400">
                      -- cm/s
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Card: Keberadaan Kereta (dari MQTT) */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Keberadaan Kereta
                </h3>
                <div className="bg-green-100 p-3 rounded-full">
                  <i className="fa fa-map-marker text-green-600 text-xl"></i>
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">
                  {trainLocation && trainLocation.titik !== "Unknown"
                    ? trainLocation.titik
                    : "Unknown"}
                </div>
                {trainLocation && trainLocation.timestamp && (
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(trainLocation.timestamp).toLocaleTimeString("id-ID")}
                  </p>
                )}
              </div>
            </div>

            {/* Card: Status Palang */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Palang Perlintasan
                </h3>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <i className="fa fa-cog text-yellow-600 text-xl"></i>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-2xl font-bold ${
                    palangLoading
                      ? "text-gray-400"
                      : palangStatus === "Terbuka"
                      ? "text-green-600"
                      : palangStatus === "Tertutup"
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}>
                    {palangLoading ? "Menunggu..." : palangStatus}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Status palang</p>
                </div>
                <button
                  onClick={() =>
                    updatePalangStatus(
                      palangStatus === "Terbuka" ? "Tertutup" : "Terbuka"
                    )
                  }
                  disabled={palangLoading}
                  className={`relative inline-flex h-12 w-24 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                    palangLoading
                      ? "bg-gray-400 cursor-not-allowed opacity-50"
                      : palangStatus === "Terbuka"
                      ? "bg-green-500"
                      : "bg-red-500"
                  }`}
                >
                  <span className={`inline-block h-8 w-8 transform rounded-full bg-white transition-transform duration-300 ${
                    palangStatus === "Terbuka"
                      ? "translate-x-2"
                      : "translate-x-14"
                  }`}/>
                </button>
              </div>
            </div>

            {/* Card: Status Camera */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Status Camera
                </h3>
                <div className="bg-purple-100 p-3 rounded-full">
                  <i className="fa fa-camera text-purple-600 text-xl"></i>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className={`text-2xl font-bold ${
                    cameraLoading
                      ? "text-gray-400"
                      : cameraStatus === "Aktif"
                      ? "text-green-600"
                      : "text-gray-600"
                  }`}>
                    {cameraLoading ? "Menunggu..." : cameraStatus}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Status camera</p>
                </div>
                <button
                  onClick={() =>
                    updateCameraStatus(
                      cameraStatus === "Aktif" ? "Nonaktif" : "Aktif"
                    )
                  }
                  disabled={cameraLoading}
                  className={`relative inline-flex h-12 w-24 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                    cameraLoading
                      ? "bg-gray-400 cursor-not-allowed opacity-50"
                      : cameraStatus === "Aktif"
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                >
                  <span className={`inline-block h-8 w-8 transform rounded-full bg-white transition-transform duration-300 ${
                    cameraStatus === "Aktif"
                      ? "translate-x-14"
                      : "translate-x-2"
                  }`}/>
                </button>
              </div>
            </div>
          </div>

          {/* 2 Grafik LINE CHART */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Grafik 1: Kecepatan Rata-rata (LINE) */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-700">
                  Grafik Kecepatan Rata-rata (cm/s)
                </h3>
                <div className="flex gap-2">
                  {["1m", "5m", "10m", "30m"].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setTimeFilter(filter)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                        timeFilter === filter
                          ? "bg-[#EB2525] text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-64">
                {speedHistory && speedHistory.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={speedHistory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="time" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis 
                        tick={{ fontSize: 12 }}
                        label={{ value: 'cm/s', angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1f2937', color: '#fff', borderRadius: '8px' }}
                        formatter={(value) => [`${value.toFixed(2)} cm/s`, 'Kecepatan']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="speed" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6', r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400">
                    No data available - waiting for data...
                  </div>
                )}
              </div>
            </div>

            {/* Grafik 2: Kecepatan Real Time (LINE) */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-6">
                Grafik Kecepatan Real Time (cm/s)
              </h3>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={realtimeSpeed}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="time" 
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      label={{ value: 'cm/s', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', color: '#fff', borderRadius: '8px' }}
                      formatter={(value) => [`${value.toFixed(2)} cm/s`, 'Kecepatan']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="speed" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ fill: '#10b981', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Live Camera Stream */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            {/* Header dengan Warning Icon */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-3xl font-bold text-gray-700">
                  Camera Stream
                </h3>
                
                {/* Warning Icon - HTTP One-to-One Limitation */}
                <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-300 rounded-lg px-5 py-3.5">
                  <i className="fa fa-exclamation-triangle text-yellow-600 text-xl"></i>
                  <span className="text-base text-yellow-700 font-bold">
                    HTTP stream is one-to-one only. Hide feed when not viewing to allow other devices in order to let other devices such as the mobile app access the stream.
                  </span>
                </div>
              </div>

              {/* Live Indicator */}
              {cameraStatus === "Aktif" && showFeed ? (
                <span className="inline-flex items-center px-5 py-3 rounded-full text-xl font-bold bg-red-100 text-red-800">
                  <span className="w-2 h-2 bg-red-600 rounded-full mr-2 animate-pulse"></span>
                  LIVE
                </span>
              ) : (
                <span className="inline-flex items-center px-5 py-3 rounded-full text-xl font-bold bg-gray-100 text-gray-600">
                  {cameraStatus === "Aktif" ? "ready" : "disconnected"}
                </span>
              )}
            </div>

            {/* Show/Hide Feed Button (Only when camera active and IP available) */}
            {cameraStatus === "Aktif" && cameraIP && cameraIP !== "waiting..." && cameraIP !== "offline" && (
              <div className="mb-4 flex justify-end">
                <button
                  onClick={() => {
                    setShowFeed(!showFeed);
                    if (showFeed) {
                      setCameraError(false); // Reset error when hiding
                    }
                  }}
                  className={`flex items-center gap-3 px-8 py-4 rounded-lg text-2xl font-bold transition-all duration-200 shadow-sm ${
                    showFeed
                      ? "bg-gray-600 hover:bg-gray-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <i className={`fa ${showFeed ? "fa-eye-slash" : "fa-eye"}`}></i>
                  {showFeed ? "Hide Feed" : "Show Feed"}
                </button>
              </div>
            )}

            {/* Camera Stream Container */}
            <div 
              className="w-full bg-gray-900 rounded-lg overflow-hidden relative" 
              style={{ height: '575px' }}
            >
              {cameraStatus === "Aktif" ? (
                cameraIP && cameraIP !== "waiting..." && cameraIP !== "offline" ? (  // ← DIGANTI!
                  showFeed ? (
                    // ===== SHOW FEED - Display Stream =====
                    cameraError ? (
                      <div className="flex items-center justify-center w-full h-full text-gray-400">
                        <div className="text-center">
                          <i className="fa fa-video-slash text-5xl mb-3 opacity-50"></i>
                          <p className="text-2xl mb-2">Camera feed unavailable</p>
                          <p className="text-xl">Trying to connect to: {cameraIP}</p>
                          <button
                            onClick={() => {
                              setCameraError(false);
                              setShowFeed(false);
                              setTimeout(() => setShowFeed(true), 100);
                            }}
                            className="mt-4 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xl"
                          >
                            Retry Connection
                          </button>
                        </div>
                      </div>
                    ) : (
                      <img
                        key={`camera-stream-${cameraIP}-${showFeed}`}
                        src={`http://${cameraIP}/stream`}
                        alt="Live Camera Feed"
                        className="w-full h-full object-contain"
                        onError={() => {
                          console.error("❌ Camera stream error from:", cameraIP);
                          setCameraError(true);
                        }}
                        onLoad={() => {
                          console.log("✅ Camera stream loaded successfully from:", cameraIP);
                          setCameraError(false);
                        }}
                      />
                    )
                  ) : (
                    // ===== HIDE FEED - Show Placeholder =====
                    <div className="flex flex-col items-center justify-center w-full h-full text-gray-400">
                      <i className="fa fa-eye-slash text-7xl mb-5 opacity-40"></i>
                      <p className="text-3xl font-bold mb-2">Feed Hidden</p>
                      <p className="text-xl text-gray-500">Click "Show Feed" button to view camera</p>
                      <div className="mt-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
                        <p className="text-base text-gray-400 mb-1">Ready to stream from:</p>
                        <code className="text-xl text-blue-400">{cameraIP}</code>
                      </div>
                    </div>
                  )
                ) : (
                  // ===== WAITING FOR IP FROM MQTT =====
                  <div className="flex items-center justify-center w-full h-full text-gray-400">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-400 mx-auto mb-4"></div>
                      <p className="text-2xl mb-2">
                        {cameraIP === "waiting..." ? "Camera Booting..." : "Waiting for Camera IP..."}
                      </p>
                      <p className="text-xl text-gray-500">
                        {cameraIP === "waiting..." 
                          ? "ESP32-CAM is starting, please wait 10-20 seconds..."
                          : "Listening to MQTT topic: smartTrain/camera/ip"
                        }
                      </p>
                      {cameraIP === "waiting..." && (
                        <p className="text-base text-gray-600 mt-2">
                          Current status: {cameraIP}
                        </p>
                      )}
                    </div>
                  </div>
                )
              ) : (
                // ===== CAMERA OFFLINE =====
                <div className="flex items-center justify-center w-full h-full text-gray-500">
                  <div className="text-center">
                    <i className="fa fa-video-slash text-6xl mb-4 opacity-30"></i>
                    <p className="text-3xl mb-2">Camera Offline</p>
                    <p className="text-xl">Turn on camera using the toggle switch above</p>
                  </div>
                </div>
              )}
            </div>

            {/* Camera Info Box (Only when IP is available) */}
            {cameraIP && cameraIP !== "waiting..." && cameraIP !== "offline" && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-xl">
                  <div>
                    <span className="text-gray-600 font-bold">Camera Status:</span>
                    <span className={`ml-2 font-bold ${
                      cameraStatus === "Aktif" ? "text-green-600" : "text-gray-500"
                    }`}>
                      {cameraStatus}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 font-bold">Stream Status:</span>
                    <span className={`ml-2 font-bold ${
                      showFeed ? "text-blue-600" : "text-gray-500"
                    }`}>
                      {showFeed ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600 font-bold">Stream URL:</span>
                    <div className="mt-1">
                      <code className="bg-white px-3 py-2 rounded border text-gray-800 text-base block">
                        http://{cameraIP}/stream
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Train Map */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Train Map
            </h3>
            <div className="w-full py-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <img
                src="/img/map.png"
                alt="Train Map"
                className="max-w-full h-auto object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentElement.innerHTML =
                    '<div class="text-gray-400">Map not available</div>';
                }}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}