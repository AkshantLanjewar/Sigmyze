using System.Security.Cryptography;

namespace SigmyzeServer.Services.Auth
{
    public interface IHashService
    {
        string? GenerateSalt(int nSalt);
        string? HashPassword(string pwd, string? salt, int nIter = 400913, int nHash = 512);
    }

    public class HashService : IHashService
    {
        private const int ITER = 400913;
        private const int N_HASH = 512;
        public string? GenerateSalt(int nSalt)
        {
            var saltBytes = new byte[nSalt];
            using (var provider = new RNGCryptoServiceProvider())
            {
                provider.GetNonZeroBytes(saltBytes);
            }

            return Convert.ToBase64String(saltBytes);
        }

        public string? HashPassword(string pwd, string? salt, int nIter = ITER, int nHash = N_HASH)
        {
            var saltBytes = Convert.FromBase64String(salt);
            using(var rfc = new Rfc2898DeriveBytes(pwd, saltBytes, nIter))
            {
                return Convert.ToBase64String(rfc.GetBytes(nHash));
            }            
        }
    }
}