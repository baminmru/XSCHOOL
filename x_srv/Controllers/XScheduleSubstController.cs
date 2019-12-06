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
    [Route("api/XScheduleSubst")]
    public class XScheduleSubstController : Controller
    {
        private readonly MyContext _context;
        IHostingEnvironment _appEnvironment;

        public XScheduleSubstController(MyContext context, IHostingEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
        }

        // GET: api/XScheduleSubst
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetXScheduleSubst()
        {
            return Json (_context.XScheduleSubst, _context.serializerSettings());
        }

        [HttpGet("combo")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT XScheduleSubstId id, ( [dbo].[XScheduleSubst_BRIEF_F](XScheduleSubstId,null)  ) name
                         FROM            
                          XScheduleSubst 
                            order by name ";
            return _context.GetRaw(sql);
        }
        
        [HttpGet("byparent/{id}")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetByBarent([FromRoute] Guid id)
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT * FROM V_XScheduleSubst where XScheduleItemID='" + id.ToString() + "'";
            return _context.GetRaw(sql);
        }
        
        // GET: api/XScheduleSubst/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetXScheduleSubst([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varXScheduleSubst = await _context.XScheduleSubst.SingleOrDefaultAsync(m => m.XScheduleSubstId == id);

            if (varXScheduleSubst == null)
            {
                return NotFound();
            }

            return Ok(varXScheduleSubst);
        }

        // PUT: api/XScheduleSubst/5
        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> PutXScheduleSubst([FromRoute] Guid id, [FromBody] XScheduleSubst varXScheduleSubst)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != varXScheduleSubst.XScheduleSubstId)
            {
                return BadRequest();
            }

            _context.Entry(varXScheduleSubst).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!XScheduleSubstExists(id))
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

        // POST: api/XScheduleSubst
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> PostXScheduleSubst([FromBody] XScheduleSubst varXScheduleSubst)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.XScheduleSubst.Add(varXScheduleSubst);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetXScheduleSubst", new { id = varXScheduleSubst.XScheduleSubstId }, varXScheduleSubst);
        }

        // DELETE: api/XScheduleSubst/5
        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteXScheduleSubst([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varXScheduleSubst = await _context.XScheduleSubst.SingleOrDefaultAsync(m => m.XScheduleSubstId == id);
            if (varXScheduleSubst == null)
            {
                return NotFound();
            }

            _context.XScheduleSubst.Remove(varXScheduleSubst);
            await _context.SaveChangesAsync();

            return Ok(varXScheduleSubst);
        }

        private bool XScheduleSubstExists(Guid id)
        {
            return _context.XScheduleSubst.Any(e => e.XScheduleSubstId == id);
        }
    }
}
