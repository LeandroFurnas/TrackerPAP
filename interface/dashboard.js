// ============================================
//  StatsVaultX — dashboard.js
//  Carrega e apresenta os dados do jogador
// ============================================

// ── Obter parâmetros do URL ───────────────
const params   = new URLSearchParams(window.location.search);
const username = params.get('user');
const offline  = params.get('offline');

// ── Iniciar dashboard ─────────────────────
window.addEventListener('DOMContentLoaded', () => {
  if (offline) {
    carregarOffline();
  } else {
    carregarDados(username);
  }
});

// ── Carregar dados da API (via Python) ────
async function carregarDados(user) {
  try {
    const resposta = await fetch(`http://localhost:5000/jogador/${encodeURIComponent(user)}`);
    const dados = await resposta.json();
    preencherDashboard(dados);
  } catch (erro) {
    carregarOffline();
  }
}

// ── Carregar dados offline (cache local) ──
function carregarOffline() {
  document.getElementById('offlineBadge').style.display = 'inline';
  const cache = localStorage.getItem('ultimo_jogador');
  if (cache) {
    preencherDashboard(JSON.parse(cache));
  }
}

// ── Preencher o dashboard com os dados ────
function preencherDashboard(dados) {
  // Perfil
  document.getElementById('nomeJogador').textContent = dados.nome      || '—';
  document.getElementById('tagJogador').textContent  = '#' + (dados.tag || '0000');
  document.getElementById('rankJogador').textContent = dados.rank      || '—';
  document.getElementById('avatar').textContent      = dados.nome?.[0] || '?';

  // Estatísticas
  document.getElementById('kd').textContent       = dados.kd        || '—';
  document.getElementById('winrate').textContent  = dados.winrate   ? dados.winrate + '%' : '—';
  document.getElementById('partidas').textContent = dados.partidas  || '—';
  document.getElementById('nivel').textContent    = dados.nivel     || '—';

  // Agentes
  preencherAgentes(dados.agentes || []);

  // Histórico
  preencherHistorico(dados.historico || []);
}

// ── Preencher lista de agentes ────────────
function preencherAgentes(agentes) {
  const lista = document.getElementById('agentesLista');
  lista.innerHTML = '';

  if (agentes.length === 0) {
    lista.innerHTML = '<p class="sem-dados">Sem dados de agentes.</p>';
    return;
  }

  agentes.forEach(agente => {
    const item = document.createElement('div');
    item.className = 'agente-item';
    item.innerHTML = `
      <div class="agente-nome">${agente.nome}</div>
      <div class="agente-stats">
        <span>Partidas: <b>${agente.partidas}</b></span>
        <span>K/D: <b>${agente.kd}</b></span>
        <span>Win: <b>${agente.winrate}%</b></span>
      </div>
    `;
    lista.appendChild(item);
  });
}

// ── Preencher histórico de partidas ───────
function preencherHistorico(historico) {
  const lista = document.getElementById('historicoLista');
  lista.innerHTML = '';

  if (historico.length === 0) {
    lista.innerHTML = '<p class="sem-dados">Sem histórico disponível.</p>';
    return;
  }

  historico.forEach(partida => {
    const item = document.createElement('div');
    item.className = `partida-item ${partida.resultado === 'Vitória' ? 'vitoria' : 'derrota'}`;
    item.innerHTML = `
      <div class="partida-resultado">${partida.resultado}</div>
      <div class="partida-info">
        <span>${partida.agente}</span>
        <span>${partida.mapa}</span>
        <span>K/D: ${partida.kd}</span>
        <span>${partida.data}</span>
      </div>
    `;
    lista.appendChild(item);
  });
}