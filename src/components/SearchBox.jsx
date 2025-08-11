import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ColorCoding } from '../utils/colorCoding';

/**
 * Componente per la ricerca progressiva
 */
const SearchBox = ({ 
  onSearch, 
  onSuggestionSelect, 
  suggestions = [], 
  isLoading = false,
  placeholder = "Cerca Orishas, toques, cantos, album...",
  showFilters = true 
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [activeFilters, setActiveFilters] = useState({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceRef = useRef(null);

  // Debounce per la ricerca
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (query.trim().length >= 2) {
        onSearch(query, activeFilters);
        setIsOpen(true);
      } else if (query.trim().length === 0) {
        onSearch('', activeFilters);
        setIsOpen(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, activeFilters, onSearch]);

  // Gestione della navigazione con tastiera
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen || suggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && suggestions[selectedIndex]) {
            handleSuggestionClick(suggestions[selectedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setSelectedIndex(-1);
          inputRef.current?.blur();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, suggestions, selectedIndex]);

  // Chiudi suggerimenti quando si clicca fuori
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
  };

  const handleSuggestionClick = (suggestion) => {
    const item = suggestion.item || suggestion;
    setQuery(item.title || '');
    setIsOpen(false);
    setSelectedIndex(-1);
    onSuggestionSelect(item);
  };

  const clearSearch = () => {
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
    onSearch('', activeFilters);
    inputRef.current?.focus();
  };

  const toggleFilter = (type, value) => {
    setActiveFilters(prev => {
      const newFilters = { ...prev };
      if (newFilters[type] === value) {
        delete newFilters[type];
      } else {
        newFilters[type] = value;
      }
      return newFilters;
    });
  };

  const clearFilters = () => {
    setActiveFilters({});
  };

  const getTypeColor = (type) => {
    return ColorCoding.getColor(type, 'primary');
  };

  const getTypeBadgeStyle = (type) => {
    const color = getTypeColor(type);
    return {
      backgroundColor: color,
      color: ColorCoding.getContrastTextColor(color),
      borderColor: color
    };
  };

  const highlightMatch = (text, query) => {
    if (!query || !text) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-yellow-900 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Input di ricerca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="pl-10 pr-20 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          onFocus={() => {
            if (suggestions.length > 0 && query.length >= 2) {
              setIsOpen(true);
            }
          }}
        />
        
        {/* Pulsanti di controllo */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="p-1 h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          
          {showFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={`p-1 h-8 w-8 ${showFilterPanel ? 'bg-gray-200' : ''}`}
            >
              <Filter className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Filtri attivi */}
      {Object.keys(activeFilters).length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {Object.entries(activeFilters).map(([type, value]) => (
            <Badge
              key={`${type}-${value}`}
              variant="secondary"
              className="cursor-pointer"
              style={getTypeBadgeStyle(value)}
              onClick={() => toggleFilter(type, value)}
            >
              {type}: {value}
              <X className="w-3 h-3 ml-1" />
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs px-2 py-1 h-6"
          >
            Cancella filtri
          </Button>
        </div>
      )}

      {/* Pannello filtri */}
      {showFilterPanel && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50">
          <h3 className="font-semibold mb-3">Filtra per tipo:</h3>
          <div className="flex flex-wrap gap-2">
            {['orishas', 'toques', 'cantos', 'albums', 'transcriptions'].map(type => (
              <Button
                key={type}
                variant={activeFilters.type === type ? "default" : "outline"}
                size="sm"
                onClick={() => toggleFilter('type', type)}
                style={activeFilters.type === type ? getTypeBadgeStyle(type) : {}}
                className="capitalize"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Suggerimenti */}
      {isOpen && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto z-40"
        >
          {suggestions.map((suggestion, index) => {
            const item = suggestion.item || suggestion;
            const isSelected = index === selectedIndex;
            
            return (
              <div
                key={item.id || index}
                className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50 ${
                  isSelected ? 'bg-blue-50' : ''
                }`}
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {highlightMatch(item.title, query)}
                    </div>
                    {item.description && (
                      <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {highlightMatch(item.description, query)}
                      </div>
                    )}
                    {item.orisha && (
                      <div className="text-xs text-gray-500 mt-1">
                        Orisha: {item.orisha}
                      </div>
                    )}
                  </div>
                  
                  <Badge
                    variant="secondary"
                    className="ml-3 text-xs"
                    style={getTypeBadgeStyle(item.type)}
                  >
                    {item.type}
                  </Badge>
                </div>
              </div>
            );
          })}
          
          {/* Indicatore di caricamento */}
          {isLoading && (
            <div className="px-4 py-3 text-center text-gray-500">
              <div className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
              Ricerca in corso...
            </div>
          )}
        </div>
      )}

      {/* Messaggio nessun risultato */}
      {isOpen && !isLoading && suggestions.length === 0 && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500 z-40">
          Nessun risultato trovato per "{query}"
        </div>
      )}
    </div>
  );
};

export default SearchBox;

