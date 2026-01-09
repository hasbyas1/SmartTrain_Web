# 🎯 MQTT Integration untuk Frontend - AdminPage

## Perubahan yang Dilakukan

### 1. ✅ Install Package
```bash
npm install mqtt
```

### 2. ✅ Buat Custom Hook untuk MQTT
File: `src/hooks/useMQTT.js`
- Menghubungkan frontend langsung ke MQTT broker HiveMQ
- Subscribe ke topik-topik MQTT
- Return `messages` dan `isConnected` state

**Konfigurasi:**
- Broker: `wss://9e108cb03c734f0394b0f0b49508ec1e.s1.eu.hivemq.cloud:8884/mqtt`
- Username: `Device02`
- Password: `Device02`

### 3. ✅ Update AdminPage.jsx
**Import useMQTT hook:**
```jsx
import { useMQTT } from "../hooks/useMQTT";
```

**Initialize MQTT connection:**
```jsx
const { messages: mqttMessages, isConnected: isMQTTConnected } = useMQTT([
  "smartTrain/speedometer",
  "smartTrain/location"
]);
```

**Update state dari MQTT messages:**
- `trainLocation` diperbaharui real-time dari topik `smartTrain/location`
- `segmentSpeed` diperbaharui real-time dari topik `smartTrain/speedometer` (tipe: "segmen")

### 4. ✅ Hapus API Calls yang Tidak Perlu
- ❌ Dihapus: `fetchTrainLocation()` - SEKARANG DARI MQTT
- ❌ Dihapus: `fetchSegmentSpeed()` - SEKARANG DARI MQTT

---

## Alur Data Sekarang

```
┌─────────────────────────────────────────────────────────────┐
│                     IoT SENSOR                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                    MQTT Messages
                         │
        ┌────────────────┴────────────────┐
        │                                 │
   ┌────▼──────────┐            ┌────────▼───────┐
   │  MQTT Broker  │            │   Backend API  │
   │   (HiveMQ)    │            │   (Port 5000)  │
   └────┬──────────┘            └────────┬───────┘
        │                               │
    WebSocket                       HTTP REST
        │                               │
   ┌────▼─────────────────────────┬────▼──────────────┐
   │   Frontend MQTT Subscribe    │  Frontend API    │
   │ (speedometer + location)     │  (speed history) │
   └────┬─────────────────────────┴────┬──────────────┘
        │                              │
        └──────────────┬───────────────┘
                       │
                    ┌──▼──┐
                    │ UI  │
                    └─────┘
```

---

## Topik MQTT yang Dimonitor

### 1. `smartTrain/speedometer`
**Tujuan:** Kecepatan Per Segmen (Real-time)
**Format Message:**
```json
{
  "tipe": "segmen",
  "id": 1,
  "kecepatan_s": 3.05
}
```

**State yang diupdate:**
```javascript
setSegmentSpeed({
  id: data.id,
  speed: data.kecepatan_s,
  timestamp: new Date().toISOString()
});
```

### 2. `smartTrain/location`
**Tujuan:** Keberadaan Kereta (Real-time)
**Format Message:**
```json
{
  "titik": "Titik 1"
}
```

**State yang diupdate:**
```javascript
setTrainLocation(mqttMessages["smartTrain/location"]);
```

---

## Data yang Tetap dari API

- ✅ `speedHistory` - dari `/train-speed/history?filter=`
- ✅ `realtimeSpeed` - dari `/train/realtime`
- ✅ `palangStatus` - dari `/palang`
- ✅ `cameraStatus` - dari `/camera`

Semua data ini tetap menggunakan API REST karena:
- Speed history = data historis dari database
- Realtime speed = agregasi data per detik dari database
- Palang & Camera = status yang perlu disimpan persistent

---

## Keuntungan MQTT untuk Location & Segment Speed

✅ **Real-time** - Update instant tanpa delay polling
✅ **Bandwidth efisien** - Publish-subscribe, bukan polling
✅ **Latency rendah** - Subscriber menerima saat ada message
✅ **Scalable** - Bisa handle banyak subscriber

---

## Testing

Untuk test apakah MQTT connection bekerja:
1. Buka DevTools (F12) → Console
2. Lihat log messages:
   - ✅ `MQTT Connected dari Frontend!`
   - ✅ `Subscribed to smartTrain/speedometer`
   - ✅ `Subscribed to smartTrain/location`
3. Lihat MQTT messages yang masuk:
   - 📨 `Message from smartTrain/location: {titik: "Titik 1"}`
   - 📊 `Segment Speed updated from MQTT: {tipe: "segmen", id: 1, kecepatan_s: 3.05}`

---

## Troubleshooting

Jika MQTT tidak terhubung:
1. **Cek broker URL** - Pastikan WebSocket endpoint benar (port 8884)
2. **Cek credentials** - Username: Device02, Password: Device02
3. **Network** - Pastikan tidak ada firewall yang block
4. **Browser console** - Lihat error messages

Jika messages tidak diterima:
1. **Cek MQTT broker** - Pastikan sensor masih publish ke topik
2. **Cek format JSON** - Pastikan message JSON valid
3. **Subscribe topik** - Cek apakah topik sesuai
