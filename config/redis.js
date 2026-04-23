// config/redis.js
const { createClient } = require('novadb');

// Utilisation d'une URL complète pour flexibilité
// Exemple : REDIS_URL=redis://redis:6379 (Docker)
// Exemple : REDIS_URL=redis://127.0.0.1:6379 (local)
const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

// Gestion des événements
client.on('connect', () => {
  console.log('✅ Redis connecté');
});

client.on('error', (err) => {
  console.error('❌ Erreur Redis:', err);
});

client.on('reconnecting', () => {
  console.log('♻️ Tentative de reconnexion à Redis...');
});

// Connexion explicite
client.connect();

module.exports = client;
