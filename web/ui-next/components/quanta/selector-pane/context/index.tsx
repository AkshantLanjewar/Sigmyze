import { createContext, useContext, useEffect, useState } from "react"
import { IPipelineAnalysis, IPipelinedData, ISelectorPaneState } from "./types"
import { v4 } from "uuid"
import { SocketHandlerData } from "../../../ui/socket-handler"
import { ISocketHandlerState } from "../../../ui/socket-handler/types"
import { addPipelineObject, compileProject, initExecutionContext, removePipelineObject, setSelectorLink } from "./functions"
import SelectorFrameTester from "../selector-frame-tester"
import { IQuantaSelectorCode, ISelectorPipeline } from "../../../data/quanta/types/project"
import { QuantaContextData } from "../../../data/quanta/context"
import { IQuantaState } from "../../../data/quanta/types"
import { ISelectorPipelineOptions } from "../selector-pipeline"
import PipelineAnalyzer from "../selector-pipeline-analysis"

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

    const [analyzePipeline, setAnalyzePipeline] = useState(false)
    const toggleAnalyzePipeline = () => setAnalyzePipeline(true)

    const [pipelineAnalysis, setPipelineAnalysis] = useState<IPipelineAnalysis[]>([])
    const [analysisLoading, setAnalysisLoading] = useState(false)
    const clearAnalysis = () => setPipelineAnalysis([])

    const [extPipelineObjectLoaded, setExtPipelineObjectLoaded] = useState(false)
    const [extPipelineAnalysisLoaded, setExtPipelineAnalysisLoaded] = useState(false)

    const { socketCreated, executeSocketFunction } = useContext(SocketHandlerData) as ISocketHandlerState
    const { addSelectorSource, editPipelineObjects, editSelectorAnalysis } = useContext(QuantaContextData) as IQuantaState
    
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

        if(_pipelinedObjects !== undefined && pipelinedObjects.length === 0) {
            setPipelinedObject([ ..._pipelinedObjects ])
            setExtPipelineObjectLoaded(true)
        } else if (analysisObjects !== undefined && pipelineAnalysis.length === 0) {
            setPipelineAnalysis([ ...analysisObjects ])
            setExtPipelineAnalysisLoaded(true)
        }
    }, [extSelectorPipeline])

    useEffect(() => {
        if(selectorCode === null)
            return

        setTestSource(null)
        addSelectorSource(selectorId, selectorCode)
    }, [selectorCode])

    let value = {} as ISelectorPaneState
    value.initialized = initialized
    value.selectorCode = selectorCode
    value.pipelinedObjects = pipelinedObjects
    value.analyzePipeline = analyzePipeline
    value.analyzePipelineLoading = analysisLoading
    value.pipelineAnalysis = pipelineAnalysis

    value.setTestSource = setTestSource
    value.setSelectorCode = setSelectorCode

    value.compileProject = (projectData: string) =>
        compileProject(compilationId, projectData, executeSocketFunction)
    
    value.setSelectorLink = (datasetId: string, selectorId: string) =>
        setSelectorLink(datasetId, selectorId, selectorCode, setSelectorCode)

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