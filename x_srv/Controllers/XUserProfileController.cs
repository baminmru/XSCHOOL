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
    [Route("api/XUserProfile")]
    public class XUserProfileController : Controller
    {
        private readonly MyContext _context;
        IHostingEnvironment _appEnvironment;

        public XUserProfileController(MyContext context, IHostingEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
        }

        // GET: api/XUserProfile
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetXUserProfile()
        {
            return Json (_context.XUserProfile, _context.serializerSettings());
        }

        [HttpGet("combo")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT XUserProfileId id, ( [dbo].[XUserProfile_BRIEF_F](XUserProfileId,null)  ) name
                         FROM            
                          XUserProfile 
                            order by name ";
            return _context.GetRaw(sql);
        }
        
        [HttpGet("byparent/{id}")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetByBarent([FromRoute] Guid id)
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT * FROM V_XUserProfile where XUserInfoID='" + id.ToString() + "'";
            return _context.GetRaw(sql);
        }
        
        // GET: api/XUserProfile/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetXUserProfile([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varXUserProfile = await _context.XUserProfile.SingleOrDefaultAsync(m => m.XUserProfileId == id);

            if (varXUserProfile == null)
            {
                return NotFound();
            }

            return Ok(varXUserProfile);
        }

        // PUT: api/XUserProfile/5
        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> PutXUserProfile([FromRoute] Guid id, [FromBody] XUserProfile varXUserProfile)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != varXUserProfile.XUserProfileId)
            {
                return BadRequest();
            }

            _context.Entry(varXUserProfile).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!XUserProfileExists(id))
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

        // POST: api/XUserProfile
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> PostXUserProfile([FromBody] XUserProfile varXUserProfile)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.XUserProfile.Add(varXUserProfile);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetXUserProfile", new { id = varXUserProfile.XUserProfileId }, varXUserProfile);
        }

        // DELETE: api/XUserProfile/5
        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteXUserProfile([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varXUserProfile = await _context.XUserProfile.SingleOrDefaultAsync(m => m.XUserProfileId == id);
            if (varXUserProfile == null)
            {
                return NotFound();
            }

            _context.XUserProfile.Remove(varXUserProfile);
            await _context.SaveChangesAsync();

            return Ok(varXUserProfile);
        }

        private bool XUserProfileExists(Guid id)
        {
            return _context.XUserProfile.Any(e => e.XUserProfileId == id);
        }
    }
}
