using Newtonsoft.Json;
using SigmyzeServer.Models.API;

namespace SigmyzeServer.Models.UserData
{
    public class CreateFolder
    {
        public string? directory { get; set; } // ["root", "foo", "bar"] -> "root/foo/bar (Directory id's)
        public string? folder_name { get; set; }
    }

    public class CreateProject
    {
        public string? directory { get; set; }
        public string? project_name { get; set; }
        public string? project_type { get; set; }
    }
}