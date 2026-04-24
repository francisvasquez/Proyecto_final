const movieForm = document.getElementById("movieForm");
const listaPeliculas = document.getElementById("listaPeliculas");

async function cargarPeliculas() {
  const res = await fetch("/api/movies");
  const peliculas = await res.json();

  listaPeliculas.innerHTML = "";

  peliculas.forEach((peli) => {
    const div = document.createElement("div");
    div.classList.add("pelicula");

div.innerHTML = `
  <h3>🎬 ${peli.titulo}</h3>
  <p>${peli.descripcion}</p>
  <small>📅 ${peli.anio} | 🎭 ${peli.genero}</small>
  <br><br>
  <button onclick="editarPelicula('${peli._id}')">✏️ Editar</button>
  <button onclick="eliminarPelicula('${peli._id}')">🗑️ Eliminar</button>
`;

    listaPeliculas.appendChild(div);
  });
}

async function editarPelicula(id) {
  const titulo = prompt("Nuevo título:");
  const descripcion = prompt("Nueva descripción:");
  const anio = prompt("Nuevo año:");
  const genero = prompt("Nuevo género:");

  if (!titulo || !descripcion || !anio || !genero) {
    alert("Todos los campos son obligatorios");
    return;
  }

  await fetch(`/api/movies/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ titulo, descripcion, anio, genero })
  });

  cargarPeliculas();
}

async function eliminarPelicula(id) {
  const confirmar = confirm("¿Seguro que quieres eliminar esta película?");

  if (!confirmar) return;

  await fetch(`/api/movies/${id}`, {
    method: "DELETE"
  });

  cargarPeliculas();
}

movieForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nuevaPelicula = {
    titulo: document.getElementById("titulo").value,
    descripcion: document.getElementById("descripcion").value,
    anio: document.getElementById("anio").value,
    genero: document.getElementById("genero").value
  };

  await fetch("/api/movies", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(nuevaPelicula)
  });

  movieForm.reset();
  cargarPeliculas();
});

cargarPeliculas();