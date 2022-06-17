using MongoDB.Driver;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;

using SigmyzeServer.Models.API;
using SigmyzeServer.Models.Data;

namespace SigmyzeServer.Services
{
    public interface IDatasetMongoORM
    {
        List<Dataset> GetDatasets();
        Task<List<string>> ProcessedObjects(string dataset);
        Task<DatasetIndicator> GetIndicator(string dataset, string object_id, string indicator_id);
        Task<DatasetCollection> GetObject(string dataset, string object_id);
        Task<List<string>> Categories(string dataset);
    }
    public class DatasetMongoORM : IDatasetMongoORM
    {
        private List<Dataset> _datasets;
        private Dictionary<string, IMongoCollection<BsonDocument>> _collectionMap;
        private Dictionary<string, IMongoCollection<DatasetCollection>> _collectionObjMap;
        private IMongoDatabase _database;

        public DatasetMongoORM()
        {
            var mongoClient   = new MongoClient("mongodb+srv://root:root@cluster0.sbwn1.mongodb.net");
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
                _dataset.Logo    = metadata["logo"].AsString;

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

        public async Task<List<string>> ProcessedObjects(string dataset)
        {
            List<DatasetObject> objects                    = new List<DatasetObject>();
            IMongoCollection<DatasetCollection> collection = _collectionObjMap[dataset];
            DatasetCollection document                     = await collection.Find(x => x.ObjectID == "metadata").FirstOrDefaultAsync();

            return document.AddedObjects;
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

        public async Task<DatasetCollection> GetObject(string dataset, string object_id)
        {
            IMongoCollection<BsonDocument> collection = _collectionMap[dataset];
            BsonDocument document                     = await collection.Find(Builders<BsonDocument>.Filter.Eq("object_id", object_id)).FirstOrDefaultAsync();

            DatasetCollection obj = BsonSerializer.Deserialize<DatasetCollection>(document);
            return obj;
        }

        public async Task<DatasetIndicator> GetIndicator(string dataset, string object_id, string indicator_id)
        {
            DatasetIndicator indicator_object = new DatasetIndicator();
            IMongoCollection<DatasetCollection> collection = _collectionObjMap[dataset];
            DatasetCollection document = await collection.Find(x => x.ObjectID == object_id).FirstOrDefaultAsync();

            for(int i = 0; i < document.Indicators.Count; i++)
            {
                DatasetIndicator _tmpIndicator = document.Indicators[i];
                if(_tmpIndicator.IndicatorID == indicator_id)
                    indicator_object = _tmpIndicator;
            }

            return indicator_object;
        }
    }
}