namespace Test.Lunar;

using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using Moq;
using Newtonsoft.Json;
using SharpCompress.Common;
using SigmyzeServer.Models.Lunar;
using Xunit.Abstractions;

public class ServiceMockedData
{
    //this is the mocked mongodb client we are going to generate
    private Mock<IMongoClient> mongoClient;

    //this is the mocked database for the lunar documents
    private Mock<IMongoDatabase> mongoDb;

    //this is the collection of lunar documents
    private Mock<IMongoCollection<LunarDocument>> documentCollection;

    //this is the list of documents that the mocked object is initiated with
    private List<LunarDocument> documents;

    //cursor for the documents
    private Mock<IAsyncCursor<LunarDocument>> documentCursor;

    //collection name for the documents
    private const string COLLECTION_NAME = "lunar_documents";

    //initialization function where we load in the required documents
    public ServiceMockedData(LunarDocument[] _documents, ITestOutputHelper? output = null)
    {
        this.mongoClient = new Mock<IMongoClient>();
        this.documentCollection = new Mock<IMongoCollection<LunarDocument>>();
        this.mongoDb = new Mock<IMongoDatabase>();
        this.documentCursor = new Mock<IAsyncCursor<LunarDocument>>();
        this.documents = _documents.ToList();

        this.InitializeMongoCollection(output);
    }

    //this is the private function that initializes the database
    private void InitMongoDB()
    {
        //first setup the DB
        this.mongoDb.Setup(x => x.GetCollection<LunarDocument>(COLLECTION_NAME, default))
            .Returns(this.documentCollection.Object);

        //now we setup the client
        this.mongoClient.Setup(x => x.GetDatabase(It.IsAny<string>(),
            default)).Returns(this.mongoDb.Object);
    }

    //this is a private function that generates a findasync cursor
    private IAsyncCursor<LunarDocument> InitFindAsyncCursor(List<LunarDocument> results)
    {
        Mock<IAsyncCursor<LunarDocument>> findCursor = new Mock<IAsyncCursor<LunarDocument>>();
        
        //loads the results
        findCursor.Setup(x => x.Current).Returns(results);
        //sets up the sequence moveNext
        findCursor.SetupSequence(x => x.MoveNext(It.IsAny<CancellationToken>()))
            .Returns(true).Returns(false);
        //sets up the moveNextAsync
        findCursor.SetupSequence(x => x.MoveNextAsync(It.IsAny<CancellationToken>()))
            .Returns(Task.FromResult(true)).Returns(Task.FromResult(false));

        //set up the FirstOrDefaultAsync function

        return findCursor.Object;
    }

    
    //this is the private function that initializes the collection
    private void InitializeMongoCollection(ITestOutputHelper? output = null)
    {
        //the setup methods for the cursor

        //loads the documents
        this.documentCursor.Setup(x => x.Current).Returns(this.documents);

        //set's up the sequence moveNext
        this.documentCursor.SetupSequence(x => x.MoveNext(It.IsAny<CancellationToken>()))
            .Returns(true).Returns(false);

        //setsups the moveNextAsync
        this.documentCursor.SetupSequence(x => x.MoveNextAsync(It.IsAny<CancellationToken>()))
            .Returns(Task.FromResult(true)).Returns(Task.FromResult(false));
        
        //setting up the collection methods
        
        //this is the method for aggregate async
        this.documentCollection.Setup(x => x.AggregateAsync(It.IsAny<PipelineDefinition<LunarDocument, LunarDocument>>(),
            It.IsAny<AggregateOptions>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(this.documentCursor.Object);

        //this is the method for FindAsync
        this.documentCollection.Setup(x => x.FindAsync(
            It.IsAny<FilterDefinition<LunarDocument>>(),
            It.IsAny<FindOptions<LunarDocument, LunarDocument>>(),
            It.IsAny<CancellationToken>()
        )).ReturnsAsync((FilterDefinition<LunarDocument> filter, FindOptions<LunarDocument, LunarDocument> f, CancellationToken t) => 
        {
            //first convert object to document filter
            IBsonSerializerRegistry? serializerRegistry = MongoDB.Bson.Serialization.BsonSerializer.SerializerRegistry;
            var documentSerializer = serializerRegistry.GetSerializer<LunarDocument>();
            string jsonFilter = filter.Render(documentSerializer, serializerRegistry).ToJson();

            LunarDocumentFilter? parsedFilter = JsonConvert.DeserializeObject<LunarDocumentFilter>(jsonFilter);
            if(parsedFilter == null)
                return InitFindAsyncCursor(new List<LunarDocument>());

            List<LunarDocument> matchedDocuments = new List<LunarDocument>();
            for(int i = 0; i < this.documents.Count; i++)
            {
                LunarDocument document = this.documents[i];
                if(parsedFilter.Matches(document))
                    matchedDocuments.Add(document);
            }

            return InitFindAsyncCursor(matchedDocuments);
        }); 

        //this is the method for InsertOneAsync
        this.documentCollection.Setup(x => x.InsertOneAsync(
            It.IsAny<LunarDocument>(),
            It.IsAny<InsertOneOptions>(),
            It.IsAny<CancellationToken>()
        )).Returns((LunarDocument newDocument, InsertOneOptions o, CancellationToken t) =>
        {
            this.documents.Add(newDocument);
            return Task.FromResult(true);
        });

        //this is the method for DeleteOneAsync
        this.documentCollection.Setup(x => x.DeleteOneAsync(
            It.IsAny<FilterDefinition<LunarDocument>>(),
            It.IsAny<CancellationToken>()
        )).Callback((FilterDefinition<LunarDocument> filter, CancellationToken c) => 
        {
            //first convert object to document filter
            IBsonSerializerRegistry? serializerRegistry = MongoDB.Bson.Serialization.BsonSerializer.SerializerRegistry;
            var documentSerializer = serializerRegistry.GetSerializer<LunarDocument>();
            string jsonFilter = filter.Render(documentSerializer, serializerRegistry).ToJson();

            LunarDocumentFilter? parsedFilter = JsonConvert.DeserializeObject<LunarDocumentFilter>(jsonFilter);
            if(parsedFilter == null)
                return;

            List<LunarDocument> newDocuments = new List<LunarDocument>();
            for(int i = 0; i < this.documents.Count; i++)
            {
                LunarDocument document = this.documents[i];
                if(parsedFilter.Matches(document))
                    continue;

                newDocuments.Add(document);
            }

            this.documents = newDocuments;
        });

        this.InitMongoDB();
    }

    public IMongoClient GetClient()
    {
        return this.mongoClient.Object;
    }
}
