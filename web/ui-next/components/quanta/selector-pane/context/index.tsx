import { createContext, useContext, useEffect, useState } from "react"
import { IPipelineAnalysis, IPipelinedData, ISelectorPaneState } from "./types"
import { v4 } from "uuid"
import { SocketHandlerData } from "../../../ui/socket-handler"
import { ISocketHandlerState } from "../../../ui/socket-handler/types"
import SelectorFrameTester from "../selector-frame-tester"
import { IQuantaSelector, IQuantaSelectorCode, ISelectorPipeline } from "../../../data/quanta/types/project"
import { QuantaContextData } from "../../../data/quanta/context"
import { IQuantaState } from "../../../data/quanta/types"
import { ISelectorPipelineOptions } from "../selector-pipeline"
import PipelineAnalyzer from "../selector-pipeline-analysis"
import { buildQuery } from "../../selector-frame"
import { IQuantaQuery } from "../../selector-frame/types"
import { 
    addPipelineObject, 
    compileProject, 
    initExecutionContext, 
    removePipelineObject, 
    setReservedLink, 
    setSelectorLink 
} from "./functions"

const SelectorPaneContextData = createContext<ISelectorPaneState | null>(null)

interface ISelectorPaneProps {
    selectorId: string,
    extSelectorCode?: IQuantaSelectorCode,
    extSelectorPipeline?: ISelectorPipeline,
    children?: React.ReactNode
}

