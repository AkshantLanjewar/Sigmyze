using SigmyzeServer.Models.User;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

public interface ITokenService
{
    string BuildToken(string key, string issuer, User user);
    bool IsTokenValid(string key, string issuer, string token);
}

public class TokenService : ITokenService
{
    private const double EXPIRY_DURATION_MINUTES = 240;

    public string BuildToken(string key, string issuer, User user)
    {
        var claims = new[] {
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.Sid, user.Lunar_ID)
        };

        var securityKey     = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var credentials     = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);
        var tokenDescriptor = new JwtSecurityToken(issuer, issuer, claims, 
            expires : DateTime.Now.AddMinutes(EXPIRY_DURATION_MINUTES), signingCredentials : credentials);
        return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
    }

    public bool IsTokenValid(string key, string issuer, string token)
    {
        var mySecret = Encoding.UTF8.GetBytes(key);
        var myKey    = new SymmetricSecurityKey(mySecret);

        var tokenHandler = new JwtSecurityTokenHandler();
        try
        {
            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                ValidateIssuer           = true,
                ValidateAudience         = true,
                ValidIssuer              = issuer,
                ValidAudience            = issuer,
                IssuerSigningKey         = myKey
            }, out SecurityToken validatedToken);
        }
        catch
        {
            return false;
        }

        return true;
    }
}