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
    [Route("api/XStatus")]
    public class XStatusController : Controller
    {
        private readonly MyContext _context;
        IHostingEnvironment _appEnvironment;

        public XStatusController(MyContext context, IHostingEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
        }

        // GET: api/XStatus
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetXStatus()
        {
            return Json (_context.XStatus, _context.serializerSettings());
        }

        [HttpGet("combo")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT XStatusId id, ( [dbo].[XStatus_BRIEF_F](XStatusId,null)  ) name
                         FROM            
                          XStatus 
                            order by name ";
            return _context.GetRaw(sql);
        }
        
        [HttpGet("view")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetView()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT * FROM V_XStatus ";
            return _context.GetRaw(sql);
        }
        
        // GET: api/XStatus/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetXStatus([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varXStatus = await _context.XStatus.SingleOrDefaultAsync(m => m.XStatusId == id);

            if (varXStatus == null)
            {
                return NotFound();
            }

            return Ok(varXStatus);
        }

        // PUT: api/XStatus/5
        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> PutXStatus([FromRoute] Guid id, [FromBody] XStatus varXStatus)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != varXStatus.XStatusId)
            {
                return BadRequest();
            }

            _context.Entry(varXStatus).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!XStatusExists(id))
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

        // POST: api/XStatus
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> PostXStatus([FromBody] XStatus varXStatus)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.XStatus.Add(varXStatus);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetXStatus", new { id = varXStatus.XStatusId }, varXStatus);
        }

        // DELETE: api/XStatus/5
        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteXStatus([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varXStatus = await _context.XStatus.SingleOrDefaultAsync(m => m.XStatusId == id);
            if (varXStatus == null)
            {
                return NotFound();
            }

            _context.XStatus.Remove(varXStatus);
            await _context.SaveChangesAsync();

            return Ok(varXStatus);
        }

        private bool XStatusExists(Guid id)
        {
            return _context.XStatus.Any(e => e.XStatusId == id);
        }
    }
}
