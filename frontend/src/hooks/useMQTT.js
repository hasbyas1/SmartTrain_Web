import { useEffect, useRef, useState } from "react";
import mqtt from "mqtt";

const MQTT_BROKER = "wss://9e108cb03c734f0394b0f0b49508ec1e.s1.eu.hivemq.cloud:8884/mqtt";
const MQTT_USERNAME = "Device02";
const MQTT_PASSWORD = "Device02";

export const useMQTT = (topics) => {
  const [messages, setMessages] = useState({});
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef(null);

  useEffect(() => {
    // Inisialisasi MQTT connection
    const client = mqtt.connect(MQTT_BROKER, {
      username: MQTT_USERNAME,
      password: MQTT_PASSWORD,
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
    });

    clientRef.current = client;

    // Subscribe hanya setelah benar-benar connect
    const handleConnect = () => {
      console.log("✅ MQTT Connected dari Frontend!");
      setIsConnected(true);
      // Subscribe ke topics hanya jika client.connected
      topics.forEach((topic) => {
        if (client.connected) {
          client.subscribe(topic, (err) => {
            if (!err) {
              console.log(`✅ Subscribed to ${topic}`);
            } else {
              console.error(`❌ Error subscribing to ${topic}:`, err);
            }
          });
        } else {
          console.warn(`⚠️ Skip subscribe to ${topic} because client not connected`);
        }
      });
    };
    client.on("connect", handleConnect);

    // Event: Message received
    client.on("message", (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        setMessages((prev) => ({
          ...prev,
          [topic]: data,
        }));
        console.log(`📨 Message from ${topic}:`, data);
      } catch (err) {
        console.error("Error parsing MQTT message:", err);
      }
    });

    // Event: Disconnect
    client.on("disconnect", () => {
      console.log("🔌 MQTT Disconnected");
      setIsConnected(false);
    });

    // Event: Error
    client.on("error", (err) => {
      console.error("❌ MQTT Error:", err);
      setIsConnected(false);
    });

    // Cleanup on unmount
    return () => {
      if (clientRef.current) {
        clientRef.current.end();
      }
      client.off("connect", handleConnect);
    };
  }, [topics]);

  return {
    messages,
    isConnected,
    client: clientRef.current,
  };
};
