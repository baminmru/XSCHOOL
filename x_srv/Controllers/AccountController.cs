﻿/*
AccountController.cs
Created by: BAMINOTE\bami
Modified: 17.12.2019
*/

namespace survey_api.Controllers
{
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Logging;
    using Microsoft.Extensions.Options;
    using MySys.Common.Extensions;
    using MySys.Common.Service;
    using MySys.Identity.Data;
    using MySys.Identity.Models;
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.IdentityModel.Tokens.Jwt;
    using System.Linq;
    using System.Security.Claims;
    using System.Threading.Tasks;
    using x_srv.models;
    using x_srv.Services.Data.User;
    using x_srv.Services.Users;
    using x_srv.Settings;

    /// <summary>
    /// Defines the <see cref="NewUserInfo" />
    /// </summary>
    public class NewUserInfo
    {
        /// <summary>
        /// Defines the email
        /// </summary>
        public string email;

        /// <summary>
        /// Defines the password
        /// </summary>
        public string password;

        /// <summary>
        /// Defines the role
        /// </summary>
        public string role;

        /// <summary>
        /// Defines the firstName
        /// </summary>
        public string firstName;

        /// <summary>
        /// Defines the lastName
        /// </summary>
        public string lastName;
    }

    /// <summary>
    /// Defines the <see cref="AccountController" />
    /// </summary>
    [Authorize]
    [ApiController]
    [Route("api/account")]
    public class AccountController : Controller
    {
        /// <summary>
        /// Defines the _context
        /// </summary>
        private readonly GoodRussianDbContext _context;

        /// <summary>
        /// Defines the _identityContext
        /// </summary>
        private readonly MySysIdentityDbContext _identityContext;

        /// <summary>
        /// Defines the _userService
        /// </summary>
        private readonly UserService _userService;

        /// <summary>
        /// Defines the _userManager
        /// </summary>
        private readonly UserManager<ApplicationUser> _userManager;

        /// <summary>
        /// Defines the _roleManager
        /// </summary>
        private readonly RoleManager<MyIdentityRole> _roleManager;

        /// <summary>
        /// Defines the _signInManager
        /// </summary>
        private readonly SignInManager<ApplicationUser> _signInManager;

        /// <summary>
        /// Defines the _jwtOptions
        /// </summary>
        private readonly JwtIssuerOptions _jwtOptions;

        /// <summary>
        /// Defines the _serializerSettings
        /// </summary>
        private readonly JsonSerializerSettings _serializerSettings;

        /// <summary>
        /// Defines the _logger
        /// </summary>
        private readonly ILogger _logger;

        /// <summary>
        /// Initializes a new instance of the <see cref="AccountController"/> class.
        /// </summary>
        /// <param name="identityContext">The identityContext<see cref="MySysIdentityDbContext"/></param>
        /// <param name="context">The context<see cref="GoodRussianDbContext"/></param>
        /// <param name="userService">The userService<see cref="UserService"/></param>
        /// <param name="userManager">The userManager<see cref="UserManager{ApplicationUser}"/></param>
        /// <param name="roleManager">The roleManager<see cref="RoleManager{MyIdentityRole}"/></param>
        /// <param name="signInManager">The signInManager<see cref="SignInManager{ApplicationUser}"/></param>
        /// <param name="jwtOptions">The jwtOptions<see cref="IOptions{JwtIssuerOptions}"/></param>
        /// <param name="logger">The logger<see cref="ILogger{AccountController}"/></param>
        public AccountController(MySysIdentityDbContext identityContext,
            GoodRussianDbContext context,
            UserService userService,
            UserManager<ApplicationUser> userManager,
            RoleManager<MyIdentityRole> roleManager,
            SignInManager<ApplicationUser> signInManager,
            IOptions<JwtIssuerOptions> jwtOptions,
            ILogger<AccountController> logger)
        {
            _identityContext = identityContext;
            _context = context;
            _userService = userService;
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _jwtOptions = jwtOptions.Value;
            _logger = logger;

            _serializerSettings = new JsonSerializerSettings
            {
                Formatting = Formatting.Indented
            };
        }

