const Redis = require("ioredis");

// Utilisation des variables d'environnement pour flexibilité
const redis = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  retryStrategy: (times) => {
    // Reconnexion exponentielle (max 2 secondes)
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on("connect", () => {
  console.log("✅ Redis connecté");
});

redis.on("error", (err) => {
  console.error("❌ Erreur Redis:", err);
});

redis.on("reconnecting", () => {
  console.log("♻️ Tentative de reconnexion à Redis...");
});

module.exports = redis;
