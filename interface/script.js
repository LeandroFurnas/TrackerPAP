// ============================================
//  StatsVaultX — script.js
//  Lógica principal da interface
// ============================================

// ── Mudar de tab de jogo ──────────────────
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// ── Pesquisar jogador ─────────────────────
async function pesquisar() {
  const input    = document.getElementById('searchInput').value.trim();
  const loading  = document.getElementById('loading');
  const errorMsg = document.getElementById('errorMsg');

  // Limpa erros anteriores
  errorMsg.style.display = 'none';

  // Valida input
  if (!input) {
    mostrarErro('Introduz um username para pesquisar.');
    return;
  }

  // Mostra loading
  loading.classList.add('visible');

  try {
    // Pede os dados ao backend Python
    const resposta = await fetch(`http://localhost:5000/jogador/${encodeURIComponent(input)}`);

    if (!resposta.ok) {
      throw new Error('Jogador não encontrado');
    }

    const dados = await resposta.json();

    // Guarda em cache local para uso offline
    localStorage.setItem('ultimo_jogador', JSON.stringify(dados));

    // Redireciona para o dashboard
    window.location.href = `dashboard.html?user=${encodeURIComponent(input)}`;

  } catch (erro) {
    // Tenta carregar cache offline
    const cache = localStorage.getItem('ultimo_jogador');
    if (cache) {
      window.location.href = `dashboard.html?offline=true`;
    } else {
      mostrarErro('Jogador não encontrado ou sem ligação à internet.');
    }
  } finally {
    loading.classList.remove('visible');
  }
}

// ── Mostrar mensagem de erro ──────────────
function mostrarErro(mensagem) {
  const errorMsg = document.getElementById('errorMsg');
  errorMsg.textContent = mensagem;
  errorMsg.style.display = 'block';
}

// ── Pesquisar com Enter ───────────────────
document.getElementById('searchInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') pesquisar();
});