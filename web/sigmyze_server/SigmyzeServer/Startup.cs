using SigmyzeServer.Services;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using SigmyzeServer.Models.User;
using SigmyzeServer.Services.Auth;
using SigmyzeServer.Services.DatabaseServices;
using MongoDB.Driver;
using Microsoft.Extensions.Options;
using SigmyzeServer.Services.OrganizationServices;
using System.Net.WebSockets;

namespace SigmyzeServer
{
    public class Startup
    {
        public IConfiguration Configuration { get; }
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options => options.AddDefaultPolicy(
                builder => builder
                    .WithOrigins("https://sigmyze.com")
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials()
            ));

            services.Configure<AuthDatabaseSettings>(Configuration.GetSection("UserDatabase"));
            services.AddControllers();

            services.AddApiVersioning(config => {
                config.DefaultApiVersion = new ApiVersion(1, 0);
                config.AssumeDefaultVersionWhenUnspecified = true;
                config.ReportApiVersions = true;
            });

            services.AddDistributedMemoryCache();
            services.AddSession(options =>
            {
                options.Cookie.HttpOnly = true;
                options.Cookie.IsEssential = true;
            });

            /*services.AddCronJob<WEODataService>(c => {
                c.TimeZoneInfo   = TimeZoneInfo.Utc;
                c.CronExpression = @"0 0 * * *"; 
            });*/

            services.AddSwaggerGen(c => {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Sigmyze API", Version = "v1" });
            });

            //add the database
            services.AddSingleton<IMongoClient>(options => {
                var authDatabaseSettings = Configuration.GetSection("UserDatabase").Get<AuthDatabaseSettings>();
                var mongoClient = new MongoClient(authDatabaseSettings.ConnectionString);
                return mongoClient;
            });

            //add authentication
            services.AddSingleton<IUserAuth, AuthService>();
            services.AddSingleton<IDatasetMongoOrm, DatasetMongoOrm>(); // dataset service for hosted datasets
            services.AddTransient<IHashService, HashService>();
            services.AddSingleton<IEmailService, EmailService>();
            services.AddSingleton<ITokenDataService, TokenDataService>();

            //data services
            services.AddSingleton<IQuantaDatasetService, QuantaDatasetService>();
            services.AddSingleton<IPublishService, PublishService>();

            //organization services
            services.AddSingleton<IOrganizationRepository, OrganizationRepository>();
            services.AddSingleton<IDriveRepository, DriveRepository>();
            services.AddSingleton<IProjectRepository, ProjectRepository>();
            services.AddSingleton<IQuantaRepository, QuantaRepository>(); 
            services.AddSingleton<IQuantaIndicatorRepository, QuantaIndicatorRepository>();
            services.AddSingleton<IUserServiceRepository, UserServiceRepository>();
            services.AddSingleton<IQuantaExecutionService, QuantaExecutionService>();

            services.AddAuthentication(auth => {
                auth.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                auth.DefaultChallengeScheme    = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(x => 
            {
                x.RequireHttpsMetadata = false;
                x.SaveToken = true;
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:Key"])),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                };
            });

            services.AddScoped<IUserService, UserService>();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseCors();
            app.UseSwagger();

            app.UseSession();
            app.Use(async (context, next) => 
            {
                var token = context.Session.GetString("Token");
                if(!string.IsNullOrEmpty(token))
                    context.Request.Headers.Add("Authorization", "Bearer " + token);
                    
                await next();
            });

            app.UseSwaggerUI(c => {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Api V1");
            });

            if(env.IsDevelopment())
                app.UseDeveloperExceptionPage();
            
            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints => {
                endpoints.MapControllers();
            });
        }
    }
}