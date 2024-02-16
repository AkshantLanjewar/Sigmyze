namespace Test.Lunar;
using SigmyzeServer.Models.Lunar;

public class LunarChartTests
{
    public LunarChart GenerateChart()
    {
        LunarChart chart = new LunarChart
        {
            Name = "test-chart",
            ObjectId = "test-id",
            Indicators = new List<QuantaIndicatorLocation>()
        };

        return chart;
    }

    [Fact]
    public void BaseCase()
    {
        //collect
        LunarChart chart = GenerateChart();

        //act
        bool result = chart.Validate();

        //expect
        Assert.True(result, "This is a valid config");
    }

    [Fact]
    public void FieldMissingCase()
    {
        //collect
        LunarChart chart = GenerateChart();
        chart.ObjectId = null;

        //act
        bool result = chart.Validate();

        //expect
        Assert.False(result, "This config has empty fields");
    }

    [Fact]
    public void InvalidIndicatorCase()
    {
        //collect
        LunarChart chart = GenerateChart();
        chart.Indicators!.Add(new QuantaIndicatorLocation());

        //act
        bool result = chart.Validate();

        //expect
        Assert.False(result, "This config has an invalid indicator location");
    }
}