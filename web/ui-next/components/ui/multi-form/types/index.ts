import { IRawFragmentTemplateProps } from './templates'

interface IMultiCollectedPayload {
    [key: string]: string | undefined // the key is the part id, and the string is its output   
}

interface IFormPart {
    //this is the title for the form part in the multi part form
    title?: string,
    //this is the type used to build the form, whether it is a raw JSX element, or a form builder
    type?: "raw",
    //part id is assigned by the component
    partId?: string,
    //this is the raw component used if it is the raw type
    rawFragment?: React.FC<IRawFragmentTemplateProps>,
    //this is the key in the submitted output payload
    outputKey?: string
}

const validateFormPart = (part: IFormPart): boolean => {
    let type = part.type
    if(part.title === undefined || type === undefined || part.outputKey === undefined)
        return false

    switch(type) {
        case "raw":
            if(part.rawFragment === undefined)
                return false

            return true
        default:
            return false
    }
}

export * from './templates'
export type { IFormPart, IMultiCollectedPayload }
export { validateFormPart }