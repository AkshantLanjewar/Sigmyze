using Newtonsoft.Json;
using SigmyzeServer.Models.API;

namespace SigmyzeServer.Models.UserData
{
    public class CreateFolder
    {
        public string? directory { get; set; } // ["root", "foo", "bar"] -> "root/foo/bar (Directory id's)
        public string? folder_name { get; set; }
        public string? organization_id { get; set; }
    }

    public class CreateProject
    {
        public string? directory { get; set; }
        public string? project_name { get; set; }
        public string? project_type { get; set; }
        public string? organization_id { get; set; }
    }

    public class UpdateProject
    {
        public string? directory { get; set; }
        public string? project_id { get; set; }
        public Project? project { get; set; }
        public string? organization_id { get; set; }
    }

    public class UpdateFolder
    {
        public string? directory { get; set; }
        public string? folder_id { get; set; }

        public Folder? folder { get; set; }
        public string? organization_id { get; set; }
    }

    public class DeleteProject
    {
        public string? directory { get; set; }
        public string? project_id { get; set; }
    }

    public class DeleteFolder
    {
        public string? directory { get; set; }
        public string? directory_id { get; set; }
    }
}