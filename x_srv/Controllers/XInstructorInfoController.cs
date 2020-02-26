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
    [Route("api/XInstructorInfo")]
    public class XInstructorInfoController : Controller
    {
        private readonly GoodRussianDbContext _context;
        IWebHostEnvironment _appEnvironment;
        public static IConfiguration _configuration { get; set; }

        private static string FilePath;

        public XInstructorInfoController(GoodRussianDbContext context, IWebHostEnvironment appEnvironment ,IConfiguration configuration)
        {
            _context = context;
            _appEnvironment = appEnvironment;
            _configuration = configuration;
            FilePath = _appEnvironment.WebRootPath + "/" + _configuration["fileStoragePath"] +"/";

            if (!Directory.Exists(FilePath ))
            {
                Directory.CreateDirectory(FilePath );
            }
        }

        // GET: api/XInstructorInfo
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetXInstructorInfo()
        {
            return Json (_context.XInstructorInfo, _context.serializerSettings());
        }

        [HttpGet("combo")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT XInstructorInfoId id, ( [dbo].[XInstructorInfo_BRIEF_F](XInstructorInfoId,null)  ) name
                         FROM            
                          XInstructorInfo 
                            order by name ";
            return _context.GetRaw(sql);
        }
        
        [HttpGet("view")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetView()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT * FROM V_XInstructorInfo ";
            return _context.GetRaw(sql);
        }
        
        // GET: api/XInstructorInfo/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetXInstructorInfo([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varXInstructorInfo = await _context.XInstructorInfo.SingleOrDefaultAsync(m => m.XInstructorInfoId == id);

            if (varXInstructorInfo == null)
            {
                return NotFound();
            }

            return Ok(varXInstructorInfo);
        }

        // PUT: api/XInstructorInfo/5
        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> PutXInstructorInfo([FromRoute] Guid id, [FromBody] XInstructorInfo varXInstructorInfo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != varXInstructorInfo.XInstructorInfoId)
            {
                return BadRequest();
            }

            _context.Entry(varXInstructorInfo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!XInstructorInfoExists(id))
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

        // POST: api/XInstructorInfo
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
            XInstructorInfo xi = _context.XInstructorInfo.FirstOrDefault(x => x.XInstructorInfoId == id);
            if (xi != null)
            {
                if (Request.Form.Files.Count > 0) {
                    IFormFile file = Request.Form.Files[0];

                    if (file == null || file.Length == 0)
                    {
                        return NoContent();
                    }


                    // try to delete old file
                    if (xi.photoUrl != null &&  xi.photoUrl.Length > 20)  // guid-name
                    {
                        if (System.IO.File.Exists(FilePath + xi.photoUrl))
                        {
                            try
                            {
                                System.IO.File.Delete(FilePath + xi.photoUrl);
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

                    xi.photoUrl = "/" + _configuration["fileStoragePath"] + "/" + realFileName;
                    await _context.SaveChangesAsync();
                    return Ok(xi.photoUrl);
                }
            }
            return NoContent();
        }

        // POST: api/XInstructorInfo
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> PostXInstructorInfo([FromBody] XInstructorInfo varXInstructorInfo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.XInstructorInfo.Add(varXInstructorInfo);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetXInstructorInfo", new { id = varXInstructorInfo.XInstructorInfoId }, varXInstructorInfo);
        }

        // DELETE: api/XInstructorInfo/5
        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteXInstructorInfo([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varXInstructorInfo = await _context.XInstructorInfo.SingleOrDefaultAsync(m => m.XInstructorInfoId == id);
            if (varXInstructorInfo == null)
            {
                return NotFound();
            }

            _context.XInstructorInfo.Remove(varXInstructorInfo);
            await _context.SaveChangesAsync();

            return Ok(varXInstructorInfo);
        }

        private bool XInstructorInfoExists(Guid id)
        {
            return _context.XInstructorInfo.Any(e => e.XInstructorInfoId == id);
        }
    }
}
