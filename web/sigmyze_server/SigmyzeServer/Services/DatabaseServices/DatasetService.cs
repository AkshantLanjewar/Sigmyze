using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using SigmyzeServer.Models.API;
using SigmyzeServer.Models.Data;
using SigmyzeServer.Models.User;

namespace SigmyzeServer.Services.DatabaseServices
{
    public interface IDatasetMongoOrm
    {
        List<Dataset> GetDatasets();
        Task<List<string>?> ProcessedObjects(string dataset);
        Task<DatasetIndicator> GetIndicator(string dataset, string object_id, string indicator_id);
        Task<DatasetCollection> GetObject(string dataset, string object_id);
        Task<List<string>> Categories(string dataset);
        Task<List<DatasetObject>> ProcessedObjectsDetailed(string dataset);
    }
    public class DatasetMongoOrm : IDatasetMongoOrm
    {
        private readonly List<Dataset> _datasets;
        private readonly Dictionary<string, IMongoCollection<BsonDocument>> _collectionMap;
        private readonly Dictionary<string, IMongoCollection<DatasetCollection>> _collectionObjMap;
        private IMongoDatabase _database;

        public DatasetMongoOrm(IOptions<AuthDatabaseSettings> authDatabaseSettings)
        {
            var mongoClient   = new MongoClient(authDatabaseSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase("SigmyzeData");
            _collectionMap    = new Dictionary<string, IMongoCollection<BsonDocument>>();
            _collectionObjMap = new Dictionary<string, IMongoCollection<DatasetCollection>>();

            List<Dataset> datasets = new List<Dataset>();
            foreach(BsonDocument collection in mongoDatabase.ListCollectionsAsync().Result.ToListAsync<BsonDocument>().Result)
            {
                string name = collection["name"].AsString;
                IMongoCollection<BsonDocument> col            = mongoDatabase.GetCollection<BsonDocument>(name);
                IMongoCollection<DatasetCollection> mappedCol = mongoDatabase.GetCollection<DatasetCollection>(name);

                var keys  = Builders<BsonDocument>.IndexKeys.Ascending("object_id");
                var mKeys = Builders<DatasetCollection>.IndexKeys.Ascending(obj => obj.ObjectID); 

                col.Indexes.CreateOne(keys);
                mappedCol.Indexes.CreateOne(mKeys);

                BsonDocument metadata = col.Find(Builders<BsonDocument>.Filter.Eq("object_id", "metadata")).FirstOrDefault();

                Dataset _dataset = new Dataset();
                _dataset.Name    = name;
                

                _collectionMap.Add(_dataset.Name, col);
                _collectionObjMap.Add(_dataset.Name, mappedCol);
                datasets.Add(_dataset);
            }

            _datasets = datasets;
            _database = mongoDatabase;
        }

        public List<Dataset> GetDatasets()
        {
            return _datasets;
        }

        public async Task<List<string>?> ProcessedObjects(string dataset)
        {
            List<DatasetObject> objects                    = new List<DatasetObject>();
            IMongoCollection<DatasetCollection> collection = _collectionObjMap[dataset];
            DatasetCollection document                     = await collection.Find(x => x.ObjectID == "metadata").FirstOrDefaultAsync();

            return document.AddedObjects;
        }

        public async Task<List<DatasetObject>> ProcessedObjectsDetailed(string dataset)
        {
            List<DatasetObject> objects = new List<DatasetObject>();
            IMongoCollection<DatasetCollection> collection = _collectionObjMap[dataset];
            DatasetCollection? document = await collection.Find(x => x.ObjectID == "metadata").FirstOrDefaultAsync();

            if(document == null)
                return objects;
            List<string>? added_objects = document.AddedObjects;
            if(added_objects == null)
                return objects;

            Parallel.For(0, added_objects.Count, count => {
                string added_object = added_objects[count];
                DatasetCollection country = Task.Run(async () => { 
                    return await GetObject(dataset, added_object); 
                }).Result;

                DatasetObject detailedObject = new DatasetObject();
                detailedObject.ObjectID       = country.ObjectID;
                detailedObject.ObjectFullname = country.ObjectFullname;
                detailedObject.ObjectLogo     = country.ObjectLogo;
                objects.Add(detailedObject);
            });

            return objects;
        }

        public async Task<List<string>> Categories(string dataset)
        {
            List<string> categories                   = new List<string>();
            IMongoCollection<BsonDocument> collection = _collectionMap[dataset];
            BsonDocument metadataDocument =  await collection.Find(Builders<BsonDocument>.Filter.Eq("object_id", "metadata")).FirstOrDefaultAsync();

            List<BsonValue> bsonCategories = metadataDocument["categories"].AsBsonArray.ToList();
            for(int i = 0; i < bsonCategories.Count; i++)
                categories.Add(bsonCategories[i].AsString);

            return categories;
        }

        public async Task<DatasetCollection> GetObject(string dataset, string objectId)
        {
            IMongoCollection<BsonDocument> collection = _collectionMap[dataset];
            BsonDocument document                     = await collection.Find(Builders<BsonDocument>.Filter.Eq("object_id", objectId)).FirstOrDefaultAsync();

            DatasetCollection obj = BsonSerializer.Deserialize<DatasetCollection>(document);
            return obj;
        }

        public async Task<DatasetIndicator> GetIndicator(string dataset, string objectId, string indicatorId)
        {
            DatasetIndicator indicatorObject = new DatasetIndicator();
            IMongoCollection<DatasetCollection> collection = _collectionObjMap[dataset];
            DatasetCollection document = await collection.Find(x => x.ObjectID == objectId).FirstOrDefaultAsync();

            for(int i = 0; i < document.Indicators.Count; i++)
            {
                DatasetIndicator tmpIndicator = document.Indicators[i];
                if(tmpIndicator.IndicatorID == indicatorId)
                    indicatorObject = tmpIndicator;
            }

            return indicatorObject;
        }
    }
}