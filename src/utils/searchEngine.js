import Fuse from 'fuse.js';

/**
 * Motore di ricerca progressiva per il database Santería
 */
export class SearchEngine {
  constructor() {
    this.fuse = null;
    this.searchIndex = [];
    this.isInitialized = false;
  }

  /**
   * Inizializza il motore di ricerca con i dati
   * @param {Array} data - Array di oggetti da indicizzare
   */
  initialize(data) {
    this.searchIndex = data;
    
    // Configurazione Fuse.js per ricerca fuzzy
    const options = {
      // Campi su cui effettuare la ricerca
      keys: [
        {
          name: 'title',
          weight: 0.3
        },
        {
          name: 'description',
          weight: 0.2
        },
        {
          name: 'content',
          weight: 0.2
        },
        {
          name: 'type',
          weight: 0.1
        },
        {
          name: 'orisha',
          weight: 0.1
        },
        {
          name: 'artist',
          weight: 0.05
        },
        {
          name: 'related_cantos',
          weight: 0.05
        },
        {
          name: 'related_toques',
          weight: 0.05
        }
      ],
      
      // Configurazioni di ricerca
      includeScore: true,
      includeMatches: true,
      threshold: 0.4, // 0 = perfetto match, 1 = qualsiasi cosa
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 2,
      
      // Opzioni avanzate
      shouldSort: true,
      findAllMatches: false,
      ignoreLocation: true,
      ignoreFieldNorm: false
    };

    this.fuse = new Fuse(this.searchIndex, options);
    this.isInitialized = true;
  }

  /**
   * Effettua una ricerca
   * @param {string} query - Query di ricerca
   * @param {Object} filters - Filtri opzionali
   * @returns {Array} Risultati della ricerca
   */
  search(query, filters = {}) {
    if (!this.isInitialized || !query || query.trim().length < 2) {
      return [];
    }

    // Ricerca con Fuse.js
    let results = this.fuse.search(query.trim());

    // Applica filtri se specificati
    if (Object.keys(filters).length > 0) {
      results = this.applyFilters(results, filters);
    }

    // Formatta i risultati
    return results.map(result => ({
      item: result.item,
      score: result.score,
      matches: result.matches,
      highlights: this.generateHighlights(result.matches, query)
    }));
  }

  /**
   * Ricerca con suggerimenti automatici
   * @param {string} partialQuery - Query parziale
   * @param {number} limit - Numero massimo di suggerimenti
   * @returns {Array} Suggerimenti
   */
  suggest(partialQuery, limit = 5) {
    if (!this.isInitialized || !partialQuery || partialQuery.length < 1) {
      return [];
    }

    // Cerca titoli che iniziano con la query
    const titleMatches = this.searchIndex
      .filter(item => 
        item.title && 
        item.title.toLowerCase().startsWith(partialQuery.toLowerCase())
      )
      .slice(0, limit);

    // Se non ci sono abbastanza match esatti, usa ricerca fuzzy
    if (titleMatches.length < limit) {
      const fuzzyResults = this.search(partialQuery, {})
        .slice(0, limit - titleMatches.length);
      
      return [
        ...titleMatches.map(item => ({ item, type: 'exact' })),
        ...fuzzyResults.map(result => ({ item: result.item, type: 'fuzzy' }))
      ];
    }

    return titleMatches.map(item => ({ item, type: 'exact' }));
  }

  /**
   * Ricerca per categoria
   * @param {string} type - Tipo di contenuto
   * @param {string} query - Query opzionale
   * @returns {Array} Risultati filtrati per tipo
   */
  searchByType(type, query = '') {
    if (!this.isInitialized) {
      return [];
    }

    let filtered = this.searchIndex.filter(item => item.type === type);

    if (query && query.trim().length >= 2) {
      // Crea un indice temporaneo solo per questo tipo
      const tempFuse = new Fuse(filtered, {
        keys: ['title', 'description', 'content'],
        threshold: 0.3,
        includeScore: true
      });
      
      const results = tempFuse.search(query.trim());
      return results.map(result => result.item);
    }

    return filtered;
  }

