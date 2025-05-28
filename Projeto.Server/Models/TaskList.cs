namespace ProjetoTechInterview.Server.Models
{
    public class TaskList
    {
        public Guid Id { get; set; } = Guid.NewGuid(); 
        public string Nome { get; set; } 
        public int Segundos { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
        public bool Concluida { get; set; } = false;
        public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
    }
}
