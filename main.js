// ============================================
//  StatsVaultX — main.js
//  Configuração do Electron
//  Transforma a Web App numa app desktop
// ============================================

const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let janela;
let servidorPython;

// ── Criar a janela principal ──────────────
function criarJanela() {
  janela = new BrowserWindow({
    width:          1100,
    height:         700,
    minWidth:       800,
    minHeight:      550,
    title:          'StatsVaultX',
    backgroundColor: '#0a0c10',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Abre o ecrã inicial
  janela.loadFile(path.join(__dirname, 'interface', 'index.html'));

  // Remove a barra de menu
  janela.setMenuBarVisibility(false);

  // Abre links externos no browser do sistema
  janela.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// ── Iniciar servidor Python ───────────────
function iniciarPython() {
  servidorPython = spawn('python', [
    path.join(__dirname, 'backend', 'api.py')
  ]);

  servidorPython.stdout.on('data', (data) => {
    console.log(`Python: ${data}`);
  });

  servidorPython.stderr.on('data', (data) => {
    console.error(`Python erro: ${data}`);
  });
}

// ── Quando o Electron está pronto ─────────
app.whenReady().then(() => {
  iniciarPython();

  // Pequena espera para o Python iniciar
  setTimeout(criarJanela, 1500);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) criarJanela();
  });
});

// ── Fechar a app ──────────────────────────
app.on('window-all-closed', () => {
  // Mata o servidor Python ao fechar
  if (servidorPython) servidorPython.kill();
  if (process.platform !== 'darwin') app.quit();
});