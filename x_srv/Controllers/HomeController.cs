/*
HomeController.cs
Created by: BAMINOTE\bami
Modified: 17.12.2019
*/

namespace x_srv.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using System.Threading.Tasks;

    /// <summary>
    /// Defines the <see cref="HomeController" />
    /// </summary>
    [Produces("application/json")]
    public class HomeController : Controller
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="HomeController"/> class.
        /// </summary>
        public HomeController()
        {
        }

        // GET: /<controller>/
        /// <summary>
        /// The Index
        /// </summary>
        /// <returns>The <see cref="Task{IActionResult}"/></returns>
        public async Task<IActionResult> Index()
        {
            return View();
        }
    }
}
