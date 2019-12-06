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
    [Route("api/XSubject")]
    public class XSubjectController : Controller
    {
        private readonly MyContext _context;
        IHostingEnvironment _appEnvironment;

        public XSubjectController(MyContext context, IHostingEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
        }

        // GET: api/XSubject
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetXSubject()
        {
            return Json (_context.XSubject, _context.serializerSettings());
        }

        [HttpGet("combo")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT XSubjectId id, ( [dbo].[XSubject_BRIEF_F](XSubjectId,null)  ) name
                         FROM            
                          XSubject 
                            order by name ";
            return _context.GetRaw(sql);
        }
        
        [HttpGet("view")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetView()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT * FROM V_XSubject ";
            return _context.GetRaw(sql);
        }
        
        // GET: api/XSubject/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetXSubject([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varXSubject = await _context.XSubject.SingleOrDefaultAsync(m => m.XSubjectId == id);

            if (varXSubject == null)
            {
                return NotFound();
            }

            return Ok(varXSubject);
        }

        // PUT: api/XSubject/5
        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> PutXSubject([FromRoute] Guid id, [FromBody] XSubject varXSubject)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != varXSubject.XSubjectId)
            {
                return BadRequest();
            }

            _context.Entry(varXSubject).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!XSubjectExists(id))
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

        // POST: api/XSubject
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> PostXSubject([FromBody] XSubject varXSubject)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.XSubject.Add(varXSubject);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetXSubject", new { id = varXSubject.XSubjectId }, varXSubject);
        }

        // DELETE: api/XSubject/5
        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteXSubject([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varXSubject = await _context.XSubject.SingleOrDefaultAsync(m => m.XSubjectId == id);
            if (varXSubject == null)
            {
                return NotFound();
            }

            _context.XSubject.Remove(varXSubject);
            await _context.SaveChangesAsync();

            return Ok(varXSubject);
        }

        private bool XSubjectExists(Guid id)
        {
            return _context.XSubject.Any(e => e.XSubjectId == id);
        }
    }
}