        /// <summary>
        /// The Logout
        /// </summary>
        /// <returns>The <see cref="Task{IActionResult}"/></returns>
        [HttpGet("Logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Json("ok");
        }

        /// <summary>
        /// The RegisterDevice
        /// </summary>
        /// <param name="request">The request<see cref="RegisterDeviceRequest"/></param>
        /// <returns>The <see cref="Task{ResponseData{TokenInfo}}"/></returns>
        [HttpPost("RegisterDevice")]
        [AllowAnonymous]
        [Produces(typeof(ResponseData<TokenInfo>))]
        public async Task<ResponseData<TokenInfo>> RegisterDevice([FromBody] RegisterDeviceRequest request)
        {
            var response = new ResponseData<TokenInfo>();
            try
            {
                var email = $"{request.DeviceId}@mobile.device";
                var user = await _userManager.FindByEmailAsync(email);

                if (user == null)
                {
                    var password = Guid.NewGuid().ToString().Replace("-", "");
                    user = new ApplicationUser
                    {
                        Id = Guid.NewGuid(),
                        OS = request.OS,
                        DeviceId = request.DeviceId,
                        Email = email,
                        EmailConfirmed = true,
                        UserName = email
                    };

                    await _userManager.CreateAsync(user, password);

                    _context.Add(new XUserInfo
                    {
                        name = "App",
                        family = "Mobile",
                        login = user.Id.ToString(),
                        XUserInfoId = user.Id
                    });
                    await _context.SaveChangesAsync();
                }
                await _userManager.AddToRoleAsync(user, MyIdentityRole.ROLE_MOBILEAPP);
                await _signInManager.SignInAsync(user, false);


                var currentUser = user;
                string encodedJwt = await CreateToken(currentUser);

                // Serialize and return the response
                var oldTokens = await _identityContext.RefreshTokens.
                    Where(p => p.UserId == currentUser.Id && p.IsExpired).
                    ToListAsync();
                oldTokens.ForEach(p => { p.IsExpired = true; });

                var refresh_token = Guid.NewGuid().ToString().Replace("-", "");
                var refreshToken = new RefreshToken
                {
                    Id = Guid.NewGuid(),
                    UserId = currentUser.Id,
                    Token = refresh_token,
                    DateIssued = DateTime.Now,
                    IsExpired = false,
                };

                response.code = BaseStatus.Success;
                response.data = new TokenInfo
                {
                    access_token = encodedJwt,
                    expires_in = (int)_jwtOptions.ValidFor.TotalSeconds,
                    token_type = "jwt",
                    refresh_token = refresh_token
                };

                _identityContext.Add(refreshToken);
                await _identityContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                response.code = BaseStatus.Exception;
                response.data = null;
                response.message = ex.Message;
                response.description = "Не удалось зарегистрироваться ";
            }

            return response;
        }

        /// <summary>
        /// The ClassLogin
        /// </summary>
        /// <param name="request">The request<see cref="ClassLoginRequest"/></param>
        /// <returns>The <see cref="Task{ResponseData{TokenInfo}}"/></returns>
        [HttpPost("ClassLogin")]
        [AllowAnonymous]
        [Produces(typeof(ResponseData<TokenInfo>))]
        public async Task<ResponseData<TokenInfo>> ClassLogin([FromBody] ClassLoginRequest request)
        {
            var response = new ResponseData<TokenInfo>();
            try
            {
                var user = await _userManager.Users.
                    Where(p => !p.IsDisabled && p.IsSingleSignon && p.Passcode == request.Passcode).
                    FirstOrDefaultAsync();

                if (user != null)
                {
                    var now = DateTime.Now;
                    if (user.ExpireTime.HasValue)
                    {
                        if (now > user.ExpireTime.Value)
                        {
                            user.IsDisabled = true;
                        }
                    }
                    else
                    {
                        user.ExpireTime = now.AddHours(3);
                    }
                    await _userManager.UpdateAsync(user);
                }

                if (user != null && !user.IsDisabled)
                {
                    var result = await _signInManager.PasswordSignInAsync(user.Email, "TestClassPassword", false, lockoutOnFailure: false);
                    if (result.Succeeded)
                    {
                        var currentUser = await _userManager.FindByEmailAsync(user.Email);
                        string encodedJwt = await CreateToken(currentUser);

                        // Serialize and return the response
                        var oldTokens = await _identityContext.RefreshTokens.
                            Where(p => p.UserId == currentUser.Id && p.IsExpired).
                            ToListAsync();
                        oldTokens.ForEach(p => { p.IsExpired = true; });

                        var refresh_token = $"{Guid.NewGuid()}{Guid.NewGuid()}{Guid.NewGuid()}".Replace("-", "");
                        var refreshToken = new RefreshToken
                        {
                            Id = Guid.NewGuid(),
                            UserId = currentUser.Id,
                            Token = refresh_token,
                            DateIssued = DateTime.Now,
                            IsExpired = false
                        };

                        response.code = BaseStatus.Success;
                        response.data = new TokenInfo
                        {
                            access_token = encodedJwt,
                            expires_in = (int)_jwtOptions.ValidFor.TotalSeconds,
                            token_type = "jwt",
                            refresh_token = refresh_token
                        };

                        _identityContext.Add(refreshToken);
                        await _identityContext.SaveChangesAsync();

                        return response;
                    }
                }
                response.code = BaseStatus.Error;
                response.description = "Не удалось войти в систему";
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "could not login");
                response.code = BaseStatus.Exception;
                response.message = "Ошибка";
                response.description = "Не удалось выполнить вход";
                return response;
            }
        }

