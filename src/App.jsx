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
  const [loading, setLoading] = useState(false);
  const [timeoutError, setTimeoutError] = useState(false);

  const apiKey = "336b2c58da447567bdceae637d3467b7";
  const moviesUrl = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=es-ES&page=1&sort_by=popularity.desc&api_key=${apiKey}`;
  const genresUrl = `https://api.themoviedb.org/3/genre/movie/list?language=es-ES&api_key=${apiKey}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setTimeoutError(false);

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
        setLoading(false);
      } catch (error) {
        setError("Error al obtener datos");
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
    setLoading(true);
    setTimeoutError(false);

    setTimeout(() => {
      if (loading) {
        setTimeoutError(true);
      }
    }, 9000);
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getGenreNames = (genreIds) => {
    return genreIds
      .map((id) => {
        const genre = genres.find((g) => g.id === id);
        return genre ? genre.name : null;
      })
      .filter((name) => name !== null)
      .join(", ");
  };

  const filteredMovies = movies.filter((movie) => {
    const lowerCaseSearch = search.toLowerCase();

    const matchesTitle = movie.title.toLowerCase().includes(lowerCaseSearch);
    const movieGenres = getGenreNames(movie.genre_ids).toLowerCase();
    const matchesGenre = movieGenres.includes(lowerCaseSearch);
    const matchesActor = movie.actors.toLowerCase().includes(lowerCaseSearch);

    return matchesTitle || matchesGenre || matchesActor;
  });

  useEffect(() => {
    if (search === "") {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    if (filteredMovies.length > 0 || search === "") {
      setLoading(false);
    }
  }, [filteredMovies]);

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

      {loading && !timeoutError && (
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-info" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      )}

      {timeoutError && !filteredMovies.length && (
        <p className="text-center text-warning">
          La película no existe o no se encuentra en la lista por el momento :3.
        </p>
      )}

      {error && <p className="text-danger text-center">{error}</p>}

      {!loading && filteredMovies.length === 0 && search && !timeoutError && (
        <p className="text-center text-warning">
          No se encontraron resultados para "{search}".
        </p>
      )}

      <div className="row">
        {filteredMovies.map((movie) => (
          <div className="col-md-4" key={movie.id}>
            <article
              className="card w-100 mt-5 shadow-lg border-0 rounded-4 overflow-hidden"
              style={{
                backgroundColor: "#333",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                className="card-img-top rounded-top w-50 h-60 mx-auto d-block mt-3"
                alt={`Imagen de ${movie.title}`}
                style={{
                  objectFit: "cover",
                  borderRadius: "12px",
                }}
              />
              <div
                className="card-body text-center"
                style={{ backgroundColor: "#343a40" }}
              >
                <h2 className="card-title text-warning">{movie.title}</h2>
                <p className="card-text text-light">
                  {expanded[movie.id]
                    ? movie.overview
                    : movie.overview.slice(0, 150) + "..."}
                </p>
                {expanded[movie.id] && (
                  <div className="card-body text-center" style={{ backgroundColor: "#222" }}>
                    <ul className="list-group list-group-flush mt-3">
                      <li className="list-group-item bg-dark text-light">
                        <strong>Género:</strong> {getGenreNames(movie.genre_ids)}
                      </li>
                      <li className="list-group-item bg-dark text-light">
                        <strong>Lenguaje:</strong> {movie.original_language}
                      </li>
                      <li className="list-group-item bg-dark text-light">
                        <strong>Actores:</strong> {movie.actors}
                      </li>
                      <li className="list-group-item bg-dark text-light">
                        <strong>Votos:</strong> {movie.vote_average}
                      </li>
                      <li className="list-group-item bg-dark text-light">
                        <strong>Fecha:</strong> {movie.release_date}
                      </li>
                    </ul>
                  </div>
                )}
                <div className="card-footer text-center" style={{ backgroundColor: "#343a40", borderRadius: "0 0 12px 12px" }}>
                  <button
                    className="btn btn-danger w-50 rounded-3"
                    onClick={() => toggleExpand(movie.id)}
                    style={{
                      transition: "background-color 0.3s ease",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e02b2b"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#dc3545"}
                  >
                    {expanded[movie.id] ? "Ocultar detalles" : "Ver más"}
                  </button>
                </div>
              </div>
            </article>
          </div>
        ))}
      </div>
    </main>
  );
};

export default MoviesList;
