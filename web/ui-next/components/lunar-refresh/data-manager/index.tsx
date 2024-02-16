import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { ILunarDataManagerState, ILunarProject, IQuantaIndicatorLoc } from "./state"
import { UserContextData } from "../../data/user/context"
import { IUserContext } from "../../data/user/types"
import { convertSigmyzeToSimple, convertSimpleFilesystem, generateDefaultProject } from "./functions"
import { LunarUIContextData } from "../ui-context"
import { ILunarUIState } from "../ui-context/state"
import useRefreshChartData from "./hooks/refresh-chart-data"
import useRefreshNoteData from "./hooks/refresh-note-data"
import useRefreshFilesystem from "./hooks/refresh-filesystem-data"
import { QuantaDatasetManagerData } from "../../ui/quanta-dataset-manager"
import { IDatasetManagerState } from "../../ui/quanta-dataset-manager/types"
import SettingsFlow from "./forms/settings"
import DeleteIndicatorFlow from "./forms/delete-indicator"
import { useRouter } from "next/router"
import { LunarRefreshAPI_fetchProject, LunarRefreshAPI_updateFileTree } from "./api"
import { showNotification } from "@mantine/notifications"

const LunarDataManagerData = createContext<ILunarDataManagerState | null>(null)

interface ILunarDataManagerProps {
    /**
     * this is the settings flow toggle meant to activate the flow
     */
    settingsFlowToggle: boolean,

    /**
     * This is the delete indicator flow toggle to be passed to the data manager
     */
    deleteIndicatorFlowToggle: boolean,

    children: React.ReactNode
}

