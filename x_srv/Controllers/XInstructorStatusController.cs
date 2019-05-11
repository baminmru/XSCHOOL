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
    [Route("api/XInstructorStatus")]
    public class XInstructorStatusController : Controller
    {
        private readonly MyContext _context;
        IHostingEnvironment _appEnvironment;

        public XInstructorStatusController(MyContext context, IHostingEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
        }

        // GET: api/XInstructorStatus
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetXInstructorStatus()
        {
            return Json (_context.XInstructorStatus, _context.serializerSettings());
        }

        [HttpGet("combo")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT XInstructorStatusId id, ( [dbo].[XInstructorStatus_BRIEF_F](XInstructorStatusId,null)  ) name
                         FROM            
                          XInstructorStatus 
                            order by name ";
            return _context.GetRaw(sql);
        }
        
        [HttpGet("byparent/{id}")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetByBarent([FromRoute] Guid id)
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT * FROM V_XInstructorStatus where XInstructorInfoID='" + id.ToString() + "'";
            return _context.GetRaw(sql);
        }
        
        // GET: api/XInstructorStatus/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetXInstructorStatus([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varXInstructorStatus = await _context.XInstructorStatus.SingleOrDefaultAsync(m => m.XInstructorStatusId == id);

            if (varXInstructorStatus == null)
            {
                return NotFound();
            }

            return Ok(varXInstructorStatus);
        }

        // PUT: api/XInstructorStatus/5
        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> PutXInstructorStatus([FromRoute] Guid id, [FromBody] XInstructorStatus varXInstructorStatus)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != varXInstructorStatus.XInstructorStatusId)
            {
                return BadRequest();
            }

            _context.Entry(varXInstructorStatus).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!XInstructorStatusExists(id))
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

        // POST: api/XInstructorStatus
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> PostXInstructorStatus([FromBody] XInstructorStatus varXInstructorStatus)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.XInstructorStatus.Add(varXInstructorStatus);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetXInstructorStatus", new { id = varXInstructorStatus.XInstructorStatusId }, varXInstructorStatus);
        }

        // DELETE: api/XInstructorStatus/5
        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteXInstructorStatus([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varXInstructorStatus = await _context.XInstructorStatus.SingleOrDefaultAsync(m => m.XInstructorStatusId == id);
            if (varXInstructorStatus == null)
            {
                return NotFound();
            }

            _context.XInstructorStatus.Remove(varXInstructorStatus);
            await _context.SaveChangesAsync();

            return Ok(varXInstructorStatus);
        }

        private bool XInstructorStatusExists(Guid id)
        {
            return _context.XInstructorStatus.Any(e => e.XInstructorStatusId == id);
        }
    }
}
