namespace SigmyzeServer.Models.Maps
{
    public class Geometry
    {
        public string type { get; set; }
        public List<List<List<List<double>>>> coordinates { get; set; }
    }

    public class MapDataProperty
    {
        public float EconomicVal { get; set; }
    }

    public class Properties
    {
        public string ADMIN { get; set; }
        public string ISO_A3 { get; set; }
        public string ISO_A2 { get; set; }
        public MapDataProperty DATA { get; set; }
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
}