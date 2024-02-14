using MongoDB.Driver;
using SigmyzeServer.Models.Lunar;

namespace SigmyzeServer.Services.Web.Lunar;

public partial class LunarRefreshService 
{
    private LunarDocument GenerateNewDocument(string organizationId, string projectId, string name)
    {
        LunarDocument document = new LunarDocument
        {
            OrganizationId = organizationId,
            ProjectId = projectId,
            ProjectName = name,
            Filesystem = new SimpleFilesystem(),
            Notes = new List<LunarNote>(),
            Charts = new List<LunarChart>()
        };

        document.Filesystem.Files = new List<string>();
        document.Filesystem.Folders = new List<SimpleFolder>();
        return document;
    }

    public async Task<string?> CreateProject(string organizationId, string projectId, string name)
    {
        string documentProjectId = projectId;
        bool generatedProjectIdFlag = false;

        //check to see if there is a document with the same projectId and organizationId
        LunarDocument? matchCheck = await (await _collection.FindAsync(x => x.ProjectId == projectId && x.OrganizationId == organizationId))
            .FirstOrDefaultAsync();

        if(matchCheck != null)
        {
            generatedProjectIdFlag = true;
            documentProjectId = Guid.NewGuid().ToString();
        }

        LunarDocument newDocument = GenerateNewDocument(organizationId, documentProjectId, name);
        await _collection.InsertOneAsync(newDocument);

        return generatedProjectIdFlag ? documentProjectId : null;
    }

    public async Task DeleteProject(string organizationId, string projectId)
    {
        await _collection.DeleteOneAsync(x => x.OrganizationId == organizationId && x.ProjectId == projectId);
    }
}