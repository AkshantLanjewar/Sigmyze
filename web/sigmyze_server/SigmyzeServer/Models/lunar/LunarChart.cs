namespace SigmyzeServer.Models.Lunar;

using MongoDB.Bson.Serialization.Attributes;
using Newtonsoft.Json;
using System.Text.Json.Serialization;

public class QuantaIndicatorLocation
{
    [BsonElement("datasetId")]
    [JsonProperty("datasetId")]
    [JsonPropertyName("datasetId")]
    public string? DatasetId { get; set; }

    [BsonElement("indicatorId")]
    [JsonProperty("indicatorId")]
    [JsonPropertyName("indicatorId")]
    public string? IndicatorId { get; set; }

    public bool Validate()
    {
        if(this.DatasetId == null | this.IndicatorId == null)
            return false;

        return true;
    }
}

public class LunarChart
{
    [BsonElement("name")]
    [JsonProperty("name")]
    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [BsonElement("objectId")]
    [JsonProperty("objectId")]
    [JsonPropertyName("objectId")]
    public string? ObjectId { get; set; }

    [BsonElement("indicators")]
    [JsonProperty("indicators")]
    [JsonPropertyName("indicators")]
    public List<QuantaIndicatorLocation>? Indicators { get; set; }

    public bool Validate()
    {
        if(this.Name == null || this.ObjectId == null || this.Indicators == null)
            return false;

        //now we will iterate thru the indicators to validate the indicators
        for(int i = 0; i < this.Indicators.Count; i++) 
        {
            QuantaIndicatorLocation indicator = this.Indicators[i];
            if(indicator.Validate() == false)
                return false;
        }

        return true;
    }
}