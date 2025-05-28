import { useState, useEffect } from 'react';

function TaskList({ tarefas, onDelete }) {
    const [mostrarConcluidas, setMostrarConcluidas] = useState(false);
    const [alertas, setAlertas] = useState([]);

    useEffect(() => {
        const interval = setInterval(() => {
            const agora = new Date();
            tarefas.forEach((tarefa) => {
                const vencimento = new Date(tarefa.dataCriacao);
                vencimento.setSeconds(vencimento.getSeconds() + tarefa.segundos);

                /
                if (vencimento < agora && !alertas.includes(tarefa.id)) {
                    setAlertas((prev) => [...prev, tarefa.id]);
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [tarefas, alertas]);

   
    const tarefasFiltradas = tarefas.filter((t) => {
        const agora = new Date();
        if (!mostrarConcluidas) return true;
        const dataCriacao = new Date(t.dataCriacao || t.criadoEm || t.id?.substring(0, 8));
        dataCriacao.setSeconds(dataCriacao.getSeconds() + t.segundos);
        return agora > dataCriacao;
    });

    return (
        <div className="lista">
            <label>
                <input
                    type="checkbox"
                    checked={mostrarConcluidas}
                    onChange={() => setMostrarConcluidas(!mostrarConcluidas)}
                />
                Mostrar tarefas vencidas
            </label>

            <ul className="lista-tarefas">
                {tarefasFiltradas.map((tarefa) => {
                    const vencida =
                        new Date(tarefa.dataCriacao).getTime() +
                        tarefa.segundos * 1000 < new Date().getTime();

                    return (
                        <li key={tarefa.id} className="tarefa-card">
                            <div className="tarefa-info">
                                Nome: <strong>{tarefa.nome}</strong>
                                <p>SLA: <strong>{tarefa.segundos}s</strong></p>
                                {tarefa.fileName && (
                                    <p>Arquivo: <strong>{tarefa.fileName}</strong></p>
                                )}
                                {vencida && alertas.includes(tarefa.id) && (
                                    <span className="vencida">
                                        ⚠ SLA da tarefa "{tarefa.nome}" venceu!
                                    </span>
                                )}
                            </div>
                            <button className="delete-button" onClick={() => onDelete(tarefa.id)}>Excluir</button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default TaskList;
