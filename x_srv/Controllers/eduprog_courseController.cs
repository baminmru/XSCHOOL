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
    [Route("api/eduprog_course")]
    public class eduprog_courseController : Controller
    {
        private readonly MyContext _context;
        IHostingEnvironment _appEnvironment;

        public eduprog_courseController(MyContext context, IHostingEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
        }

        // GET: api/eduprog_course
        [HttpGet]
        [AllowAnonymous]
        public IActionResult Geteduprog_course()
        {
            return Json (_context.eduprog_course, _context.serializerSettings());
        }

        [HttpGet("combo")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT eduprog_courseId id, ( [dbo].[eduprog_course_BRIEF_F](eduprog_courseId,null)  ) name
                         FROM            
                          eduprog_course 
                            order by name ";
            return _context.GetRaw(sql);
        }
        
        [HttpGet("byparent/{id}")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetByBarent([FromRoute] Guid id)
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT * FROM V_eduprog_course where xeduprog_infoID='" + id.ToString() + "'";
            return _context.GetRaw(sql);
        }
        
        // GET: api/eduprog_course/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Geteduprog_course([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var vareduprog_course = await _context.eduprog_course.SingleOrDefaultAsync(m => m.eduprog_courseId == id);

            if (vareduprog_course == null)
            {
                return NotFound();
            }

            return Ok(vareduprog_course);
        }

        // PUT: api/eduprog_course/5
        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Puteduprog_course([FromRoute] Guid id, [FromBody] eduprog_course vareduprog_course)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != vareduprog_course.eduprog_courseId)
            {
                return BadRequest();
            }

            _context.Entry(vareduprog_course).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!eduprog_courseExists(id))
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

        // POST: api/eduprog_course
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Posteduprog_course([FromBody] eduprog_course vareduprog_course)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.eduprog_course.Add(vareduprog_course);
            await _context.SaveChangesAsync();

            return CreatedAtAction("Geteduprog_course", new { id = vareduprog_course.eduprog_courseId }, vareduprog_course);
        }

        // DELETE: api/eduprog_course/5
        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Deleteeduprog_course([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var vareduprog_course = await _context.eduprog_course.SingleOrDefaultAsync(m => m.eduprog_courseId == id);
            if (vareduprog_course == null)
            {
                return NotFound();
            }

            _context.eduprog_course.Remove(vareduprog_course);
            await _context.SaveChangesAsync();

            return Ok(vareduprog_course);
        }

        private bool eduprog_courseExists(Guid id)
        {
            return _context.eduprog_course.Any(e => e.eduprog_courseId == id);
        }
    }
}
