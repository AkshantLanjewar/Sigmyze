import { Dispatch, SetStateAction, useContext, useEffect } from "react"
import { SelectorPaneContextData } from "../context"
import { IPipelineAnalysis, ISelectorPaneState } from "../context/types"
import { v4 } from "uuid"
import { QuantaContextData } from "../../../data/quanta/context"
import { IQuantaState } from "../../../data/quanta/types"
import { UserContextData } from "../../../data/user/context"
import { IUserContext } from "../../../data/user/types"
import { CreateExecutionCache, DeleteExecutionCache } from "../../../data/quanta/quanta-api"
import { IAnalyzePipelineFields, IAnalyzeResponse, ILoadPipelineIndicatorsBody } from "./messages"
import { SocketHandlerData } from "../../../ui/socket-handler"
import { ISocketHandlerState } from "../../../ui/socket-handler/types"
import { IQuantaSchema } from "../../schema-editor/types"
import { showNotification } from "@mantine/notifications"

interface IPipelineAnalyzerProps {
    selectorId: string,
    setPipelineAnalysis: Dispatch<SetStateAction<IPipelineAnalysis[]>>
}

const PipelineAnalyzer: React.FC<IPipelineAnalyzerProps> = ({ selectorId, setPipelineAnalysis }) => {
    const { quantaId, organizationId, getSchema } = useContext(QuantaContextData) as IQuantaState
    const { authData } = useContext(UserContextData) as IUserContext
    const { executeSocketFunction, socketCreated } = useContext(SocketHandlerData) as ISocketHandlerState
    const { 
        analyzePipeline, 
        clearAnalysis, 
        pipelinedObjects, 
        setAnalyzePipeline,
        setPipelineLoading 
    } = useContext(SelectorPaneContextData) as ISelectorPaneState

    const executeHandler = (processId: string, functionId: string, body: any) => {
        const promise = new Promise<string>((resolve, reject) => {
            const handler = (val: string) => {
                resolve(val)
            }

            executeSocketFunction(
                processId,
                v4(),
                functionId, 
                [],
                body,
                handler
            )
        })

        return promise
    }

    async function analyze() {
        function exit() {
            setAnalyzePipeline(false)
            setPipelineLoading(false)
        }

        setPipelineLoading(true)
        clearAnalysis()
        if(socketCreated === false || pipelinedObjects.length === 0) {
            exit()
            return
        }

        const processId = v4()
        const token = authData?.token
        if(token === undefined || quantaId === null || organizationId === null) {
            exit()
            return
        }

        await CreateExecutionCache(token, organizationId, quantaId, processId)

        let functionId = "load_indicators_analysis"
        let body: ILoadPipelineIndicatorsBody | any = {
            organizationId: organizationId,
            quantaId: quantaId
        }

        let loadRes = await executeHandler(processId, functionId, body)
        let schemaChildren = getSchema("dataset")?.children
        if(loadRes !== "success" || schemaChildren === undefined) {
            setAnalyzePipeline(false)
            setPipelineLoading(false)
            await DeleteExecutionCache(token, organizationId, quantaId, processId)
            
            return
        }

        let fieldsToAnalyze = [] as string[]
        for(let i = 0; i < pipelinedObjects.length; i++) {
            let pipelinedObject = pipelinedObjects[i]
            if(pipelinedObject.pipeline_type === "selected")
                continue

            let dataset_id = pipelinedObject.dataset_id
            let selected_dataset: IQuantaSchema | undefined = undefined
            for(let x = 0; x < schemaChildren.length; x++) {
                let child = schemaChildren[x]
                if(child.nodeId === dataset_id)
                    selected_dataset = child
            }


            let field_name = selected_dataset?.name
            if(field_name === undefined)
                continue

            fieldsToAnalyze.push(field_name)
        }

        functionId = "analyze_fields"
        body = { fieldNames: fieldsToAnalyze } as IAnalyzePipelineFields
        let analyzeRes = await executeHandler(processId, functionId, body)

        try {
            let parsed: IAnalyzeResponse = JSON.parse(analyzeRes)
            if(parsed.analysisResults === undefined) {
                setAnalyzePipeline(false)
                setPipelineLoading(false)
                await DeleteExecutionCache(token, organizationId, quantaId, processId)

                return
            }

            let results = parsed.analysisResults
            setPipelineAnalysis([ ...results ])
        } catch (error) {
            //do nothing
            showNotification({
                title: "Analysis Error",
                message: `Error with analysis -> ${error}`,
                color: 'red',
                autoClose: 1000 * 5
            })
        } finally {
            await DeleteExecutionCache(token, organizationId, quantaId, processId)
            setAnalyzePipeline(false)
            setPipelineLoading(false)
        }

        exit()
    }

    useEffect(() => {
        if(analyzePipeline !== true)
            return

        analyze()
    }, [analyzePipeline])

    return (
        <>
        </>
    )
}

export default PipelineAnalyzer