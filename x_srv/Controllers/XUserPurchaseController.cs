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
    [Route("api/XUserPurchase")]
    public class XUserPurchaseController : Controller
    {
        private readonly MyContext _context;
        IHostingEnvironment _appEnvironment;

        public XUserPurchaseController(MyContext context, IHostingEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
        }

        // GET: api/XUserPurchase
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetXUserPurchase()
        {
            return Json (_context.XUserPurchase, _context.serializerSettings());
        }

        [HttpGet("combo")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT XUserPurchaseId id, ( [dbo].[XUserPurchase_BRIEF_F](XUserPurchaseId,null)  ) name
                         FROM            
                          XUserPurchase 
                            order by name ";
            return _context.GetRaw(sql);
        }
        
        [HttpGet("byparent/{id}")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetByBarent([FromRoute] Guid id)
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT * FROM V_XUserPurchase where XUserInfoID='" + id.ToString() + "'";
            return _context.GetRaw(sql);
        }
        
        // GET: api/XUserPurchase/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetXUserPurchase([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varXUserPurchase = await _context.XUserPurchase.SingleOrDefaultAsync(m => m.XUserPurchaseId == id);

            if (varXUserPurchase == null)
            {
                return NotFound();
            }

            return Ok(varXUserPurchase);
        }

        // PUT: api/XUserPurchase/5
        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> PutXUserPurchase([FromRoute] Guid id, [FromBody] XUserPurchase varXUserPurchase)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != varXUserPurchase.XUserPurchaseId)
            {
                return BadRequest();
            }

            _context.Entry(varXUserPurchase).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!XUserPurchaseExists(id))
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

        // POST: api/XUserPurchase
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> PostXUserPurchase([FromBody] XUserPurchase varXUserPurchase)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.XUserPurchase.Add(varXUserPurchase);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetXUserPurchase", new { id = varXUserPurchase.XUserPurchaseId }, varXUserPurchase);
        }

        // DELETE: api/XUserPurchase/5
        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteXUserPurchase([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varXUserPurchase = await _context.XUserPurchase.SingleOrDefaultAsync(m => m.XUserPurchaseId == id);
            if (varXUserPurchase == null)
            {
                return NotFound();
            }

            _context.XUserPurchase.Remove(varXUserPurchase);
            await _context.SaveChangesAsync();

            return Ok(varXUserPurchase);
        }

        private bool XUserPurchaseExists(Guid id)
        {
            return _context.XUserPurchase.Any(e => e.XUserPurchaseId == id);
        }
    }
}
