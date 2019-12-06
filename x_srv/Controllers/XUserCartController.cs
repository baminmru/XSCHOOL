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
    [Route("api/XUserCart")]
    public class XUserCartController : Controller
    {
        private readonly MyContext _context;
        IHostingEnvironment _appEnvironment;

        public XUserCartController(MyContext context, IHostingEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
        }

        // GET: api/XUserCart
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetXUserCart()
        {
            return Json (_context.XUserCart, _context.serializerSettings());
        }

        [HttpGet("combo")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT XUserCartId id, ( [dbo].[XUserCart_BRIEF_F](XUserCartId,null)  ) name
                         FROM            
                          XUserCart 
                            order by name ";
            return _context.GetRaw(sql);
        }
        
        [HttpGet("byparent/{id}")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetByBarent([FromRoute] Guid id)
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT * FROM V_XUserCart where XUserInfoID='" + id.ToString() + "'";
            return _context.GetRaw(sql);
        }
        
        // GET: api/XUserCart/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetXUserCart([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varXUserCart = await _context.XUserCart.SingleOrDefaultAsync(m => m.XUserCartId == id);

            if (varXUserCart == null)
            {
                return NotFound();
            }

            return Ok(varXUserCart);
        }

        // PUT: api/XUserCart/5
        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> PutXUserCart([FromRoute] Guid id, [FromBody] XUserCart varXUserCart)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != varXUserCart.XUserCartId)
            {
                return BadRequest();
            }

            _context.Entry(varXUserCart).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!XUserCartExists(id))
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

        // POST: api/XUserCart
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> PostXUserCart([FromBody] XUserCart varXUserCart)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.XUserCart.Add(varXUserCart);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetXUserCart", new { id = varXUserCart.XUserCartId }, varXUserCart);
        }

        // DELETE: api/XUserCart/5
        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteXUserCart([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varXUserCart = await _context.XUserCart.SingleOrDefaultAsync(m => m.XUserCartId == id);
            if (varXUserCart == null)
            {
                return NotFound();
            }

            _context.XUserCart.Remove(varXUserCart);
            await _context.SaveChangesAsync();

            return Ok(varXUserCart);
        }

        private bool XUserCartExists(Guid id)
        {
            return _context.XUserCart.Any(e => e.XUserCartId == id);
        }
    }
}
