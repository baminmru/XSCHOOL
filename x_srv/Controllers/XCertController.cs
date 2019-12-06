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
    [Route("api/XCert")]
    public class XCertController : Controller
    {
        private readonly MyContext _context;
        IHostingEnvironment _appEnvironment;

        public XCertController(MyContext context, IHostingEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
        }

        // GET: api/XCert
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetXCert()
        {
            return Json (_context.XCert, _context.serializerSettings());
        }

        [HttpGet("combo")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT XCertId id, ( [dbo].[XCert_BRIEF_F](XCertId,null)  ) name
                         FROM            
                          XCert 
                            order by name ";
            return _context.GetRaw(sql);
        }
        
        [HttpGet("view")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetView()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT * FROM V_XCert ";
            return _context.GetRaw(sql);
        }
        
        // GET: api/XCert/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetXCert([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varXCert = await _context.XCert.SingleOrDefaultAsync(m => m.XCertId == id);

            if (varXCert == null)
            {
                return NotFound();
            }

            return Ok(varXCert);
        }

        // PUT: api/XCert/5
        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> PutXCert([FromRoute] Guid id, [FromBody] XCert varXCert)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != varXCert.XCertId)
            {
                return BadRequest();
            }

            _context.Entry(varXCert).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!XCertExists(id))
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

        // POST: api/XCert
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> PostXCert([FromBody] XCert varXCert)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.XCert.Add(varXCert);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetXCert", new { id = varXCert.XCertId }, varXCert);
        }

        // DELETE: api/XCert/5
        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteXCert([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varXCert = await _context.XCert.SingleOrDefaultAsync(m => m.XCertId == id);
            if (varXCert == null)
            {
                return NotFound();
            }

            _context.XCert.Remove(varXCert);
            await _context.SaveChangesAsync();

            return Ok(varXCert);
        }

        private bool XCertExists(Guid id)
        {
            return _context.XCert.Any(e => e.XCertId == id);
        }
    }
}
