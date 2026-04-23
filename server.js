const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

const client = require("./config/redis");
const { encrypt, decrypt } = require("./utils/crypto");

const app = express();

/* ======================
   MIDDLEWARE GLOBAL
====================== */

app.use(cors({
  origin: "https://novadb-2.onrender.com", // frontend Render
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(bodyParser.json());

/* ======================
   TEMP DATABASE (PFE ONLY)
====================== */

const users = [];

/* ======================
   HEALTH CHECK
====================== */

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Session Management API is running",
    endpoints: {
      signup: "POST /api/auth/signup",
      login: "POST /api/auth/login",
      profile: "GET /api/auth/profile",
      logout: "POST /api/auth/logout"
    }
  });
});

/* ======================
   SIGNUP
====================== */

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email et mot de passe requis"
      });
    }

    const exists = users.find(u => u.email === email);

    if (exists) {
      return res.status(409).json({
        message: "Utilisateur déjà existant"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({
      email,
      password: hashedPassword
    });

    res.json({
      message: "Compte créé avec succès"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur signup" });
  }
});

/* ======================
   LOGIN + SESSION REDIS
====================== */

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({
        message: "Utilisateur introuvable"
      });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({
        message: "Mot de passe incorrect"
      });
    }

    const sessionId = uuidv4();

    const session = {
      email: user.email,
      last_activity: new Date().toISOString()
    };

    const encryptedSession = encrypt(session);

    await client.set(
      `session:${sessionId}`,
      JSON.stringify(encryptedSession),
      { EX: 1800 } // 30 min
    );

    res.json({
      message: "Login success ✅",
      sessionId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur login" });
  }
});

/* ======================
   AUTH MIDDLEWARE
====================== */

async function authMiddleware(req, res, next) {
  try {
    const sessionId = req.headers["authorization"];

    if (!sessionId) {
      return res.status(403).json({
        message: "Session manquante"
      });
    }

    const sessionData = await client.get(`session:${sessionId}`);

    if (!sessionData) {
      return res.status(401).json({
        message: "Session invalide ou expirée"
      });
    }

    const decrypted = decrypt(JSON.parse(sessionData));

    decrypted.last_activity = new Date().toISOString();

    const updated = encrypt(decrypted);

    await client.set(
      `session:${sessionId}`,
      JSON.stringify(updated),
      { EX: 1800 }
    );

    req.user = decrypted;
    next();

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur middleware auth" });
  }
}

/* ======================
   PROFILE
====================== */

app.get("/api/auth/profile", authMiddleware, (req, res) => {
  res.json({
    email: req.user.email,
    last_activity: req.user.last_activity
  });
});

/* ======================
   LOGOUT
====================== */

app.post("/api/auth/logout", async (req, res) => {
  try {
    const sessionId = req.headers["authorization"];

    if (sessionId) {
      await client.del(`session:${sessionId}`);
    }

    res.json({
      message: "Déconnexion réussie"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur logout" });
  }
});

/* ======================
   START SERVER
====================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 API running on port ${PORT}`);
});