        /// <summary>
        /// The Login
        /// </summary>
        /// <param name="request">The request<see cref="LoginRequest"/></param>
        /// <returns>The <see cref="Task{ResponseData{TokenInfo}}"/></returns>
        [HttpPost("Login")]
        [AllowAnonymous]
        [Produces(typeof(ResponseData<TokenInfo>))]
        public async Task<ResponseData<TokenInfo>> Login([FromBody] LoginRequest request)
        {
            var response = new ResponseData<TokenInfo>();
            try
            {
                var result = await _signInManager.PasswordSignInAsync(request.email, request.password, false, lockoutOnFailure: false);
                if (result.Succeeded)
                {
                    var currentUser = await _userManager.FindByEmailAsync(request.email);
                    string encodedJwt = await CreateToken(currentUser);

                    // Serialize and return the response
                    var oldTokens = await _identityContext.RefreshTokens.
                        Where(p => p.UserId == currentUser.Id && p.IsExpired).
                        ToListAsync();
                    oldTokens.ForEach(p => { p.IsExpired = true; });

                    var refresh_token = $"{Guid.NewGuid()}{Guid.NewGuid()}{Guid.NewGuid()}".Replace("-", "");
                    var refreshToken = new RefreshToken
                    {
                        Id = Guid.NewGuid(),
                        UserId = currentUser.Id,
                        Token = refresh_token,
                        DateIssued = DateTime.Now,
                        IsExpired = false
                    };

                    response.code = BaseStatus.Success;
                    response.data = new TokenInfo
                    {
                        access_token = encodedJwt,
                        expires_in = (int)_jwtOptions.ValidFor.TotalSeconds,
                        token_type = "jwt",
                        refresh_token = refresh_token
                    };

                    _identityContext.Add(refreshToken);
                    await _identityContext.SaveChangesAsync();

                    return response;
                }

                response.code = BaseStatus.Error;
                response.description = "Не удалось войти в систему";
                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "could not login");
                response.code = BaseStatus.Exception;
                response.message = "Ошибка";
                response.description = "Не удалось выполнить вход";
                return response;
            }
        }

