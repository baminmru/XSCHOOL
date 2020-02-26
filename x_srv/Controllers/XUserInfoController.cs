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
    [Route("api/XUserInfo")]
    public class XUserInfoController : Controller
    {
        private readonly GoodRussianDbContext _context;
        IWebHostEnvironment _appEnvironment;
        public static IConfiguration _configuration { get; set; }

        private static string FilePath;
        public XUserInfoController(GoodRussianDbContext context, IWebHostEnvironment appEnvironment, IConfiguration configuration)
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

        // GET: api/XUserInfo
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetXUserInfo()
        {
            return Json (_context.XUserInfo, _context.serializerSettings());
        }

        [HttpGet("combo")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT XUserInfoId id, ( [dbo].[XUserInfo_BRIEF_F](XUserInfoId,null)  ) name
                         FROM            
                          XUserInfo 
                            order by name ";
            return _context.GetRaw(sql);
        }
        
        [HttpGet("view")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetView()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT * FROM V_XUserInfo ";
            return _context.GetRaw(sql);
        }
        
        // GET: api/XUserInfo/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetXUserInfo([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varXUserInfo = await _context.XUserInfo.SingleOrDefaultAsync(m => m.XUserInfoId == id);

            if (varXUserInfo == null)
            {
                return NotFound();
            }

            return Ok(varXUserInfo);
        }

        // PUT: api/XUserInfo/5
        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> PutXUserInfo([FromRoute] Guid id, [FromBody] XUserInfo varXUserInfo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != varXUserInfo.XUserInfoId)
            {
                return BadRequest();
            }

            _context.Entry(varXUserInfo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!XUserInfoExists(id))
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

        // POST: api/XUserInfo
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> PostXUserInfo([FromBody] XUserInfo varXUserInfo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.XUserInfo.Add(varXUserInfo);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetXUserInfo", new { id = varXUserInfo.XUserInfoId }, varXUserInfo);
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
            XUserInfo xi = _context.XUserInfo.FirstOrDefault(x => x.XUserInfoId == id);
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
                    if (xi.photoUrl != null  && xi.photoUrl.Length > 20)  // guid-name
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

        // DELETE: api/XUserInfo/5
        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteXUserInfo([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varXUserInfo = await _context.XUserInfo.SingleOrDefaultAsync(m => m.XUserInfoId == id);
            if (varXUserInfo == null)
            {
                return NotFound();
            }

            _context.XUserInfo.Remove(varXUserInfo);
            await _context.SaveChangesAsync();

            return Ok(varXUserInfo);
        }

        private bool XUserInfoExists(Guid id)
        {
            return _context.XUserInfo.Any(e => e.XUserInfoId == id);
        }
    }
}
