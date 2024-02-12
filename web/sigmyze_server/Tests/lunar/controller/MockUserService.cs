using MongoDB.Driver;
using MongoDB.Driver.Core.Operations;
using Moq;
using SigmyzeServer.Models.ApplicationServices;
using SigmyzeServer.Services.Auth;

namespace Test.Lunar;

public class LinkedUserServiceMocked
{
    //this is the mongodb client we are going to generate
    private Mock<IMongoClient> mongoClient;

    //this is the mocked database for the organization documents
    private Mock<IMongoDatabase> mongoDb;

    //this is the collection of organization documents
    private Mock<IMongoCollection<UserServiceIndex>> userServiceCollection;

    //this list of user service documents that are filled in
    private List<UserServiceIndex> userServices;

    //cursor for the user service index
    private Mock<IAsyncCursor<UserServiceIndex>> userServiceCursor;

    //collection name
    private const string COLLECTION_NAME = "user_services";

    //initialization function where we load in the documents
    public LinkedUserServiceMocked(UserServiceIndex[] indexs)
    {
        this.mongoClient = new Mock<IMongoClient>();
        this.userServiceCollection = new Mock<IMongoCollection<UserServiceIndex>>();
        this.mongoDb = new Mock<IMongoDatabase>();
        this.userServiceCursor = new Mock<IAsyncCursor<UserServiceIndex>>();
        this.userServices = indexs.ToList();

        //iniitialize the collection here
        InitCollection();
    }

    //this is the private function that initializes the database
    private void InitMongoDB()
    {
        //setup the DB
        this.mongoDb.Setup(x => x.GetCollection<UserServiceIndex>(COLLECTION_NAME, default))
            .Returns(this.userServiceCollection.Object);

        //setup the client
        this.mongoClient.Setup(x => x.GetDatabase(It.IsAny<string>(),
            default)).Returns(this.mongoDb.Object);
    }

    //this is the private function that initializes the collection
    private void InitCollection()
    {
        this.userServiceCursor.Setup(x => x.Current).Returns(this.userServices);
        this.userServiceCursor.SetupSequence(x => x.MoveNext(It.IsAny<CancellationToken>()))
            .Returns(true).Returns(false);
        this.userServiceCursor.SetupSequence(x => x.MoveNextAsync(It.IsAny<CancellationToken>()))
            .Returns(Task.FromResult(true)).Returns(Task.FromResult(false));
        this.userServiceCollection.Setup(x => x.AggregateAsync(It.IsAny<PipelineDefinition<UserServiceIndex, UserServiceIndex>>(),
            It.IsAny<AggregateOptions>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(this.userServiceCursor.Object);

        this.InitMongoDB();
    }

    public IMongoClient GetClient()
    {
        return this.mongoClient.Object;
    }
}