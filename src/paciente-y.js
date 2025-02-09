import React, { useEffect, useState, useCallback } from "react";
import { TrendingUp, TrendingDown, ArrowRight, X } from "lucide-react";

const EvolucaoPacienteY = React.memo(() => {
  const [dashboardData, setDashboardData] = useState({ graficos: {}, analise: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGraph, setSelectedGraph] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://hackahealth-back.onrender.com/dashboard-y");
        if (!response.ok) throw new Error("Erro ao buscar dados de evolução");
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getTrendIcon = useCallback((tendencia) => {
    if (tendencia.includes("MELHORANDO")) return <TrendingUp className="w-5 h-5 text-green-500" />;
    if (tendencia.includes("PIORANDO")) return <TrendingDown className="w-5 h-5 text-red-500" />;
    return <ArrowRight className="w-5 h-5 text-yellow-500" />;
  }, []);

  if (loading) {
    return (
      <div className="p-6 bg-slate-50">
        <h1 className="text-2xl font-bold text-blue-800">Gerando dashboards...</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-blue-200 rounded w-1/2 mb-4"></div>
          <div className="h-64 bg-blue-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-slate-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Erro:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-50">
      <h1 className="text-2xl font-bold mb-6 text-blue-900">Evolução do Paciente Y</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(dashboardData.graficos || {}).map(([exame, base64Image]) => (
          <div
            key={exame}
            className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow duration-200"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-blue-800">
                Evolução do {exame}
              </h3>
              {dashboardData.analise[exame] && (
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${dashboardData.analise[exame].status_atual === "Normal"
                      ? "bg-green-100 text-green-800"
                      : dashboardData.analise[exame].status_atual === "Abaixo"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                    {dashboardData.analise[exame].status_atual}
                  </span>
                  {getTrendIcon(dashboardData.analise[exame].tendencia)}
                </div>
              )}
            </div>

            <div className="cursor-pointer" onClick={() => setSelectedGraph({ exame, base64Image })}>
              <img
                src={`data:image/png;base64,${base64Image}`}
                alt={`Gráfico de ${exame}`}
                className="rounded-lg w-full"
              />
            </div>

            {dashboardData.analise[exame] && (
              <div className="mt-4 text-sm text-gray-600">
                <p>Valor atual: {dashboardData.analise[exame].valor_atual}</p>
                <p>Referência: {dashboardData.analise[exame].referencia.join(" - ")}</p>
                <p className="font-medium">
                  Tendência: {dashboardData.analise[exame].tendencia}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedGraph && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={() => setSelectedGraph(null)}
        >
          <div
            className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedGraph(null)}
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold mb-4 text-blue-900">
              Evolução do {selectedGraph.exame}
            </h2>
            <img
              src={`data:image/png;base64,${selectedGraph.base64Image}`}
              alt={`Gráfico de ${selectedGraph.exame}`}
              className="rounded-lg w-full"
            />
            {dashboardData.analise[selectedGraph.exame] && (
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-medium">Valor Atual</p>
                  <p>{dashboardData.analise[selectedGraph.exame].valor_atual}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-medium">Faixa de Referência</p>
                  <p>{dashboardData.analise[selectedGraph.exame].referencia.join(" - ")}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="font-medium">Tendência</p>
                  <p>{dashboardData.analise[selectedGraph.exame].tendencia}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

export default EvolucaoPacienteY;