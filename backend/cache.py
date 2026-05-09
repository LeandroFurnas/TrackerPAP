# ============================================
#  StatsVaultX — cache.py
#  Sistema de cache offline em JSON
# ============================================

import json
import os

CACHE_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'cache.json')

# ── Guardar dados em cache ────────────────
def guardar_cache(username, dados):
    cache = carregar_todos()
    cache[username] = dados

    with open(CACHE_PATH, 'w', encoding='utf-8') as f:
        json.dump(cache, f, ensure_ascii=False, indent=2)

# ── Obter dados do cache ──────────────────
def obter_cache(username):
    cache = carregar_todos()
    return cache.get(username, None)

# ── Carregar todo o cache ─────────────────
def carregar_todos():
    if not os.path.exists(CACHE_PATH):
        return {}
    with open(CACHE_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)

# ── Limpar cache de um jogador ────────────
def limpar_cache(username):
    cache = carregar_todos()
    if username in cache:
        del cache[username]
        with open(CACHE_PATH, 'w', encoding='utf-8') as f:
            json.dump(cache, f, ensure_ascii=False, indent=2)