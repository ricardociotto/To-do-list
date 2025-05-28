import { useState, useRef } from 'react';

function TaskForm({ onTaskCreated }) {
    const [Nome, setNome] = useState('');
    const [segundos, setSegundos] = useState('');
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!Nome || !segundos || !file) {
            alert("Preencha todos os campos.");
            return;
        }

        const segundosValue = parseInt(segundos, 10);

        const formData = new FormData();
        formData.append("Nome", Nome); 
        formData.append("Segundos", segundosValue);
        formData.append("File", file);

       
        

        try {
            const response = await fetch("https://localhost:7082/api/TaskList", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error("Erro ao enviar dados");
            }

            
            setNome('');
            setSegundos('');
            setFile(null);
            fileInputRef.current.value = null;
            onTaskCreated(); 
        } catch (error) {
            console.error("Erro no envio:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="task-form">
            <input
                type="text"
                placeholder="Nome"
                value={Nome}
                onChange={(e) => setNome(e.target.value)}
            />
            <input
                type="number"
                placeholder="SLA (segundos)"
                value={segundos}
                onChange={(e) => setSegundos(e.target.value)}
            />
            <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => setFile(e.target.files[0])}
            />
            {file && (
                <div className="file-info">
                    <strong>Arquivo selecionado: </strong>
                    {file.name}
                </div>
            )}
            <button type="submit">Salvar</button>
        </form>
    );
}

export default TaskForm;
