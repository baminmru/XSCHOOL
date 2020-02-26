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
    [Produces("application/json")]
    [Route("api/XLevel")]
    public class XLevelController : Controller
    {
        private readonly GoodRussianDbContext _context;
        IWebHostEnvironment _appEnvironment;

        public XLevelController(GoodRussianDbContext context, IWebHostEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
        }

        // GET: api/XLevel
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetXLevel()
        {
            return Json (_context.XLevel, _context.serializerSettings());
        }

        [HttpGet("combo")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT XLevelId id, ( [dbo].[XLevel_BRIEF_F](XLevelId,null)  ) name
                         FROM            
                          XLevel 
                            order by name ";
            return _context.GetRaw(sql);
        }
        
        [HttpGet("view")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetView()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT * FROM V_XLevel ";
            return _context.GetRaw(sql);
        }
        
        // GET: api/XLevel/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetXLevel([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varXLevel = await _context.XLevel.SingleOrDefaultAsync(m => m.XLevelId == id);

            if (varXLevel == null)
            {
                return NotFound();
            }

            return Ok(varXLevel);
        }

        // PUT: api/XLevel/5
        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> PutXLevel([FromRoute] Guid id, [FromBody] XLevel varXLevel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != varXLevel.XLevelId)
            {
                return BadRequest();
            }

            _context.Entry(varXLevel).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!XLevelExists(id))
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

        // POST: api/XLevel
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> PostXLevel([FromBody] XLevel varXLevel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.XLevel.Add(varXLevel);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetXLevel", new { id = varXLevel.XLevelId }, varXLevel);
        }

        // DELETE: api/XLevel/5
        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteXLevel([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varXLevel = await _context.XLevel.SingleOrDefaultAsync(m => m.XLevelId == id);
            if (varXLevel == null)
            {
                return NotFound();
            }

            _context.XLevel.Remove(varXLevel);
            await _context.SaveChangesAsync();

            return Ok(varXLevel);
        }

        private bool XLevelExists(Guid id)
        {
            return _context.XLevel.Any(e => e.XLevelId == id);
        }
    }
}
