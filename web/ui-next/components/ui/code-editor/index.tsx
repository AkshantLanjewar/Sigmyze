import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import FileWrapper from './file-wrapper'
import styles from './styles.module.scss'
import { ICodeEditorState } from './state'
import ModalManager from '../modal-manager'
import DeleteSelectorForm from './forms/delete-selector'
import { QuantaCodeContextData } from '../../data/quanta/quanta-code-context'
import { IQuantaCodeContext } from '../../data/quanta/quanta-code-context/state'
import { IQuantaCodeShort } from '../../data/quanta/quanta-code-context/types'
import { UserContextData } from '../../data/user/context'
import { IUserContext } from '../../data/user/types'
import { GetCodeRepository } from './code-api'
import { IFilesystem } from './types'
import { getFile, openFile, selectDirectory, unselectItems } from './functions'
import { SocketHandlerData } from '../socket-handler'
import { ISocketHandlerState } from '../socket-handler/types'
import InternalSandpack from './sandpack'

interface ICodeEditorProps {
    codeId: string
}

const CodeEditorContextData = createContext<ICodeEditorState | null>(null)

const CodeEditor: React.FC<ICodeEditorProps> = ({ codeId }) => { 
    const { codeItems } = useContext(QuantaCodeContextData) as IQuantaCodeContext
    const { authData } = useContext(UserContextData) as IUserContext
    const { socketCreated, executeSocketFunction } = useContext(SocketHandlerData) as ISocketHandlerState

    //state relating to the editor, and the active source behind it
    const [activeFile, setActiveFile] = useState<string | undefined>(undefined)
    const [activeItem, setActiveItem] = useState<string | undefined>(undefined)

    //state relating to the smaller parameters surrounding the project such as name etc
    const [projectName, setProjectName] = useState<string | undefined>(undefined)
    const [projectId, setProjectId] = useState<string | undefined>(undefined)

    //state relating to the filesystem data structure
    const [editorFilesystem, setEditorFilesystem] = useState<IFilesystem | undefined>(undefined)
    //typings from the file system
    const [lspPID, setLspPID] = useState<string | null>(null)
    const [mappings, setMappings] = useState<{ [key: string]: string } | null>(null)

    //state whether or not a directory is selected in the explorer
    const [activeDirectory, setActiveDirectory] = useState<string | undefined>(undefined)
    //state that determines the active modal within the context
    const [activeModal, setActiveModal] = useState<string | null>(null)
    const validModalIds = ["delete-selector"]

    const closeModal = useCallback(() => {
        setActiveModal(null)
    }, [])

    const openModal = useCallback((id: string) => {
        if(validModalIds.includes(id) === false)
            return

        setActiveModal(id)
    }, [])

    const openFileCallback = useCallback((id: string) => {
        openFile(id, activeFile, editorFilesystem, setActiveFile, setActiveItem, setActiveDirectory)
    }, [activeFile, editorFilesystem])

    const unselectItemsCallback = useCallback(() => {
        unselectItems(setActiveDirectory, setActiveItem)
    }, [])

    const selectDirectoryCallback = useCallback((id: string) => {
        selectDirectory(id, setActiveItem, setActiveDirectory)
    }, [])

    const getFileCallback = useCallback((id: string) => {
        return getFile(id, editorFilesystem)
    }, [editorFilesystem])
    
    //grab the data from the server
    useEffect(() => {
        setEditorFilesystem(undefined)
        async function main() {
            let codeItem: undefined | IQuantaCodeShort = undefined
            for(let i = 0; i < codeItems.length; i++) {
                let item = codeItems[i]
                if(item.code_id === codeId)
                    codeItem = item
            }

            let token = authData?.token
            if(codeItem === undefined || token === undefined)
                return

            //now we fetch the filesystem from the server
            let filesystem = await GetCodeRepository(token, codeId)
            if(filesystem === undefined)
                return

            setEditorFilesystem({ ...filesystem })
            setProjectName(codeItem.short)
            setProjectId(codeItem.short_id)
        }

        main()
    }, [codeId])
    
    const value: ICodeEditorState = {
        activeDirectory: activeDirectory,
        code_id: codeId,
        editorFilesystem: editorFilesystem,

        name: projectName,
        short_id: projectId,

        activeFile: activeFile,
        activeItem: activeItem,

        openModal: openModal,
        closeModal: closeModal,

        openFile: openFileCallback,
        unselectAll: unselectItemsCallback,
        selectDirectory: selectDirectoryCallback,
        getFile: getFileCallback,

        lspUrl: lspPID,
        mappings: mappings
    }

    return (
        <>
            <CodeEditorContextData.Provider value={value}>
                <div className={styles.code__wrapper}>
                    <ModalManager
                        modalState={activeModal}
                        close={closeModal}
                    >
                        <ModalManager.Modal
                            id="delete-selector"
                            title={activeDirectory ? "" : 'Delete Selector'}
                        >
                            {activeDirectory
                                ? null
                                : (
                                    <DeleteSelectorForm 
                                        closeModal={closeModal}
                                    />
                                )
                            }
                        </ModalManager.Modal>
                    </ModalManager>

                    <div className={styles.files__wrapper}>
                        <FileWrapper filesystem={editorFilesystem} />
                    </div>

                    <div className={styles.editor__wrapper}>
                        <InternalSandpack />
                    </div>
                </div> 
            </CodeEditorContextData.Provider>
        </>
    )
}

export { CodeEditorContextData }
export default CodeEditor