const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");

router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo películas" });
  }
});

router.post("/", async (req, res) => {
  try {

    if (Array.isArray(req.body)) {
      const movies = await Movie.insertMany(req.body);
      return res.json(movies);
    }

    const nueva = new Movie(req.body);
    await nueva.save();
    res.json(nueva);
  } catch (error) {
    res.status(500).json({ error: "Error creando película" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Película eliminada" });
  } catch (error) {
    res.status(500).json({ error: "Error eliminando película" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const actualizada = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!actualizada) {
      return res.status(404).json({ error: "Película no encontrada" });
    }

    res.json(actualizada);
  } catch (error) {
    res.status(500).json({ error: "Error actualizando película" });
  }
});

module.exports = router;