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
    [Route("api/XScheduleItem")]
    public class XScheduleItemController : Controller
    {
        private readonly GoodRussianDbContext _context;
        IWebHostEnvironment _appEnvironment;

        public XScheduleItemController(GoodRussianDbContext context, IWebHostEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
        }

        // GET: api/XScheduleItem
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetXScheduleItem()
        {
            return Json (_context.XScheduleItem, _context.serializerSettings());
        }

        [HttpGet("combo")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT XScheduleItemId id, ( [dbo].[XScheduleItem_BRIEF_F](XScheduleItemId,null)  ) name
                         FROM            
                          XScheduleItem 
                            order by name ";
            return _context.GetRaw(sql);
        }
        
        [HttpGet("view")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetView()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT * FROM V_XScheduleItem ";
            return _context.GetRaw(sql);
        }
        
        // GET: api/XScheduleItem/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetXScheduleItem([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varXScheduleItem = await _context.XScheduleItem.SingleOrDefaultAsync(m => m.XScheduleItemId == id);

            if (varXScheduleItem == null)
            {
                return NotFound();
            }

            return Ok(varXScheduleItem);
        }

        // PUT: api/XScheduleItem/5
        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> PutXScheduleItem([FromRoute] Guid id, [FromBody] XScheduleItem varXScheduleItem)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != varXScheduleItem.XScheduleItemId)
            {
                return BadRequest();
            }

            _context.Entry(varXScheduleItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!XScheduleItemExists(id))
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

        // POST: api/XScheduleItem
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> PostXScheduleItem([FromBody] XScheduleItem varXScheduleItem)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.XScheduleItem.Add(varXScheduleItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetXScheduleItem", new { id = varXScheduleItem.XScheduleItemId }, varXScheduleItem);
        }

        // DELETE: api/XScheduleItem/5
        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteXScheduleItem([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varXScheduleItem = await _context.XScheduleItem.SingleOrDefaultAsync(m => m.XScheduleItemId == id);
            if (varXScheduleItem == null)
            {
                return NotFound();
            }

            _context.XScheduleItem.Remove(varXScheduleItem);
            await _context.SaveChangesAsync();

            return Ok(varXScheduleItem);
        }

        private bool XScheduleItemExists(Guid id)
        {
            return _context.XScheduleItem.Any(e => e.XScheduleItemId == id);
        }
    }
}
