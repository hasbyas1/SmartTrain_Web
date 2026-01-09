import React, { useState, useEffect } from "react";
import Sidebar from "../components/AdminSidebar";
import Navbar from "../components/AdminNavbar";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// ==========================================
// 🔧 KONVERSI: km/h → cm/s
// 1 km/h = 27.7778 cm/s
// ==========================================
const kmhToCms = (kmh) => {
  return kmh * 27.7778;
};

export default function AdminDashboard() {
  // States untuk data MQTT
  const [trainSpeed, setTrainSpeed] = useState(null);
  const [speedHistory, setSpeedHistory] = useState([]);
  const [realtimeSpeed, setRealtimeSpeed] = useState([]);
  const [palangStatus, setPalangStatus] = useState("Loading...");
  const [cameraStatus, setCameraStatus] = useState("Loading...");
  
  // States untuk loading & error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter untuk speed history (default 5 menit)
  const [timeFilter, setTimeFilter] = useState("5m");

  // ==========================================
  // 📡 FETCH DATA FROM API (sourced from MQTT)
  // ==========================================

  // Fetch Latest Train Speed
  const fetchLatestSpeed = async () => {
    try {
      const response = await axios.get(`${API_URL}/train/latest`);
      setTrainSpeed(response.data);
    } catch (err) {
      console.error("Error fetching latest speed:", err);
    }
  };

  // Fetch Speed History (untuk chart)
  const fetchSpeedHistory = async (filter = "5m") => {
    try {
      const response = await axios.get(
        `${API_URL}/train-speed/history?filter=${filter}`
      );
      setSpeedHistory(response.data);
    } catch (err) {
      console.error("Error fetching speed history:", err);
    }
  };

  // Fetch Realtime Speed per Segment
  const fetchRealtimeSpeed = async () => {
    try {
      const response = await axios.get(`${API_URL}/train/realtime`);
      setRealtimeSpeed(response.data);
    } catch (err) {
      console.error("Error fetching realtime speed:", err);
    }
  };

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
      }
    } catch (err) {
      console.error("Error fetching camera status:", err);
      setCameraStatus("Error");
    }
  };

  // Update Palang Status (POST to API → MQTT)
  const updatePalangStatus = async (newStatus) => {
    try {
      await axios.post(`${API_URL}/palang/update`, {
        status: newStatus,
      });
      // Refresh status setelah update
      setTimeout(() => fetchPalangStatus(), 500);
    } catch (err) {
      console.error("Error updating palang:", err);
      alert("Gagal mengupdate status palang");
    }
  };

  // Update Camera Status (POST to API → MQTT)
  const updateCameraStatus = async (newStatus) => {
    try {
      await axios.post(`${API_URL}/camera/update`, {
        status: newStatus,
      });
      // Refresh status setelah update
      setTimeout(() => fetchCameraStatus(), 500);
    } catch (err) {
      console.error("Error updating camera:", err);
      alert("Gagal mengupdate status camera");
    }
  };

  // ==========================================
  // 🔄 AUTO REFRESH DATA
  // ==========================================

  useEffect(() => {
    // Initial fetch
    const fetchAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchLatestSpeed(),
          fetchRealtimeSpeed(),
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

    // Auto refresh setiap 3 detik
    const interval = setInterval(() => {
      fetchLatestSpeed();
      fetchRealtimeSpeed();
      fetchPalangStatus();
      fetchCameraStatus();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Refresh history saat filter berubah
  useEffect(() => {
    fetchSpeedHistory(timeFilter);
  }, [timeFilter]);

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
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
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
            <p className="text-gray-600 mt-1">
              Real-time data dari MQTT sensors
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Card: Kecepatan Kereta */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Kecepatan Kereta
                </h3>
                <div className="bg-blue-100 p-3 rounded-full">
                  <i className="fa fa-train text-blue-600 text-xl"></i>
                </div>
              </div>
              <div className="text-4xl font-bold text-blue-600">
                {trainSpeed 
                  ? `${kmhToCms(trainSpeed.speed).toFixed(2)} cm/s` 
                  : "-- cm/s"}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {trainSpeed
                  ? `Update: ${new Date(trainSpeed.created_at).toLocaleTimeString("id-ID")}`
                  : "Waiting for data..."}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {trainSpeed && `(${trainSpeed.speed.toFixed(1)} km/h)`}
              </p>
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
                  <div
                    className={`text-2xl font-bold ${
                      palangStatus === "Aktif"
                        ? "text-green-600"
                        : "text-gray-600"
                    }`}
                  >
                    {palangStatus}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Status palang saat ini
                  </p>
                </div>
                <button
                  onClick={() =>
                    updatePalangStatus(
                      palangStatus === "Aktif" ? "Nonaktif" : "Aktif"
                    )
                  }
                  className={`relative inline-flex h-12 w-24 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                    palangStatus === "Aktif" ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-8 w-8 transform rounded-full bg-white transition-transform duration-300 ${
                      palangStatus === "Aktif" ? "translate-x-14" : "translate-x-2"
                    }`}
                  />
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
                  <div
                    className={`text-2xl font-bold ${
                      cameraStatus === "Aktif"
                        ? "text-green-600"
                        : "text-gray-600"
                    }`}
                  >
                    {cameraStatus}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Status camera monitoring
                  </p>
                </div>
                <button
                  onClick={() =>
                    updateCameraStatus(
                      cameraStatus === "Aktif" ? "Nonaktif" : "Aktif"
                    )
                  }
                  className={`relative inline-flex h-12 w-24 items-center rounded-full transition-colors duration-300 focus:outline-none ${
                    cameraStatus === "Aktif" ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-8 w-8 transform rounded-full bg-white transition-transform duration-300 ${
                      cameraStatus === "Aktif" ? "translate-x-14" : "translate-x-2"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Speed History Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-700">
                History Kecepatan (cm/s)
              </h3>
              <div className="flex gap-2">
                {["1m", "5m", "10m", "30m"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setTimeFilter(filter)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
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

            {/* Simple Bar Chart */}
            <div className="h-64 flex items-end justify-around gap-2">
              {speedHistory.length > 0 ? (
                speedHistory.map((data, index) => {
                  const maxSpeed = Math.max(...speedHistory.map((d) => d.speed));
                  const height = (data.speed / maxSpeed) * 100;
                  const speedCms = kmhToCms(data.speed);
                  
                  return (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center"
                    >
                      <div
                        className="w-full bg-[#EB2525] rounded-t-lg hover:bg-red-600 transition-all relative group"
                        style={{ height: `${height}%` }}
                      >
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                          {speedCms.toFixed(2)} cm/s
                          <br />
                          ({data.speed.toFixed(1)} km/h)
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(data.created_at).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="flex items-center justify-center w-full h-full text-gray-400">
                  No data available
                </div>
              )}
            </div>
          </div>

          {/* Realtime Speed per Segment */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-6">
              Kecepatan Realtime per Segment (cm/s)
            </h3>
            
            {realtimeSpeed.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {realtimeSpeed.slice(0, 12).map((data, index) => {
                  const speedCms = kmhToCms(data.speed);
                  
                  return (
                    <div
                      key={index}
                      className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center border border-blue-200"
                    >
                      <div className="text-sm font-semibold text-blue-800 mb-1">
                        {data.segment}
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {speedCms.toFixed(2)}
                      </div>
                      <div className="text-xs text-blue-600">cm/s</div>
                      <div className="text-xs text-gray-500 mt-1">
                        ({data.speed.toFixed(1)} km/h)
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                No realtime data available
              </div>
            )}
          </div>

          {/* Train Map (placeholder) */}
          <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
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