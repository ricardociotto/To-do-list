import { useEffect, useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

function App() {
    const [tarefas, setTarefas] = useState([]);

    const carregarTarefas = async () => {
        try {
            const response = await fetch("https://localhost:7082/api/TaskList");
            const data = await response.json();
            setTarefas(data);
        } catch (error) {
            console.error("Erro ao carregar tarefas:", error);
        }
    };

    const deletarTarefa = async (id) => {
        try {
            const response = await fetch(`https://localhost:7082/api/TaskList/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                carregarTarefas(); 
            } else {
                console.error("Erro ao deletar");
            }
        } catch (error) {
            console.error("Erro ao deletar tarefa:", error);
        }
    };

    useEffect(() => {
        carregarTarefas(); 
    }, []);

    return (
        <div className="app-container">
            <h1>Gerenciador de Tarefas</h1>
            <TaskForm onTaskCreated={carregarTarefas} />
            <TaskList tarefas={tarefas} onDelete={deletarTarefa} />
        </div>
    );
}

export default App;
