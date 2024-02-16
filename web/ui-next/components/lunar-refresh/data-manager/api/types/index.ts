import { IStatus } from "../../../../data/datasets/DatasetsTypes"

/**
 * This is the interface that defines the response from the Lunar API's create endpoint
 */
interface ILunarCreateResponse {
    /**
     * The status of the request, can either have an error with the request or not
     */
    status?: IStatus,

    /**
     * Whether or not a new ID was generated for the project that is different from its old id
     */
    newId?: string

    /**
     * @description
     *  - This is the function that validates whether or not this request was successfull
     * @returns
     *  boolean value
     */
    validate?: () => boolean
}


/**
 * This is the class that implements the ILunarCreateResponse interface
 */
class LunarCreateResponse implements ILunarCreateResponse {
    status?: IStatus | undefined = undefined
    newId?: string | undefined = undefined

    /**
     * @description
     *  - this is the constructor for the lunar create response
     * @param status 
     *  - the status of the response
     * @param newId 
     *  - the potential new id of the response
     */
    constructor(resp: ILunarCreateResponse) {
        this.status = resp.status 
        this.newId = resp.newId 
    }

    validate = () => {
        if(this.status === undefined || this.status?.error === true)
            return false

        return true
    }
}


export * from './project-data'
export * from './body'

export type { ILunarCreateResponse }
export { LunarCreateResponse }