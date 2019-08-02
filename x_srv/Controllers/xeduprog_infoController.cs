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
    [Route("api/xeduprog_info")]
    public class xeduprog_infoController : Controller
    {
        private readonly MyContext _context;
        IHostingEnvironment _appEnvironment;

        public xeduprog_infoController(MyContext context, IHostingEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
        }

        // GET: api/xeduprog_info
        [HttpGet]
        [AllowAnonymous]
        public IActionResult Getxeduprog_info()
        {
            return Json (_context.xeduprog_info, _context.serializerSettings());
        }

        [HttpGet("combo")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT xeduprog_infoId id, ( [dbo].[xeduprog_info_BRIEF_F](xeduprog_infoId,null)  ) name
                         FROM            
                          xeduprog_info 
                            order by name ";
            return _context.GetRaw(sql);
        }
        
        [HttpGet("view")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetView()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT * FROM V_xeduprog_info ";
            return _context.GetRaw(sql);
        }
        
        // GET: api/xeduprog_info/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Getxeduprog_info([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varxeduprog_info = await _context.xeduprog_info.SingleOrDefaultAsync(m => m.xeduprog_infoId == id);

            if (varxeduprog_info == null)
            {
                return NotFound();
            }

            return Ok(varxeduprog_info);
        }

        // PUT: api/xeduprog_info/5
        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Putxeduprog_info([FromRoute] Guid id, [FromBody] xeduprog_info varxeduprog_info)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != varxeduprog_info.xeduprog_infoId)
            {
                return BadRequest();
            }

            _context.Entry(varxeduprog_info).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!xeduprog_infoExists(id))
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

        // POST: api/xeduprog_info
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Postxeduprog_info([FromBody] xeduprog_info varxeduprog_info)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.xeduprog_info.Add(varxeduprog_info);
            await _context.SaveChangesAsync();

            return CreatedAtAction("Getxeduprog_info", new { id = varxeduprog_info.xeduprog_infoId }, varxeduprog_info);
        }

        // DELETE: api/xeduprog_info/5
        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> Deletexeduprog_info([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varxeduprog_info = await _context.xeduprog_info.SingleOrDefaultAsync(m => m.xeduprog_infoId == id);
            if (varxeduprog_info == null)
            {
                return NotFound();
            }

            _context.xeduprog_info.Remove(varxeduprog_info);
            await _context.SaveChangesAsync();

            return Ok(varxeduprog_info);
        }

        private bool xeduprog_infoExists(Guid id)
        {
            return _context.xeduprog_info.Any(e => e.xeduprog_infoId == id);
        }
    }
}
