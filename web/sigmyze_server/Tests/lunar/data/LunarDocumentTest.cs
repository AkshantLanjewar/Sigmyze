namespace Test.Lunar;
using SigmyzeServer.Models.Lunar;

public class LunarDocumentTests
{
    /*
        This is the function that generates a valid simple filesystem that requires the two functions below,
        GenerateLunarCharts and GenerateLunarNotes in order to generate a valid config.
    */
    public SimpleFilesystem GenerateValidSimpleFilesystem(string projectName)
    {
        SimpleFilesystem filesystem = new SimpleFilesystem
        {
            Files = new List<string>(),
            Folders = new List<SimpleFolder>()
        };

        SimpleFolder rootFolder = new SimpleFolder
        {
            Files = new List<string>(),
            Folders = new List<SimpleFolder>(),
            FolderName = projectName,
            FolderId = "root-folder"
        };

        rootFolder.Files.Add("test-chart");
        rootFolder.Files.Add("test-note");
        filesystem.Folders.Add(rootFolder);
        return filesystem;
    }

    /*
        This is the function that generates the list of valid charts for the generated SimpleFilesytem to work
    */
    public List<LunarChart> GenerateLunarCharts()
    {
        List<LunarChart> charts = new List<LunarChart>();
        LunarChart chart = new LunarChart
        {
            ObjectId = "test-chart",
            Name = "Test Chart",
            Indicators = new List<QuantaIndicatorLocation>()
        };

        charts.Add(chart);
        return charts;
    }

    /*
        This is the function that generates the list of valid notes for the generated SimpleFilesystem tobe valid
    */
    public List<LunarNote> GenerateLunarNotes()
    {
        List<LunarNote> notes = new List<LunarNote>();
        LunarNote note = new LunarNote
        {
            ObjectId = "test-note",
            Name = "Test Note",
            Blocks = new List<NoteBlock>()
        };

        NoteBlock block = new NoteBlock
        {
            BlockId = "root-block",
            BlockContent = "",
            BlockType = "paragraph",
            IsGroup = false
        };

        note.Blocks.Add(block);
        notes.Add(note);
        return notes;
    }

    public LunarDocument GenerateValidDocuemnt()
    {
        LunarDocument doc = new LunarDocument
        {
            Id = "test-document",
            OrganizationId = "orgId",
            ProjectId = "projectSwag",
            ProjectName = "Swag",
            Filesystem = GenerateValidSimpleFilesystem("Swag"),
            Notes = GenerateLunarNotes(),
            Charts = GenerateLunarCharts()
        };

        return doc;
    }

    [Fact]
    public void DocumentBaseCase()
    {
        //collect
        LunarDocument document = GenerateValidDocuemnt();

        //act
        bool result = document.Validate();

        //asert
        Assert.True(result, "This is a valid configuration");
    }

    [Fact]
    public void FieldsMissing()
    {
        //collect
        LunarDocument document = new LunarDocument();

        //act
        bool result = document.Validate();

        //assert
        Assert.False(result, "There are multiple fields missing");
    }

    [Fact]
    public void InvalidFilesystemTest()
    {
        //collect
        LunarDocument document = GenerateValidDocuemnt();
        document.Filesystem!.Folders = new List<SimpleFolder>();

        //act
        bool result = document.Validate();

        //assert
        Assert.False(result, "The filesystem has no folders or submembers");
    }

    [Fact]
    public void NameDoesntMatchTest()
    {
        //collect
        LunarDocument document = GenerateValidDocuemnt();
        document.ProjectName = "lolzors";

        //act
        bool result = document.Validate();

        //assert
        Assert.False(result, "The project name doesnt match with the root folder");
    }
}