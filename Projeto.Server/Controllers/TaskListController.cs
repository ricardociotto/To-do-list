using Microsoft.AspNetCore.Mvc;
using ProjetoTechInterview.Server.Class;
using ProjetoTechInterview.Server.Models;

namespace ProjetoTechInterview.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TaskListController : ControllerBase
    {
        private static readonly List<TaskList> _tarefas = new();
        private readonly IWebHostEnvironment _env;

        public TaskListController(IWebHostEnvironment env)
        {
            _env = env;
        }

        
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_tarefas);
        }

        
        [HttpGet("{id}")]
        public IActionResult GetById(Guid id)
        {
            var tarefa = _tarefas.FirstOrDefault(t => t.Id == id);
            if (tarefa == null) return NotFound();
            return Ok(tarefa);
        }

        
        [HttpPost]
        public async Task<IActionResult> Create([FromForm] TaskListUploadDto dto)
        {
            
            if (string.IsNullOrWhiteSpace(dto.Nome))
                return BadRequest("Nome � obrigat�rio."); 
            if (dto.Segundos <= 0)
                return BadRequest("Segundos devem ser um valor positivo.");
            if (dto.File == null || dto.File.Length == 0)
                return BadRequest("Arquivo � obrigat�rio.");

            try
            {
                
                var uploadsFolder = Path.Combine(_env.ContentRootPath, "Uploads");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

               
                var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.File.FileName);
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.File.CopyToAsync(stream);
                }

                
                var task = new TaskList
                {
                    Nome = dto.Nome, 
                    Segundos = dto.Segundos,
                    FileName = uniqueFileName,
                    FilePath = filePath,
                    DataCriacao = DateTime.UtcNow
                };

               
                _tarefas.Add(task);
                return Ok(task); 
            }
            catch (Exception ex)
            {
                
                return StatusCode(500, $"Erro ao salvar a tarefa: {ex.Message}");
            }
        }

       
        [HttpPut("{id}")]
        public IActionResult Update(Guid id, [FromBody] TaskList updatedTask)
        {
            var existing = _tarefas.FirstOrDefault(t => t.Id == id);
            if (existing == null) return NotFound();

            existing.Nome = updatedTask.Nome; 
            existing.Segundos = updatedTask.Segundos;
            existing.Concluida = updatedTask.Concluida;

            return Ok(existing);
        }

        
        [HttpDelete("{id}")]
        public IActionResult Delete(Guid id)
        {
            var task = _tarefas.FirstOrDefault(t => t.Id == id);
            if (task == null) return NotFound();

            if (System.IO.File.Exists(task.FilePath))
                System.IO.File.Delete(task.FilePath);

            _tarefas.Remove(task);
            return NoContent();
        }

        
        [HttpGet("{id}/download")]
        public IActionResult Download(Guid id)
        {
            var task = _tarefas.FirstOrDefault(t => t.Id == id);
            if (task == null || !System.IO.File.Exists(task.FilePath))
                return NotFound();

            var contentType = "application/octet-stream";
            return PhysicalFile(task.FilePath, contentType, task.FileName);
        }
    }
}