const LunarDataManager: React.FC<ILunarDataManagerProps> = ({ settingsFlowToggle, deleteIndicatorFlowToggle, children }) => {
    //this is the lunar project being loaded in
    const [lunarProject, setLunarProject] = useState<ILunarProject | undefined>(undefined)
    //this is the flag to skip the filesystem reload
    const skipFilesystem = useRef<boolean>(false)

    //whether or not the data has been loaded from the server
    const dataLoad = useRef<boolean>(false)
    
    //this is the ref that tracks whether or not the charts have been loaded
    const chartInitialLoad = useRef<boolean>(false)
    //this is the state for the context on whether or not the chartdata has been loaded
    const [chartLoaded, setChartLoaded] = useState<boolean>(false)

    //this is the indicator that is being handled during an event
    const [eventIndicator, setEventIndicator] = useState<IQuantaIndicatorLoc | undefined>(undefined)

    //note intial load flag
    const noteInitialLoad = useRef<boolean>(true)

    const { fetchIndicatorText } = useContext(QuantaDatasetManagerData) as IDatasetManagerState

    const { authData, loaded, loggedIn, userData } = useContext(UserContextData) as IUserContext

    const { 
        notes, 
        setNotes,
        createNewNote, 
        deleteNote,
        editNoteName,
        fetchNoteBlocks,
        updateNoteBlocks 
    } = useRefreshNoteData(lunarProject, dataLoad, authData, setLunarProject)

    const { 
        fileSystem, 
        ignoreFilesystemSIG, 
        ignoreFilesystemSIM, 
        setFilesystem, 
        updateDataFilesystem, 
        updateUIFilesystem 
    } = useRefreshFilesystem()

    const { 
        debugMode, 
        loadedFilesystem, 
        resetActive, 
        activeItemId,
        messagesLeft,
        consumeSynchroMessage 
    } = useContext(LunarUIContextData) as ILunarUIState

    const { 
        charts, 
        setCharts, 
        createNewChart, 
        deleteChart,
        editChartName,
        addChartIndicator,
        updateSigmyzeIndicators,
        getChartIndicators,
        deleteChartIndicator,
        getCharts 
    } = useRefreshChartData(
        lunarProject, 
        loadedFilesystem, 
        skipFilesystem,
        dataLoad,
        authData,
        updateUIFilesystem, 
        fetchIndicatorText,
        setLunarProject
    )

    const router = useRouter()

    /**
     * this effect handles the loading of project data
     */
    useEffect(() => {
        async function main() {
            if(debugMode === true) {
                setLunarProject(undefined)
                return
            }
    
            //we want the user state to be loaded
            if(loaded === false || dataLoad.current === true)
                return
    
            let token = authData?.token
            let lunarId = authData?.lunarId
            if(token === undefined || lunarId === undefined)
                setLunarProject({ ...generateDefaultProject() })

            //NOTE: have to implemenet load project but thats a little later
            let query = router.query.ids
            if(Array.isArray(query) && loggedIn === false)
                router.push('/')
            else if(Array.isArray(query) && query.length === 2 && token !== undefined && lunarId !== undefined) {
                const organizationId = query[0]
                const projectId = query[1]
                const projectData = await LunarRefreshAPI_fetchProject(token, lunarId, organizationId, projectId)
                if(projectData === undefined || projectData.validate() === false)
                    return

                const newLunarProject: ILunarProject = {
                    projectId,
                    name: projectData.projectName!,
                    notes: projectData.notes!,
                    charts: projectData.charts!,
                    fileSystem: projectData.fileSystem!
                }

                setLunarProject({ ...newLunarProject })
                dataLoad.current = true
            }
        }
        
        main()
    }, [authData, debugMode, loaded, loggedIn])

    /**
     * once a lunar project is loaded, the component parts are also updated as well
     */
    useEffect(() => {
        if(lunarProject === undefined)
            return

        let newCharts = lunarProject.charts
        setCharts([ ...newCharts ])
        if(noteInitialLoad.current === true) {
            let newNotes = lunarProject.notes
            setNotes([ ...newNotes ])
            noteInitialLoad.current = false
        }

        if(skipFilesystem.current === true) {
            skipFilesystem.current = false
            return
        }

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
     * This is the effect that will handle the filesystem updating
     */
    useEffect(() => {
        async function main() {
            let token = authData?.token
            let lunarId = authData?.lunarId
            let query = router.query.ids

            if(query === undefined)
                return
            if(fileSystem === undefined || token === undefined || lunarId === undefined)
                return 
            if(Array.isArray(query) === false || query.length !== 2 || dataLoad.current === false)
                return
            
            const organizationId = query[0]
            const projectId = query[1]
            let result = await LunarRefreshAPI_updateFileTree(token, lunarId, organizationId, projectId, fileSystem)

            if(result !== undefined)
                showNotification({
                    title: "Update Error",
                    message: `There was an error updating the server. Error code: ${result}`,
                    color: 'red',
                    autoClose: 1000 * 5
                })
        }

        const timeout = setTimeout(() => main(), 10 * 1000)
        return () => clearTimeout(timeout)
    }, [fileSystem, authData])


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
        notes,
        eventIndicator,
        addChartIndicator,
        updateSigmyzeIndicators,
        getChartIndicators,
        deleteChartIndicator,
        setEventIndicator,
        fetchNoteBlocks,
        updateNoteBlocks,
        getCharts
    }), [
        charts, 
        notes, 
        addChartIndicator, 
        updateSigmyzeIndicators,
        getChartIndicators,
        deleteChartIndicator,
        eventIndicator,
        setEventIndicator,
        fetchNoteBlocks,
        updateNoteBlocks,
        getCharts
    ])

    return (
        <>
            <LunarDataManagerData.Provider value={value}>
                <div style={{ width: "100%", height: "100%" }}>
                    <SettingsFlow settingsFlowToggle={settingsFlowToggle} />
                    <DeleteIndicatorFlow deleteIndicatorFlowToggle={deleteIndicatorFlowToggle} />

                    {children}
                </div>
            </LunarDataManagerData.Provider>
        </>
    )
}

export { LunarDataManagerData }
export default LunarDataManager