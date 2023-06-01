using MongoDB.Driver;
using SigmyzeServer.Models.ApplicationServices.Code;

namespace SigmyzeServer.Services;

public partial class CodeRepository
{
    public async Task<CodeFilesystem?> GetCode(string codeId)
    {
        CodeProject? project = await _codeProjects.Find<CodeProject>(x => x.CodeId == codeId).FirstOrDefaultAsync();
        CodeFilesystem? filesystem = project?.Filesystem;
        if(filesystem == null || filesystem.Files == null || filesystem.Folders == null)
            return null;

        //remove any hidden files
        List<CodeFile> newFiles = new List<CodeFile>();
        for(int i = 0; i < filesystem.Files.Count; i++)
        {
            CodeFile file = filesystem.Files[i];
            if(file.Hidden == true)
                continue;

            newFiles.Add(file);
        }

        //recurse thru the folders to check aswell
        List<CodeFolder> newFolders = new List<CodeFolder>();
        for(int i = 0; i < filesystem.Folders.Count; i++)
            newFolders.Add(RemoveHiddenFiles(filesystem.Folders[i]));

        filesystem.Files = newFiles;
        filesystem.Folders = newFolders;
        return filesystem;
    }

    private CodeFolder RemoveHiddenFiles(CodeFolder folder)
    {
        List<CodeFile> newFiles = new List<CodeFile>();
        for(int i = 0; i < folder.Files!.Count; i++)
        {
            CodeFile file = folder.Files[i];
            if(file.Hidden == true)
                continue;

            newFiles.Add(file);
        }

        List<CodeFolder> newFolders = new List<CodeFolder>();
        for(int i = 0; i < folder.Folders!.Count; i++)
            newFolders.Add(RemoveHiddenFiles(folder.Folders[i]));

        folder.Files = newFiles;
        folder.Folders = newFolders;
        return folder;
    }
}
