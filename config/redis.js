// config/redis.js
const { createClient } = require('redis');

// Utilise REDIS_URL de Render
// Exemple Render : redis://default:password@novadb:6379
// Exemple local   : redis://127.0.0.1:6379

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

const client = createClient({
  url: redisUrl
});

// Événements
client.on('connect', () => {
  console.log('✅ Redis connecté');
});

client.on('ready', () => {
  console.log('🚀 Redis prêt');
});

client.on('error', (err) => {
  console.error('❌ Erreur Redis:', err.message);
});

client.on('reconnecting', () => {
  console.log('♻️ Reconnexion Redis...');
});

// Connexion sécurisée
(async () => {
  try {
    await client.connect();
  } catch (error) {
    console.error('❌ Impossible de connecter Redis:', error.message);
  }
})();

module.exports = client;