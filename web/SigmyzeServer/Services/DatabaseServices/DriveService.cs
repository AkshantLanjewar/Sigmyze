using Microsoft.Extensions.Options;
using MongoDB.Driver;
using SigmyzeServer.Models.User;
using SigmyzeServer.Models.UserData;

namespace SigmyzeServer.Services.DatabaseServices
{
    public interface IDriveService
    {
        Task<Drive> GetDrive(string lunarId);
        Task SaveDrive(string lunarId, Drive nDrive);
    }

    public class DriveMongoOrm : IDriveService
    {
        private readonly IMongoCollection<Drive> _driveCollection;

        public DriveMongoOrm(IOptions<AuthDatabaseSettings> authDatabaseSettings)
        {
            var mongoClient   = new MongoClient(authDatabaseSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(authDatabaseSettings.Value.DatabaseName);
            _driveCollection  = mongoDatabase.GetCollection<Drive>("userDrives");
        }

        public async Task<Drive> GetDrive(string lunarId)
        {
            Drive? tDrive = await _driveCollection.Find(x => x.Lunar_ID == lunarId).FirstOrDefaultAsync();
            if(tDrive == null)
                tDrive = await CreateDrive(lunarId);

            return tDrive;
        }

        public async Task SaveDrive(string lunarId, Drive nDrive)
        {
            await _driveCollection.ReplaceOneAsync(x => x.Lunar_ID == lunarId, nDrive);
        }

        private async Task<Drive> CreateDrive(string lunarId)
        {
            Drive drive                  = new Drive();
            drive.Lunar_ID               = lunarId;
            drive.Folders                = new List<Folder>();
            drive.RecentlyEditedProjects = new List<Project>();
            drive.Projects               = new List<Project>();

            await _driveCollection.InsertOneAsync(drive);

            return drive;
        }
    }
}