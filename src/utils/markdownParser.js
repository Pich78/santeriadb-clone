import { marked } from 'marked';
import matter from 'gray-matter';

// Configurazione del parser Markdown
marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: true,
  mangle: false
});

/**
 * Parser per file Markdown con frontmatter YAML
 */
export class MarkdownParser {
  /**
   * Parsa un file Markdown con frontmatter
   * @param {string} content - Contenuto del file Markdown
   * @returns {Object} Oggetto con metadati e contenuto HTML
   */
  static parse(content) {
    try {
      // Estrae frontmatter e contenuto
      const { data, content: markdownContent } = matter(content);
      
      // Converte Markdown in HTML
      const htmlContent = marked(markdownContent);
      
      return {
        metadata: data,
        content: htmlContent,
        rawContent: markdownContent,
        success: true
      };
    } catch (error) {
      console.error('Errore nel parsing Markdown:', error);
      return {
        metadata: {},
        content: '',
        rawContent: content,
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Estrae solo i metadati dal frontmatter
   * @param {string} content - Contenuto del file Markdown
   * @returns {Object} Metadati estratti
   */
  static extractMetadata(content) {
    try {
      const { data } = matter(content);
      return data;
    } catch (error) {
      console.error('Errore nell\'estrazione metadati:', error);
      return {};
    }
  }

  /**
   * Estrae solo il contenuto Markdown (senza frontmatter)
   * @param {string} content - Contenuto del file Markdown
   * @returns {string} Contenuto Markdown pulito
   */
  static extractContent(content) {
    try {
      const { content: markdownContent } = matter(content);
      return markdownContent;
    } catch (error) {
      console.error('Errore nell\'estrazione contenuto:', error);
      return content;
    }
  }

  /**
   * Converte Markdown in HTML
   * @param {string} markdown - Contenuto Markdown
   * @returns {string} HTML generato
   */
  static toHtml(markdown) {
    try {
      return marked(markdown);
    } catch (error) {
      console.error('Errore nella conversione HTML:', error);
      return markdown;
    }
  }

  /**
   * Estrae il testo puro dal Markdown (per la ricerca)
   * @param {string} markdown - Contenuto Markdown
   * @returns {string} Testo puro
   */
  static toPlainText(markdown) {
    try {
      // Rimuove i tag Markdown più comuni
      return markdown
        .replace(/#{1,6}\s+/g, '') // Headers
        .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
        .replace(/\*(.*?)\*/g, '$1') // Italic
        .replace(/`(.*?)`/g, '$1') // Inline code
        .replace(/```[\s\S]*?```/g, '') // Code blocks
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
        .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1') // Images
        .replace(/^\s*[-*+]\s+/gm, '') // List items
        .replace(/^\s*\d+\.\s+/gm, '') // Numbered lists
        .replace(/^\s*>\s+/gm, '') // Blockquotes
        .replace(/\n{2,}/g, '\n') // Multiple newlines
        .trim();
    } catch (error) {
      console.error('Errore nell\'estrazione testo:', error);
      return markdown;
    }
  }

  /**
   * Valida la struttura del frontmatter
   * @param {Object} metadata - Metadati da validare
   * @param {string} type - Tipo di contenuto (orisha, toque, canto, album)
   * @returns {Object} Risultato della validazione
   */
  static validateMetadata(metadata, type) {
    const requiredFields = {
      orisha: ['title', 'type', 'description'],
      toque: ['title', 'type', 'orisha', 'description'],
      canto: ['title', 'type', 'orisha', 'description'],
      album: ['title', 'type', 'artist', 'description'],
      home: ['title', 'type', 'description']
    };

    const required = requiredFields[type] || ['title', 'type'];
    const missing = required.filter(field => !metadata[field]);

    return {
      valid: missing.length === 0,
      missing,
      metadata
    };
  }

  /**
   * Genera un sommario automatico dal contenuto Markdown
   * @param {string} markdown - Contenuto Markdown
   * @returns {Array} Array di oggetti con i titoli
   */
  static generateToc(markdown) {
    const headings = [];
    const lines = markdown.split('\n');

    lines.forEach((line, index) => {
      const match = line.match(/^(#{1,6})\s+(.+)$/);
      if (match) {
        const level = match[1].length;
        const title = match[2].trim();
        const id = title.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-');

        headings.push({
          level,
          title,
          id,
          line: index + 1
        });
      }
    });

    return headings;
  }

  /**
   * Estrae i link interni dal contenuto Markdown
   * @param {string} markdown - Contenuto Markdown
   * @returns {Array} Array di link interni
   */
  static extractInternalLinks(markdown) {
    const links = [];
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;

    while ((match = linkRegex.exec(markdown)) !== null) {
      const [, text, url] = match;
      
      // Considera solo link interni (non iniziano con http)
      if (!url.startsWith('http') && !url.startsWith('mailto:')) {
        links.push({
          text: text.trim(),
          url: url.trim(),
          type: this.inferLinkType(url)
        });
      }
    }

    return links;
  }

  /**
   * Inferisce il tipo di link basandosi sull'URL
   * @param {string} url - URL del link
   * @returns {string} Tipo inferito
   */
  static inferLinkType(url) {
    if (url.includes('/orishas/')) return 'orisha';
    if (url.includes('/toques/')) return 'toque';
    if (url.includes('/cantos/')) return 'canto';
    if (url.includes('/albums/')) return 'album';
    if (url.includes('/transcriptions/')) return 'transcription';
    return 'unknown';
  }
}

export default MarkdownParser;

