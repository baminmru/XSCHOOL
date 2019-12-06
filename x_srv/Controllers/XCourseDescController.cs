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
    [Route("api/XCourseDesc")]
    public class XCourseDescController : Controller
    {
        private readonly MyContext _context;
        IHostingEnvironment _appEnvironment;

        public XCourseDescController(MyContext context, IHostingEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
        }

        // GET: api/XCourseDesc
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetXCourseDesc()
        {
            return Json (_context.XCourseDesc, _context.serializerSettings());
        }

        [HttpGet("combo")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT XCourseDescId id, ( [dbo].[XCourseDesc_BRIEF_F](XCourseDescId,null)  ) name
                         FROM            
                          XCourseDesc 
                            order by name ";
            return _context.GetRaw(sql);
        }
        
        [HttpGet("view")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetView()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT * FROM V_XCourseDesc ";
            return _context.GetRaw(sql);
        }
        
        // GET: api/XCourseDesc/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetXCourseDesc([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varXCourseDesc = await _context.XCourseDesc.SingleOrDefaultAsync(m => m.XCourseDescId == id);

            if (varXCourseDesc == null)
            {
                return NotFound();
            }

            return Ok(varXCourseDesc);
        }

        // PUT: api/XCourseDesc/5
        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> PutXCourseDesc([FromRoute] Guid id, [FromBody] XCourseDesc varXCourseDesc)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != varXCourseDesc.XCourseDescId)
            {
                return BadRequest();
            }

            _context.Entry(varXCourseDesc).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!XCourseDescExists(id))
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

        // POST: api/XCourseDesc
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> PostXCourseDesc([FromBody] XCourseDesc varXCourseDesc)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.XCourseDesc.Add(varXCourseDesc);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetXCourseDesc", new { id = varXCourseDesc.XCourseDescId }, varXCourseDesc);
        }

        // DELETE: api/XCourseDesc/5
        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteXCourseDesc([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varXCourseDesc = await _context.XCourseDesc.SingleOrDefaultAsync(m => m.XCourseDescId == id);
            if (varXCourseDesc == null)
            {
                return NotFound();
            }

            _context.XCourseDesc.Remove(varXCourseDesc);
            await _context.SaveChangesAsync();

            return Ok(varXCourseDesc);
        }

        private bool XCourseDescExists(Guid id)
        {
            return _context.XCourseDesc.Any(e => e.XCourseDescId == id);
        }
    }
}
