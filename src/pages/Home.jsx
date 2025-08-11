import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Music, Disc, BookOpen, Search, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ContentRenderer from '../components/ContentRenderer';
import { ColorCoding } from '../utils/colorCoding';

/**
 * Pagina principale del sito
 */
const Home = ({ searchEngine }) => {
  const [homeContent, setHomeContent] = useState('');
  const [stats, setStats] = useState({});
  const [featuredContent, setFeaturedContent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHomeContent();
    loadStats();
    loadFeaturedContent();
  }, [searchEngine]);

  const loadHomeContent = async () => {
    try {
      // Carica il contenuto della home page
      const response = await fetch('/content/index.md');
      if (response.ok) {
        const content = await response.text();
        setHomeContent(content);
      }
    } catch (error) {
      console.error('Errore nel caricamento del contenuto home:', error);
      // Contenuto di fallback
      setHomeContent(`---
title: "Santería Music Database"
type: "home"
description: "Un database completo di informazioni sulla musica folkloristica afro-cubana e la religione Santería"
---

# Santería Music Database

Benvenuti nel database della musica Santería, una collezione completa di informazioni sulla musica folkloristica afro-cubana.

## Esplora il Database

Utilizzate la navigazione per esplorare le diverse sezioni del database e scoprire la ricchezza della tradizione musicale della Santería.
`);
    }
  };

  const loadStats = () => {
    if (searchEngine && searchEngine.isInitialized) {
      const statistics = searchEngine.getStats();
      setStats(statistics);
    } else {
      // Stats di esempio
      setStats({
        total: 150,
        byType: {
          orishas: 35,
          toques: 45,
          cantos: 120,
          albums: 85,
          transcriptions: 25
        }
      });
    }
  };

  const loadFeaturedContent = () => {
    // Contenuto in evidenza (esempio)
    const featured = [
      {
        id: 'eleggua',
        title: 'Elegguá',
        type: 'orishas',
        description: 'Il guardiano delle strade e messaggero degli Orishas',
        path: '/orishas/eleggua'
      },
      {
        id: 'latokpa',
        title: 'Latokpa',
        type: 'toques',
        description: 'Toque principale per Elegguá',
        path: '/toques/latokpa'
      },
      {
        id: 'ago-eleggua',
        title: 'Ago Elegguá',
        type: 'cantos',
        description: 'Canto fondamentale di richiesta di permesso',
        path: '/cantos/ago-eleggua'
      }
    ];
    
    setFeaturedContent(featured);
    setIsLoading(false);
  };

  const sections = [
    {
      name: 'Orishas',
      path: '/orishas',
      icon: User,
      type: 'orishas',
      description: 'Esplora le divinità della tradizione yoruba',
      count: stats.byType?.orishas || 0
    },
    {
      name: 'Toques',
      path: '/toques',
      icon: Music,
      type: 'toques',
      description: 'Scopri i ritmi sacri dei tamburi batá',
      count: stats.byType?.toques || 0
    },
    {
      name: 'Cantos',
      path: '/cantos',
      icon: Music,
      type: 'cantos',
      description: 'Ascolta i canti e le invocazioni',
      count: stats.byType?.cantos || 0
    },
    {
      name: 'Albums',
      path: '/albums',
      icon: Disc,
      type: 'albums',
      description: 'Esplora la discografia afro-cubana',
      count: stats.byType?.albums || 0
    },
    {
      name: 'Trascrizioni',
      path: '/transcriptions',
      icon: BookOpen,
      type: 'transcriptions',
      description: 'Leggi le trascrizioni musicali',
      count: stats.byType?.transcriptions || 0
    }
  ];

  const getSectionStyle = (type) => {
    const theme = ColorCoding.generateTheme(type);
    return {
      borderColor: theme.colors.primary,
      '--hover-bg': theme.colors.light,
      '--hover-border': theme.colors.secondary
    };
  };

  const getIconStyle = (type) => {
    const theme = ColorCoding.generateTheme(type);
    return {
      backgroundColor: theme.colors.primary,
      color: 'white'
    };
  };

  const getBadgeStyle = (type) => {
    const theme = ColorCoding.generateTheme(type);
    return {
      backgroundColor: theme.colors.secondary,
      color: 'white'
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-amber-600 to-red-600 rounded-full flex items-center justify-center shadow-lg">
            <Music className="w-10 h-10 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Santería Music Database
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Un database completo di informazioni sulla musica folkloristica afro-cubana 
          e la religione Santería. Esplora Orishas, toques, cantos e molto altro.
        </p>
        
        {/* Statistiche rapide */}
        <div className="flex justify-center items-center space-x-8 text-sm text-gray-500">
          <div className="flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            {stats.total || 0} contenuti totali
          </div>
          <div className="flex items-center">
            <Search className="w-4 h-4 mr-1" />
            Ricerca progressiva
          </div>
        </div>
      </div>

      {/* Sezioni principali */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {sections.map((section) => {
          const Icon = section.icon;
          
          return (
            <Link
              key={section.path}
              to={section.path}
              className="group"
            >
              <Card 
                className="h-full border-2 transition-all duration-300 hover:shadow-lg hover:scale-105"
                style={getSectionStyle(section.type)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = e.currentTarget.style.getPropertyValue('--hover-bg');
                  e.currentTarget.style.borderColor = e.currentTarget.style.getPropertyValue('--hover-border');
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = ColorCoding.getColor(section.type, 'primary');
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div 
                      className="p-3 rounded-lg"
                      style={getIconStyle(section.type)}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge 
                      variant="secondary"
                      style={getBadgeStyle(section.type)}
                    >
                      {section.count}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-gray-700 transition-colors">
                    {section.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 group-hover:text-gray-700 transition-colors">
                    {section.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Contenuto in evidenza */}
      {featuredContent.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Contenuti in Evidenza
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredContent.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className="group"
              >
                <Card className="h-full border hover:shadow-md transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </CardTitle>
                      <Badge 
                        variant="outline"
                        style={{
                          borderColor: ColorCoding.getColor(item.type, 'primary'),
                          color: ColorCoding.getColor(item.type, 'primary')
                        }}
                      >
                        {item.type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Contenuto principale */}
      <div className="max-w-4xl mx-auto">
        <ContentRenderer 
          content={homeContent}
          type="home"
          showMetadata={false}
          showRelated={false}
        />
      </div>

      {/* Call to action */}
      <div className="text-center mt-12 py-8 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Inizia la tua esplorazione
        </h3>
        <p className="text-gray-600 mb-6">
          Utilizza la ricerca per trovare contenuti specifici o naviga attraverso le sezioni
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link to="/orishas">
              <User className="w-5 h-5 mr-2" />
              Esplora gli Orishas
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/toques">
              <Music className="w-5 h-5 mr-2" />
              Ascolta i Toques
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;

