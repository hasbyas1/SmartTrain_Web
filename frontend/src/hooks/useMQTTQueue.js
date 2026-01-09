import { useEffect, useRef, useState } from "react";
import mqtt from "mqtt";

const MQTT_BROKER = "wss://9e108cb03c734f0394b0f0b49508ec1e.s1.eu.hivemq.cloud:8884/mqtt";
const MQTT_USERNAME = "Device02";
const MQTT_PASSWORD = "Device02";

// Queue version: simpan array message per topik
export const useMQTTQueue = (topics, maxQueue = 10) => {
  const [queues, setQueues] = useState({}); // { topic: [msg, ...] }
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef(null);

  useEffect(() => {
    const client = mqtt.connect(MQTT_BROKER, {
      username: MQTT_USERNAME,
      password: MQTT_PASSWORD,
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
    });
    clientRef.current = client;

    client.on("connect", () => {
      setIsConnected(true);
      topics.forEach((topic) => {
        client.subscribe(topic, (err) => {
          if (!err) {
            // ...
          }
        });
      });
    });

    client.on("message", (topic, message) => {
      try {
        const data = JSON.parse(message.toString());
        setQueues((prev) => {
          const prevQueue = prev[topic] || [];
          // Tambahkan message ke queue, batasi panjang queue
          const newQueue = [...prevQueue, { ...data, _ts: Date.now() }].slice(-maxQueue);
          return { ...prev, [topic]: newQueue };
        });
      } catch (err) {
        // ...
      }
    });

    client.on("disconnect", () => setIsConnected(false));
    client.on("error", () => setIsConnected(false));

    return () => {
      if (clientRef.current) {
        clientRef.current.end();
      }
    };
  }, [topics, maxQueue]);

  return {
    queues, // { topic: [msg, ...] }
    isConnected,
    client: clientRef.current,
  };
};
