using MongoDB.Driver;
using SigmyzeServer.Models.ApplicationServices;

namespace SigmyzeServer.Services.OrganizationServices;

public interface IUserServiceRepository
{
    Task<List<UserServiceIndex>> GetAllAsync();
    Task<UserServiceIndex?> GetUserService(string user_id);
    Task UpdateUserService(string user_id, UserServiceIndex nUserService);
    Task InsertUserService(UserServiceIndex nUserService);
    Task DeleteUserService(string user_id);
}

public class UserServiceRepository : IUserServiceRepository
{
    private readonly IMongoCollection<UserServiceIndex> _userServiceCollection;
    public UserServiceRepository(IMongoClient mongoClient)
    {
        var mongoDatabse = mongoClient.GetDatabase("SigmyzeOrganizations");
        _userServiceCollection = mongoDatabse.GetCollection<UserServiceIndex>("user_services");
    }

    //FEATURE: This retreives all the user service index's from the collection
    public async Task<List<UserServiceIndex>> GetAllAsync() =>
        await _userServiceCollection.Find(_ => true).ToListAsync();

    //FEATURE: This retreives the user service index based on the user_id
    public async Task<UserServiceIndex?> GetUserService(string user_id) =>
        await _userServiceCollection.Find(x => x.UserId == user_id).FirstOrDefaultAsync();

    //FEATURE: This updates the userindex based on the user_id
    public async Task UpdateUserService(string user_id, UserServiceIndex nUserService) =>
        await _userServiceCollection.ReplaceOneAsync(x => x.UserId == user_id, nUserService);

    //FEATURE: This creates a new user service index
    public async Task InsertUserService(UserServiceIndex nUserService) =>
        await _userServiceCollection.InsertOneAsync(nUserService);

    //FEATURE: This purges a 

    //FEATURE: This deletes the user index and removes it from all linked organizations
    public async Task DeleteUserService(string user_id)
    {
        UserServiceIndex? userService = await GetUserService(user_id);
        if(userService == null)
            return;

        //TODO: get delete the user and then remove all references from the organiztions
    }   
}