  /**
   * Trova contenuti correlati
   * @param {Object} item - Elemento di riferimento
   * @param {number} limit - Numero massimo di risultati
   * @returns {Array} Contenuti correlati
   */
  findRelated(item, limit = 5) {
    if (!this.isInitialized || !item) {
      return [];
    }

    const related = [];

    // Cerca per Orisha correlato
    if (item.orisha) {
      const orishaRelated = this.searchIndex.filter(other => 
        other.id !== item.id && 
        (other.orisha === item.orisha || 
         (other.related_orishas && other.related_orishas.includes(item.orisha)))
      );
      related.push(...orishaRelated);
    }

    // Cerca per toques correlati
    if (item.related_toques) {
      const toqueRelated = this.searchIndex.filter(other =>
        other.id !== item.id &&
        other.type === 'toque' &&
        item.related_toques.includes(other.title.toLowerCase())
      );
      related.push(...toqueRelated);
    }

    // Cerca per cantos correlati
    if (item.related_cantos) {
      const cantoRelated = this.searchIndex.filter(other =>
        other.id !== item.id &&
        other.type === 'canto' &&
        item.related_cantos.includes(other.title.toLowerCase())
      );
      related.push(...cantoRelated);
    }

    // Rimuovi duplicati e limita i risultati
    const unique = related.filter((item, index, self) => 
      index === self.findIndex(other => other.id === item.id)
    );

    return unique.slice(0, limit);
  }

  /**
   * Applica filtri ai risultati di ricerca
   * @param {Array} results - Risultati da filtrare
   * @param {Object} filters - Filtri da applicare
   * @returns {Array} Risultati filtrati
   */
  applyFilters(results, filters) {
    return results.filter(result => {
      const item = result.item;

      // Filtro per tipo
      if (filters.type && item.type !== filters.type) {
        return false;
      }

      // Filtro per Orisha
      if (filters.orisha && item.orisha !== filters.orisha) {
        return false;
      }

      // Filtro per artista (album)
      if (filters.artist && item.artist !== filters.artist) {
        return false;
      }

      // Filtro per anno (album)
      if (filters.year && item.year !== filters.year) {
        return false;
      }

      return true;
    });
  }

  /**
   * Genera highlights per i match trovati
   * @param {Array} matches - Match trovati da Fuse.js
   * @param {string} query - Query originale
   * @returns {Object} Highlights organizzati per campo
   */
  generateHighlights(matches, query) {
    const highlights = {};

    if (!matches) return highlights;

    matches.forEach(match => {
      const field = match.key;
      const value = match.value;
      
      if (!highlights[field]) {
        highlights[field] = [];
      }

      // Crea highlight per ogni match
      match.indices.forEach(([start, end]) => {
        const before = value.substring(0, start);
        const highlighted = value.substring(start, end + 1);
        const after = value.substring(end + 1);

        highlights[field].push({
          before,
          highlighted,
          after,
          full: value
        });
      });
    });

    return highlights;
  }

  /**
   * Ottiene statistiche sui contenuti
   * @returns {Object} Statistiche del database
   */
  getStats() {
    if (!this.isInitialized) {
      return {};
    }

    const stats = {
      total: this.searchIndex.length,
      byType: {}
    };

    // Conta per tipo
    this.searchIndex.forEach(item => {
      if (!stats.byType[item.type]) {
        stats.byType[item.type] = 0;
      }
      stats.byType[item.type]++;
    });

    return stats;
  }

  /**
   * Ottiene tutti i valori unici per un campo
   * @param {string} field - Campo da analizzare
   * @returns {Array} Valori unici
   */
  getUniqueValues(field) {
    if (!this.isInitialized) {
      return [];
    }

    const values = new Set();
    
    this.searchIndex.forEach(item => {
      if (item[field]) {
        if (Array.isArray(item[field])) {
          item[field].forEach(value => values.add(value));
        } else {
          values.add(item[field]);
        }
      }
    });

    return Array.from(values).sort();
  }

  /**
   * Resetta il motore di ricerca
   */
  reset() {
    this.fuse = null;
    this.searchIndex = [];
    this.isInitialized = false;
  }
}

// Istanza singleton del motore di ricerca
export const searchEngine = new SearchEngine();

export default searchEngine;

