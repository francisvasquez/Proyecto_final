const movieForm = document.getElementById("movieForm");
const listaPeliculas = document.getElementById("listaPeliculas");

let todasLasPeliculas = [];

function actualizarContador(peliculas) {
  let contador = document.getElementById("contadorPeliculas");

  if (!contador) {
    contador = document.createElement("p");
    contador.id = "contadorPeliculas";
    movieForm.insertAdjacentElement("afterend", contador);
  }

  contador.textContent = `Total de películas: ${peliculas.length}`;
}

function mostrarPeliculas(peliculas) {
  listaPeliculas.innerHTML = "";

  actualizarContador(peliculas);

  if (peliculas.length === 0) {
    listaPeliculas.innerHTML = "<p>No hay películas registradas.</p>";
    return;
  }

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

async function cargarPeliculas() {
  const res = await fetch("/api/movies");
  todasLasPeliculas = await res.json();
  mostrarPeliculas(todasLasPeliculas);
}

function filtrarPeliculas() {
  const texto = document.getElementById("buscador").value.toLowerCase();

  const filtradas = todasLasPeliculas.filter((peli) =>
    peli.titulo.toLowerCase().includes(texto) ||
    peli.genero.toLowerCase().includes(texto)
  );

  mostrarPeliculas(filtradas);
}

async function editarPelicula(id) {
  const pelicula = todasLasPeliculas.find((peli) => peli._id === id);

  if (!pelicula) return;

  const titulo = prompt("Nuevo título:", pelicula.titulo);
  const descripcion = prompt("Nueva descripción:", pelicula.descripcion);
  const anio = prompt("Nuevo año:", pelicula.anio);
  const genero = prompt("Nuevo género:", pelicula.genero);

  if (!titulo || !descripcion || !anio || !genero) {
    alert("Todos los campos son obligatorios");
    return;
  }

  if (isNaN(anio)) {
    alert("El año debe ser un número");
    return;
  }

  await fetch(`/api/movies/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ titulo, descripcion, anio, genero })
  });

  alert("Película actualizada correctamente ✅");
  cargarPeliculas();
}

async function eliminarPelicula(id) {
  const confirmar = confirm("¿Seguro que quieres eliminar esta película?");

  if (!confirmar) return;

  await fetch(`/api/movies/${id}`, {
    method: "DELETE"
  });

  alert("Película eliminada correctamente 🗑️");
  cargarPeliculas();
}

movieForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const anio = document.getElementById("anio").value.trim();
  const genero = document.getElementById("genero").value.trim();

  if (!titulo || !descripcion || !anio || !genero) {
    alert("Todos los campos son obligatorios");
    return;
  }

  if (isNaN(anio)) {
    alert("El año debe ser un número");
    return;
  }

  const nuevaPelicula = {
    titulo,
    descripcion,
    anio,
    genero
  };

  await fetch("/api/movies", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(nuevaPelicula)
  });

  alert("Película guardada correctamente ✅");
  movieForm.reset();
  cargarPeliculas();
});

const buscador = document.createElement("input");
buscador.type = "text";
buscador.id = "buscador";
buscador.placeholder = "Buscar por título o género...";
buscador.addEventListener("input", filtrarPeliculas);

movieForm.insertAdjacentElement("afterend", buscador);

cargarPeliculas();