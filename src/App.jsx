import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSearch } from "react-icons/fa";

const MoviesList = () => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({});
  const [genres, setGenres] = useState([]);
  const apiKey = "336b2c58da447567bdceae637d3467b7";

  // URLs de la API
  const moviesUrl = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&api_key=${apiKey}`;
  const genresUrl = `https://api.themoviedb.org/3/genre/movie/list?language=en-US&api_key=${apiKey}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesResponse, genresResponse] = await Promise.all([
          axios.get(moviesUrl),
          axios.get(genresUrl),
        ]);

        const moviesWithActors = await Promise.all(
          moviesResponse.data.results.map(async (movie) => {
            const creditsUrl = `https://api.themoviedb.org/3/movie/${movie.id}/credits?api_key=${apiKey}`;
            try {
              const creditsResponse = await axios.get(creditsUrl);
              const actors = creditsResponse.data.cast
                .slice(0, 5)
                .map((actor) => actor.name)
                .join(", ");
              return { ...movie, actors };
            } catch (error) {
              console.error("Error al obtener actores:", error);
              return { ...movie, actors: "No disponible" };
            }
          })
        );

        setMovies(moviesWithActors);
        setGenres(genresResponse.data.genres);
      } catch (error) {
        setError("Error al obtener datos");
        console.error(error);
      }
    };

    fetchData();
  }, []);

  // Función para manejar la búsqueda
  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  // Función para alternar la expansión de tarjetas
  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Función para obtener el nombre de los géneros basado en sus IDs
  const getGenreNames = (genreIds) => {
    return genreIds
      .map((id) => {
        const genre = genres.find((g) => g.id === id);
        return genre ? genre.name : null;
      })
      .filter((name) => name !== null)
      .join(", ");
  };

  // Filtrar películas por título, género o actor
  const filteredMovies = movies.filter((movie) => {
    const lowerCaseSearch = search.toLowerCase();

    // Verificar si coincide el título
    const matchesTitle = movie.title.toLowerCase().includes(lowerCaseSearch);

    // Verificar si coincide con un género
    const movieGenres = getGenreNames(movie.genre_ids).toLowerCase();
    const matchesGenre = movieGenres.includes(lowerCaseSearch);

    // Verificar si coincide con un actor
    const matchesActor = movie.actors.toLowerCase().includes(lowerCaseSearch);

    return matchesTitle || matchesGenre || matchesActor;
  });

  return (
    <main className="container-fluid bg-dark text-white p-5 mt-5">
      {/* Barra de búsqueda */}
      <section className="d-flex justify-content-center mb-4">
        <div className="position-relative w-50">
          <input
            type="text"
            className="form-control border-4 rounded-5 bg-dark shadow-lg p-3 text-white ps-5"
            placeholder="Buscar por nombre, género o actor..."
            value={search}
            onChange={handleSearch}
          />
          <FaSearch className="position-absolute top-50 start-0 translate-middle-y text-white ms-3" />
        </div>
      </section>

      {error && <p className="text-danger text-center">{error}</p>}

      <div className="row">
        {filteredMovies.map((movie) => (
          <div className="col-md-4" key={movie.id}>
            <article
              className="card w-100 mt-5 shadow-lg border-0"
              style={{ backgroundColor: "#f8f9fa" }}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                className="card-img-top rounded-top w-50 h-60 mx-auto d-block mt-3"
                alt={`Imagen de ${movie.title}`}
              />
              <div className="card-body text-center">
                <h2 className="card-title text-primary">{movie.title}</h2>
                <p className="card-text text-muted">{movie.overview}</p>
              </div>

              {expanded[movie.id] && (
                <ul className="list-group list-group-flush mt-3">
                  <li className="list-group-item bg-light">
                    <strong>Género:</strong> {getGenreNames(movie.genre_ids)}
                  </li>
                  <li className="list-group-item bg-light">
                    <strong>Lenguaje:</strong> {movie.original_language}
                  </li>
                  <li className="list-group-item bg-light">
                    <strong>Actores:</strong> {movie.actors}
                  </li>
                  <li className="list-group-item bg-light">
                    <strong>Votos:</strong> {movie.vote_average}
                  </li>
                  <li className="list-group-item bg-light">
                    <strong>Fecha:</strong> {movie.release_date}
                  </li>
                </ul>
              )}

              <div className="card-footer text-center">
                <button
                  className="btn btn-primary w-50"
                  onClick={() => toggleExpand(movie.id)}
                >
                  {expanded[movie.id] ? "Ocultar detalles" : "Ver más"}
                </button>
              </div>
            </article>
          </div>
        ))}
      </div>
    </main>
  );
};

const App = () => {
  return <MoviesList />;
};

export default App;
