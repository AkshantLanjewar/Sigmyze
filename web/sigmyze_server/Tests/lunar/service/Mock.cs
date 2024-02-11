using MongoDB.Driver;
using Moq;
using SigmyzeServer.Models.Lunar;

namespace Test.Lunar;


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
    public ServiceMockedData(LunarDocument[] documents)
    {
        this.mongoClient = new Mock<IMongoClient>();
        this.documentCollection = new Mock<IMongoCollection<LunarDocument>>();
        this.mongoDb = new Mock<IMongoDatabase>();
        this.documentCursor = new Mock<IAsyncCursor<LunarDocument>>();
        this.documents = documents.ToList();
        
        this.InitializeMongoCollection();
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
    
    //this is the private function that initializes the collection
    private void InitializeMongoCollection()
    {
        this.documentCursor.Setup(x => x.Current).Returns(this.documents);
        this.documentCursor.SetupSequence(x => x.MoveNext(It.IsAny<CancellationToken>()))
            .Returns(true).Returns(false);
        this.documentCursor.SetupSequence(x => x.MoveNextAsync(It.IsAny<CancellationToken>()))
            .Returns(Task.FromResult(true)).Returns(Task.FromResult(false));
        this.documentCollection.Setup(x => x.AggregateAsync(It.IsAny<PipelineDefinition<LunarDocument, LunarDocument>>(),
            It.IsAny<AggregateOptions>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(this.documentCursor.Object);

        this.InitMongoDB();
    }

    public IMongoClient GetClient()
    {
        return this.mongoClient.Object;
    }
}