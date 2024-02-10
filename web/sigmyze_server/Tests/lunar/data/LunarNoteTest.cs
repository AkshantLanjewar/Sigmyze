namespace Test.Lunar;
using SigmyzeServer.Models.Lunar;

public class LunarNoteTests
{
    public LunarNote GenerateValidNote()
    {
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
        return note;
    }

    [Fact]
    public void BaseCase()
    {
        //collect
        LunarNote note = GenerateValidNote();

        //act
        bool result = note.Validate();

        //expect
        Assert.True(result, "This is a valid note block");
    }

    [Fact]
    public void FieldMissingCase()
    {
        //collect
        LunarNote note = GenerateValidNote();
        note.ObjectId = null;

        //act
        bool result = note.Validate();

        //expect
        Assert.False(result, "There is a field missing within the note");
    }

    [Fact]
    public void InvalidBlockTypeCase()
    {
        //collect
        LunarNote note = GenerateValidNote();
        note.Blocks![0].BlockType = "not-a-type";

        //act
        bool result = note.Validate();

        //expect
        Assert.False(result, "There is a block with an invalid type within the note");
    }

    [Fact]
    public void NestedInvalidBlockTypeCase()
    {
        //collect
        LunarNote note = GenerateValidNote();
        note.Blocks![0].IsGroup = true;
        note.Blocks[0].BlockChildren = new List<NoteBlock>();

        note.Blocks![0].BlockChildren!.Add(new NoteBlock {
            BlockId = "nested-block",
            BlockType = "invalid-block",
            BlockContent = "",
            IsGroup = false
        });

        //act
        bool result = note.Validate();

        //expect
        Assert.False(result, "There is a block nested away with an invalid type within the note");
    }

    [Fact]
    public void NoBlocksCase()
    {
        //collect
        LunarNote note = GenerateValidNote();
        note.Blocks = new List<NoteBlock>();

        //act
        bool result = note.Validate();

        //expect
        Assert.False(result, "There are no blocks within this note");
    }
}