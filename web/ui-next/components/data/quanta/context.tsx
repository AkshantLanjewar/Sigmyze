import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { IQuantaSchema } from "../../quanta/schema-editor/types"
import { IQuantaState } from "./types"
import { DefaultQuantaProject, SaveCounterUtil } from "./utils"

import { 
    IQuantaCategorization, 
    IQuantaEditorProject, 
    IQuantaProjectData, 
    IQuantaSelector, 
    IQuantaSelectorCode, 
    IQuantaTextStore, 
    ProjectSchemas 
} from "./types/project"

import { 
    activateSelector, 
    changeText, 
    openSelector, 
    createElement, 
    initSchema, 
    editSchema,
    getSchema,
    changeSchema,
    deleteSchema,
    unfocusAllSchema,
    GetEditorProjects,
    SetEditorProjectData,
    SaveQuantaProject,
    SetEditorExecutionData,
    rehydrateQuantaProject,
    newSelector,
    addSelectorSource,
    editSelectorAnalysis,
    editPipelineObjects,
    eraseSchema,
    deleteSelector,
    editPipelineLinks,
    setTextValue
} from "./functions"

import { GetProject } from "./quanta-api"
import { UserContextData } from "../user/context"
import { IUserContext } from "../user/types"
import { INodeExecutionResult } from "../../quanta/quanta-editor/execution-engine/context/types"
import { IconFileCode2, IconStack2 } from "@tabler/icons"
import QuantaIndicatorManager from "../../quanta/quanta-indicator-manager"
import { IPipelineAnalysis, IPipelinedData } from "../../quanta/selector-pane/context/types"
import { usePrevious } from "../../ui/debug"
import QuantaUIContext from "./ui-context"
import QuantaCodeContex from "./quanta-code-context"
import { IQuantaRFEdge } from "../../quanta/quanta-editor/types/edges"
import { IQuantaTypeRef } from "../../quanta/quanta-editor/types/node-type"
import { IQuantaRFNode } from "../../quanta/quanta-editor/types/nodes"
import { IQuantaStore } from "../../quanta/quanta-editor/types/store"

interface IQuantaContextProps {
    quantaId: string | null,
    organizationId: string | null,
    children?: JSX.Element | never[]
}

const QuantaContextData = createContext<IQuantaState | null>(null)

