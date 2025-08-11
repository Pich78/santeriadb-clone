# Santería Music Database Clone

Un clone moderno e modulare del database di musica Santería, costruito con React e architettura basata su Markdown.

## 🎵 Caratteristiche

- **Architettura modulare**: Separazione completa tra contenuti (Markdown) e logica di rendering
- **Ricerca progressiva**: Sistema di ricerca in tempo reale con suggerimenti automatici
- **Color-coding**: Sistema di colori per distinguere i diversi tipi di contenuto
- **Responsive design**: Ottimizzato per desktop, tablet e mobile
- **Cross-referencing**: Collegamenti automatici tra contenuti correlati
- **GitHub Pages**: Deployment automatico su GitHub Pages

## 🏗️ Architettura

### Struttura del Progetto

```
santeriadb-clone/
├── content/                    # Contenuti in formato Markdown
│   ├── orishas/               # File Markdown per ogni Orisha
│   ├── toques/                # File Markdown per ogni Toque
│   ├── cantos/                # File Markdown per ogni Canto
│   ├── albums/                # File Markdown per ogni Album
│   └── transcriptions/        # File Markdown per trascrizioni
├── src/
│   ├── components/            # Componenti React riutilizzabili
│   ├── pages/                 # Pagine principali
│   ├── utils/                 # Utilità e helper
│   └── data/                  # Indici e metadati generati
└── public/                    # File statici
```

### Componenti Principali

- **Navigation**: Barra di navigazione con color-coding
- **SearchBox**: Ricerca progressiva con filtri
- **ContentRenderer**: Rendering dei contenuti Markdown
- **ColorCoding**: Sistema di colori per tipi di contenuto

### Utilità

- **MarkdownParser**: Parser per file Markdown con frontmatter
- **SearchEngine**: Motore di ricerca con Fuse.js
- **ColorCoding**: Gestione dei colori per tipo di contenuto

## 🎨 Sistema di Color-Coding

Ogni tipo di contenuto ha colori specifici per facilitare la navigazione:

- **Orishas**: Marrone (#8B4513)
- **Toques**: Blu reale (#4169E1)
- **Cantos**: Verde foresta (#228B22)
- **Albums**: Rosso cremisi (#DC143C)
- **Trascrizioni**: Viola scuro (#9932CC)

## 🚀 Installazione e Sviluppo

### Prerequisiti

- Node.js 20+
- pnpm (raccomandato) o npm

### Installazione

```bash
# Clona il repository
git clone https://github.com/tuousername/santeriadb-clone.git
cd santeriadb-clone

# Installa le dipendenze
pnpm install

# Avvia il server di sviluppo
pnpm run dev
```

### Comandi Disponibili

```bash
# Sviluppo
pnpm run dev          # Avvia il server di sviluppo
pnpm run build        # Build per produzione
pnpm run preview      # Anteprima del build
pnpm run lint         # Linting del codice
```

## 📝 Gestione dei Contenuti

### Formato Markdown

Ogni file Markdown deve avere un frontmatter YAML con metadati:

```yaml
---
title: "Nome del contenuto"
type: "orisha|toque|canto|album|transcription"
description: "Breve descrizione"
# Altri metadati specifici per tipo
---

# Contenuto in Markdown

Il contenuto principale va qui...
```

### Tipi di Contenuto

#### Orishas
```yaml
---
title: "Elegguá"
type: "orisha"
category: "warrior"
colors: ["red", "black"]
related_toques: ["latokpa", "olumbanshe"]
related_cantos: ["ago_eleggua", "eleggua_go_ana"]
description: "Orisha delle strade e dei crocicchi"
---
```

#### Toques
```yaml
---
title: "Latokpa"
type: "toque"
orisha: "eleggua"
tempo: "medium"
difficulty: "intermediate"
related_cantos: ["ago_eleggua", "eleggua_go_ana"]
description: "Toque principale per Elegguá"
---
```

#### Cantos
```yaml
---
title: "Ago Elegguá"
type: "canto"
orisha: "eleggua"
toque: "latokpa"
lyrics_yoruba: "Ago Elegguá, ago ibara"
translation: "Permission Elegguá, permission guardian"
description: "Canto di richiesta di permesso"
---
```

## 🔍 Sistema di Ricerca

Il sistema di ricerca utilizza Fuse.js per fornire:

- **Ricerca fuzzy**: Tolleranza per errori di battitura
- **Ricerca in tempo reale**: Risultati mentre si digita
- **Filtri**: Per tipo di contenuto
- **Suggerimenti**: Completamento automatico
- **Highlighting**: Evidenziazione dei termini trovati

## 🌐 Deployment

### GitHub Pages

Il progetto è configurato per il deployment automatico su GitHub Pages:

1. Push su branch `main`
2. GitHub Actions esegue il build
3. Deploy automatico su GitHub Pages

### Deployment Manuale

```bash
# Build del progetto
pnpm run build

# Il contenuto della cartella dist/ può essere deployato su qualsiasi hosting statico
```

## 🤝 Contribuire

### Aggiungere Contenuti

1. Crea un nuovo file Markdown nella cartella appropriata
2. Segui il formato del frontmatter
3. Aggiungi il contenuto in Markdown
4. Testa localmente
5. Crea una pull request

### Sviluppo

1. Fork del repository
2. Crea un branch per la feature
3. Sviluppa e testa
4. Crea una pull request

## 📚 Tecnologie Utilizzate

### Frontend
- **React 18**: Framework principale
- **React Router**: Routing client-side
- **Tailwind CSS**: Styling utility-first
- **Lucide Icons**: Iconografia
- **shadcn/ui**: Componenti UI

### Parsing e Ricerca
- **Marked**: Parser Markdown
- **Gray-matter**: Parser frontmatter YAML
- **Fuse.js**: Ricerca fuzzy

### Build e Deploy
- **Vite**: Build tool
- **GitHub Actions**: CI/CD
- **GitHub Pages**: Hosting

## 📄 Licenza

Questo progetto è creato con rispetto per la tradizione afro-cubana e per scopi educativi. 

## 🙏 Riconoscimenti

- Sito originale: [Santería Music Database](https://furius.ca/santeriadb/)
- Tradizione yoruba e cultura afro-cubana
- Comunità della Santería

## 📞 Supporto

Per domande, suggerimenti o segnalazioni:

- Apri un issue su GitHub
- Contatta i maintainer del progetto

---

*"La musica è il linguaggio universale che connette il cuore umano con il divino. In ogni toque, in ogni canto, vive l'eco degli antenati e la speranza del futuro."*

