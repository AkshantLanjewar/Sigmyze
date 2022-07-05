using Newtonsoft.Json;

namespace SigmyzeServer.Models.API
{
    public class Country
    {
        [JsonProperty("iso3")]
        public string ISO3 { get; set; }

        [JsonProperty("name")]
        public string FullName { get; set; }
    }

    public class IndicatorName
    {
        [JsonProperty("ind3")]
        public string IND3 { get; set; }

        [JsonProperty("fullname")]
        public string FullName { get; set; }

        [JsonProperty("category")]
        public string Category { get; set; }
    }

    public class IndicatorData
    {
        [JsonProperty("date")]
        public string Date { get; set; }

        [JsonProperty("value")]
        public string Value { get; set; }
    }

    public class ValidCountryIndicators
    {
        [JsonProperty("country")]
        public Country Country { get; set; }

        [JsonProperty("indicators")]
        public List<IndicatorName> Indicators { get; set; }
    }

    public class CountryIndicator
    {
        [JsonProperty("iso3")]
        public string ISO3 { get; set; }

        [JsonProperty("country")]
        public string FullName { get; set; }

        [JsonProperty("metricCode")]
        public string IND3 { get; set; }

        [JsonProperty("metric")]
        public string Metric { get; set; }

        [JsonProperty("simpleName")]
        public string SimpleName { get; set; }

        [JsonProperty("scale")]
        public string Scale { get; set; }

        [JsonProperty("data")]
        public Dictionary<string, string> DataDict { get; set; }
    }
}