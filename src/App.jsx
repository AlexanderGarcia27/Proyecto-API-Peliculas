import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaSearch } from 'react-icons/fa';

const MoviesList = () => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);

  const apiKey = '336b2c58da447567bdceae637d3467b7';
  const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&api_key=${apiKey}`;

  useEffect(() => {
    axios
      .get(url)
      .then(response => setMovies(response.data.results))
      .catch(error => {
        setError('Error al obtener las películas');
        console.error(error);
      });
  }, []);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="container-fluid bg-dark text-white p-5 mt-5">
      <section className="d-flex justify-content-center mb-4">
        <div className="position-relative w-50">
          <input
            type="text"
            className="form-control border-4 rounded-5 bg-dark shadow-lg p-3 text-white ps-5"
            placeholder="Buscar..."
            value={search}
            onChange={handleSearch}
          />
          <FaSearch className="position-absolute top-50 start-0 translate-middle-y text-white ms-3" />
        </div>
      </section>

      {error && <p className="text-danger text-center">{error}</p>}

      <div className="row">
        {filteredMovies.map(movie => (
          <div className="col-md-4" key={movie.id}>
            <article className="card w-100 mt-5 shadow-lg border-0" style={{ backgroundColor: '#f8f9fa' }}>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                className="card-img-top rounded-top"
                alt={`Imagen de ${movie.title}`}
              />
              <div className="card-body text-center">
                <h2 className="card-title text-primary">{movie.title}</h2>
                <p className="card-text text-muted">{movie.overview}</p>
              </div>
              <ul className="list-group list-group-flush mt-3">
                <li className="list-group-item bg-light">Género: {movie.genre_ids.join(', ')}</li>
                <li className="list-group-item bg-light">Lenguaje: {movie.original_language}</li>
                <li className="list-group-item bg-light">Votos: {movie.vote_average}</li>
                <li className="list-group-item bg-light">Fecha: {movie.release_date}</li>
              </ul>
            </article>
          </div>
        ))}
      </div>
    </main>
  );
};

const App = () => {
  return (
    <MoviesList />
  );
};

export default App;
