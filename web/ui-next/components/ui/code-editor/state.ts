import { IFile, IFilesystem } from "./types"

interface ICodeEditorState {
    activeDirectory: string | undefined,
    code_id: string,
    editorFilesystem: IFilesystem | undefined,

    //state relating to the project
    name: string | undefined,
    short_id: string | undefined,

    //state relating to the active components within the editor
    activeFile: string | undefined, //which file is active within the editor
    activeItem: string | undefined, //this is the focused item within the sidebar

    //opens a modal if its a valid modal
    openModal: (id: string) => void
    //closes the modal
    closeModal: () => void,

    //opens a file from the sidebar
    openFile: (id: string) => void,
    //unselects all items from the sidebar
    unselectAll: () => void
    //selects a directory from the sidebar
    selectDirectory: (id: string) => void,
    //gets a files content
    getFile: (id: string) => IFile | undefined,

    //state relating to the monaco editor
    lspUrl: string | null // this is the LSP servers process id within its container
    mappings: { [key: string]: string; } | null //mappings between id and file location
}

export type { ICodeEditorState }