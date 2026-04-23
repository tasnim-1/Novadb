const bcrypt = require("bcrypt");
const { encrypt, decrypt } = require("../utils/crypto"); // utilitaire de chiffrement
const { randomUUID } = require("crypto");
const redis = require("../config/redis");

// SIGNUP
exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const existingUser = await redis.get(`user:${email}`);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = {
      email,
      password: hashedPassword,
      created_at: new Date().toISOString(),
    };

    await redis.set(`user:${email}`, JSON.stringify(user));

    res.status(201).json({ message: "User created ✅" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userData = await redis.get(`user:${email}`);
    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = JSON.parse(userData);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Wrong password" });
    }

    const sessionId = randomUUID();
    const session = {
      user_id: email,
      created_at: new Date().toISOString(),
      ip_address: req.ip,
      user_agent: req.headers["user-agent"],
    };

    // 🔐 Chiffrement obligatoire
    const encryptedSession = encrypt(session);

    await redis.set(
      `session:${sessionId}`,
      JSON.stringify(encryptedSession),
      "EX",
      1800 // 30 minutes
    );

    res.cookie("sessionId", sessionId, {
      httpOnly: true,
      secure: true, // ⚠️ active en production avec HTTPS
      sameSite: "Strict",
      maxAge: 1800 * 1000,
    });

    res.status(200).json({ message: "Login success ✅", sessionId });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// LOGOUT
exports.logout = async (req, res) => {
  try {
    const sessionId = req.cookies.sessionId;

    if (sessionId) {
      await redis.del(`session:${sessionId}`);
    }

    res.clearCookie("sessionId");
    res.status(200).json({ message: "Logout success ✅" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// PROFILE (route protégée)
exports.profile = async (req, res) => {
  try {
    const sessionId = req.cookies.sessionId;
    if (!sessionId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const sessionData = await redis.get(`session:${sessionId}`);
    if (!sessionData) {
      return res.status(401).json({ error: "Session expired" });
    }

    let decryptedSession;
    try {
      decryptedSession = decrypt(JSON.parse(sessionData));
    } catch (err) {
      console.error("Profile decryption error:", err);
      return res.status(500).json({ error: "Invalid session data" });
    }

    res.status(200).json(decryptedSession);
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
