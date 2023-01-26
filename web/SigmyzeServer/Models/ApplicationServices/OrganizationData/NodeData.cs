using MongoDB.Bson.Serialization.Attributes;

namespace SigmyzeServer.Models.ApplicationServices
{
    public class IIndicator
    {
        [BsonElement("dataset")]
        public string? Dataset { get; set; }
        
        [BsonElement("object")]
        public IDatasetObject? Object { get; set; }
        
        [BsonElement("indicator")]
        public IObjectIndicator? Indicator { get; set; }
    }

    public class IDatasetObject
    {
        [BsonElement("object_id")]
        public string? ObjectId { get; set; }
        
        [BsonElement("object_fullname")]
        public string? ObjectFullname { get; set; }
        
        [BsonIgnore]
        public string? ObjectLogo { get; set; }
    }

    public class IObjectIndicator
    {
        [BsonElement("indicator_id")]
        public string? IndicatorId { get; set; }
        
        [BsonElement("indicator_fullname")]
        public string? IndicatorFullname { get; set; }
        
        [BsonElement("category")]
        public string? Category { get; set; }
    }

    public class IChartSettings
    {
        [BsonElement("indicatorSettings")]
        public List<IIndicatorSetting>? IndicatorSettings { get; set; }
    }

    public class IIndicatorSetting
    {
        [BsonElement("indicator")]
        public IIndicator? Indicator { get; set; }
        
        [BsonElement("lineColor")]
        public string? LineColor { get; set; }
    }

    public class IGlobalChartSettings
    {   
        [BsonElement("chartTitle")]
        public string? ChartTitle { get; set; }
    }
}