const express = require("express");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const redis = require("novadb");
const { encrypt, decrypt } = require("./utils/crypto");

const app = express();
app.use(bodyParser.json());

// ⚠️ À remplacer par une vraie base de données
const users = [];
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur sur port ${PORT}`));

// Connexion Redis
const client = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || "novadb",
    port: process.env.REDIS_PORT || 6379
  }
});

client.on("error", (err) => console.error("Redis error:", err));
client.connect();

// ====================== HEALTH CHECK ======================
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Session Management API is running",
    endpoints: {
      signup:  "POST /api/auth/signup",
      login:   "POST /api/auth/login",
      profile: "GET  /api/auth/profile",
      logout:  "POST /api/auth/logout"
    }
  });
});

// ====================== SIGNUP ======================
app.post("/api/auth/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email et mot de passe requis" });

  const exists = users.find(u => u.email === email);
  if (exists)
    return res.status(409).json({ message: "Utilisateur déjà existant" });

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ email, password: hashedPassword });
  res.json({ message: "Compte créé avec succès" });
});

// ====================== LOGIN ======================
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ message: "Utilisateur introuvable" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: "Mot de passe incorrect" });

  const sessionId = uuidv4();

  const session = {
    email: user.email,
    last_activity: new Date().toISOString()
  };

  // 🟢 Chiffrer la session avant stockage
  const encryptedSession = encrypt(session);

  // Stocker la session chiffrée dans Redis avec expiration 30 min
  await client.set('session:${sessionId}', JSON.stringify(encryptedSession), { EX: 1800 });

  res.json({ message: "Login success ✅", sessionId });
});

// ====================== MIDDLEWARE ======================
async function authMiddleware(req, res, next) {
  const sessionId = req.headers["authorization"];
  if (!sessionId) return res.status(403).json({ message: "Session manquante" });

  const sessionData = await client.get('session:${sessionId}');
  if (!sessionData) return res.status(401).json({ message: "Session invalide ou expirée" });

  let decryptedSession;
  try {
    decryptedSession = decrypt(JSON.parse(sessionData));
  } catch (err) {
    console.error("Erreur de déchiffrement :", err);
    return res.status(500).json({ message: "Invalid session data" });
  }

  // Mise à jour de l'heure de dernière activité
  decryptedSession.last_activity = new Date().toISOString();

  const updatedSession = encrypt(decryptedSession);
  await client.set('session:${sessionId}', JSON.stringify(updatedSession), { EX: 1800 });

  req.user = decryptedSession;
  next();
}

// ====================== PROFILE ======================
app.get("/api/auth/profile", authMiddleware, (req, res) => {
  res.json({ email: req.user.email, last_activity: req.user.last_activity });
});

// ====================== LOGOUT ======================
app.post("/api/auth/logout", async (req, res) => {
  const sessionId = req.headers["authorization"];
  if (sessionId) {
    await client.del('session:${sessionId}');
  }
  res.json({ message: "Déconnexion réussie" });
});

// ====================== SERVER ======================
app.listen(5000, () => console.log("🚀 API running on port 5000"));