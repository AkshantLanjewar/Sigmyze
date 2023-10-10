import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { ILunarChart, ILunarDataManagerState, ILunarNote, ILunarProject } from "./state"
import { UserContextData } from "../../data/user/context"
import { IUserContext } from "../../data/user/types"
import { convertSigmyzeToSimple, convertSimpleFilesystem, generateDefaultProject } from "./functions"
import { ISigmyzeFilesystem, ISimpleFilesystem } from "../../ui/file-management/types"
import { LunarUIContextData } from "../ui-context"
import { ILunarUIState } from "../ui-context/state"

const LunarDataManagerData = createContext<ILunarDataManagerState | null>(null)

interface ILunarDataManagerProps {
    children: React.ReactNode
}

const LunarDataManager: React.FC<ILunarDataManagerProps> = ({ children }) => {
    //this is the lunar project being loaded in
    const [lunarProject, setLunarProject] = useState<ILunarProject | undefined>(undefined)
    //this is the charts in the project (detached for easier editing)
    const [charts, setCharts] = useState<ILunarChart[]>([])
    //theese are the notes in the project (detached for easier editing)
    const [notes, setNotes] = useState<ILunarNote[]>([])
    //this is the simpleform version of the filesystem
    const [fileSystem, setFilesystem] = useState<ISimpleFilesystem | undefined>(undefined)
    //this flag is so that we dont update the tracked simplefilesystem when a change occurs to the more complex shape
    const ignoreFilesystemSIG = useRef<boolean>(false)
    //this flag is so that we dont update the sigmyzefilesystem when we update the filesystem
    const ignoreFilesystemSIM = useRef<boolean>(false)

    const { authData } = useContext(UserContextData) as IUserContext
    const { 
        debugMode, 
        loadedFilesystem, 
        setLoadedFilesystem, 
        resetActive, 
        activeItemId,
        messagesLeft,
        consumeSynchroMessage 
    } = useContext(LunarUIContextData) as ILunarUIState

    //internal methods

    /**
     * this functions sets the necessary flags in order to make updating the ui filesystem easier
     */
    const updateUIFilesystem = useCallback((filesystem: ISigmyzeFilesystem) => {
        ignoreFilesystemSIG.current = true
        setLoadedFilesystem({ ...filesystem })
    }, [])

    /**
     * this function sets the necessary flags in order to make updating the simple filesystem easier
     */
    const updateDataFilesystem = useCallback((fileSystem: ISimpleFilesystem) => {
        ignoreFilesystemSIM.current = true
        setFilesystem({ ...fileSystem })
    }, [])

    /**
     * NOTE: This function should only be used within the data context
     * 
     * @description
     *  - this is the function that handles the creation of a new chart within the data context.
     * @param chartName
     *  - this is the name for the new chart
     * @param chartId
     *  - this is the id for the new chart
     */
    const createNewChart = useCallback((chartName: string, chartId: string) => {
        const newChart: ILunarChart = {
            name: chartName,
            objectId: chartId
        }

        setCharts([ ...charts, newChart ])
    }, [charts])

    /**
     * NOTE: This function should only be used within the data context
     * 
     * @description
     *  - this is the function that handles the creation ofa new note within the data context.
     * @param name
     *  - this is the name for the new note
     * @param id
     *  - this is the fileId for the new note
     */
    const createNewNote = useCallback((name: string, id: string) => {
        const newNote: ILunarNote = {
            name: name,
            objectId: id
        }

        setNotes([ ...notes, newNote ])
    }, [notes])

    /**
     * NOTE: This function should only be used within the data context
     * 
     * @description
     *  - this is the function that handles the deletion of a chart within the data context
     * @param fileId
     *  - this is the id of the chart we are going to delete
     */
    const deleteChart = useCallback((fileId: string) => {
        let newCharts: ILunarChart[] = []
        for(let i = 0; i < charts.length; i++) {
            let chart = charts[i]
            if(chart.objectId === fileId)
                continue

            newCharts.push(chart)
        }

        setCharts([ ...newCharts ])
    }, [charts])

    /**
     * NOTE: This function should only be used within the data context
     * 
     * @description
     *  - this is the function that handles the deletion of a note within the data context
     * @param fileId
     *  - this is the id of the note we are going to delete
     */
    const deleteNote = useCallback((fileId: string) => {
        let newNotes: ILunarNote[] = []
        for(let i = 0; i < notes.length; i++) {
            let note = notes[i]
            if(note.objectId === fileId)
                continue

            newNotes.push(note)
        }

        setNotes([ ...newNotes ])
    }, [notes])

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
    }, [fileSystem, lunarProject, charts, notes])


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