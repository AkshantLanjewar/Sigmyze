using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using Moq;
using Newtonsoft.Json;
using SigmyzeServer.Models.ApplicationServices;

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

    //this is a private function that generates a findasync cursor
    private IAsyncCursor<UserServiceIndex> InitFindAsyncCursor(List<UserServiceIndex> results)
    {
        Mock<IAsyncCursor<UserServiceIndex>> findCursor = new Mock<IAsyncCursor<UserServiceIndex>>();
        
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
    private void InitCollection()
    {
        this.userServiceCursor.Setup(x => x.Current).Returns(this.userServices);
        this.userServiceCursor.SetupSequence(x => x.MoveNext(It.IsAny<CancellationToken>()))
            .Returns(true).Returns(false);
        this.userServiceCursor.SetupSequence(x => x.MoveNextAsync(It.IsAny<CancellationToken>()))
            .Returns(Task.FromResult(true)).Returns(Task.FromResult(false));
        
        //these methods are setup for the collection
        this.userServiceCollection.Setup(x => x.AggregateAsync(It.IsAny<PipelineDefinition<UserServiceIndex, UserServiceIndex>>(),
            It.IsAny<AggregateOptions>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(this.userServiceCursor.Object);

        //this is the method for FindAsync
        this.userServiceCollection.Setup(x => x.FindAsync(
            It.IsAny<FilterDefinition<UserServiceIndex>>(),
            It.IsAny<FindOptions<UserServiceIndex, UserServiceIndex>>(),
            It.IsAny<CancellationToken>()
        )).ReturnsAsync((FilterDefinition<UserServiceIndex> f, FindOptions<UserServiceIndex, UserServiceIndex> o, CancellationToken t) =>
        {
            //first we convert the filter into a parsed object
            IBsonSerializerRegistry? serializerRegistry = MongoDB.Bson.Serialization.BsonSerializer.SerializerRegistry;
            var documentSerializer = serializerRegistry.GetSerializer<UserServiceIndex>();
            string jsonFilter = f.Render(documentSerializer, serializerRegistry).ToJson();

            UserServiceFilter? filter = JsonConvert.DeserializeObject<UserServiceFilter>(jsonFilter);
            if(filter == null)
                return InitFindAsyncCursor(new List<UserServiceIndex>());            

            List<UserServiceIndex> matchedDocuments = new List<UserServiceIndex>();
            for(int i = 0; i < this.userServices.Count; i++)
            {
                UserServiceIndex index = this.userServices[i];
                if(filter.Matches(index))
                    matchedDocuments.Add(index);
            }

            return InitFindAsyncCursor(matchedDocuments);
        });

        this.InitMongoDB();
    }

    public IMongoClient GetClient()
    {
        return this.mongoClient.Object;
    }
}