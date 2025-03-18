import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [search, setSearch] = useState('');

  const handleSearch = (event) => {
    setSearch(event.target.value);
    console.log("Buscando:", event.target.value);
  };

  return (
    <main className="container-fluid bg-success p-5 mt-5">
      <section className="d-flex justify-content-center mb-4">
        <input
          type="text"
          className="form-control w-50 "
          placeholder="Buscar..."
          value={search}
          onChange={handleSearch}
        />
      </section>
      <div>
      <article className="card w-25 mt-5">
        <img src="..." className="card-img-top" alt="Imagen de la pelicula" />
        <div className="card-body">
          <h2 className="card-title">Titulo</h2>
          <p className="card-text">Descripcion</p>
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">Genero</li>
          <li className="list-group-item">Lenguaje</li>
          <li className="list-group-item">Votos</li>
          <li className="list-group-item">Fecha</li>
        </ul>
      </article>
      
      </div>
    </main>
  );
}

export default App;
