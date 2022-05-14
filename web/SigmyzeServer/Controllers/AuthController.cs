using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SigmyzeServer.Models.User;
using SigmyzeServer.Models;
using Microsoft.AspNetCore.Authorization;
using SigmyzeServer.Services.Auth;

namespace SigmyzeServer.Controllers
{
    [ApiController]
    [Route("api/v{version:apiVersion}/auth")]
    [ApiVersion("1.0")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ITokenService _tokenService;
        private readonly IHashService _hashService;
        private readonly IUserAuth _userAuth;
        private string generatedToken = null;

        public AuthController(IConfiguration config, ITokenService tokenService, IUserAuth userAuth, IHashService hashService)
        {
            _config         = config;
            _tokenService   = tokenService;
            _userAuth       = userAuth;
            _hashService    = hashService;
        }

        private async Task<IActionResult> SerializeJSON(object data)
        {
            string content = await Task.Run(() => JsonConvert.SerializeObject(data));
            return Content(
                content,
                "application/json"
            );
        }

        [HttpGet]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> AuthControllerRoot()
        {
            APIStatusMsg status = new APIStatusMsg();
            status.Error = false;
            status.MSG   = "Auth working";

            return await SerializeJSON(status);
        }

        [AllowAnonymous]
        [HttpPost("login")]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> AuthLogin([FromBody]LoginPost data)
        {
            LoginResp resp  = new LoginResp();
            resp.Authorized = false;
            resp.Message    = "not_auth";
            resp.Token      = "";

            //grab potential user
            User? pUser = await _userAuth.GetAsyncEmail(data.Email);
            if(pUser == null)
            {
                resp.Message = "user_dne";
                return await SerializeJSON(resp);
            }

            string hashedPWD = _hashService.HashPassword(data.Password, pUser.Salt);
            if(pUser.Password == hashedPWD)
            {
                resp.Authorized = true;
                resp.Message    = "auth";

                generatedToken = _tokenService.BuildToken(_config["Jwt:Key"].ToString(), _config["Jwt:Issuer"].ToString(), pUser);
                if(generatedToken != null)
                {
                    HttpContext.Session.SetString("Token", generatedToken);
                    resp.Token = generatedToken;
                    return await SerializeJSON(resp);
                }
                else
                {
                    resp.Authorized = false;
                    resp.Message    = "failed_gen";
                    return await SerializeJSON(resp);
                }
            }
            else
            {
                resp.Message = "bad_pwd";
                return await SerializeJSON(resp);
            }
        }

        [AllowAnonymous]
        [HttpPost("register")]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> AuthRegister([FromBody]RegisterPost data)
        {
            RegisterResp resp  = new RegisterResp();
            resp.Registered    = false;
            resp.Message       = "";

            User? pUser = await _userAuth.GetAsyncEmail(data.Email);
            if(pUser != null)
            {
                resp.Message = "user_exists";
                return await SerializeJSON(resp);
            }

            User user     = new User();
            user.EMail    = data.Email;
            user.Username = data.Username;

            //hash the pwd
            Random rnd  = new Random();
            string salt = _hashService.GenerateSalt(rnd.Next());
            string pwd  = _hashService.HashPassword(data.Password, salt);

            user.Password = pwd;
            user.Salt     = salt;

            //generate the lunar id
            string lunar_id = Guid.NewGuid().ToString();
            user.Lunar_ID   = lunar_id;

            Random rndVerification  = new Random();
            string verificationCode = rndVerification.Next(0, 1000000).ToString("D6");

            user.Verified          = false;
            user.VerificationToken = verificationCode;
            user.Role              = "user";

            //push to db
            await _userAuth.CreateAsync(user);
            resp.Registered = true;
            resp.Message    = "email";

            return await SerializeJSON(resp);
        }
    }
}