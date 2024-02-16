using MongoDB.Driver;
using SigmyzeServer.Models.Lunar;

namespace SigmyzeServer.Services.Web.Lunar;

public partial class LunarRefreshService
{
    public async Task UpdateFileTree(string organizationId, string projectId, SimpleFilesystem newFileTree)
    {
        //first we have to validate the filesystem
        if(newFileTree.ShallowValidate() == false)
            return;

        var projectIdFilter = Builders<LunarDocument>.Filter
            .Eq(x => x.ProjectId, projectId);
        
        var organizationIdFilter = Builders<LunarDocument>.Filter
            .Eq(x => x.OrganizationId, organizationId);

        var filter = Builders<LunarDocument>.Filter.And(projectIdFilter, organizationIdFilter);

        var update = Builders<LunarDocument>.Update
            .Set(x => x.Filesystem, newFileTree);

        await _collection.UpdateOneAsync(filter, update);
    }

    public async Task UpdateChart(string organizationId, string projectId, List<LunarChart> newCharts)
    {
        //first we validate the charts
        for(int i = 0; i < newCharts.Count; i++)
            if(newCharts[i].Validate() == false)
                return;

        var projectIdFilter = Builders<LunarDocument>.Filter
            .Eq(x => x.ProjectId, projectId);
        
        var organizationIdFilter = Builders<LunarDocument>.Filter
            .Eq(x => x.OrganizationId, organizationId);

        var filter = Builders<LunarDocument>.Filter.And(projectIdFilter, organizationIdFilter);

        var update = Builders<LunarDocument>.Update
            .Set(x => x.Charts, newCharts);

        await _collection.UpdateOneAsync(filter, update);
    }

    public async Task UpdateNote(string organizationId, string projectId, List<LunarNote> newNotes)
    {
        //first we validate the notes
        for(int i = 0; i < newNotes.Count; i++)
            if(newNotes[i].Validate() == false)
                return;

        var projectIdFilter = Builders<LunarDocument>.Filter
            .Eq(x => x.ProjectId, projectId);
        
        var organizationIdFilter = Builders<LunarDocument>.Filter
            .Eq(x => x.OrganizationId, organizationId);

        var filter = Builders<LunarDocument>.Filter.And(projectIdFilter, organizationIdFilter);

        var update = Builders<LunarDocument>.Update
            .Set(x => x.Notes, newNotes);

        await _collection.UpdateOneAsync(filter, update);
    }

    public async Task UpdateName(string organizationId, string projectId, string name)
    {
        var projectIdFilter = Builders<LunarDocument>.Filter
            .Eq(x => x.ProjectId, projectId);
        
        var organizationIdFilter = Builders<LunarDocument>.Filter
            .Eq(x => x.OrganizationId, organizationId);

        var filter = Builders<LunarDocument>.Filter.And(projectIdFilter, organizationIdFilter);

        var update = Builders<LunarDocument>.Update
            .Set(x => x.ProjectName, name);

        await _collection.UpdateOneAsync(filter, update);
    }
}