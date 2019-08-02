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
    [Route("api/XCoursePrice")]
    public class XCoursePriceController : Controller
    {
        private readonly MyContext _context;
        IHostingEnvironment _appEnvironment;

        public XCoursePriceController(MyContext context, IHostingEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
        }

        // GET: api/XCoursePrice
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetXCoursePrice()
        {
            return Json (_context.XCoursePrice, _context.serializerSettings());
        }

        [HttpGet("combo")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT XCoursePriceId id, ( [dbo].[XCoursePrice_BRIEF_F](XCoursePriceId,null)  ) name
                         FROM            
                          XCoursePrice 
                            order by name ";
            return _context.GetRaw(sql);
        }
        
        [HttpGet("byparent/{id}")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetByBarent([FromRoute] Guid id)
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT * FROM V_XCoursePrice where XCourseDescID='" + id.ToString() + "'";
            return _context.GetRaw(sql);
        }
        
        // GET: api/XCoursePrice/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetXCoursePrice([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varXCoursePrice = await _context.XCoursePrice.SingleOrDefaultAsync(m => m.XCoursePriceId == id);

            if (varXCoursePrice == null)
            {
                return NotFound();
            }

            return Ok(varXCoursePrice);
        }

        // PUT: api/XCoursePrice/5
        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> PutXCoursePrice([FromRoute] Guid id, [FromBody] XCoursePrice varXCoursePrice)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != varXCoursePrice.XCoursePriceId)
            {
                return BadRequest();
            }

            _context.Entry(varXCoursePrice).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!XCoursePriceExists(id))
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

        // POST: api/XCoursePrice
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> PostXCoursePrice([FromBody] XCoursePrice varXCoursePrice)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.XCoursePrice.Add(varXCoursePrice);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetXCoursePrice", new { id = varXCoursePrice.XCoursePriceId }, varXCoursePrice);
        }

        // DELETE: api/XCoursePrice/5
        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteXCoursePrice([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varXCoursePrice = await _context.XCoursePrice.SingleOrDefaultAsync(m => m.XCoursePriceId == id);
            if (varXCoursePrice == null)
            {
                return NotFound();
            }

            _context.XCoursePrice.Remove(varXCoursePrice);
            await _context.SaveChangesAsync();

            return Ok(varXCoursePrice);
        }

        private bool XCoursePriceExists(Guid id)
        {
            return _context.XCoursePrice.Any(e => e.XCoursePriceId == id);
        }
    }
}
