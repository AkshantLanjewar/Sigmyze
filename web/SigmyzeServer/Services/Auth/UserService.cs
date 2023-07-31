using SigmyzeServer.Models.User;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SigmyzeServer.Services.DatabaseServices;

namespace SigmyzeServer.Services.Auth
{
    public interface IUserService
    {
        Task<AuthResp> Authenticate(LoginPost data, string? ipAddress);
        Task<AuthResp> RefreshToken(string token, string? ipAddress);
        Task<bool> RevokeToken(string token, string? ipAddress);
        string generateJwtToken(User user);
        (User user, string token) Register(User data, string? ipAddress);
    }

    public class UserService : IUserService
    {
        private readonly IUserAuth _authService;
        private readonly IHashService _hashService;
        private readonly IConfiguration _configuration;

        public UserService(IUserAuth authService, IHashService hashService, IConfiguration configuration)
        {
            _authService   = authService;
            _hashService   = hashService;
            _configuration = configuration;
        }

        private AuthResp badAuth(string msg)
        {
            AuthResp resp   = new AuthResp();
            resp.Message    = msg;
            resp.Authorized = false;
            return resp;
        }

        public async Task<AuthResp> Authenticate(LoginPost data, string? ipAddress)
        {
            AuthResp resp = new AuthResp();
            User? pUser   = await _authService.GetAsyncEmail(data.Email);
            if(pUser == null)
                return badAuth("user_dne");

            string? hashed = _hashService.HashPassword(data.Password, pUser.Salt);
            if(hashed != pUser.Password)
                return badAuth("pwd_bad");

            var token          = generateJwtToken(pUser);
            var refreshToken   = generateRefreshToken(ipAddress);
            pUser.RefreshToken = refreshToken;
            await _authService.UpdateAsync(pUser.LunarId, pUser);

            resp.Authorized   = true;
            resp.Message      = "auth";
            resp.Token        = token;
            resp.RefreshToken = refreshToken.Token;
            resp.Verified     = pUser.Verified;
            resp.Role         = pUser.Role;

            return resp;
        }

        public (User user, string token) Register(User data, string? ipAddress)
        {   
            var token         = generateJwtToken(data);
            var refreshToken  = generateRefreshToken(ipAddress);
            data.RefreshToken = refreshToken;

            return (data, token);
        }

        public async Task<AuthResp> RefreshToken(string token, string? ipAddress)
        {
            AuthResp resp = new AuthResp();
            User? pUser   = await _authService.GetAsyncToken(token);
            if(pUser == null)
                return badAuth("token_dne");
            if(!pUser.RefreshToken.IsActive)
                return badAuth("token_n_active");

            var newRefreshToken = generateRefreshToken(ipAddress);
            pUser.RefreshToken  = newRefreshToken;
            await _authService.UpdateAsyncToken(token, pUser);

            var jwtToken      = generateJwtToken(pUser);
            resp.Authorized   = true;
            resp.Token        = jwtToken;
            resp.Verified     = pUser.Verified;
            resp.RefreshToken = newRefreshToken.Token;

            return resp;
        }

        public async Task<bool> RevokeToken(string token, string? ipAddress)
        {
            User? pUser = await _authService.GetAsyncToken(token);
            if(pUser == null) return false;
            if(pUser.RefreshToken.IsActive == false) return false;

            pUser.RefreshToken.Revoked     = DateTime.UtcNow;
            pUser.RefreshToken.RevokedByIp = ipAddress;
            await _authService.UpdateAsyncToken(token, pUser);

            return true;
        }

        public string generateJwtToken(User user)
        {
            var tokenHandler    = new JwtSecurityTokenHandler();
            var key             = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim("Lunar_Id", user.LunarId),
                    new Claim("Verified", user.Verified),
                    new Claim("Email", user.EMail),
                    new Claim("Username", user.Username),
                    new Claim("Role", user.Role)
                }),
                Expires = DateTime.UtcNow.AddMinutes(120),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        private RefreshToken? generateRefreshToken(string? ipAddress)
        {
            using (var rngCryptoServiceProvider = new RNGCryptoServiceProvider())
            {
                var randomBytes = new byte[64];
                rngCryptoServiceProvider.GetBytes(randomBytes);
                return new RefreshToken
                {
                    Token       = Convert.ToBase64String(randomBytes),
                    Expires     = DateTime.UtcNow.AddDays(7),
                    Created     = DateTime.UtcNow,
                    CreatedByIp = ipAddress
                };
            }
        }
    }
}