// ============================================
//  StatsVaultX — stats.cpp
//  Processamento e cálculo de estatísticas
//  Recebe dados em JSON, calcula e devolve
// ============================================

#include <iostream>
#include <string>
#include <vector>
#include <numeric>
#include <iomanip>
#include <sstream>

// ── Estrutura de uma partida ──────────────
struct Partida {
    int kills;
    int deaths;
    int assists;
    bool vitoria;
};

// ── Calcular K/D Ratio ────────────────────
double calcularKD(const std::vector<Partida>& partidas) {
    if (partidas.empty()) return 0.0;

    int totalKills  = 0;
    int totalDeaths = 0;

    for (const auto& p : partidas) {
        totalKills  += p.kills;
        totalDeaths += p.deaths;
    }

    if (totalDeaths == 0) return static_cast<double>(totalKills);
    return static_cast<double>(totalKills) / totalDeaths;
}

// ── Calcular Taxa de Vitórias ─────────────
double calcularWinrate(const std::vector<Partida>& partidas) {
    if (partidas.empty()) return 0.0;

    int vitorias = 0;
    for (const auto& p : partidas) {
        if (p.vitoria) vitorias++;
    }

    return (static_cast<double>(vitorias) / partidas.size()) * 100.0;
}

// ── Formatar número para 2 casas decimais ─
std::string formatarDouble(double valor) {
    std::ostringstream oss;
    oss << std::fixed << std::setprecision(2) << valor;
    return oss.str();
}

// ── Programa principal ────────────────────
int main() {
    // Exemplo de dados (mais tarde recebidos via JSON do Python)
    std::vector<Partida> partidas = {
        {20, 10, 5, true},
        {15, 12, 8, false},
        {25, 8,  3, true},
        {18, 14, 6, true},
        {10, 15, 4, false}
    };

    double kd      = calcularKD(partidas);
    double winrate = calcularWinrate(partidas);

    // Devolver resultado em JSON para o Python ler
    std::cout << "{"
              << "\"kd\":"      << formatarDouble(kd)      << ","
              << "\"winrate\":" << formatarDouble(winrate)  << ","
              << "\"partidas\":" << partidas.size()
              << "}" << std::endl;

    return 0;
}