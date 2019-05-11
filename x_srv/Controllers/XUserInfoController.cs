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
    [Route("api/XUserInfo")]
    public class XUserInfoController : Controller
    {
        private readonly MyContext _context;
        IHostingEnvironment _appEnvironment;

        public XUserInfoController(MyContext context, IHostingEnvironment appEnvironment)
        {
            _context = context;
            _appEnvironment = appEnvironment;
        }

        // GET: api/XUserInfo
        [HttpGet]
        [AllowAnonymous]
        public IActionResult GetXUserInfo()
        {
            return Json (_context.XUserInfo, _context.serializerSettings());
        }

        [HttpGet("combo")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetCombo()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT XUserInfoId id, ( [dbo].[XUserInfo_BRIEF_F](XUserInfoId,null)  ) name
                         FROM            
                          XUserInfo 
                            order by name ";
            return _context.GetRaw(sql);
        }
        
        [HttpGet("view")]
        [AllowAnonymous]
        public List<Dictionary<string, object>> GetView()
        {
            //var uid = User.GetUserId();

            string sql = @"SELECT * FROM V_XUserInfo ";
            return _context.GetRaw(sql);
        }
        
        // GET: api/XUserInfo/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetXUserInfo([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varXUserInfo = await _context.XUserInfo.SingleOrDefaultAsync(m => m.XUserInfoId == id);

            if (varXUserInfo == null)
            {
                return NotFound();
            }

            return Ok(varXUserInfo);
        }

        // PUT: api/XUserInfo/5
        [HttpPut("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> PutXUserInfo([FromRoute] Guid id, [FromBody] XUserInfo varXUserInfo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != varXUserInfo.XUserInfoId)
            {
                return BadRequest();
            }

            _context.Entry(varXUserInfo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!XUserInfoExists(id))
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

        // POST: api/XUserInfo
        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> PostXUserInfo([FromBody] XUserInfo varXUserInfo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.XUserInfo.Add(varXUserInfo);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetXUserInfo", new { id = varXUserInfo.XUserInfoId }, varXUserInfo);
        }

        // DELETE: api/XUserInfo/5
        [HttpDelete("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> DeleteXUserInfo([FromRoute] Guid id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var varXUserInfo = await _context.XUserInfo.SingleOrDefaultAsync(m => m.XUserInfoId == id);
            if (varXUserInfo == null)
            {
                return NotFound();
            }

            _context.XUserInfo.Remove(varXUserInfo);
            await _context.SaveChangesAsync();

            return Ok(varXUserInfo);
        }

        private bool XUserInfoExists(Guid id)
        {
            return _context.XUserInfo.Any(e => e.XUserInfoId == id);
        }
    }
}
