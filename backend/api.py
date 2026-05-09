# ============================================
#  StatsVaultX — api.py
#  Comunicação com a API do Valorant
#  Usa Flask para criar um servidor local
# ============================================

from flask import Flask, jsonify
from database import guardar_jogador, obter_jogador
import requests

app = Flask(__name__)

# URL base da API do Valorant (Henrik API - gratuita)
API_BASE = "https://api.henrikdev.xyz/valorant/v1"

# ── Rota principal — buscar jogador ──────
@app.route('/jogador/<username>', methods=['GET'])
def get_jogador(username):
    try:
        # Separar nome e tag (ex: "Leandro#PT1")
        if '#' in username:
            nome, tag = username.split('#', 1)
        else:
            return jsonify({'erro': 'Formato inválido. Usa Username#Tag'}), 400

        # Buscar dados do jogador
        url = f"{API_BASE}/account/{nome}/{tag}"
        resposta = requests.get(url)

        if resposta.status_code != 200:
            return jsonify({'erro': 'Jogador não encontrado'}), 404

        dados_api = resposta.json()['data']

        # Buscar rank do jogador
        rank_url = f"{API_BASE}/mmr/eu/{nome}/{tag}"
        rank_resposta = requests.get(rank_url)
        rank_dados = rank_resposta.json().get('data', {})

        # Organizar os dados
        jogador = {
            'nome':     dados_api.get('name'),
            'tag':      dados_api.get('tag'),
            'nivel':    dados_api.get('account_level'),
            'rank':     rank_dados.get('currenttierpatched', 'Não classificado'),
            'kd':       0,       # Calculado pelo C++
            'winrate':  0,       # Calculado pelo C++
            'partidas': 0,
            'agentes':  [],
            'historico': []
        }

        # Guardar na base de dados (cache)
        guardar_jogador(jogador)

        return jsonify(jogador)

    except Exception as e:
        return jsonify({'erro': str(e)}), 500


# ── Iniciar servidor ──────────────────────
if __name__ == '__main__':
    app.run(port=5000, debug=True)