const SelectorPaneContext: React.FC<ISelectorPaneProps> = ({ selectorId, extSelectorCode, extSelectorPipeline, children }) => {
    const [initialized, setInitialized] = useState(false)
    const [compilationId, setCompilationId] = useState(v4())
    
    //relates to testing the selectors code
    const [testSource, setTestSource] = useState<string | null>(null)
    const [selectorCode, setSelectorCode] = useState<IQuantaSelectorCode | null>(null)
    //this is pipelined object within the data
    const [pipelinedObjects, setPipelinedObject] = useState<IPipelinedData[]>([])
    const [pipelineLinks, setPipelineLinks] = useState<{[key: string]: string}>({})

    const [analyzePipeline, setAnalyzePipeline] = useState(false)
    const toggleAnalyzePipeline = () => setAnalyzePipeline(true)

    const [pipelineAnalysis, setPipelineAnalysis] = useState<IPipelineAnalysis[]>([])
    const [analysisLoading, setAnalysisLoading] = useState(false)
    const clearAnalysis = () => setPipelineAnalysis([])

    const [extPipelineObjectLoaded, setExtPipelineObjectLoaded] = useState(false)
    const [extPipelineAnalysisLoaded, setExtPipelineAnalysisLoaded] = useState(false)
    const [extLinksLoaded, setExtLinksLoaded] = useState(false)

    const [previousQuery, setPreviousQuery] = useState<IQuantaQuery[] | undefined>(undefined)

    const { socketCreated, executeSocketFunction } = useContext(SocketHandlerData) as ISocketHandlerState
    const { 
        addSelectorSource, 
        editPipelineObjects, 
        editSelectorAnalysis,
        editPipelineLinks,
        selectorsUpdated,
        selectors,
        getSchema 
    } = useContext(QuantaContextData) as IQuantaState

    //we need to build an example query based on the default value of all the other selectors
    useEffect(() => {
        setPreviousQuery([])
        let prevSelectors = [] as IQuantaSelector[]
        let datasetSchema = getSchema('dataset')
        
        if(datasetSchema === undefined)
            return

        for(let i = 0; i < selectors.length; i++) {
            let tmpSelector = selectors[i]
            if(tmpSelector.selectorId === selectorId)
                break

            prevSelectors.push(tmpSelector)
        }

        //for each selector we need three things
        // its schema, the collected data(string) and the links between its schema and the dataset overall
        let query = [] as IQuantaQuery[]
        for(let i = 0; i < prevSelectors.length; i++) {
            let querySelector = prevSelectors[i]
            if(querySelector.selectorCode === undefined)
                continue

            let queryData = querySelector.selectorCode.defaultValue
            let links = querySelector.selectorCode.selectorLinks
            let schemaId = querySelector.selectorId
            if(schemaId === undefined)
                continue
            
            let schema = getSchema(schemaId)
            if(schema === undefined || links === undefined)
                continue

            let resQuery = buildQuery(queryData, links, schema, datasetSchema)
            if(resQuery === undefined)
                continue

            query = [ ...query, ...resQuery ]
        }

        setPreviousQuery([ ...query ])
    }, [selectorsUpdated, selectorId])
    
    useEffect(() => {
        if(extLinksLoaded === true) {
            setExtLinksLoaded(false)
            return
        }

        editPipelineLinks(selectorId, pipelineLinks)
    }, [pipelineLinks])

    useEffect(() => {
        if(extPipelineObjectLoaded === true) {
            setExtPipelineObjectLoaded(false)
            return
        }

        editPipelineObjects(selectorId, pipelinedObjects)
    }, [pipelinedObjects])

    useEffect(() => {
        if(extPipelineAnalysisLoaded === true) {
            setExtPipelineAnalysisLoaded(false)
            return
        }

        editSelectorAnalysis(selectorId, pipelineAnalysis)
    }, [pipelineAnalysis])

    useEffect(() => {
        async function main() {
            if(socketCreated === false)
                return

            await initExecutionContext(
                compilationId,
                setInitialized,
                executeSocketFunction
            )
        }

        main()
    }, [socketCreated])

    useEffect(() => {
        if(extSelectorCode === undefined)
            return
        if(selectorCode !== null)
            return

        setSelectorCode({ ...extSelectorCode })
    }, [extSelectorCode])

    useEffect(() => {
        if(extSelectorPipeline === undefined)
            return

        let _pipelinedObjects = extSelectorPipeline.pipelinedObjects
        let analysisObjects = extSelectorPipeline.pipelineAnalysis
        let _pipelineLinks = extSelectorPipeline.pipelineLinks 

        if(_pipelinedObjects !== undefined && pipelinedObjects.length === 0) {
            setPipelinedObject([ ..._pipelinedObjects ])
            setExtPipelineObjectLoaded(true)
        } if (analysisObjects !== undefined && pipelineAnalysis.length === 0) {
            setPipelineAnalysis([ ...analysisObjects ])
            setExtPipelineAnalysisLoaded(true)
        } if(_pipelineLinks !== undefined) {
            setPipelineLinks({ ..._pipelineLinks })
            setExtLinksLoaded(true)
        }
    }, [extSelectorPipeline])

    useEffect(() => {
        if(selectorCode === null)
            return

        setTestSource(null)
        addSelectorSource(selectorId, selectorCode)
    }, [selectorCode])

    //HANDLE THE CHANGING OF THE SELECTOR ID
    useEffect(() => {
        let newSelector = undefined
        for(let i = 0; i < selectors.length; i++) {
            let selector = selectors[i]
            if(selector.selectorId === selectorId)
                newSelector = selector
        }

        if(newSelector === undefined)
            return

        let nSelectorCode: IQuantaSelectorCode | undefined | null = newSelector.selectorCode
        if(nSelectorCode === undefined)
            nSelectorCode = null

        let selectorPipeline = newSelector.selectorPipeline
        let nObjects = selectorPipeline?.pipelinedObjects
        let nAnalysis = selectorPipeline?.pipelineAnalysis
        let nLinks = selectorPipeline?.pipelineLinks

        let nPipelineObjects = [] as IPipelinedData[]
        let nPipelineAnalysis = [] as IPipelineAnalysis[]
        let nPipelineLinks = {} as {[key: string]: string}

        //set the ext's so we dont needlesly update the quanta struct
        setExtLinksLoaded(true)
        setExtPipelineAnalysisLoaded(true)
        setExtPipelineObjectLoaded(true)

        if(nObjects !== undefined)
            nPipelineObjects = nObjects
        if(nAnalysis !== undefined)
            nPipelineAnalysis = nAnalysis
        if(nLinks !== undefined)
            nPipelineLinks = nLinks

        setPipelinedObject([ ...nPipelineObjects ])
        setPipelineAnalysis([ ...nPipelineAnalysis ])
        setPipelineLinks({ ...nPipelineLinks })
        setSelectorCode(nSelectorCode)
    }, [selectorId])

    let value = {} as ISelectorPaneState
    value.initialized = initialized
    value.selectorCode = selectorCode
    value.pipelinedObjects = pipelinedObjects
    value.analyzePipeline = analyzePipeline
    value.analyzePipelineLoading = analysisLoading
    value.pipelineAnalysis = pipelineAnalysis
    value.pipelineLinks = pipelineLinks

    value.setTestSource = setTestSource
    value.setSelectorCode = setSelectorCode

    value.compileProject = (projectData: string) =>
        compileProject(compilationId, projectData, executeSocketFunction)
    
    value.setSelectorLink = (datasetId: string, selectorId: string) =>
        setSelectorLink(datasetId, selectorId, selectorCode, setSelectorCode)

    value.setPipelineLink = (reservedId: string, selectorId: string) =>
        setReservedLink(reservedId, selectorId, pipelineLinks, setPipelineLinks)

    value.addPipelineObject = (object: ISelectorPipelineOptions) =>
        addPipelineObject(object, pipelinedObjects, setPipelinedObject, toggleAnalyzePipeline)

    value.deletePipelineObject = (objectId: string) =>
        removePipelineObject(objectId, pipelinedObjects, setPipelinedObject, toggleAnalyzePipeline)

    value.clearAnalysis = clearAnalysis
    value.toggleAnalyzePipeline = toggleAnalyzePipeline
    value.setPipelineLoading = setAnalysisLoading
    value.setAnalyzePipeline = setAnalyzePipeline

    return (
        <>
            <SelectorPaneContextData.Provider value={value}>
                <div style={{ width: '100%', height: '100%' }}>
                    <PipelineAnalyzer 
                        selectorId={selectorId} 
                        setPipelineAnalysis={setPipelineAnalysis}
                    />

                    <SelectorFrameTester 
                        source={testSource} 
                        selectorId={selectorId}
                    />

                    {children}
                </div>
            </SelectorPaneContextData.Provider>
        </>
    )
}

export { SelectorPaneContextData }
export default SelectorPaneContext