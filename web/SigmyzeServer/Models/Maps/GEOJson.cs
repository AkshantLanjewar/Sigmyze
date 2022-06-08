namespace SigmyzeServer.Models.Maps
{
    public class Geometry
    {
        public string type { get; set; }
        public List<List<List<List<double>>>> coordinates { get; set; }
    }
    
    public class Properties
    {
        public string ADMIN { get; set; }
        public string ISO_A3 { get; set; }
        public string ISO_A2 { get; set; }
        public List<EconomicData> data { get; set; }
    }
    public class Feature
    {
        public string type { get; set; }
        public Properties properties { get; set; }
        public Geometry geometry { get; set; }
    }

    public class Root
    {
        public string type { get; set; }
        public List<Feature> features { get; set; }
    }

    public class EconomicData
    {
        public string ISO3 { get; set; }
        public string IND3 { get; set; }
        public float VAL   { get; set; }
    }
}