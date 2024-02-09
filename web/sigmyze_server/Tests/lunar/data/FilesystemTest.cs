namespace Test.Lunar;
using SigmyzeServer.Models.Lunar;

public class FilesystemTests
{
    /*
        This is the function that generates a valid simple filesystem that requires the two functions below,
        GenerateLunarCharts and GenerateLunarNotes in order to generate a valid config.
    */
    public SimpleFilesystem GenerateValidSimpleFilesystem(string projectName)
    {
        SimpleFilesystem filesystem = new SimpleFilesystem();
        filesystem.Files = new List<string>();
        filesystem.Folders = new List<SimpleFolder>();

        SimpleFolder rootFolder = new SimpleFolder();
        rootFolder.Files = new List<string>();
        rootFolder.Folders = new List<SimpleFolder>();
        rootFolder.FolderName = projectName;
        rootFolder.FolderId = "root-folder";

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
        LunarChart chart = new LunarChart();
        chart.ObjectId = "test-chart";
        chart.Name = "Test Chart";
        chart.Indicators = new List<QuantaIndicatorLocation>();

        charts.Add(chart);
        return charts;
    }

    /*
        This is the function that generates the list of valid notes for the generated SimpleFilesystem tobe valid
    */
    public List<LunarNote> GenerateLunarNotes()
    {
        List<LunarNote> notes = new List<LunarNote>();
        LunarNote note = new LunarNote();
        note.ObjectId = "test-note";
        note.Name = "Test Note";
        note.Blocks = new List<NoteBlock>();

        return notes;
    }

    [Fact]
    public void FileBaseCase()
    {
        //collect
        SimpleFilesystem filesystem = GenerateValidSimpleFilesystem("test");
        List<LunarNote> notes = GenerateLunarNotes();
        List<LunarChart> charts = GenerateLunarCharts();

        //act
        bool validateResult = filesystem.Validate("test", charts, notes);

        //expect
        Assert.True(validateResult, "This is a valid filesystem configuration");
    }

    [Fact]
    public void FileOutsideOfRootFolder()
    {
        //collect
        SimpleFilesystem filesystem = GenerateValidSimpleFilesystem("test");
        filesystem.Files!.Add("testing");

        List<LunarNote> notes = GenerateLunarNotes();
        List<LunarChart> charts = GenerateLunarCharts();

        //act
        bool validateResult = filesystem.Validate("test", charts, notes);

        //expect
        Assert.False(validateResult, "There is a file in the root of the filesystem");
    }

    [Fact]
    public void FileMissingCase()
    {
        //collect
        SimpleFilesystem filesystem = GenerateValidSimpleFilesystem("test");
        filesystem.Folders![0].Files = new List<string>();

        List<LunarNote> notes = GenerateLunarNotes();
        List<LunarChart> charts = GenerateLunarCharts();

        //act
        bool validateResult = filesystem.Validate("test", charts, notes);

        //expect
        Assert.False(validateResult, "There are projects that are not represented by files within the filesystem");
    }

    [Fact]
    public void ParamsMissingCase()
    {
        //collect
        SimpleFilesystem filesystem = new SimpleFilesystem();
        List<LunarNote> notes = new List<LunarNote>();
        List<LunarChart> charts = new List<LunarChart>();

        //act
        bool validateResult = filesystem.Validate("test", charts, notes);

        //expect
        Assert.False(validateResult, "There are parameters missing from the filesystem");
    }

    //TODO: Implement
    [Fact]
    public void InvalidFolderCase()
    {
        //collect
        SimpleFilesystem filesystem = GenerateValidSimpleFilesystem("test");
        filesystem.Folders![0].Folders!.Add(new SimpleFolder());

        List<LunarNote> notes = GenerateLunarNotes();
        List<LunarChart> charts = GenerateLunarCharts();

        //act
        bool validateResult = filesystem.Validate("test", charts, notes);

        //expect
        Assert.False(validateResult, "There is a folder that is invalid within the filesystem");
    }

    [Fact]
    public void InvalidFileCase()
    {
        //collect
        SimpleFilesystem filesystem = GenerateValidSimpleFilesystem("test");
        filesystem.Folders![0].Files!.Add("swag");

        List<LunarNote> notes = GenerateLunarNotes();
        List<LunarChart> charts = GenerateLunarCharts();
        //act
        bool validateResult = filesystem.Validate("test", charts, notes);
        
        //expect
        Assert.False(validateResult, "There is an extra file within the filesystem");
    }
}