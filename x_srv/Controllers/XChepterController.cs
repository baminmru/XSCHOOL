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
    [Route("api/XChepter")]
    public class XChepterController : Controller
    {
        private readonly MyContext _context;
        IHostingEnvironment _appEnvironment;

        public XChepterController(MyContext context, IHostingEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
        }

        // GET: api/XChepter
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetXChepter()
        {
            return Json (_context.XChepter, _context.serializerSettings());
        }

        [HttpGet("combo")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT XChepterId id, ( [dbo].[XChepter_BRIEF_F](XChepterId,null)  ) name
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

            string sql = @"SELECT * FROM V_XChepter where XCourseModuleID='" + id.ToString() + "'";
            return _context.GetRaw(sql);
        }
        
        // GET: api/XChepter/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetXChepter([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varXChepter = await _context.XChepter.SingleOrDefaultAsync(m => m.XChepterId == id);

            if (varXChepter == null)
            {
                return NotFound();
            }

            return Ok(varXChepter);
        }

        // PUT: api/XChepter/5
        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> PutXChepter([FromRoute] Guid id, [FromBody] XChepter varXChepter)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != varXChepter.XChepterId)
            {
                return BadRequest();
            }

            _context.Entry(varXChepter).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!XChepterExists(id))
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
        public async Task<IActionResult> PostXChepter([FromBody] XChepter varXChepter)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.XChepter.Add(varXChepter);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetXChepter", new { id = varXChepter.XChepterId }, varXChepter);
        }

        // DELETE: api/XChepter/5
        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteXChepter([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varXChepter = await _context.XChepter.SingleOrDefaultAsync(m => m.XChepterId == id);
            if (varXChepter == null)
            {
                return NotFound();
            }

            _context.XChepter.Remove(varXChepter);
            await _context.SaveChangesAsync();

            return Ok(varXChepter);
        }

        private bool XChepterExists(Guid id)
        {
            return _context.XChepter.Any(e => e.XChepterId == id);
        }
    }
}
