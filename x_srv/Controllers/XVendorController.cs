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
    [Route("api/XVendor")]
    public class XVendorController : Controller
    {
        private readonly MyContext _context;
        IHostingEnvironment _appEnvironment;

        public XVendorController(MyContext context, IHostingEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
        }

        // GET: api/XVendor
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetXVendor()
        {
            return Json (_context.XVendor, _context.serializerSettings());
        }

        [HttpGet("combo")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT XVendorId id, ( [dbo].[XVendor_BRIEF_F](XVendorId,null)  ) name
                         FROM            
                          XVendor 
                            order by name ";
            return _context.GetRaw(sql);
        }
        
        [HttpGet("view")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetView()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT * FROM V_XVendor ";
            return _context.GetRaw(sql);
        }
        
        // GET: api/XVendor/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetXVendor([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varXVendor = await _context.XVendor.SingleOrDefaultAsync(m => m.XVendorId == id);

            if (varXVendor == null)
            {
                return NotFound();
            }

            return Ok(varXVendor);
        }

        // PUT: api/XVendor/5
        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> PutXVendor([FromRoute] Guid id, [FromBody] XVendor varXVendor)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != varXVendor.XVendorId)
            {
                return BadRequest();
            }

            _context.Entry(varXVendor).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!XVendorExists(id))
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

        // POST: api/XVendor
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> PostXVendor([FromBody] XVendor varXVendor)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.XVendor.Add(varXVendor);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetXVendor", new { id = varXVendor.XVendorId }, varXVendor);
        }

        // DELETE: api/XVendor/5
        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteXVendor([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varXVendor = await _context.XVendor.SingleOrDefaultAsync(m => m.XVendorId == id);
            if (varXVendor == null)
            {
                return NotFound();
            }

            _context.XVendor.Remove(varXVendor);
            await _context.SaveChangesAsync();

            return Ok(varXVendor);
        }

        private bool XVendorExists(Guid id)
        {
            return _context.XVendor.Any(e => e.XVendorId == id);
        }
    }
}
