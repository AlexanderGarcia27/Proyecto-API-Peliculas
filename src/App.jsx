import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaSearch } from "react-icons/fa";

const NoResults = () => {
  return (
    <div className="no-results-container d-flex flex-column justify-content-center align-items-center p-4">
      <div className="animation-container">
        
      </div>
      
      <p className="text-dark no-results-text mb-3" style={{ fontSize: '1.2rem', fontWeight: '500' }}>
        No se encontraron resultados para lo que estás buscando.
      </p>
      
      <div className="d-flex flex-column align-items-center mt-4">
        <img
          src="https://img.icons8.com/ios/452/sad.png"
          alt="Sad face"
          className="sad-icon mb-3"
          style={{ width: '60px', height: '60px' }} 
        />
        <p className="text-muted try-again-text" style={{ fontSize: '1rem', fontWeight: '400' }}>
          ¡Intenta con otro término!
        </p>
      </div>
      
      <button className="btn btn-primary mt-4 px-4 py-2" style={{ borderRadius: '50px' }}>
        No se encontro ningun resultado de busqueda.
      </button>
    </div>
  );
};

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
    axios
      .get(moviesUrl)
      .then((response) => setMovies(response.data.results))
      .catch((error) => {
        setError("Error al obtener las películas");
        console.error(error);
      });

    axios
      .get(genresUrl)
      .then((response) => setGenres(response.data.genres))
      .catch((error) => console.error("Error al obtener géneros:", error));
  }, []);

  const handleSearch = (event) => {
    const value = event.target.value;
    if (value.trim().length === 0) {
      setSearch(""); 
      return;
    }
    setSearch(value);
    setLoading(true);
    setTimeoutError(false);

    setTimeout(() => {
      if (loading) {
        setTimeoutError(true);
      }
    }, 7500);
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

    return matchesTitle || matchesGenre;
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
        <NoResults />
      )}

      {error && <p className="text-danger text-center">{error}</p>}
      
      {!loading && filteredMovies.length === 0 && search && !timeoutError }

      {filteredMovies.length > 0 && (
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
      )}
    </main>
  );
};

const App = () => {
  return <MoviesList />;
};

export default App;