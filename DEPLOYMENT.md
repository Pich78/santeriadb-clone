# Guida al Deployment su GitHub Pages

Questa guida spiega come deployare il clone del Santería Music Database su GitHub Pages.

## 📋 Prerequisiti

- Account GitHub
- Repository GitHub (pubblico o privato con GitHub Pro)
- Git installato localmente

## 🚀 Deployment Automatico

Il progetto è configurato per il deployment automatico tramite GitHub Actions.

### 1. Creazione del Repository

```bash
# Crea un nuovo repository su GitHub chiamato 'santeriadb-clone'
# Poi collega il repository locale:

git remote add origin https://github.com/tuousername/santeriadb-clone.git
git branch -M main
git push -u origin main
```

### 2. Configurazione GitHub Pages

1. Vai nelle **Settings** del repository
2. Scorri fino alla sezione **Pages**
3. In **Source**, seleziona **GitHub Actions**
4. Il workflow si attiverà automaticamente al prossimo push

### 3. Workflow Automatico

Il file `.github/workflows/deploy.yml` gestisce automaticamente:

- ✅ Installazione delle dipendenze
- ✅ Copia dei file di contenuto
- ✅ Build del progetto
- ✅ Deploy su GitHub Pages

### 4. URL del Sito

Dopo il deployment, il sito sarà disponibile all'indirizzo:
```
https://tuousername.github.io/santeriadb-clone/
```

## 🔧 Deployment Manuale

Se preferisci un deployment manuale:

### 1. Build Locale

```bash
# Installa le dipendenze
pnpm install

# Copia i contenuti
mkdir -p public/content
cp -r content/* public/content/

# Build per produzione
pnpm run build
```

### 2. Deploy Manuale

```bash
# Installa gh-pages (se non già installato)
pnpm add -D gh-pages

# Aggiungi script al package.json:
# "deploy": "gh-pages -d dist"

# Deploy
pnpm run deploy
```

## ⚙️ Configurazione

### Vite Configuration

Il file `vite.config.js` è configurato per GitHub Pages:

```javascript
export default defineConfig({
  base: '/santeriadb-clone/', // Nome del repository
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
```

### GitHub Actions Workflow

Il workflow include:

- **Node.js 20** con cache npm
- **pnpm** per la gestione delle dipendenze
- **Copia automatica** dei file di contenuto
- **Build ottimizzato** per produzione
- **Deploy automatico** su GitHub Pages

## 📁 Struttura dei File

```
santeriadb-clone/
├── .github/workflows/
│   └── deploy.yml          # Workflow GitHub Actions
├── content/                # Contenuti Markdown
├── src/                    # Codice sorgente React
├── public/                 # File statici
├── dist/                   # Build di produzione (generato)
├── vite.config.js          # Configurazione Vite
└── package.json            # Dipendenze e script
```

## 🔍 Troubleshooting

### Problema: 404 su GitHub Pages

**Soluzione**: Verifica che:
- Il `base` in `vite.config.js` corrisponda al nome del repository
- Il workflow abbia completato con successo
- GitHub Pages sia configurato su "GitHub Actions"

### Problema: Contenuti non caricati

**Soluzione**: Assicurati che:
- I file di contenuto siano nella cartella `public/content/`
- Il workflow copi correttamente i file con `cp -r content/* public/content/`

### Problema: Build fallisce

**Soluzione**: Controlla:
- Che tutte le dipendenze siano installate
- Che non ci siano errori di sintassi nel codice
- I log del workflow GitHub Actions per dettagli

## 📊 Monitoraggio

### GitHub Actions

- Vai nella tab **Actions** del repository
- Monitora lo stato dei deployment
- Visualizza i log in caso di errori

### Performance

Il sito è ottimizzato per:
- ⚡ Caricamento veloce (build Vite ottimizzato)
- 📱 Responsive design
- 🔍 SEO-friendly
- ♿ Accessibilità

## 🔄 Aggiornamenti

Per aggiornare il sito:

1. Modifica i contenuti o il codice
2. Commit e push su `main`
3. Il deployment si attiva automaticamente
4. Il sito si aggiorna in 2-3 minuti

```bash
git add .
git commit -m "Aggiorna contenuti"
git push origin main
```

## 🌐 Domini Personalizzati

Per usare un dominio personalizzato:

1. Crea un file `public/CNAME` con il tuo dominio:
   ```
   tuodominio.com
   ```

2. Configura i DNS del dominio:
   ```
   CNAME www tuousername.github.io
   A @ 185.199.108.153
   A @ 185.199.109.153
   A @ 185.199.110.153
   A @ 185.199.111.153
   ```

3. Aggiorna `vite.config.js`:
   ```javascript
   base: '/', // Rimuovi il base path per domini personalizzati
   ```

## 📈 Analytics

Per aggiungere Google Analytics:

1. Crea un file `public/gtag.js`
2. Aggiungi il tag nel `index.html`
3. Configura il tracking ID

## 🔒 Sicurezza

- ✅ HTTPS automatico su GitHub Pages
- ✅ Contenuti statici (nessun server-side)
- ✅ Nessun dato sensibile nel repository
- ✅ Dipendenze aggiornate regolarmente

## 📞 Supporto

Per problemi di deployment:

1. Controlla i log di GitHub Actions
2. Verifica la configurazione di GitHub Pages
3. Consulta la [documentazione GitHub Pages](https://docs.github.com/en/pages)
4. Apri un issue nel repository

---

**Nota**: Il primo deployment può richiedere alcuni minuti. I deployment successivi sono più veloci grazie alla cache.

