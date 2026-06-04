const express = require("express");
const cors = require("cors");
const apiRouter = require("./routes/index");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
    ],
    methods: ["POST", "PUT", "GET", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

// Inyectamos todas las combinaciones de rutas bajo el prefijo global /api
app.use("/api", apiRouter);

module.exports = app;
