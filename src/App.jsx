import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import SearchBox from './components/SearchBox';
import Home from './pages/Home';
import { searchEngine } from './utils/searchEngine';
import './App.css';

function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  useEffect(() => {
    // Inizializza il motore di ricerca con dati di esempio
    initializeSearchEngine();
  }, []);

  const initializeSearchEngine = async () => {
    // Dati di esempio per il motore di ricerca
    const sampleData = [
      {
        id: 'eleggua',
        title: 'Elegguá',
        type: 'orishas',
        description: 'Orisha delle strade e dei crocicchi, guardiano delle porte e messaggero degli dei',
        content: 'Elegguá è uno degli Orishas più importanti nella religione Santería...',
        orisha: 'eleggua',
        related_toques: ['latokpa', 'olumbanshe'],
        related_cantos: ['ago_eleggua', 'eleggua_go_ana']
      },
      {
        id: 'chango',
        title: 'Changó',
        type: 'orishas',
        description: 'Orisha del fuoco, del tuono, della guerra e della danza, re di Oyó',
        content: 'Changó è uno degli Orishas più venerati nella Santería...',
        orisha: 'chango',
        related_toques: ['alado_okuo', 'meta_meta'],
        related_cantos: ['chango_fara_kade', 'chango_iloro_oba']
      },
      {
        id: 'latokpa',
        title: 'Latokpa',
        type: 'toques',
        description: 'Toque principale per Elegguá, utilizzato per aprire le cerimonie',
        content: 'Latokpa è uno dei toques più importanti dedicati a Elegguá...',
        orisha: 'eleggua',
        related_cantos: ['ago_eleggua', 'eleggua_go_ana']
      },
      {
        id: 'ago_eleggua',
        title: 'Ago Elegguá',
        type: 'cantos',
        description: 'Canto fondamentale di richiesta di permesso a Elegguá',
        content: 'Ago Elegguá è uno dei cantos più fondamentali...',
        orisha: 'eleggua',
        toque: 'latokpa'
      },
      {
        id: 'abbilona_aggayu',
        title: 'Abbilona Tambor Yoruba, Aggayú',
        type: 'albums',
        description: 'Album dedicato interamente ad Aggayú, con registrazioni tradizionali di tamburi batá',
        content: 'Questo album della serie Abbilona Tambor Yoruba...',
        artist: 'Abbilona',
        year: 1990,
        orishas_featured: ['aggayu']
      }
    ];

    searchEngine.initialize(sampleData);
  };

  const handleSearch = (query, filters = {}) => {
    setIsSearchLoading(true);
    
    setTimeout(() => {
      if (query.trim().length >= 2) {
        const results = searchEngine.search(query, filters);
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
      setIsSearchLoading(false);
    }, 200);
  };

  const handleSuggestionSelect = (item) => {
    console.log('Elemento selezionato:', item);
    // Qui potresti navigare alla pagina dell'elemento
    setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation 
          onSearchToggle={toggleSearch}
          isSearchOpen={isSearchOpen}
        />
        
        {/* Overlay di ricerca */}
        {isSearchOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsSearchOpen(false)}>
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4" onClick={(e) => e.stopPropagation()}>
              <div className="bg-white rounded-lg shadow-xl p-6">
                <SearchBox
                  onSearch={handleSearch}
                  onSuggestionSelect={handleSuggestionSelect}
                  suggestions={searchResults}
                  isLoading={isSearchLoading}
                  placeholder="Cerca Orishas, toques, cantos, album..."
                  showFilters={true}
                />
              </div>
            </div>
          </div>
        )}

        <main className="py-8">
          <Routes>
            <Route 
              path="/" 
              element={<Home searchEngine={searchEngine} />} 
            />
            <Route 
              path="/orishas" 
              element={
                <div className="max-w-4xl mx-auto px-4">
                  <h1 className="text-3xl font-bold mb-6">Orishas</h1>
                  <p className="text-gray-600">Sezione in costruzione...</p>
                </div>
              } 
            />
            <Route 
              path="/toques" 
              element={
                <div className="max-w-4xl mx-auto px-4">
                  <h1 className="text-3xl font-bold mb-6">Toques</h1>
                  <p className="text-gray-600">Sezione in costruzione...</p>
                </div>
              } 
            />
            <Route 
              path="/cantos" 
              element={
                <div className="max-w-4xl mx-auto px-4">
                  <h1 className="text-3xl font-bold mb-6">Cantos</h1>
                  <p className="text-gray-600">Sezione in costruzione...</p>
                </div>
              } 
            />
            <Route 
              path="/albums" 
              element={
                <div className="max-w-4xl mx-auto px-4">
                  <h1 className="text-3xl font-bold mb-6">Albums</h1>
                  <p className="text-gray-600">Sezione in costruzione...</p>
                </div>
              } 
            />
            <Route 
              path="/transcriptions" 
              element={
                <div className="max-w-4xl mx-auto px-4">
                  <h1 className="text-3xl font-bold mb-6">Trascrizioni</h1>
                  <p className="text-gray-600">Sezione in costruzione...</p>
                </div>
              } 
            />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-gray-600">
              <p className="mb-2">
                © 2025 Santería Music Database. Creato con rispetto per la tradizione.
              </p>
              <p className="text-sm">
                Questo lavoro è dedicato alla preservazione e diffusione della cultura afro-cubana.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
