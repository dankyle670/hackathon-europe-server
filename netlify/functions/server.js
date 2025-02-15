require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

// init app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connexion
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connecté ✅"))
  .catch((err) => console.error("Erreur de connexion à MongoDB ❌", err));

// Test route
app.get("/", (req, res) => {
  res.send("Bienvenue sur Outh Game API !");
});

// running the server
if (process.env.NODE_ENV === 'development') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } else {
    module.exports.handler = serverless(app);
  }