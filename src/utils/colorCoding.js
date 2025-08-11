/**
 * Sistema di color-coding per il database Santería
 * Ogni tipo di contenuto ha colori specifici per facilitare la navigazione
 */

export const ColorCoding = {
  // Colori principali per ogni tipo di contenuto
  colors: {
    orishas: {
      primary: '#8B4513',      // Marrone (Saddle Brown)
      secondary: '#A0522D',    // Marrone chiaro (Sienna)
      light: '#DEB887',        // Beige (Burlywood)
      dark: '#654321',         // Marrone scuro
      text: '#FFFFFF'          // Testo bianco per contrasto
    },
    toques: {
      primary: '#4169E1',      // Blu reale (Royal Blue)
      secondary: '#6495ED',    // Blu acciaio (Cornflower Blue)
      light: '#B0C4DE',        // Blu chiaro (Light Steel Blue)
      dark: '#191970',         // Blu scuro (Midnight Blue)
      text: '#FFFFFF'          // Testo bianco per contrasto
    },
    cantos: {
      primary: '#228B22',      // Verde foresta (Forest Green)
      secondary: '#32CD32',    // Verde lime (Lime Green)
      light: '#90EE90',        // Verde chiaro (Light Green)
      dark: '#006400',         // Verde scuro (Dark Green)
      text: '#FFFFFF'          // Testo bianco per contrasto
    },
    albums: {
      primary: '#DC143C',      // Rosso cremisi (Crimson)
      secondary: '#FF6347',    // Rosso pomodoro (Tomato)
      light: '#FFB6C1',        // Rosa chiaro (Light Pink)
      dark: '#8B0000',         // Rosso scuro (Dark Red)
      text: '#FFFFFF'          // Testo bianco per contrasto
    },
    transcriptions: {
      primary: '#9932CC',      // Viola scuro (Dark Orchid)
      secondary: '#BA55D3',    // Viola medio (Medium Orchid)
      light: '#DDA0DD',        // Viola chiaro (Plum)
      dark: '#4B0082',         // Indaco (Indigo)
      text: '#FFFFFF'          // Testo bianco per contrasto
    },
    home: {
      primary: '#2F4F4F',      // Grigio ardesia scuro (Dark Slate Gray)
      secondary: '#708090',    // Grigio ardesia (Slate Gray)
      light: '#D3D3D3',        // Grigio chiaro (Light Gray)
      dark: '#1C1C1C',         // Quasi nero
      text: '#FFFFFF'          // Testo bianco per contrasto
    }
  },

  /**
   * Ottiene il colore per un tipo di contenuto
   * @param {string} type - Tipo di contenuto
   * @param {string} shade - Tonalità (primary, secondary, light, dark, text)
   * @returns {string} Codice colore esadecimale
   */
  getColor(type, shade = 'primary') {
    const typeColors = this.colors[type];
    if (!typeColors) {
      console.warn(`Tipo di contenuto non riconosciuto: ${type}`);
      return this.colors.home[shade] || this.colors.home.primary;
    }
    return typeColors[shade] || typeColors.primary;
  },

  /**
   * Ottiene tutti i colori per un tipo
   * @param {string} type - Tipo di contenuto
   * @returns {Object} Oggetto con tutti i colori per il tipo
   */
  getColorPalette(type) {
    return this.colors[type] || this.colors.home;
  },

  /**
   * Genera classi CSS per un tipo di contenuto
   * @param {string} type - Tipo di contenuto
   * @returns {Object} Oggetto con classi CSS
   */
  getCssClasses(type) {
    const colors = this.getColorPalette(type);
    
    return {
      // Classi per background
      bgPrimary: `bg-[${colors.primary}]`,
      bgSecondary: `bg-[${colors.secondary}]`,
      bgLight: `bg-[${colors.light}]`,
      bgDark: `bg-[${colors.dark}]`,
      
      // Classi per testo
      textPrimary: `text-[${colors.primary}]`,
      textSecondary: `text-[${colors.secondary}]`,
      textLight: `text-[${colors.light}]`,
      textDark: `text-[${colors.dark}]`,
      textContrast: `text-[${colors.text}]`,
      
      // Classi per bordi
      borderPrimary: `border-[${colors.primary}]`,
      borderSecondary: `border-[${colors.secondary}]`,
      borderLight: `border-[${colors.light}]`,
      borderDark: `border-[${colors.dark}]`,
      
      // Classi per hover
      hoverBgPrimary: `hover:bg-[${colors.primary}]`,
      hoverBgSecondary: `hover:bg-[${colors.secondary}]`,
      hoverTextPrimary: `hover:text-[${colors.primary}]`,
      hoverTextSecondary: `hover:text-[${colors.secondary}]`
    };
  },

  /**
   * Genera stili inline per un tipo di contenuto
   * @param {string} type - Tipo di contenuto
   * @param {string} property - Proprietà CSS (backgroundColor, color, borderColor)
   * @param {string} shade - Tonalità del colore
   * @returns {Object} Oggetto con stili inline
   */
  getInlineStyles(type, property = 'backgroundColor', shade = 'primary') {
    const color = this.getColor(type, shade);
    return { [property]: color };
  },

  /**
   * Genera variabili CSS custom per un tipo
   * @param {string} type - Tipo di contenuto
   * @returns {Object} Oggetto con variabili CSS
   */
  getCssVariables(type) {
    const colors = this.getColorPalette(type);
    
    return {
      [`--${type}-primary`]: colors.primary,
      [`--${type}-secondary`]: colors.secondary,
      [`--${type}-light`]: colors.light,
      [`--${type}-dark`]: colors.dark,
      [`--${type}-text`]: colors.text
    };
  },

  /**
   * Verifica se un colore è scuro (per determinare il colore del testo)
   * @param {string} color - Colore in formato esadecimale
   * @returns {boolean} True se il colore è scuro
   */
  isDarkColor(color) {
    // Rimuove il # se presente
    const hex = color.replace('#', '');
    
    // Converte in RGB
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calcola la luminanza
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    return luminance < 0.5;
  },

  /**
   * Ottiene il colore del testo appropriato per un background
   * @param {string} backgroundColor - Colore di sfondo
   * @returns {string} Colore del testo (#FFFFFF o #000000)
   */
  getContrastTextColor(backgroundColor) {
    return this.isDarkColor(backgroundColor) ? '#FFFFFF' : '#000000';
  },

  /**
   * Genera un gradiente per un tipo di contenuto
   * @param {string} type - Tipo di contenuto
   * @param {string} direction - Direzione del gradiente (to-r, to-b, etc.)
   * @returns {string} Classe CSS per il gradiente
   */
  getGradientClass(type, direction = 'to-r') {
    const colors = this.getColorPalette(type);
    return `bg-gradient-${direction} from-[${colors.primary}] to-[${colors.secondary}]`;
  },

  /**
   * Ottiene un colore con opacità
   * @param {string} type - Tipo di contenuto
   * @param {string} shade - Tonalità del colore
   * @param {number} opacity - Opacità (0-1)
   * @returns {string} Colore con opacità in formato rgba
   */
  getColorWithOpacity(type, shade = 'primary', opacity = 0.5) {
    const color = this.getColor(type, shade);
    
    // Converte hex in RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  },

  /**
   * Genera tema completo per un tipo di contenuto
   * @param {string} type - Tipo di contenuto
   * @returns {Object} Tema completo con tutti gli stili
   */
  generateTheme(type) {
    const colors = this.getColorPalette(type);
    const cssClasses = this.getCssClasses(type);
    const cssVariables = this.getCssVariables(type);
    
    return {
      type,
      colors,
      cssClasses,
      cssVariables,
      gradients: {
        horizontal: this.getGradientClass(type, 'to-r'),
        vertical: this.getGradientClass(type, 'to-b'),
        diagonal: this.getGradientClass(type, 'to-br')
      },
      opacity: {
        light: this.getColorWithOpacity(type, 'primary', 0.1),
        medium: this.getColorWithOpacity(type, 'primary', 0.3),
        heavy: this.getColorWithOpacity(type, 'primary', 0.7)
      }
    };
  },

  /**
   * Ottiene tutti i temi disponibili
   * @returns {Object} Oggetto con tutti i temi
   */
  getAllThemes() {
    const themes = {};
    Object.keys(this.colors).forEach(type => {
      themes[type] = this.generateTheme(type);
    });
    return themes;
  }
};

export default ColorCoding;

