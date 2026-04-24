const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectado 🔥"))
  .catch(err => console.log("Error conectando MongoDB:", err));


app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


const movieRoutes = require("./routes/movies");
app.use("/api/movies", movieRoutes);


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});