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

namespace x_srv.Controllers
{
    [Authorize]
    [ApiController]
    [Produces("application/json")]
    [Route("api/XInstructorInfo")]
    public class XInstructorInfoController : Controller
    {
        private readonly MyContext _context;
        IHostingEnvironment _appEnvironment;

        public XInstructorInfoController(MyContext context, IHostingEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
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
