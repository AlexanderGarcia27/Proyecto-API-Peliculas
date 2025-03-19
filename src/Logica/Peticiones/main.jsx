import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MoviesList = () => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");

  const apiKey = '336b2c58da447567bdceae637d3467b7';

  const url = `https://api.themoviedb.org/3/trending/movie/day?language=es-ES&api_key=${apiKey}`;

  // Obtener géneros disponibles
  useEffect(() => {
    axios
      .get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=es-ES`)
      .then(response => {
        setGenres(response.data.genres);
      })
      .catch(error => {
        setError('Error al obtener los géneros');
        console.error(error);
      });
  }, []);

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

  const handleGenreChange = (event) => {
    setSelectedGenre(event.target.value);
  };

  // Filtrar películas por título y género
  const filteredMovies = movies.filter(movie => {
    const matchesTitleOrName =
      (movie.title?.toLowerCase().includes(search.toLowerCase()) ||
        movie.name?.toLowerCase().includes(search.toLowerCase()));

    const matchesGenre = selectedGenre
      ? movie.genre_ids.includes(parseInt(selectedGenre))
      : true;

    return matchesTitleOrName && matchesGenre;
  });

  const getReleaseDate = (movie) => {
    if (movie.media_type === 'movie') {
      return movie.release_date || 'Fecha no disponible';
    }
    if (movie.media_type === 'tv') {
      return movie.first_air_date || 'Fecha no disponible';
    }
    return 'Fecha no disponible';
  };

  // Cambiar para mostrar géneros en texto, no en números
  const getGenres = (genreIds) => {
    // Creamos un mapa de géneros para buscar por nombre
    const genresMap = genres.reduce((map, genre) => {
      map[genre.id] = genre.name;
      return map;
    }, {});

    return genreIds.map(id => genresMap[id] || 'Género desconocido').join(', ');
  };

  return (
    <main className="container-fluid bg-success p-5 mt-5">
      <section className="d-flex justify-content-center mb-4">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Buscar por título, autor o género..."
          value={search}
          onChange={handleSearch}
        />
      </section>

      {/* Selector de Género */}
      <section className="d-flex justify-content-center mb-4">
        <select
          className="form-control w-50"
          value={selectedGenre}
          onChange={handleGenreChange}
        >
          <option value="">Todos los géneros</option>
          {genres.map(genre => (
            <option key={genre.id} value={genre.id}>{genre.name}</option>
          ))}
        </select>
      </section>

      <div className="row">
        {error && <p>{error}</p>}

        {filteredMovies.map(movie => (
          <div className="col-md-4" key={movie.id}>
            <article className="card w-100 mt-5">
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                className="card-img-top"
                alt={`Imagen de ${movie.title || movie.name}`}
              />
              <div className="card-body">
                <h2 className="card-title">{movie.title || movie.name}</h2>
                <p className="card-text">{movie.overview}</p>
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">Género: {getGenres(movie.genre_ids)}</li>
                <li className="list-group-item">Lenguaje: {movie.original_language}</li>
                <li className="list-group-item">Votos: {movie.vote_average}</li>
                <li className="list-group-item">Fecha: {getReleaseDate(movie)}</li>
              </ul>
            </article>
          </div>
        ))}
      </div>
    </main>
  );
};

export default MoviesList;
