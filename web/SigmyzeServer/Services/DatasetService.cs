using MongoDB.Driver;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using SigmyzeServer.Models.Data;

namespace SigmyzeServer.Services
{
    public interface IDatasetMongoORM
    {
        List<string> GetDatasets();
        List<DatasetObject> ProcessedObjects(string dataset);
        DatasetIndicator GetIndicator(string dataset, string object_id, string indicator_id);
        DatasetCollection GetObject(string dataset, string object_id);
        List<string> Categories(string dataset);
    }
    public class DatasetMongoORM : IDatasetMongoORM
    {
        private List<string> _datasets;
        private IMongoDatabase _database;

        public DatasetMongoORM()
        {
            var mongoClient = new MongoClient("mongodb+srv://root:root@cluster0.sbwn1.mongodb.net");
            var mongoDatabase = mongoClient.GetDatabase("SigmyzeData");

            List<string> datasets = new List<string>();
            foreach(BsonDocument collection in mongoDatabase.ListCollectionsAsync().Result.ToListAsync<BsonDocument>().Result)
            {
                string name = collection["name"].AsString;
                datasets.Add(name);
            }

            _datasets = datasets;
            _database = mongoDatabase;
        }

        public List<string> GetDatasets()
        {
            return _datasets;
        }

        public List<DatasetObject> ProcessedObjects(string dataset)
        {
            List<DatasetObject> objects = new List<DatasetObject>();
            IMongoCollection<BsonDocument> collection = _database.GetCollection<BsonDocument>(dataset);
            List<BsonDocument> documents = collection.Find(new BsonDocument()).ToList();

            for(int i = 0; i < documents.Count; i++)
            {
                BsonDocument document  = documents[i];

                string object_id       = document["object_id"].AsString;
                if(object_id == "metadata")
                    continue;
                string object_fullname = document["object_fullname"].AsString;

                DatasetObject obj = new DatasetObject();
                obj.ObjectID = object_id;
                obj.ObjectFullname = object_fullname;
                objects.Add(obj);
            }

            return objects;
        }

        public List<string> Categories(string dataset)
        {
            List<string> categories = new List<string>();
            IMongoCollection<BsonDocument> collection = _database.GetCollection<BsonDocument>(dataset);
            BsonDocument metadataDocument = collection.Find(Builders<BsonDocument>.Filter.Eq("object_id", "metadata")).FirstOrDefault();

            List<BsonValue> bsonCategories = metadataDocument["categories"].AsBsonArray.ToList();
            for(int i = 0; i < bsonCategories.Count; i++)
                categories.Add(bsonCategories[i].AsString);

            return categories;
        }

        public DatasetCollection GetObject(string dataset, string object_id)
        {
            IMongoCollection<BsonDocument> collection = _database.GetCollection<BsonDocument>(dataset);
            BsonDocument document                     = collection.Find(Builders<BsonDocument>.Filter.Eq("object_id", object_id)).FirstOrDefault();

            DatasetCollection obj = BsonSerializer.Deserialize<DatasetCollection>(document);
            return obj;
        }

        public DatasetIndicator GetIndicator(string dataset, string object_id, string indicator_id)
        {
            DatasetIndicator indicator_object = new DatasetIndicator();
            IMongoCollection<DatasetCollection> collection = _database.GetCollection<DatasetCollection>(dataset);
            DatasetCollection document = collection.Find(x => x.ObjectID == object_id).FirstOrDefault();

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