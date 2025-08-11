import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Calendar, User, Music, Disc, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MarkdownParser } from '../utils/markdownParser';
import { ColorCoding } from '../utils/colorCoding';

/**
 * Componente per il rendering dei contenuti Markdown con metadati
 */
const ContentRenderer = ({ 
  content, 
  type = 'home', 
  showMetadata = true, 
  showRelated = true,
  onLinkClick 
}) => {
  const [parsedContent, setParsedContent] = useState(null);
  const [tableOfContents, setTableOfContents] = useState([]);
  const [internalLinks, setInternalLinks] = useState([]);

  useEffect(() => {
    if (content) {
      // Parsa il contenuto Markdown
      const parsed = MarkdownParser.parse(content);
      setParsedContent(parsed);

      if (parsed.success) {
        // Genera il sommario
        const toc = MarkdownParser.generateToc(parsed.rawContent);
        setTableOfContents(toc);

        // Estrae i link interni
        const links = MarkdownParser.extractInternalLinks(parsed.rawContent);
        setInternalLinks(links);
      }
    }
  }, [content]);

  if (!parsedContent || !parsedContent.success) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Errore nel caricamento del contenuto</p>
        {parsedContent?.error && (
          <p className="text-red-500 text-sm mt-2">{parsedContent.error}</p>
        )}
      </div>
    );
  }

  const { metadata } = parsedContent;
  const theme = ColorCoding.generateTheme(type);

  const getTypeIcon = (contentType) => {
    const icons = {
      orisha: User,
      toque: Music,
      canto: Music,
      album: Disc,
      transcription: BookOpen,
      home: BookOpen
    };
    return icons[contentType] || BookOpen;
  };

  const formatMetadataValue = (key, value) => {
    if (Array.isArray(value)) {
      return value.map((item, index) => (
        <Badge 
          key={index} 
          variant="secondary" 
          className="mr-1 mb-1"
          style={{ 
            backgroundColor: theme.colors.light,
            color: theme.colors.dark 
          }}
        >
          {item}
        </Badge>
      ));
    }
    
    if (typeof value === 'string' && value.includes('/')) {
      // Potrebbe essere un link interno
      return (
        <Link 
          to={value} 
          className="text-blue-600 hover:text-blue-800 underline"
          onClick={onLinkClick}
        >
          {value}
        </Link>
      );
    }
    
    return value;
  };

  const renderMetadata = () => {
    if (!showMetadata || !metadata || Object.keys(metadata).length === 0) {
      return null;
    }

    const excludeFields = ['title', 'type', 'description'];
    const metadataFields = Object.entries(metadata).filter(
      ([key]) => !excludeFields.includes(key)
    );

    if (metadataFields.length === 0) return null;

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <div 
              className="w-4 h-4 rounded mr-2"
              style={{ backgroundColor: theme.colors.primary }}
            />
            Informazioni
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metadataFields.map(([key, value]) => (
              <div key={key} className="flex flex-col">
                <dt className="font-medium text-gray-700 capitalize mb-1">
                  {key.replace(/_/g, ' ')}:
                </dt>
                <dd className="text-gray-900">
                  {formatMetadataValue(key, value)}
                </dd>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderTableOfContents = () => {
    if (tableOfContents.length === 0) return null;

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Sommario</CardTitle>
        </CardHeader>
        <CardContent>
          <nav className="space-y-1">
            {tableOfContents.map((heading, index) => (
              <a
                key={index}
                href={`#${heading.id}`}
                className={`block py-1 text-sm hover:text-blue-600 transition-colors ${
                  heading.level === 1 ? 'font-semibold' :
                  heading.level === 2 ? 'ml-4 font-medium' :
                  heading.level === 3 ? 'ml-8' :
                  'ml-12 text-gray-600'
                }`}
                style={{
                  color: heading.level <= 2 ? theme.colors.primary : undefined
                }}
              >
                {heading.title}
              </a>
            ))}
          </nav>
        </CardContent>
      </Card>
    );
  };

  const renderRelatedContent = () => {
    if (!showRelated || internalLinks.length === 0) return null;

    const linksByType = internalLinks.reduce((acc, link) => {
      if (!acc[link.type]) acc[link.type] = [];
      acc[link.type].push(link);
      return acc;
    }, {});

    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Contenuti Correlati</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.entries(linksByType).map(([linkType, links]) => (
            <div key={linkType} className="mb-4 last:mb-0">
              <h4 className="font-medium text-gray-700 capitalize mb-2">
                {linkType}s:
              </h4>
              <div className="flex flex-wrap gap-2">
                {links.map((link, index) => (
                  <Link
                    key={index}
                    to={link.url}
                    onClick={onLinkClick}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm border hover:shadow-md transition-all"
                    style={{
                      borderColor: ColorCoding.getColor(linkType, 'primary'),
                      color: ColorCoding.getColor(linkType, 'primary')
                    }}
                  >
                    {link.text}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  const processHtmlContent = (html) => {
    // Aggiungi ID agli heading per il sommario
    return html.replace(
      /<h([1-6])>(.*?)<\/h[1-6]>/g,
      (match, level, title) => {
        const id = title.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');
        return `<h${level} id="${id}" class="scroll-mt-20">${title}</h${level}>`;
      }
    );
  };

  const TypeIcon = getTypeIcon(type);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header con titolo e tipo */}
      {metadata.title && (
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <div 
              className="p-2 rounded-lg mr-3"
              style={{ backgroundColor: theme.colors.primary }}
            >
              <TypeIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 
                className="text-3xl font-bold"
                style={{ color: theme.colors.primary }}
              >
                {metadata.title}
              </h1>
              <Badge 
                variant="secondary"
                className="mt-1"
                style={{
                  backgroundColor: theme.colors.secondary,
                  color: 'white'
                }}
              >
                {type}
              </Badge>
            </div>
          </div>
          
          {metadata.description && (
            <p className="text-lg text-gray-600 mt-2">
              {metadata.description}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Contenuto principale */}
        <div className="lg:col-span-3">
          {/* Metadati */}
          {renderMetadata()}
          
          {/* Contenuto Markdown */}
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: processHtmlContent(parsedContent.content) 
            }}
            style={{
              '--tw-prose-headings': theme.colors.primary,
              '--tw-prose-links': theme.colors.secondary,
              '--tw-prose-bold': theme.colors.dark
            }}
          />
          
          {/* Contenuti correlati */}
          {renderRelatedContent()}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Sommario */}
          {renderTableOfContents()}
          
          {/* Informazioni aggiuntive */}
          {metadata.last_update && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  Ultimo aggiornamento: {metadata.last_update}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentRenderer;

