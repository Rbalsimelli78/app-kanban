
import { useState } from 'react';

const prioridades = ['Urgente', 'Alta', 'Média', 'Baixa'];
const recorrencias = ['Única', 'Diária', 'Semanal', 'Mensal'];

export default function App() {
  const [tarefas, setTarefas] = useState([]);
  const [filtroEmpresa, setFiltroEmpresa] = useState('');
  const [colunas, setColunas] = useState(['A Fazer', 'Em Progresso', 'Concluído']);

  const novaTarefaPadrao = {
    titulo: '',
    empresa: '',
    inicio: '',
    fim: '',
    followup: '',
    responsavel: '',
    prioridade: 'Média',
    recorrencia: 'Única',
    status: 'A Fazer',
    duracao: 0
  };

  const [novaTarefa, setNovaTarefa] = useState(novaTarefaPadrao);

  const calcularDuracao = (inicio, fim) => {
    const dtInicio = new Date(inicio);
    const dtFim = fim ? new Date(fim) : new Date();
    return Math.ceil((dtFim - dtInicio) / (1000 * 60 * 60 * 24));
  };

  const adicionarTarefa = () => {
    const duracao = novaTarefa.inicio ? calcularDuracao(novaTarefa.inicio, novaTarefa.fim) : 0;
    const nova = { ...novaTarefa, id: Date.now(), duracao };
    setTarefas([...tarefas, nova]);
    setNovaTarefa(novaTarefaPadrao);
  };

  const moverTarefa = (id, novoStatus) => {
    setTarefas(tarefas.map(t => t.id === id ? { ...t, status: novoStatus } : t));
  };

  const marcarComoConcluida = (id) => {
    moverTarefa(id, 'Concluído');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Painel de Tarefas</h1>

      <div className="mb-4 flex gap-2">
        <input
          className="border p-2"
          placeholder="Pesquisar por empresa"
          value={filtroEmpresa}
          onChange={(e) => setFiltroEmpresa(e.target.value)}
        />
        <button className="bg-blue-500 text-white p-2 rounded" onClick={adicionarTarefa}>Adicionar Tarefa</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {colunas.map(coluna => (
          <div key={coluna} className="bg-gray-100 p-2 rounded">
            <h2 className="text-xl font-semibold mb-2">{coluna}</h2>
            {tarefas
              .filter(t => t.status === coluna && t.empresa.toLowerCase().includes(filtroEmpresa.toLowerCase()))
              .map(t => (
              <div key={t.id} className="bg-white p-2 mb-2 rounded shadow">
                <div className="flex justify-between items-center">
                  <h3 className={`font-bold ${t.prioridade === 'Alta' || t.prioridade === 'Urgente' ? 'text-red-600' : ''}`}>
                    {t.prioridade === 'Alta' || t.prioridade === 'Urgente' ? '⚠️ ' : ''}{t.titulo}
                  </h3>
                  {t.status !== 'Concluído' && (
                    <button onClick={() => marcarComoConcluida(t.id)} className="text-sm text-green-600">Concluir</button>
                  )}
                </div>
                <p><strong>Empresa:</strong> {t.empresa}</p>
                <p><strong>Responsável:</strong> {t.responsavel}</p>
                <p><strong>Início:</strong> {t.inicio} <strong>Fim:</strong> {t.fim}</p>
                <p><strong>Follow-up:</strong> {t.followup}</p>
                <p><strong>Recorrência:</strong> {t.recorrencia}</p>
                <p><strong>Duração:</strong> {t.duracao} dia(s)</p>
                <p><strong>Status Atual:</strong> {t.status}</p>
                <div className="mt-2 flex gap-1 flex-wrap">
                  {colunas.filter(c => c !== t.status).map(c => (
                    <button key={c} onClick={() => moverTarefa(t.id, c)} className="text-xs bg-gray-200 px-2 py-1 rounded">{c}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
