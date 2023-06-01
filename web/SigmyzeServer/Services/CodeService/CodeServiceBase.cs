using MongoDB.Driver;
using SigmyzeServer.Models.ApplicationServices.Code;

namespace SigmyzeServer.Services;

public interface ICodeRepository
{
    //CodeServiceQuanta.cs
    Task<QuantaSuppository> GetQuantaSuppository(string quantaId);
    //CodeServiceQuanta.cs
    Task CreateQuantaSuppositoryProject(string quantaId, string title, string projectId);
    //CodeServiceQuanta.cs
    Task DeleteQuantaSuppositoryProject(string quantaId, string codeId);
    //CodeServiceCode.cs
    Task<CodeFilesystem?> GetCode(string codeId);
}

public partial class CodeRepository : ICodeRepository
{
    private readonly IMongoCollection<QuantaSuppository> _quantaSuppositoryCollection;
    private readonly IMongoCollection<CodeProject> _codeProjects;

    public CodeRepository(IMongoClient mongoClient)
    {
        var codeDatabase = mongoClient.GetDatabase("Sigmyze::Code");

        _quantaSuppositoryCollection = codeDatabase.GetCollection<QuantaSuppository>("quanta::supository");
        _codeProjects = codeDatabase.GetCollection<CodeProject>("quanta::code");
    }
}