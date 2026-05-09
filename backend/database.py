# ============================================
#  StatsVaultX — database.py
#  Gestão da base de dados SQLite
# ============================================

import sqlite3
import os

# Caminho para a base de dados
DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'tracker.db')

# ── Criar tabelas se não existirem ────────
def iniciar_db():
    conn = sqlite3.connect(DB_PATH)

    conn.execute('''
        CREATE TABLE IF NOT EXISTS jogadores (
            id       INTEGER PRIMARY KEY AUTOINCREMENT,
            nome     TEXT NOT NULL,
            tag      TEXT NOT NULL,
            nivel    INTEGER,
            rank     TEXT,
            kd       REAL,
            winrate  REAL,
            partidas INTEGER,
            data     TEXT DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(nome, tag)
        )
    ''')

    conn.execute('''
        CREATE TABLE IF NOT EXISTS agentes (
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            jogador   TEXT NOT NULL,
            nome      TEXT NOT NULL,
            partidas  INTEGER,
            kd        REAL,
            winrate   REAL
        )
    ''')

    conn.execute('''
        CREATE TABLE IF NOT EXISTS historico (
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            jogador   TEXT NOT NULL,
            resultado TEXT,
            agente    TEXT,
            mapa      TEXT,
            kd        REAL,
            data      TEXT
        )
    ''')

    conn.commit()
    conn.close()

# ── Guardar jogador na base de dados ──────
def guardar_jogador(dados):
    conn = sqlite3.connect(DB_PATH)

    # Inserir ou atualizar jogador
    conn.execute('''
        INSERT INTO jogadores (nome, tag, nivel, rank, kd, winrate, partidas)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(nome, tag) DO UPDATE SET
            nivel=excluded.nivel,
            rank=excluded.rank,
            kd=excluded.kd,
            winrate=excluded.winrate,
            partidas=excluded.partidas,
            data=CURRENT_TIMESTAMP
    ''', (
        dados['nome'], dados['tag'], dados['nivel'],
        dados['rank'], dados['kd'], dados['winrate'], dados['partidas']
    ))

    conn.commit()
    conn.close()

# ── Obter jogador da base de dados ────────
def obter_jogador(nome, tag):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row

    jogador = conn.execute(
        'SELECT * FROM jogadores WHERE nome=? AND tag=?', (nome, tag)
    ).fetchone()

    conn.close()
    return dict(jogador) if jogador else None

# ── Listar jogadores pesquisados ──────────
def listar_jogadores():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row

    jogadores = conn.execute(
        'SELECT * FROM jogadores ORDER BY data DESC'
    ).fetchall()

    conn.close()
    return [dict(j) for j in jogadores]

# Inicia a base de dados ao importar
iniciar_db()