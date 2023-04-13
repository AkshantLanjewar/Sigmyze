import { v4 } from "uuid"

interface ICompileProjectBody {
    data: string
}

function compileProject(
    compilationId: string,
    projectData: string,
    executeSocketFunction: (processId: string, nodeId: string, functionId: string, outputIds: string[], functionData: any, cb: (val: string) => void) => string | undefined
) {
    const nodeId = v4()
    const functionId = "compile_project"
    const outputIds = [] as string[]
    const functionData: ICompileProjectBody = {
        data: projectData
    }

    const promise = new Promise((resolve, reject) => {
        const handler = (val: string) => {
            
        }
    
        executeSocketFunction(
            compilationId,
            nodeId,
            functionId,
            outputIds,
            functionData,
            handler
        )
    })

    return promise
}

export { compileProject }