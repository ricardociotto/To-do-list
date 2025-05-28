namespace ProjetoTechInterview.Class
{
    public class Taskmanager
    {
        public class TaskItem
        {
            public Guid Id { get; set; }
            public string Title { get; set; }
            public int SLAHours { get; set; } // SLA in hours
            public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
            public string FilePath { get; set; }
            public bool IsCompleted { get; set; } = false;
        }
    }
}
