const express = require("express");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const compression = require("compression");
const helmet = require("helmet");

const app = express();

app.use(compression()); // réduit la taille des réponses
app.use(helmet());      // sécurise les headers HTTP
app.use(express.json({ limit: "10kb" })); // limite la taille des payloads
app.use(cookieParser());

// routes
app.use("/api/auth", authRoutes);

// test route
app.get("/", (req, res) => {
  res.send("API working 🚀");
});

module.exports = app;
