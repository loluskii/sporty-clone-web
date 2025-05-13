import mqtt from "mqtt";
import { ref, reactive } from "vue";

const isConnected = ref(false);
const connectionError = ref(null);
const subscriptions = new Map();
const messageCache = reactive({});
let mqttClient = null;
let processingInterval = null;
const PROCESS_INTERVAL = 300; // ms
const n = 10;

export function useMqttService() {
  const connect = () => {
    if (mqttClient) return mqttClient;

    if (mqttClient) {
      return mqttClient;
    }

    const clientId =
      import.meta.env.VITE_MQTT_CLIENTID +
      "-" +
      Math.floor(Math.random() * (9 * Math.pow(10, n))) +
      Math.pow(10, n);
    const host = "206.189.229.191";
    const port = "8083";
    const connectUrl = `wss://${host}:${port}/mqtt`;

    mqttClient = mqtt.connect(import.meta.env.VITE_MQTT_URI, {
      clientId,
      username: import.meta.env.VITE_MQTT_USERNAME,
      password: import.meta.env.VITE_MQTT_PASSWORD,
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
    });

    mqttClient.on("connect", () => {
      isConnected.value = true;
      connectionError.value = null;

      if (subscriptions.size > 0) {
        subscriptions.forEach((callbacks, topic) => {
          mqttClient.subscribe(topic);
        });
      }

      // Start processing interval if not already running
      if (!processingInterval) {
        processingInterval = setInterval(processMessageCache, PROCESS_INTERVAL);
      }
    });

    mqttClient.on("message", (topic, message) => {
      try {
        const data = JSON.parse(message.toString());

        // Extract match ID from topic
        const matchId = topic.split("/").pop();

        // Store in cache by topic type and match ID
        if (topic.includes("odds_change")) {
          if (!messageCache[matchId]) {
            messageCache[matchId] = {
              odds: null,
              betStop: null,
              updated: false,
            };
          }
          messageCache[matchId].odds = data;
          messageCache[matchId].updated = true;
        } else if (topic.includes("bet_stop")) {
          if (!messageCache[matchId]) {
            messageCache[matchId] = {
              odds: null,
              betStop: null,
              updated: false,
            };
          }
          messageCache[matchId].betStop = data;
          messageCache[matchId].updated = true;
        }
      } catch (error) {
        // console.error(`Error parsing MQTT message for topic ${topic}:`, error);
      }
    });

    mqttClient.on("error", (error) => {
      // console.error('MQTT connection error:', error);
      connectionError.value = error;
    });

    mqttClient.on("close", () => {
      isConnected.value = false;
      if (processingInterval) {
        clearInterval(processingInterval);
        processingInterval = null;
      }
    });

    return mqttClient;
  };

  // Process message cache at regular intervals
  function processMessageCache() {
    // Get all match IDs with updates
    const matchIds = Object.keys(messageCache).filter(
      (id) => messageCache[id].updated,
    );

    if (matchIds.length === 0) return;

    // Process each match's updates
    matchIds.forEach((matchId) => {
      const matchData = messageCache[matchId];

      // Process bet stop first (higher priority)
      if (matchData.betStop) {
        const betStopTopic = `feeds/live/bet_stop/${matchId}`;
        const callbacks = subscriptions.get(betStopTopic) || [];

        callbacks.forEach((callback) => {
          try {
            callback(matchData.betStop);
          } catch (error) {
            // console.error(`Error in bet_stop callback for match ${matchId}:`, error);
          }
        });

        // Clear bet stop after processing
        matchData.betStop = null;
      }

      // Process odds changes
      if (matchData.odds) {
        const oddsChangeTopic = `feeds/live/odds_change/${matchId}`;
        const callbacks = subscriptions.get(oddsChangeTopic) || [];

        callbacks.forEach((callback) => {
          try {
            callback(matchData.odds);
          } catch (error) {
            // console.error(`Error in odds_change callback for match ${matchId}:`, error);
          }
        });

        // Clear odds after processing
        matchData.odds = null;
      }

      // Mark as processed
      matchData.updated = false;
    });
  }

  const subscribe = (topic, callback) => {
    connect();

    if (!subscriptions.has(topic)) {
      subscriptions.set(topic, []);
      mqttClient.subscribe(topic, (err) => {
        if (err) {
          // console.error(`Error subscribing to topic ${topic}:`, err);
        }
      });
    }

    subscriptions.get(topic).push(callback);
    // console.log(`Added callback for topic ${topic}, total callbacks:`, subscriptions.get(topic).length);

    // Start processing interval if not already running
    if (isConnected.value && !processingInterval) {
      processingInterval = setInterval(processMessageCache, PROCESS_INTERVAL);
    }

    // Return unsubscribe function
    return () => {
      const callbacks = subscriptions.get(topic) || [];
      // console.log(`Attempting to unsubscribe from ${topic}, current callbacks:`, callbacks.length);
      const index = callbacks.indexOf(callback);

      if (index !== -1) {
        callbacks.splice(index, 1);
        // console.log(`Removed callback from ${topic}, remaining callbacks:`, callbacks.length);

        // If no more callbacks, unsubscribe from topic
        if (callbacks.length === 0) {
          // console.log(`Unsubscribing from topic ${topic}, removing from subscriptions Map`);
          mqttClient.unsubscribe(topic);
          subscriptions.delete(topic);
          // console.log('Current subscriptions:', Array.from(subscriptions.keys()));
        } else {
          // console.log(`Topic ${topic} still has ${callbacks.length} callbacks:`, callbacks);
        }
      } else {
        // console.log(`Callback not found for topic ${topic}, current callbacks:`, callbacks);
      }
    };
  };

  return {
    isConnected,
    connectionError,
    subscribe,
    getActiveSubscriptions: () => Array.from(subscriptions.keys()),
  };
}
