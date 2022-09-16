using MongoDB.Driver;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;

using SigmyzeServer.Models.User;
using Microsoft.Extensions.Options;
using SigmyzeServer.Models.UserData;

namespace SigmyzeServer.Services
{
    public interface IDriveService
    {
        Task<Drive> GetDrive(string lunar_id);
    }

    public class DriveMongoORM : IDriveService
    {
        private IMongoCollection<Drive> _driveCollection;

        public DriveMongoORM(IOptions<AuthDatabaseSettings> authDatabaseSettings)
        {
            var mongoClient   = new MongoClient(authDatabaseSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(authDatabaseSettings.Value.DatabaseName);
            _driveCollection  = mongoDatabase.GetCollection<Drive>("userDrives");
        }

        public async Task<Drive> GetDrive(string lunar_id)
        {
            Drive? _tDrive = await _driveCollection.Find(x => x.Lunar_ID == lunar_id).FirstOrDefaultAsync();
            if(_tDrive == null)
                _tDrive = await CreateDrive(lunar_id);

            return _tDrive;
        }

        private async Task<Drive> CreateDrive(string lunar_id)
        {
            Drive _drive                  = new Drive();
            _drive.Lunar_ID               = lunar_id;
            _drive.Folders                = new List<Folder>();
            _drive.RecentlyEditedProjects = new List<Project>();
            _drive.Projects               = new List<Project>();

            await _driveCollection.InsertOneAsync(_drive);

            return _drive;
        }
    }
}