        /// <summary>
        /// The RefreshToken
        /// </summary>
        /// <param name="request">The request<see cref="RefreshTokenRequest"/></param>
        /// <returns>The <see cref="Task{ResponseData{TokenInfo}}"/></returns>
        [HttpPost("RefreshToken")]
        [AllowAnonymous]
        [Produces(typeof(ResponseData<TokenInfo>))]
        public async Task<ResponseData<TokenInfo>> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            var response = new ResponseData<TokenInfo>();
            var token = await _identityContext.
                RefreshTokens.
                Include(p => p.User).
                Where(p => p.Token == request.RefreshToken && !p.IsExpired).
                AsNoTracking().
                SingleOrDefaultAsync();
            if (token != null)
            {
                var currentUser = token.User;
                string encodedJwt = await CreateToken(currentUser);
                await _signInManager.SignInAsync(currentUser, false);

                response.code = BaseStatus.Success;
                response.data = new TokenInfo
                {
                    access_token = encodedJwt,
                    expires_in = (int)_jwtOptions.ValidFor.TotalSeconds,
                    token_type = "jwt",
                    refresh_token = request.RefreshToken
                };

                return response;
            }

            response.code = BaseStatus.Error;
            response.description = "Не удалось войти в систему";
            return response;
        }

        /// <summary>
        /// The CreateToken
        /// </summary>
        /// <param name="currentUser">The currentUser<see cref="ApplicationUser"/></param>
        /// <returns>The <see cref="Task{string}"/></returns>
        private async Task<string> CreateToken(ApplicationUser currentUser)
        {
            var roles = await _userManager.GetRolesAsync(currentUser);
            var claims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Sub, currentUser.Id.ToString()),
                    new Claim(JwtRegisteredClaimNames.Jti, await _jwtOptions.JtiGenerator()),
                    new Claim(JwtRegisteredClaimNames.Iat,
                              ConvertToUnixTimestamp(_jwtOptions.IssuedAt).ToString(),
                              ClaimValueTypes.Integer64),
                    new Claim(ClaimTypes.NameIdentifier, currentUser.Id.ToString())
                };
            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            // Create the JWT security token and encode it.
            var jwt = new JwtSecurityToken(
                issuer: _jwtOptions.Issuer,
                audience: _jwtOptions.Audience,
                claims: claims,
                notBefore: _jwtOptions.NotBefore,
                expires: _jwtOptions.Expiration,
                signingCredentials: _jwtOptions.SigningCredentials);


            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);
            return encodedJwt;
        }

        /// <summary>
        /// The ConvertToUnixTimestamp
        /// </summary>
        /// <param name="date">The date<see cref="DateTime"/></param>
        /// <returns>The <see cref="double"/></returns>
        private static double ConvertToUnixTimestamp(DateTime date)
        {
            DateTime origin = new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
            TimeSpan diff = date.ToUniversalTime() - origin;
            return Math.Floor(diff.TotalSeconds);
        }

        /// <summary>
        /// The RedirectToLocal
        /// </summary>
        /// <param name="returnUrl">The returnUrl<see cref="string"/></param>
        /// <returns>The <see cref="IActionResult"/></returns>
        private IActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            else
            {
                return Content(""); // RedirectToAction(nameof(HomeController.Index), "Home");
            }
        }

        /// <summary>
        /// The Index
        /// </summary>
        /// <returns>The <see cref="Task{IActionResult}"/></returns>
        [HttpGet("Index")]
        [AllowAnonymous]
        public async Task<IActionResult> Index()
        {
            return Content("Hello");
        }

        /// <summary>
        /// The Private
        /// </summary>
        /// <returns>The <see cref="IActionResult"/></returns>
        [HttpPost("Private")]
        public IActionResult Private()
        {
            var id = User.GetUserId();
            var roles = User.GetRoles();


            return Json(new { id = id, roles = string.Join(',', roles.Select(p => p.Value)) });
        }

        /// <summary>
        /// The PrivateAdmin
        /// </summary>
        /// <returns>The <see cref="Task{IActionResult}"/></returns>
        [HttpPost("PrivateAdmin")]
        [Authorize(Roles = "SUPERADMIN")]
        public async Task<IActionResult> PrivateAdmin()
        {
            return Json(new { name = "Hello from private method" });
        }

        /// <summary>
        /// The PrivatePost
        /// </summary>
        /// <returns>The <see cref="Task{IActionResult}"/></returns>
        [HttpPost("PrivatePost")]
        public async Task<IActionResult> PrivatePost()
        {
            return Content("Hello from private method");
        }

        /// <summary>
        /// The AddUser
        /// </summary>
        /// <param name="newUser">The newUser<see cref="NewUserInfo"/></param>
        /// <returns>The <see cref="Task{IActionResult}"/></returns>
        [HttpPost("AddUser")]
        [AllowAnonymous]
        public async Task<IActionResult> AddUser([FromBody] NewUserInfo newUser)
        {
            try
            {
                System.Diagnostics.Debug.Print(newUser.email);
                var email = newUser.email;
                var user = new ApplicationUser
                {
                    Id = Guid.NewGuid(),
                    Email = email,
                    EmailConfirmed = true,
                    UserName = email
                };

                System.Diagnostics.Debug.Print(newUser.password);
                await _userManager.CreateAsync(user, newUser.password);

                await _userManager.AddToRoleAsync(user, newUser.role);

                _context.Add(new XUserInfo
                {
                    eMail = email,
                    name = newUser.lastName,
                    family = newUser.firstName,
                    login = user.Id.ToString(),
                    XUserInfoId = user.Id
                });

                await _context.SaveChangesAsync();
            }
            catch (System.Exception ex)
            {
                System.Diagnostics.Debug.Print("\r\n\r\n");
                System.Diagnostics.Debug.Print(ex.Message);
                System.Diagnostics.Debug.Print("\r\n\r\n");
            }
            return Content("ОК");
        }

        /// <summary>
        /// The InitUsers
        /// </summary>
        /// <returns>The <see cref="Task{IActionResult}"/></returns>
        [HttpGet("InitUsers")]
        [AllowAnonymous]
        public async Task<IActionResult> InitUsers()
        {
            await _roleManager.CreateAsync(new MyIdentityRole
            {
                Name = MyIdentityRole.ROLE_ADMIN,
                Id = new Guid("BE2C9C98-8174-4798-6589-08D5AF855020")
            });
            await _roleManager.CreateAsync(new MyIdentityRole
            {
                Name = MyIdentityRole.ROLE_CLIENT,
                Id = new Guid("EA275962-49D0-4A0A-658B-08D5AF855020")
            });

            var email = "developer.bami@gmail.com";
            var user = new ApplicationUser
            {
                Id = Guid.NewGuid(),
                Email = email,
                EmailConfirmed = true,
                UserName = email,
            };
            await _userManager.CreateAsync(user, "password");

            await _roleManager.CreateAsync(new MyIdentityRole
            {
                Name = MyIdentityRole.ROLE_SUPERADMIN
            });

            await _userManager.AddToRoleAsync(user, MyIdentityRole.ROLE_SUPERADMIN);

            _context.Add(new XUserInfo
            {
                eMail = email,
                name = "Super",
                family = "Administrator",
                login = user.Id.ToString(),
                XUserInfoId = user.Id
            });
            await _context.SaveChangesAsync();

            return Content("User created");
        }

        /// <summary>
        /// The AccessDenied
        /// </summary>
        /// <returns>The <see cref="Task{IActionResult}"/></returns>
        [HttpGet("AccessDenied")]
        [AllowAnonymous]
        public async Task<IActionResult> AccessDenied()
        {
            return StatusCode(401);
        }
    }
}
