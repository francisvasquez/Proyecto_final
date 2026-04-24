const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  titulo: String,
  descripcion: String,
  anio: Number,
  genero: String
});

module.exports = mongoose.model("Movie", movieSchema);