import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaSearch } from 'react-icons/fa';

function App() {
  const [search, setSearch] = useState('');
  const [showDetails, setShowDetails] = useState(false);

  const handleSearch = (event) => {
    setSearch(event.target.value);
    console.log('Buscando:', event.target.value);
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <main className="container-fluid bg-dark text-white p-5 mt-5">
      {/* Agregamos estilos en línea para el placeholder */}
      <style>{`
        .form-control::placeholder {
          color: white !important;
          opacity: 1;
        }
      `}</style>

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


      <div>
        <article className="card w-25 mt-5 shadow-lg border-0" style={{ backgroundColor: '#f8f9fa' }}>
          <img src="..." className="card-img-top rounded-top" alt="Imagen de la película" />
          <div className="card-body text-center">
            <h2 className="card-title text-primary">Título</h2>
            <p className="card-text text-muted">Descripción</p>
          </div>

          {showDetails && (
            <ul className="list-group list-group-flush mt-3">
              <li className="list-group-item bg-light">Género:</li>
              <li className="list-group-item bg-light">Lenguaje:</li>
              <li className="list-group-item bg-light">Votos:</li>
              <li className="list-group-item bg-light">Fecha:</li>
            </ul>
          )}

          <div className="card-footer text-center">
            <button className="btn btn-primary w-100" onClick={toggleDetails}>
              {showDetails ? 'Ocultar detalles' : 'Ver detalles'}
            </button>
          </div>
        </article>
      </div>
    </main>
  );
}

export default App;
