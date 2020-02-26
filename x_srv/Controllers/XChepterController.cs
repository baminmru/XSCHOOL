using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Authorization;
using x_srv.models;
using System.IO;
using Microsoft.Extensions.Configuration;

namespace x_srv.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/XChepter")]
    public class xChepterController : Controller
    {
        private readonly GoodRussianDbContext _context;
        IWebHostEnvironment _appEnvironment;
        public static IConfiguration _configuration { get; set; }

        private static string FilePath;

        public xChepterController(GoodRussianDbContext context, IWebHostEnvironment appEnvironment, IConfiguration configuration)
        {
            _context = context;
            _appEnvironment = appEnvironment;
            _configuration = configuration;
            FilePath = _appEnvironment.WebRootPath + "/" + _configuration["fileStoragePath"] + "/";

            if (!Directory.Exists(FilePath))
            {
                Directory.CreateDirectory(FilePath);
            }

        }

        // GET: api/XChepter
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetxChepter()
        {
            return Json (_context.XChepter, _context.serializerSettings());
        }

        [HttpGet("combo")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT XChepterId id, ( [dbo].[xChepter_BRIEF_F](XChepterId,null)  ) name
                         FROM            
                          XChepter 
                            order by name ";
            return _context.GetRaw(sql);
        }
        
        [HttpGet("byparent/{id}")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetByBarent([FromRoute] Guid id)
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT * FROM V_xChepter where XCourseModuleID='" + id.ToString() + "'";
            return _context.GetRaw(sql);
        }
        
        // GET: api/XChepter/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetxChepter([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varxChepter = await _context.XChepter.SingleOrDefaultAsync(m => m.XChepterId == id);

            if (varxChepter == null)
            {
                return NotFound();
            }

            return Ok(varxChepter);
        }

        // PUT: api/XChepter/5
        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> PutxChepter([FromRoute] Guid id, [FromBody] XChepter varxChepter)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != varxChepter.XChepterId)
            {
                return BadRequest();
            }

            _context.Entry(varxChepter).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!xChepterExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/XChepter
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> PostxChepter([FromBody] XChepter varxChepter)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.XChepter.Add(varxChepter);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetxChepter", new { id = varxChepter.XChepterId }, varxChepter);
        }


        [HttpPost("upload")]
        [AllowAnonymous]
        // [RequestSizeLimit(1024 * 1024 * 1024)]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> Upload()
        {
            Guid id;

            try
            {
                id = new Guid(Request.Form["rowid"]);
            }
            catch
            {
                return NoContent();
            }
            XChepter xi = _context.XChepter.FirstOrDefault(x => x.XChepterId == id);
            if (xi != null)
            {
                if (Request.Form.Files.Count > 0)
                {
                    IFormFile file = Request.Form.Files[0];

                    if (file == null || file.Length == 0)
                    {
                        return NoContent();
                    }


                    // try to delete old file
                    if (xi.refFile != null && xi.refFile.Length > 20)  // guid-name
                    {
                        if (System.IO.File.Exists(FilePath + xi.refFile))
                        {
                            try
                            {
                                System.IO.File.Delete(FilePath + xi.refFile);
                            }
                            catch
                            {
                            }
                        }
                    }

                    // handle file here
                    var stream = file.OpenReadStream();
                    FileInfo fi;
                    string realFileName;
                    fi = new FileInfo(file.FileName);
                    Guid rowid = Guid.NewGuid(); 
                    realFileName = rowid.ToString().Replace("{", "").Replace("}", "").Replace("-", "") + fi.Extension;
                    string targetFilePath = FilePath + realFileName;

                    using (var targetStream = System.IO.File.Create(targetFilePath))
                    {
                        await stream.CopyToAsync(targetStream);
                        stream.Close();
                        targetStream.Close();
                    }

                    xi.refFile = "/" + _configuration["fileStoragePath"] + "/" + realFileName;
                    await _context.SaveChangesAsync();
                    return Ok(xi.refFile);
                }
            }
            return NotFound(); 
        }

        // DELETE: api/XChepter/5
        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeletexChepter([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varxChepter = await _context.XChepter.SingleOrDefaultAsync(m => m.XChepterId == id);
            if (varxChepter == null)
            {
                return NotFound();
            }

            _context.XChepter.Remove(varxChepter);
            await _context.SaveChangesAsync();

            return Ok(varxChepter);
        }

        private bool xChepterExists(Guid id)
        {
            return _context.XChepter.Any(e => e.XChepterId == id);
        }
    }
}
