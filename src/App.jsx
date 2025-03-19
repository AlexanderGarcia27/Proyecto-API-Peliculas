import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'
const MoviesList = () => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  const apiKey = '336b2c58da447567bdceae637d3467b7';

  const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=es-ES&page=1&sort_by=popularity.desc&api_key=${apiKey}`;

  //const url = `https://api.themoviedb.org/3/trending/all/day?language=en-EN&api_key=${apiKey}`;
  useEffect(() => {
    
    axios
      .get(url)
      .then(response => {
        
        setMovies(response.data.results);
      })
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
    <main className="container-fluid bg-success p-5 mt-5">
      <section className="d-flex justify-content-center mb-4">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Buscar..."
          value={search}
          onChange={handleSearch}
        />
      </section>

      <div className="row">
        {error && <p>{error}</p>}

        {filteredMovies.map(movie => (
          <div className="col-md-4" key={movie.id}>
            <article className="card w-100 mt-5">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                className="card-img-top"
                alt={`Imagen de ${movie.title}`}
              />
              <div className="card-body">
                <h2 className="card-title">{movie.title}</h2>
                <p className="card-text">{movie.overview}</p>
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Genero: {movie.genre_ids.join(', ')}</li>
                <li className="list-group-item">Lenguaje: {movie.original_language}</li>
                <li className="list-group-item">Votos: {movie.vote_average}</li>
                <li className="list-group-item">Fecha: {movie.release_date}</li>
              </ul>
            </article>
          </div>
        ))}
      </div>
    </main>
  );
};

export default MoviesList;