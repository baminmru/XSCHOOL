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
    [Route("api/XSubscription")]
    public class XSubscriptionController : Controller
    {
        private readonly GoodRussianDbContext _context;
        IWebHostEnvironment _appEnvironment;

        public XSubscriptionController(GoodRussianDbContext context, IWebHostEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
        }

        // GET: api/XSubscription
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetXSubscription()
        {
            return Json (_context.XSubscription, _context.serializerSettings());
        }

        [HttpGet("combo")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT XSubscriptionId id, ( [dbo].[XSubscription_BRIEF_F](XSubscriptionId,null)  ) name
                         FROM            
                          XSubscription 
                            order by name ";
            return _context.GetRaw(sql);
        }
        
        [HttpGet("byparent/{id}")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetByBarent([FromRoute] Guid id)
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT * FROM V_XSubscription where XUserInfoID='" + id.ToString() + "'";
            return _context.GetRaw(sql);
        }
        
        // GET: api/XSubscription/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetXSubscription([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varXSubscription = await _context.XSubscription.SingleOrDefaultAsync(m => m.XSubscriptionId == id);

            if (varXSubscription == null)
            {
                return NotFound();
            }

            return Ok(varXSubscription);
        }

        // PUT: api/XSubscription/5
        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> PutXSubscription([FromRoute] Guid id, [FromBody] XSubscription varXSubscription)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != varXSubscription.XSubscriptionId)
            {
                return BadRequest();
            }

            _context.Entry(varXSubscription).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!XSubscriptionExists(id))
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

        // POST: api/XSubscription
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> PostXSubscription([FromBody] XSubscription varXSubscription)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.XSubscription.Add(varXSubscription);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetXSubscription", new { id = varXSubscription.XSubscriptionId }, varXSubscription);
        }

        // DELETE: api/XSubscription/5
        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteXSubscription([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varXSubscription = await _context.XSubscription.SingleOrDefaultAsync(m => m.XSubscriptionId == id);
            if (varXSubscription == null)
            {
                return NotFound();
            }

            _context.XSubscription.Remove(varXSubscription);
            await _context.SaveChangesAsync();

            return Ok(varXSubscription);
        }

        private bool XSubscriptionExists(Guid id)
        {
            return _context.XSubscription.Any(e => e.XSubscriptionId == id);
        }
    }
}
