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
    [Route("api/XCourseDesc")]
    public class xCourseDescController : Controller
    {
        private readonly GoodRussianDbContext _context;
        IWebHostEnvironment _appEnvironment;
        public static IConfiguration _configuration { get; set; }

        private static string FilePath;

        public xCourseDescController(GoodRussianDbContext context, IWebHostEnvironment appEnvironment, IConfiguration configuration)
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

        // GET: api/XCourseDesc
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetxCourseDesc()
        {
            return Json (_context.XCourseDesc, _context.serializerSettings());
        }

        [HttpGet("combo")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT XCourseDescId id, ( [dbo].[xCourseDesc_BRIEF_F](XCourseDescId,null)  ) name
                         FROM            
                          XCourseDesc 
                            order by name ";
            return _context.GetRaw(sql);
        }
        
        [HttpGet("view")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetView()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT * FROM V_xCourseDesc ";
            return _context.GetRaw(sql);
        }
        
        // GET: api/XCourseDesc/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetxCourseDesc([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varxCourseDesc = await _context.XCourseDesc.SingleOrDefaultAsync(m => m.XCourseDescId == id);

            if (varxCourseDesc == null)
            {
                return NotFound();
            }

            return Ok(varxCourseDesc);
        }

        // PUT: api/XCourseDesc/5
        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> PutxCourseDesc([FromRoute] Guid id, [FromBody] XCourseDesc varxCourseDesc)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != varxCourseDesc.XCourseDescId)
            {
                return BadRequest();
            }

            _context.Entry(varxCourseDesc).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!xCourseDescExists(id))
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
            XCourseDesc xi = _context.XCourseDesc.FirstOrDefault(x => x.XCourseDescId == id);
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
                    if (xi.imageUrl != null && xi.imageUrl.Length > 20)  // guid-name
                    {
                        if (System.IO.File.Exists(FilePath + xi.imageUrl))
                        {
                            try
                            {
                                System.IO.File.Delete(FilePath + xi.imageUrl);
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

                    xi.imageUrl = "/" + _configuration["fileStoragePath"] + "/" + realFileName;
                    await _context.SaveChangesAsync();
                    return Ok(xi.imageUrl);
                }
            }
            return NoContent();
        }


        // POST: api/XCourseDesc
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> PostxCourseDesc([FromBody] XCourseDesc varxCourseDesc)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.XCourseDesc.Add(varxCourseDesc);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetxCourseDesc", new { id = varxCourseDesc.XCourseDescId }, varxCourseDesc);
        }

        // DELETE: api/XCourseDesc/5
        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeletexCourseDesc([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varxCourseDesc = await _context.XCourseDesc.SingleOrDefaultAsync(m => m.XCourseDescId == id);
            if (varxCourseDesc == null)
            {
                return NotFound();
            }

            _context.XCourseDesc.Remove(varxCourseDesc);
            await _context.SaveChangesAsync();

            return Ok(varxCourseDesc);
        }

        private bool xCourseDescExists(Guid id)
        {
            return _context.XCourseDesc.Any(e => e.XCourseDescId == id);
        }
    }
}
