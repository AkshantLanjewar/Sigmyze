using System.Text;
using SigmyzeServer.Models.ApplicationServices.Code;

namespace SigmyzeServer.Services;

public partial class CodeRepository
{
    public CodeFilesystem TemplateWalk(string templateDir)
    {
        CodeFilesystem filesystem = new CodeFilesystem();
        filesystem.Files = new List<CodeFile>();
        filesystem.Folders = new List<CodeFolder>();    

        DirectoryInfo templateDirInfo = new DirectoryInfo(templateDir);
        CodeFolder dirFolder = WalkFolder(templateDirInfo);
        
        filesystem.Files = dirFolder.Files;
        filesystem.Folders = dirFolder.Folders;
        return filesystem;
    }

    private CodeFolder WalkFolder(DirectoryInfo dir)
    {
        CodeFolder folder = new CodeFolder();
        folder.FolderName = dir.Name;
        folder.ItemId = Guid.NewGuid().ToString();
        folder.Folders = new List<CodeFolder>();
        folder.Files = new List<CodeFile>();

        foreach(FileInfo file in dir.EnumerateFiles())
        {
            string[] name_split = file.Name.Split('.');
            if(name_split.Length != 2)
                continue;

            CodeFile system_file = new CodeFile();
            system_file.FileName = name_split[0];
            system_file.FileType = name_split[1];
            system_file.ItemId = Guid.NewGuid().ToString();
            system_file.Hidden = false;

            if(name_split[0] == "index" && name_split[1] == "html")
                system_file.Hidden = true;

            //now read the contents of the file
            FileStream fs = file.Open(FileMode.Open, FileAccess.Read, FileShare.Read);
            byte[] fileBytes = new byte[fs.Length];

            int numBytesToRead = (int)fileBytes.Length;
            int numBytesRead = 0;

            while(numBytesToRead > 0)
            {
                int n = fs.Read(fileBytes, numBytesRead, numBytesToRead);
                if(n == 0)
                    break;

                numBytesRead += n;
                numBytesToRead -= n;
            }

            system_file.FileContent = Encoding.UTF8.GetString(fileBytes);
            folder.Files.Add(system_file);
        }   

        //iterate thru the folders
        foreach(DirectoryInfo childDir in dir.EnumerateDirectories())
        {
            CodeFolder childFolder = WalkFolder(childDir);
            folder.Folders.Add(childFolder);
        }

        return folder;
    }
}