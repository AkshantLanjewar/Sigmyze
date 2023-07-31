interface IFilesystem {
    files?: IFile[],
    folders?: IFolder[]
}

interface IFile {
    file_name?: string,
    file_type?: string,
    file_content?: string,
    item_id?: string
}

interface IFolder {
    folder_name?: string,
    files?: IFile[],
    folders?: IFolder[],
    item_id?: string
}

export type {
    IFilesystem,
    IFile,
    IFolder
}