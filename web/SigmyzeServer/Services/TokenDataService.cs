using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SigmyzeServer.Models.User;
using SigmyzeServer.Models.API;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using SigmyzeServer.Services;
using SigmyzeServer.Services.Auth;
using System.IdentityModel.Tokens.Jwt;

namespace SigmyzeServer.Services
{
    public interface ITokenDataService
    {
        string ExtractLunarID(string token);
    }

    public class TokenDataService : ITokenDataService
    {
        public TokenDataService()
        {
            
        }

        public string ExtractLunarID(string token)
        {
            var handler = new JwtSecurityTokenHandler();
            var jwt     = handler.ReadJwtToken(token);  
            string l_id = jwt.Claims.First(claim => claim.Type == "Lunar_Id").Value.ToString();

            return l_id;
        }
    }
}