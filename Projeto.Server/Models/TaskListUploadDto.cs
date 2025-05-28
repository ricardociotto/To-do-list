namespace ProjetoTechInterview.Server.Class
{
    public class TaskListUploadDto
    {
        public string Nome { get; set; } 
        public int Segundos { get; set; }
        public IFormFile File { get; set; }
    }
}
