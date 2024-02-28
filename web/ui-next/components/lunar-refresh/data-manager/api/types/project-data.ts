import { IStatus } from "../../../../data/datasets/DatasetsTypes";
import { ISimpleFilesystem } from "../../../../ui/file-management/types";
import { ILunarChart, ILunarNote } from "../../state";

/**
 * This is the interface that defines the project data that is returned from the endpoint
 */
interface ILunarProjectData {
    /**
     * These are the notes that were stored in the db for the project
     */
    notes?: ILunarNote[],

    /**
     * These are the charts that were stored in the db for the project
     */
    charts?: ILunarChart[],

    /**
     * This is the filesystem that was stored in the db 
     */
    fileSystem?: ISimpleFilesystem,

    /**
     * This ist the name of the project
     */
    projectName?: string

    /**
     * @description
     *  - this is the method that validates the project data
     * @returns 
     *  - boolean on whether or not the project data is valid
     */
    validate?: () => boolean
}

class LunarProjectData implements ILunarProjectData {
    notes?: ILunarNote[] | undefined = undefined
    charts?: ILunarChart[] | undefined = undefined
    fileSystem?: ISimpleFilesystem | undefined = undefined
    projectName?: string | undefined = undefined

    constructor(data: ILunarProjectData) {
        console.log(data)
        if(data === null)
            return
        if(Object.keys(data).includes("notes") === true)
            this.notes = data.notes 
        this.charts = data.charts 
        this.fileSystem = data.fileSystem 
        this.projectName = data.projectName 
    }

    validate = () => {
        if(this.notes === undefined || this.charts === undefined || this.fileSystem === undefined || this.projectName === undefined)
            return false

        return true
    }
}

/**
 * This is the interface that defines the members for the FetchProjectDataResponse
 */
interface IFetchProjectDataResponse {
    /**
     * This is the status that the API gives us on the request
     */
    status?: IStatus

    /**
     * This is the project data that has been returned by the endpoint
     */
    projectData?: LunarProjectData 

    /**
     * @description
     *  - this is the method that validates whether or not the request was a success
     * @returns 
     *  - a boolean value on the requests success
     */
    validate?: () => boolean
}

class FetchProjectDataResponse implements IFetchProjectDataResponse {
    status?: IStatus | undefined = undefined
    projectData?: LunarProjectData | undefined = undefined

    constructor(resp: IFetchProjectDataResponse) {
        this.status = resp.status 

        if(resp.projectData !== undefined)
            this.projectData = new LunarProjectData(resp.projectData) 
    }

    validate: () => boolean = () => {
        if(this.status === undefined || this.projectData === undefined)
            return false
        if(this.status.error === true || this.projectData.validate() === false)
            return false

        return true
    }
}

export type { ILunarProjectData, IFetchProjectDataResponse }
export { LunarProjectData, FetchProjectDataResponse }