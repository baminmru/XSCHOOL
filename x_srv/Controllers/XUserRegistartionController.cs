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
    [Route("api/XUserRegistartion")]
    public class XUserRegistartionController : Controller
    {
        private readonly MyContext _context;
        IHostingEnvironment _appEnvironment;

        public XUserRegistartionController(MyContext context, IHostingEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
        }

        // GET: api/XUserRegistartion
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetXUserRegistartion()
        {
            return Json (_context.XUserRegistartion, _context.serializerSettings());
        }

        [HttpGet("combo")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT XUserRegistartionId id, ( [dbo].[XUserRegistartion_BRIEF_F](XUserRegistartionId,null)  ) name
                         FROM            
                          XUserRegistartion 
                            order by name ";
            return _context.GetRaw(sql);
        }
        
        [HttpGet("byparent/{id}")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetByBarent([FromRoute] Guid id)
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT * FROM V_XUserRegistartion where XUserInfoID='" + id.ToString() + "'";
            return _context.GetRaw(sql);
        }
        
        // GET: api/XUserRegistartion/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetXUserRegistartion([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varXUserRegistartion = await _context.XUserRegistartion.SingleOrDefaultAsync(m => m.XUserRegistartionId == id);

            if (varXUserRegistartion == null)
            {
                return NotFound();
            }

            return Ok(varXUserRegistartion);
        }

        // PUT: api/XUserRegistartion/5
        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> PutXUserRegistartion([FromRoute] Guid id, [FromBody] XUserRegistartion varXUserRegistartion)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != varXUserRegistartion.XUserRegistartionId)
            {
                return BadRequest();
            }

            _context.Entry(varXUserRegistartion).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!XUserRegistartionExists(id))
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

        // POST: api/XUserRegistartion
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> PostXUserRegistartion([FromBody] XUserRegistartion varXUserRegistartion)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.XUserRegistartion.Add(varXUserRegistartion);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetXUserRegistartion", new { id = varXUserRegistartion.XUserRegistartionId }, varXUserRegistartion);
        }

        // DELETE: api/XUserRegistartion/5
        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteXUserRegistartion([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varXUserRegistartion = await _context.XUserRegistartion.SingleOrDefaultAsync(m => m.XUserRegistartionId == id);
            if (varXUserRegistartion == null)
            {
                return NotFound();
            }

            _context.XUserRegistartion.Remove(varXUserRegistartion);
            await _context.SaveChangesAsync();

            return Ok(varXUserRegistartion);
        }

        private bool XUserRegistartionExists(Guid id)
        {
            return _context.XUserRegistartion.Any(e => e.XUserRegistartionId == id);
        }
    }
}
