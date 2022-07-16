using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SigmyzeServer.Models.User;
using SigmyzeServer.Models.API;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using SigmyzeServer.Services;
using SigmyzeServer.Services.Auth;
using System.IdentityModel.Tokens.Jwt;

namespace SigmyzeServer.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/v{version:apiVersion}/auth")]
    [ApiVersion("1.0")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly IUserService _userService;
        private readonly IUserAuth _userAuth;
        private readonly IHashService _hashService;
        private readonly IEmailService _emailService;
        private string generatedToken = null;

        public AuthController(
            IConfiguration config, IUserAuth userAuth, IUserService userService, IHashService hashService, IEmailService emailService)
        {
            _config         = config;
            _userAuth       = userAuth;
            _userService    = userService;
            _hashService    = hashService;
            _emailService   = emailService;
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
        [AllowAnonymous]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> AuthControllerRoot()
        {
            APIStatusMsg status = new APIStatusMsg();
            status.Error = false;
            status.MSG   = "Auth working";

            return await SerializeJSON(status);
        }

        [HttpGet("user-data")]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> GetUserData()
        {
            UserDataResp resp  = new UserDataResp();
            string accessToken = await HttpContext.GetTokenAsync("access_token");

            var handler     = new JwtSecurityTokenHandler();
            var jwt         = handler.ReadJwtToken(accessToken);
            string username = jwt.Claims.First(claim => claim.Type == "Username").Value.ToString();
            string email    = jwt.Claims.First(claim => claim.Type == "Email").Value.ToString();
            string verified = jwt.Claims.First(claim => claim.Type == "Verified").Value.ToString();
            string role     = jwt.Claims.First(claim => claim.Type == "Role").Value.ToString();
            
            resp.EMail    = email;
            resp.Role     = role;
            resp.Username = username;
            resp.Verified = verified;

            return await SerializeJSON(resp);
        }

        [AllowAnonymous]
        [HttpPost("login")]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> AuthLogin([FromBody]LoginPost data)
        {
            AuthResp resp = await _userService.Authenticate(data, ipAddress());
            if(resp.Authorized)
                setTokenCookie(resp.RefreshToken);

            return await SerializeJSON(resp);
            
        }

        [AllowAnonymous]
        [HttpPost("register")]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> Register([FromBody]RegisterPost data)
        {
            RegisterResp resp = new RegisterResp();
            User? pUser       = await _userAuth.GetAsyncEmail(data.Email);
            if(pUser != null)
                return await SerializeJSON(BadResp("user_exists"));

            User aUser = new User();
            aUser.EMail             = data.Email;
            aUser.Username          = data.Username;
            aUser.Lunar_ID          = Guid.NewGuid().ToString();
            aUser.VerificationToken = Guid.NewGuid().ToString();
            aUser.Role              = "User";
            aUser.Verified          = "no";

            if(data.Email == "akshant.lanjewar@gmail.com")
                aUser.Role = "Admin";
            
            //salt and hash password
            string salt = _hashService.GenerateSalt(128);
            string pwd  = _hashService.HashPassword(data.Password, salt);

            aUser.Password = pwd;
            aUser.Salt     = salt;

            //generate the token
            var tokens = _userService.Register(aUser, ipAddress());
            aUser      = tokens.user;
            var token  = tokens.token;

            await _userAuth.CreateAsync(aUser);
            resp.Token      = token;
            resp.Registered = true;
            setTokenCookie(aUser.RefreshToken.Token);
            await _emailService.SendVerificationEmail(aUser.VerificationToken, aUser.EMail, aUser.Username);            

            return await SerializeJSON(resp);
        }

        [HttpPost("refresh-token")]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            AuthResp resp    = await _userService.RefreshToken(refreshToken, ipAddress());
            if(resp.Authorized)
                setTokenCookie(resp.RefreshToken);

            return await SerializeJSON(resp);
        }

        [HttpPost("revoke-token")]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> RevokeToken()
        {
            LogoutResp resp = new LogoutResp();
            var token       = Request.Cookies["refreshToken"];
            if(String.IsNullOrEmpty(token))
            {
                resp.LoggedOut = false;
                resp.Message   = "need_token";
                return await SerializeJSON(resp);
            }

            var response = await _userService.RevokeToken(token, ipAddress());
            if(!response)
            {
                resp.LoggedOut = false;
                resp.Message   = "bad_token";
                return await SerializeJSON(resp);
            }

            resp.LoggedOut = true;
            return await SerializeJSON(resp);
        }

        [HttpPost("verify")]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> Verify([FromBody]VerifyPost data)
        {
            VerifyResp resp = new VerifyResp();
            string lunarID  = GetLunarID(data.Token);
            User? pUser     = await _userAuth.GetAsync(lunarID);
            
            if(pUser == null)
                return await SerializeJSON(BadVerifyResp("user_dne"));
            if(pUser.Verified == "yes")
                return await SerializeJSON(BadVerifyResp("alr_verified"));
            if(pUser.VerificationToken != data.Code)
                return await SerializeJSON(BadVerifyResp("no_match"));

            pUser.Verified = "yes";

            string nToken = _userService.generateJwtToken(pUser);
            await _userAuth.UpdateAsync(pUser.Lunar_ID, pUser);

            resp.Verified = true;
            resp.Token    = nToken;
            return await SerializeJSON(resp);
        }

        [HttpPost("resend-verification")]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> ResendVerification([FromBody]ResendPost data)
        {
            ResendResp resp = new ResendResp();
            string token    = data.Token;
            string Lunar_id = GetLunarID(token);

            User pUser   = await _userAuth.GetAsync(Lunar_id);
            string email = pUser.EMail;
            string code  = pUser.VerificationToken;
            string name  = pUser.Username;

            await _emailService.SendVerificationEmail(code, email, name);
            resp.Resent = true;

            return await SerializeJSON(resp);
        }

        private void setTokenCookie(string token)
        {
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires  = DateTime.UtcNow.AddDays(7)
            };

            Response.Cookies.Append("refreshToken", token, cookieOptions);
        }

        private string ipAddress()
        {
            if(Request.Headers.ContainsKey("X-Forwarded-For"))
                return Request.Headers["X-Forwarded-For"];
            else
                return HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
        }

        private RegisterResp BadResp(string msg)
        {
            RegisterResp resp = new RegisterResp();
            resp.Registered   = false;
            resp.Message      = msg;

            return resp;
        }

        private VerifyResp BadVerifyResp(string msg)
        {
            VerifyResp resp = new VerifyResp();
            resp.Verified   = false;
            resp.Message    = msg;

            return resp;
        }

        private string GetLunarID(string token)
        {
            var handler    = new JwtSecurityTokenHandler();
            var jwt        = handler.ReadJwtToken(token);
            string lunarID = jwt.Claims.First(claim => claim.Type == "Lunar_Id").Value.ToString();

            return lunarID;
        }
    }
}