import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { ILunarChart, ILunarDataManagerState, ILunarNote, ILunarProject } from "./state"
import { UserContextData } from "../../data/user/context"
import { IUserContext } from "../../data/user/types"
import { convertSigmyzeToSimple, convertSimpleFilesystem, generateDefaultProject } from "./functions"
import { ISigmyzeFilesystem, ISimpleFilesystem } from "../../ui/file-management/types"
import { LunarUIContextData } from "../ui-context"
import { ILunarUIState } from "../ui-context/state"
import useRefreshChartData from "./hooks/refresh-chart-data"
import useRefreshNoteData from "./hooks/refresh-note-data"
import useRefreshFilesystem from "./hooks/refresh-filesystem-data"

const LunarDataManagerData = createContext<ILunarDataManagerState | null>(null)

interface ILunarDataManagerProps {
    children: React.ReactNode
}

const LunarDataManager: React.FC<ILunarDataManagerProps> = ({ children }) => {
    //this is the lunar project being loaded in
    const [lunarProject, setLunarProject] = useState<ILunarProject | undefined>(undefined)

    const { 
        notes, 
        createNewNote, 
        deleteNote,
        editNoteName 
    } = useRefreshNoteData()

    const { 
        charts, 
        setCharts, 
        createNewChart, 
        deleteChart,
        editChartName 
    } = useRefreshChartData()

    const { 
        fileSystem, 
        ignoreFilesystemSIG, 
        ignoreFilesystemSIM, 
        setFilesystem, 
        updateDataFilesystem, 
        updateUIFilesystem 
    } = useRefreshFilesystem()

    const { authData } = useContext(UserContextData) as IUserContext
    const { 
        debugMode, 
        loadedFilesystem, 
        resetActive, 
        activeItemId,
        messagesLeft,
        consumeSynchroMessage 
    } = useContext(LunarUIContextData) as ILunarUIState

    /**
     * this effect handles the loading of project data
     */
    useEffect(() => {
        if(debugMode === true) {
            setLunarProject(undefined)
            return
        }

        let token = authData?.token
        if(token === undefined)
            setLunarProject({ ...generateDefaultProject() })
        //NOTE: have to implemenet load project but thats a little later
    }, [authData, debugMode])

    /**
     * once a lunar project is loaded, the component parts are also updated as well
     */
    useEffect(() => {
        if(lunarProject === undefined)
            return

        let newCharts = lunarProject.charts
        setCharts([ ...newCharts ])
        let newNotes = lunarProject.notes
        setCharts([ ...newNotes ])
        let newFileSystem = lunarProject.fileSystem
        setFilesystem({ ...newFileSystem })
    }, [lunarProject])

    /**
     * this effect handles the conversion of a simplefilesystem to a sigmyze filesystem
     */
    useEffect(() => {
        if(fileSystem === undefined || lunarProject === undefined)
            return
        if(ignoreFilesystemSIM.current === true) {
            ignoreFilesystemSIM.current = false
            return
        }

        let generatedFilesystem = convertSimpleFilesystem(lunarProject.name, fileSystem, charts, notes)
        updateUIFilesystem(generatedFilesystem)
    }, [fileSystem])


    /**
     * this effect handles the conversion of a sigmyze filesystem to a simple one
     */
    useEffect(() => {
        if(loadedFilesystem === undefined)
            return
        if(ignoreFilesystemSIG.current === true) {
            ignoreFilesystemSIG.current = false
            return
        }

        let generatedSimpleFileSystem = convertSigmyzeToSimple(loadedFilesystem)
        updateDataFilesystem(generatedSimpleFileSystem)
    }, [loadedFilesystem])

    /**
     * this sets the default activeId to the project's root folder
     */
    useEffect(() => {
        if(activeItemId !== undefined)
            return

        resetActive()
    }, [activeItemId, resetActive])

    /**
     * this effect handles synchro messages
     */
    useEffect(() => {
        if(messagesLeft === 0)
            return

        //if not we want to consume a message
        let message = consumeSynchroMessage()
        if(message === undefined)
            return

        //we want to switch and case through all the possible message types
        let messageData = message.messageData
        switch(message.messageType) {
            case "CREATE":
                let create_split = messageData.split("::")
                //here are all the fields parsed from the string
                let fileType = create_split[0]
                let fileName = create_split[1]
                let fileId = create_split[2]

                //now depending on the file type, we will either create a chart or note depending on the filetype
                if(fileType === "chart")
                    createNewChart(fileName, fileId)
                if(fileType === "note")
                    createNewNote(fileName, fileId)
            case "DELETE":
                //TODO: Implement delete synchro messages
                let delete_split = messageData.split("::")
                //here are the parts from the string
                let fileTypeDelete = delete_split[0]
                let fileIdDelete = delete_split[1]

                if(fileTypeDelete === "chart")
                    deleteChart(fileIdDelete)
                if(fileTypeDelete === "note")
                    deleteNote(fileIdDelete)
                break
            case "EDIT":
                let editSplit = messageData.split("::")
                //here is the edit function we are going to be using from the root split
                let editFunction = editSplit[0]
                //case through all the edit functions 
                switch(editFunction) {
                    case "TITLE":
                        //here are all the components from the title function data
                        let titleFileType = editSplit[1]
                        let titleFileId = editSplit[2]
                        let titleFileName = editSplit[3]

                        if(titleFileType === "chart")
                            editChartName(titleFileId, titleFileName)
                        if(titleFileType === "note")
                            editNoteName(titleFileId, titleFileName)
                        break
                    default:
                        break
                }

                break
            default:
                return
        }
    }, [messagesLeft])

    const value: ILunarDataManagerState = useMemo(() => ({
        charts,
        notes
    }), [charts, notes])

    return (
        <>
            <LunarDataManagerData.Provider value={value}>
                <div style={{ width: "100%", height: "100%" }}>
                    {children}
                </div>
            </LunarDataManagerData.Provider>
        </>
    )
}

export default LunarDataManager