const QuantaContext: React.FC<IQuantaContextProps> = ({ quantaId, organizationId, children }) => {
    const [projectData, setProjectData] = useState<IQuantaProjectData | undefined>(undefined)

    //state for the selector
    const [activeSelector, setActiveSelector] = useState<string | null>(null)

    //the datasets schema
    const [schemas, setSchemas] = useState<ProjectSchemas[]>([])
    const prevSchemas = usePrevious(schemas, [])
    const [schemaLoad, setSchemaLoad] = useState(false)

    const [updateSchema, setUpdateSchema] = useState(false)
    const toggleUpdateSchema = () => setUpdateSchema(!updateSchema)

    const [updateEditorSchema, setUpdateEditorSchema] = useState(false)
    const toggleUpdateEditorSchema = () => setUpdateEditorSchema(!updateEditorSchema)

    const [updateEditorIndicators, setUpdateEditorIndicators] = useState(false)
    const toggleUpdateEditorIndicators = () => setUpdateEditorIndicators(!updateEditorIndicators)

    const [publishUpdate, setPublishUpdate] = useState(false)
    const togglePublishUpdate = useCallback(() => setPublishUpdate(!publishUpdate), [publishUpdate])

    //store elements
    const [editorProjects, setEditorProjects] = useState<IQuantaEditorProject[]>([])
    //counter to efficiently save data
    const [saveCounter, setSaveCounter] = useState(0)

    //selectors within the project
    const [selectors, setSelectors] = useState<IQuantaSelector[]>([])
    const [selectorLoad, setSelectorLoad] = useState(false)

    const [selectorsUpdated, setSelectorsUpdated] = useState(false)
    const toggleSelectorsUpdated = () => setSelectorsUpdated(!selectorsUpdated)

    const [dataLoaded, setDataLoaded] = useState(false)
    const [selectorUpdated, setSelectorUpdated] = useState(false)
    const toggleSelectorUpdate = () => setSelectorUpdated(!selectorUpdated)

    //state relating to the text formatters
    const [textStore, setTextStore] = useState<IQuantaTextStore>({})
    const [textLoad, setTextLoad] = useState(false)
    const [textUpdated, setTextUpdated] = useState(false)

    //state relating to the categorization of the dataset
    const [categorize, setCategorize] = useState<IQuantaCategorization | undefined>(undefined)
    const [categorizeLoad, setCategorizeLoad] = useState(false)
    const [categorizeUpdated, setCategorizeUpdated] = useState(false)

    const clearCategorize = () => setCategorize(undefined)
    const toggleCategorizeUpdated = () => setCategorizeUpdated(!categorizeUpdated)
    const toggleTextUpdated = () => setTextUpdated(!textUpdated)

    const { authData } = useContext(UserContextData) as IUserContext

    function saveFunc(caller?: string) {
        let token = authData?.token
        if(token === undefined || organizationId === null || quantaId === null)
            return
        if(dataLoaded === false)
            return

        setSaveCounter(0)
        SaveQuantaProject(
            token, 
            organizationId, 
            quantaId, 
            projectData, 
            editorProjects, 
            schemas, 
            selectors,
            categorize,
            textStore
        )
    }

    useEffect(() => {
        loadQuanta()
    }, [])

    useEffect(() => {
        loadQuanta()
    }, [quantaId, organizationId])

    useEffect(() => {
        SaveCounterUtil(
            dataLoaded,
            textLoad,
            saveCounter,
            setTextLoad,
            toggleTextUpdated,
            setSaveCounter
        )
    }, [textStore])

    useEffect(() => {
        if(projectData === undefined || dataLoaded === false)
            return

        SaveCounterUtil(
            dataLoaded,
            textLoad,
            saveCounter,
            setTextLoad,
            toggleTextUpdated,
            setSaveCounter
        )
    }, [projectData])

    useEffect(() => {
        SaveCounterUtil(
            dataLoaded, 
            categorizeLoad, 
            saveCounter, 
            setCategorizeLoad, 
            toggleCategorizeUpdated, 
            setSaveCounter
        )
    }, [categorize])

    useEffect(() => {
        SaveCounterUtil(
            dataLoaded, 
            selectorLoad,
            saveCounter,
            setSelectorLoad,
            toggleSelectorUpdate,
            setSaveCounter
        )
    }, [selectors])

    useEffect(() => {
        //update the editor
        let token = authData?.token
        if(token === undefined || organizationId === null || quantaId === null)
            return

        setSaveCounter(saveCounter + 1)
    }, [editorProjects])

    useEffect(() => {
        if(dataLoaded === false)
            return
        if(schemaLoad === true) {
            setSchemaLoad(false)
            return
        }

        let oldJson = JSON.stringify(prevSchemas)
        let newJson = JSON.stringify(schemas)
        if(oldJson === newJson)
            return

        saveFunc("caller_schema")
    }, [schemas])

    useEffect(() => {    
        if(dataLoaded === false)
            return
        
        let interval: NodeJS.Timer | undefined = undefined
        if(saveCounter !== 50 && saveCounter > 0)
            interval = setInterval(() => {
                saveFunc("caller_save_1")
            }, 1000 * 15)
        else if (saveCounter === 50)
            saveFunc("caller_save_2")

        return () => {
            if(interval === undefined)
                return

            clearInterval(interval)
        }
    }, [saveCounter])

    //NOTE: Theese are the functions relating to the context
    
    //NOTE: This function changes the tab to the specified tabs string
    //Note this function focuses to a tab within the editor

    const changeTextCallback = useCallback((text: string, field: "title" | "id" | "desc") => {
        return changeText(text, field, projectData, setProjectData)
    }, [projectData])

    const activateSelectorCallback = useCallback((selectorId: string) => {
        return activateSelector(selectorId, setActiveSelector)
    }, [])

    const openSelectorCallback = useCallback((selectorId: string) => {
        return openSelector(selectorId, projectData, setActiveSelector)
    }, [projectData])

    const getSchemaCallback = useCallback((parentId: string) => {
        return getSchema(parentId, schemas)
    }, [schemas])

    const changeSchemaCallback = useCallback((parentId: string, nSchema: IQuantaSchema) => {
        return changeSchema(parentId, nSchema, schemas, setSchemas, toggleUpdateEditorSchema)
    }, [schemas, toggleUpdateEditorSchema])

    const initSchemaCallback = useCallback((parentId: string) => {
        return initSchema(parentId, schemas, setSchemas, toggleUpdateEditorSchema) 
    }, [schemas, toggleUpdateEditorSchema])

    const createElementCallback = useCallback((parentId: string, nodeId: string, fieldName?: string) => {
        return createElement(
            parentId, 
            nodeId, 
            getSchemaCallback(parentId), 
            fieldName, 
            changeSchemaCallback, 
            toggleUpdateEditorSchema
        )
    }, [getSchemaCallback, changeSchemaCallback, toggleUpdateEditorSchema])

    const editSchemaCallback = useCallback((
        parentId: string,
        nodeId: string, 
        type: "edit_text" | "edit_type", 
        text: string, 
        node_type: IQuantaTypeRef | undefined
    ) => {
        return editSchema(
            parentId, 
            nodeId, 
            type, 
            text, 
            node_type, 
            getSchemaCallback(parentId), 
            changeSchemaCallback, 
            toggleUpdateSchema,
            toggleUpdateEditorSchema
        )
    }, [getSchemaCallback, changeSchemaCallback, toggleUpdateSchema, toggleUpdateEditorSchema])

    const deleteElementCallback = useCallback((parentId: string, nodeId: string) => {
        return deleteSchema(parentId, nodeId, getSchemaCallback(parentId), changeSchemaCallback, toggleUpdateEditorSchema)
    }, [getSchemaCallback, changeSchemaCallback, toggleUpdateEditorSchema])

    const eraseSchemaCallback = useCallback((parentId: string) => {
        return eraseSchema(parentId, schemas, setSchemas)
    }, [schemas])

    const unfocusAllCallback = useCallback((parentId: string) => {
        return unfocusAllSchema(parentId, getSchemaCallback(parentId), changeSchemaCallback)
    }, [getSchemaCallback, changeSchemaCallback])

    const getEditorProjectCallback = useCallback((fileId: string) => {
        return GetEditorProjects(fileId, editorProjects)
    }, [editorProjects])

    const setEditorProjectCallback = useCallback((
        fileId: string, 
        nodes: IQuantaRFNode[], 
        edges: IQuantaRFEdge[], 
        quantaStore: IQuantaStore, 
        executionResults: INodeExecutionResult[]
    ) => {
        return SetEditorProjectData(fileId, nodes, edges, quantaStore, editorProjects, executionResults, setEditorProjects)
    }, [editorProjects])

    const setEditorExecutionCallback = useCallback((fileId: string, executionResults: INodeExecutionResult[]) => {
        return SetEditorExecutionData(fileId, executionResults, editorProjects, setEditorProjects)
    }, [editorProjects])

    const newSelectorCallback = useCallback((selectorName: string, selectorId: string) => {
        return newSelector(selectorName, selectorId, selectors, setSelectors, toggleSelectorsUpdated)
    }, [toggleSelectorsUpdated, selectors])

    const addSelectorSourceCallback = useCallback((selectorId: string, selectorSource: IQuantaSelectorCode) => {
        return addSelectorSource(selectorId, selectorSource, selectors, setSelectors)
    }, [selectors])

    const editSelectorAnalysisCallback = useCallback((selectorId: string, analysis: IPipelineAnalysis[]) => {
        return editSelectorAnalysis(selectorId, analysis, selectors, setSelectors)
    }, [selectors])

    const editPipelineObjectsCallback = useCallback((selectorId: string, data: IPipelinedData[]) => {
        return editPipelineObjects(selectorId, data, selectors, setSelectors)
    }, [selectors])

    const editPipelineLinksCallback = useCallback((selectorId: string, links: {[key: string]: string}) => {
        return editPipelineLinks(selectorId, links, selectors, setSelectors)
    }, [selectors])

    const deleteSelectorCallback = useCallback((selectorId: string) => {
        return deleteSelector(
            selectorId, 
            selectors, 
            eraseSchemaCallback, 
            setSelectors, 
            setActiveSelector, 
            toggleSelectorsUpdated
        )
    }, [selectors, toggleSelectorsUpdated])

    const editTextCallback = useCallback((id: string, val: string) => {
        setTextValue(id, val, textStore, setTextStore)
        toggleTextUpdated()
    }, [textStore])

    const setCategorizationCallback = useCallback((mapsTo: string, categoriesMap: { [key: string]: string[] }) => {
        const nCategorization = {
            fileName: "categories.json",
            mapsTo: mapsTo,
            categories: Object.keys(categoriesMap),
            categoriesMap: categoriesMap
        } as IQuantaCategorization

        setCategorize({ ...nCategorization })
    }, [])

    const memoValue: IQuantaState = useMemo(() => {
        let internalValue: IQuantaState = {} as IQuantaState
        internalValue.project_data = { ...projectData }
        if(internalValue.project_data !== undefined)
            internalValue.project_data.dataset_schema = schemas
        if(internalValue.project_data.store === undefined)
            internalValue.project_data.store = { selectors: [] }

        internalValue.project_data.store.editorProjects = editorProjects
        internalValue.project_data.store.selectors = selectors
        internalValue.editorProjects = editorProjects
        internalValue.selectors = selectors

        internalValue.textStore = textStore
        internalValue.textUpdated = textUpdated
        internalValue.categorization = categorize
        internalValue.updateCategorization = categorizeUpdated
        internalValue.updateEditorIndicators = updateEditorIndicators
        internalValue.toggleUpdateEditorIndicators = toggleUpdateEditorIndicators
        internalValue.publishUpdate = publishUpdate

        internalValue.updateEditorSchema = updateEditorSchema
        internalValue.updateSchema = updateSchema
        internalValue.activeSelectorId = activeSelector
        internalValue.dataLoaded = dataLoaded
        internalValue.organizationId = organizationId
        internalValue.quantaId = quantaId
        internalValue.selectorsUpdated = selectorUpdated
        internalValue.schemas = schemas

        //NOTE: Theese are the functions relating to the context
        //function handles publish status updated
        internalValue.togglePublishUpdate = togglePublishUpdate
        //this function handles changing a text field
        internalValue.changeText = changeTextCallback
        //this function activates a selector
        internalValue.activateSelector = activateSelectorCallback
        //this function opens a selector in the selector view
        internalValue.openSelector = openSelectorCallback
        //this function retreives a schema from the list of schemas
        internalValue.getSchema = getSchemaCallback
        //this function edits a schema within the context
        internalValue.changeSchema = changeSchemaCallback
        //this function initializes a schema
        internalValue.initSchema = initSchemaCallback
        //this function adds an item to the schema
        internalValue.createElement = createElementCallback
        //this function edits a schemas value
        internalValue.editSchema = editSchemaCallback
        //deletes an element from the schema
        internalValue.deleteElement = deleteElementCallback
        //erases an entire schema from the project
        internalValue.eraseSchema = eraseSchemaCallback
        //unfocuses all schemas in their UI view
        internalValue.unfocusAll = unfocusAllCallback
        //gets an editor project
        internalValue.getEditorProject = getEditorProjectCallback
        //updates an editor project
        internalValue.setEditorProject = setEditorProjectCallback
        //sets the execution result within the project
        internalValue.setEditorExecution = setEditorExecutionCallback
        //creates a selector in the project
        internalValue.newSelector = newSelectorCallback
        //sets the source code of a selector
        internalValue.addSelectorSource = addSelectorSourceCallback
        //edits the saved analysis for a selector
        internalValue.editSelectorAnalysis = editSelectorAnalysisCallback
        //persists the pipelined data to project
        internalValue.editPipelineObjects = editPipelineObjectsCallback
        //changes a selector's pipeline links
        internalValue.editPipelineLinks = editPipelineLinksCallback
        //deletes a selector
        internalValue.deleteSelector = deleteSelectorCallback
        //clears the categories from the project
        internalValue.clearCategorization = clearCategorize
        //sets the categories for the project
        internalValue.setCategorization = setCategorizationCallback
        //edits a text store in the project
        internalValue.editText = editTextCallback

        return internalValue
    }, [
        publishUpdate,
        togglePublishUpdate,
        projectData, 
        schemas, 
        editorProjects, 
        selectors, 
        textStore, 
        textUpdated, 
        categorize, 
        categorizeUpdated,
        updateEditorIndicators,
        toggleUpdateEditorIndicators,
        updateEditorSchema,
        updateSchema,
        activeSelector,
        dataLoaded,
        organizationId,
        quantaId,
        selectorUpdated,
        schemas,
        editTextCallback,
        setCategorizationCallback,
        clearCategorize,
        deleteSelectorCallback,
        editPipelineLinksCallback,
        editPipelineObjectsCallback,
        editSelectorAnalysisCallback,
        addSelectorSourceCallback,
        newSelectorCallback,
        setEditorExecutionCallback,
        setEditorProjectCallback,
        getEditorProjectCallback,
        unfocusAllCallback,
        eraseSchemaCallback,
        deleteElementCallback,
        editSchemaCallback,
        createElementCallback,
        initSchemaCallback,
        changeSchemaCallback,
        getSchemaCallback,
        openSelectorCallback,
        activateSelectorCallback,
        changeTextCallback
    ])

    //function that loads the quanta data
    function loadQuanta() {
        if(quantaId === null) {
            let defaultProject = DefaultQuantaProject()
            setProjectData({ ...defaultProject })
            return
        }

        const icon_dict = {
            file: <IconFileCode2 />,
            stack_2: <IconStack2 />
        } as any

        //otherwise load the project from the server
        async function main() {
            let token = authData?.token
            if(organizationId === null || token === undefined)
                return

            let project = await GetProject(token, organizationId, quantaId!)
            if(project === undefined)
                return

            let projectData = project.project_data
            if(projectData === undefined)
                return

            projectData = rehydrateQuantaProject(projectData, icon_dict)
            setProjectData({ ...projectData })

            let schema = projectData.dataset_schema
            if(schema !== undefined) {
                setSchemas([ ...schema ])
                setSchemaLoad(true)
            }

            let projectTextStore = projectData.store?.textStore
            if(projectTextStore !== undefined) {
                setTextStore({ ...projectTextStore })
                setTextLoad(true)
            }

            let editorProjects = projectData.store?.editorProjects
            if(editorProjects !== undefined)
                setEditorProjects([ ...editorProjects ])

            let loadedSelectors = projectData.store?.selectors
            if(loadedSelectors !== undefined) {
                setSelectors([ ...loadedSelectors ])
                setSelectorLoad(true)
            }

            let loadedCategorize = projectData.store?.categorization
            if(loadedCategorize !== undefined) {
                setCategorize({ ...loadedCategorize })
                setCategorizeLoad(true)
            }

            toggleUpdateSchema()
            toggleUpdateEditorSchema()
            toggleSelectorUpdate()

            setDataLoaded(true)
        }

        main()
    }

    return (
        <>
            <QuantaContextData.Provider value={memoValue}>
                <QuantaIndicatorManager>
                    <QuantaCodeContex quantaId={quantaId}>
                        <QuantaUIContext projectData={projectData}>
                            <div style={{ width: "100%", height: "100%" }}>
                                {children}
                            </div>
                        </QuantaUIContext>
                    </QuantaCodeContex>
                </QuantaIndicatorManager>
            </QuantaContextData.Provider>
        </>
    )
}

export { QuantaContextData }
export default QuantaContext