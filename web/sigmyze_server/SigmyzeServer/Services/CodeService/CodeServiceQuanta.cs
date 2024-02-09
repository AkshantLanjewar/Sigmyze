using MongoDB.Driver;
using SigmyzeServer.Models.ApplicationServices.Code;

namespace SigmyzeServer.Services;

public partial class CodeRepository
{
    public async Task<QuantaSuppository> GetQuantaSuppository(string quantaId)
    {
        QuantaSuppository? suppository = await _quantaSuppositoryCollection
            .Find(x => x.QuantaId == quantaId).FirstOrDefaultAsync();

        if(suppository == null)
        {
            suppository = new QuantaSuppository();
            suppository.QuantaId = quantaId;
            suppository.Items = new List<SuppositoryItems>();

            await _quantaSuppositoryCollection.InsertOneAsync(suppository);
        }

        return suppository;
    }

    public async Task CreateQuantaSuppositoryProject(string quantaId, string title, string projectId)
    {
        SuppositoryItems newItem = new SuppositoryItems();
        newItem.CodeId = Guid.NewGuid().ToString();
        newItem.Short = title;
        newItem.ShortId = projectId;

        //insert into the suppository collection
        var filter = Builders<QuantaSuppository>.Filter.Eq("quanta_id", quantaId);
        var update = Builders<QuantaSuppository>.Update
            .Push<SuppositoryItems>(e => e.Items, newItem);

        await _quantaSuppositoryCollection.FindOneAndUpdateAsync(filter, update);

        //now we create the actual code definition for the project
        //using the default typescript-react template since no other ones exist
        string template_locaition = "./data/templates/quanta-react-ts";
        CodeFilesystem internal_system = TemplateWalk(template_locaition);

        CodeProject newProject = new CodeProject();
        newProject.CodeId = newItem.CodeId;
        newProject.Filesystem = internal_system;

        await _codeProjects.InsertOneAsync(newProject);
    }

    public async Task DeleteQuantaSuppositoryProject(string quantaId, string codeId)
    {
        //update the suppository collection
        var filter = Builders<QuantaSuppository>.Filter.Eq(q => q.QuantaId, quantaId);
        var result = Builders<QuantaSuppository>.Update.PullFilter(
            p => p.Items,
            f => f.CodeId == codeId
        );

        await _quantaSuppositoryCollection.FindOneAndUpdateAsync(filter, result);

        //delete the actual code repo
        var codeFilter = Builders<CodeProject>.Filter.Eq(q => q.CodeId, codeId);
        await _codeProjects.DeleteOneAsync(codeFilter);
    }
}