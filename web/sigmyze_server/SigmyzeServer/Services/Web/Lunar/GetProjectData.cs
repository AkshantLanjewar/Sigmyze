using MongoDB.Driver;
using SigmyzeServer.Models.Lunar;

namespace SigmyzeServer.Services.Web.Lunar;

public partial class LunarRefreshService 
{
    public async Task<LunarProjectData?> GetProjectData(string organizationId, string projectId)
    {
        LunarDocument? document = await _collection.Find(x => x.OrganizationId == organizationId && x.ProjectId == projectId)
            .FirstOrDefaultAsync();
        if(document == null || document.Validate() == false)
            return null;

        LunarProjectData projectData = new LunarProjectData
        {
            Filesystem = document.Filesystem,
            Notes = document.Notes!,
            Charts = document.Charts!
        };

        return projectData;
    }
}