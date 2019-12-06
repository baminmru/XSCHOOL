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
    [Route("api/XSubscriptionType")]
    public class XSubscriptionTypeController : Controller
    {
        private readonly MyContext _context;
        IHostingEnvironment _appEnvironment;

        public XSubscriptionTypeController(MyContext context, IHostingEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
        }

        // GET: api/XSubscriptionType
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetXSubscriptionType()
        {
            return Json (_context.XSubscriptionType, _context.serializerSettings());
        }

        [HttpGet("combo")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT XSubscriptionTypeId id, ( [dbo].[XSubscriptionType_BRIEF_F](XSubscriptionTypeId,null)  ) name
                         FROM            
                          XSubscriptionType 
                            order by name ";
            return _context.GetRaw(sql);
        }
        
        [HttpGet("view")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetView()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT * FROM V_XSubscriptionType ";
            return _context.GetRaw(sql);
        }
        
        // GET: api/XSubscriptionType/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetXSubscriptionType([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varXSubscriptionType = await _context.XSubscriptionType.SingleOrDefaultAsync(m => m.XSubscriptionTypeId == id);

            if (varXSubscriptionType == null)
            {
                return NotFound();
            }

            return Ok(varXSubscriptionType);
        }

        // PUT: api/XSubscriptionType/5
        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> PutXSubscriptionType([FromRoute] Guid id, [FromBody] XSubscriptionType varXSubscriptionType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != varXSubscriptionType.XSubscriptionTypeId)
            {
                return BadRequest();
            }

            _context.Entry(varXSubscriptionType).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!XSubscriptionTypeExists(id))
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

        // POST: api/XSubscriptionType
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> PostXSubscriptionType([FromBody] XSubscriptionType varXSubscriptionType)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.XSubscriptionType.Add(varXSubscriptionType);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetXSubscriptionType", new { id = varXSubscriptionType.XSubscriptionTypeId }, varXSubscriptionType);
        }

        // DELETE: api/XSubscriptionType/5
        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteXSubscriptionType([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varXSubscriptionType = await _context.XSubscriptionType.SingleOrDefaultAsync(m => m.XSubscriptionTypeId == id);
            if (varXSubscriptionType == null)
            {
                return NotFound();
            }

            _context.XSubscriptionType.Remove(varXSubscriptionType);
            await _context.SaveChangesAsync();

            return Ok(varXSubscriptionType);
        }

        private bool XSubscriptionTypeExists(Guid id)
        {
            return _context.XSubscriptionType.Any(e => e.XSubscriptionTypeId == id);
        }
    }
}
