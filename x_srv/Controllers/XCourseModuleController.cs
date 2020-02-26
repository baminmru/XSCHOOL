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
    [Route("api/XCourseModule")]
    public class XCourseModuleController : Controller
    {
        private readonly GoodRussianDbContext _context;
        IWebHostEnvironment _appEnvironment;

        public XCourseModuleController(GoodRussianDbContext context, IWebHostEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
        }

        // GET: api/XCourseModule
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetXCourseModule()
        {
            return Json (_context.XCourseModule, _context.serializerSettings());
        }

        [HttpGet("combo")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT XCourseModuleId id, ( [dbo].[XCourseModule_BRIEF_F](XCourseModuleId,null)  ) name
                         FROM            
                          XCourseModule 
                            order by name ";
            return _context.GetRaw(sql);
        }
        
        [HttpGet("byparent/{id}")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetByBarent([FromRoute] Guid id)
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT * FROM V_XCourseModule where xCourseDescID='" + id.ToString() + "'";
            return _context.GetRaw(sql);
        }
        
        // GET: api/XCourseModule/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetXCourseModule([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varXCourseModule = await _context.XCourseModule.SingleOrDefaultAsync(m => m.XCourseModuleId == id);

            if (varXCourseModule == null)
            {
                return NotFound();
            }

            return Ok(varXCourseModule);
        }

        // PUT: api/XCourseModule/5
        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> PutXCourseModule([FromRoute] Guid id, [FromBody] XCourseModule varXCourseModule)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != varXCourseModule.XCourseModuleId)
            {
                return BadRequest();
            }

            _context.Entry(varXCourseModule).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!XCourseModuleExists(id))
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

        // POST: api/XCourseModule
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> PostXCourseModule([FromBody] XCourseModule varXCourseModule)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.XCourseModule.Add(varXCourseModule);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetXCourseModule", new { id = varXCourseModule.XCourseModuleId }, varXCourseModule);
        }

        // DELETE: api/XCourseModule/5
        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteXCourseModule([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varXCourseModule = await _context.XCourseModule.SingleOrDefaultAsync(m => m.XCourseModuleId == id);
            if (varXCourseModule == null)
            {
                return NotFound();
            }

            _context.XCourseModule.Remove(varXCourseModule);
            await _context.SaveChangesAsync();

            return Ok(varXCourseModule);
        }

        private bool XCourseModuleExists(Guid id)
        {
            return _context.XCourseModule.Any(e => e.XCourseModuleId == id);
        }
    }
}
