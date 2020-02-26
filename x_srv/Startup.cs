namespace x_srv
{
    using Microsoft.AspNetCore.Authentication.JwtBearer;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.AspNetCore.Identity;
    using Microsoft.EntityFrameworkCore; // пространство имен EntityFramework
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Hosting;
    using Microsoft.IdentityModel.Tokens;
    using MySys.Identity.Data;
    using MySys.Identity.Models;
    using System.Text;
    using x_srv.models;
    using x_srv.Options;
    using x_srv.Services.Users;
    using x_srv.Settings;
    using Microsoft.AspNetCore.Mvc.Formatters;
    using Newtonsoft.Json.Serialization;

    /// <summary>
    /// Defines the <see cref="Startup" />
    /// </summary>
    public class Startup
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="Startup"/> class.
        /// </summary>
        /// <param name="configuration">The configuration<see cref="IConfiguration"/></param>
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        /// <summary>
        /// Gets the Configuration
        /// </summary>
        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        /// <summary>
        /// The ConfigureServices
        /// </summary>
        /// <param name="services">The services<see cref="IServiceCollection"/></param>
        public void ConfigureServices(IServiceCollection services)
        {
            // получаем строку подключения из файла конфигурации
            string connection = Configuration.GetConnectionString("DefaultConnection");
            var connectionStringLogin = Configuration.GetConnectionString("LoginConnection");
            // добавляем контекст MobileContext в качестве сервиса в приложение
            services.AddDbContext<GoodRussianDbContext>(options =>
                options.UseSqlServer(connection));
            services.AddDbContext<MySysIdentityDbContext>(o => o.UseSqlServer(connectionStringLogin));

            services.AddOptions();
            services.Configure<IntegrationOptions>(Configuration.GetSection("IntegrationOptions"));

            services.Configure<JWTSettings>(Configuration.GetSection("JWTSettings"));

            var jwtAppSettingOptions = Configuration.GetSection(nameof(JwtIssuerOptions));

            var secretKey = Configuration.GetSection("JWTSettings:SecretKey").Value;
            SymmetricSecurityKey signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));

            services.Configure<JwtIssuerOptions>(options =>
            {
                options.Issuer = jwtAppSettingOptions[nameof(JwtIssuerOptions.Issuer)];
                options.Audience = jwtAppSettingOptions[nameof(JwtIssuerOptions.Audience)];
                options.SigningCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);
            });

            services.AddAuthorization(options =>
            {
                options.DefaultPolicy = new AuthorizationPolicyBuilder(
                    JwtBearerDefaults.AuthenticationScheme).
                    RequireAuthenticatedUser().
                    Build();
            });
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.SaveToken = true;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = jwtAppSettingOptions[nameof(JwtIssuerOptions.Issuer)],
                        ValidAudience = jwtAppSettingOptions[nameof(JwtIssuerOptions.Audience)],
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
                    };
                });

            services.AddIdentity<ApplicationUser, MyIdentityRole>(o =>
            {
                o.Password.RequireNonAlphanumeric = false;
                o.Password.RequireDigit = false;
                o.Password.RequireLowercase = false;
                o.Password.RequireUppercase = false;
                o.Password.RequiredLength = 6;
                o.Lockout.MaxFailedAccessAttempts = 100;

                o.SignIn.RequireConfirmedEmail = false;
                o.SignIn.RequireConfirmedPhoneNumber = false;

                o.User.RequireUniqueEmail = true;
            })
               .AddEntityFrameworkStores<MySysIdentityDbContext>()
               .AddDefaultTokenProviders();

            services.AddTransient<UserService>();

            services.AddMvc().AddNewtonsoftJson(options =>
                {
                    // вот возможное решение проблемы с Ангуляром
                    // options.SerializerSettings.ContractResolver = new DefaultContractResolver();
                }
            );
           
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        /// <summary>
        /// The Configure
        /// </summary>
        /// <param name="app">The app<see cref="IApplicationBuilder"/></param>
        /// <param name="env">The env<see cref="Microsoft.Extensions.Hosting.IHostEnvironment"/></param>
        public void Configure(IApplicationBuilder app, Microsoft.Extensions.Hosting.IHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                //app.UseBrowserLink();
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseDefaultFiles();
            app.UseStaticFiles();


            ///

            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseAuthorization();
            app.UseAuthentication();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");

                endpoints.MapFallbackToController("Index", "Home");
            });
        }
    }
}
