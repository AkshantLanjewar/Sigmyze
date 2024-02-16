import { ISimpleFilesystem } from "../../../../ui/file-management/types"
import { ILunarChart, ILunarNote } from "../../state"

/**
 * This is the interface that defines the body for the create project request
 */
interface ILunarCreateProjectBody {
    /**
     * This is the lunar id of the user making the request
     */
    lunarId: string,

    /**
     * This is the organizationId of the organization this project is going to belong too
     */
    organizationId: string,

    /**
     * This is the id of the project we are going to create
     */
    projectId: string,

    /**
     * This is the name of the project we are going to create
     */
    name: string
}

/**
 * This is the interface that defines the body for the delete project request
 */
interface ILunarDeleteProjectBody {
    /**
     * This is the lunar id of the user making the request
     */
    lunarId: string,

    /**
     * This is the organizationId of the organization this project is going to belong too
     */
    organizationId: string,

    /**
     * This is the id of the project we are going to create
     */
    projectId: string,
}

interface ILunarUpdateFiletreeBody {
    /**
     * This is the lunar id of the user making the request
     */
    lunarId: string,

    /**
     * This is the organizationId of the organization this project is going to belong too
     */
    organizationId: string,

    /**
     * This is the id of the project we are going to create
     */
    projectId: string,

    /**
     * This is the new filesystem we are updating the database with
     */
    newFiletree: ISimpleFilesystem
}

interface ILunarUpdateNameBody {
    /**
     * This is the lunar id of the user making the request
     */
    lunarId: string,

    /**
     * This is the organizationId of the organization this project is going to belong too
     */
    organizationId: string,

    /**
     * This is the id of the project we are going to create
     */
    projectId: string,

    /**
     * this is the new name for the project
     */
    name: string
}

interface ILunarUpdateChartsBody {
    /**
     * This is the lunar id of the user making the request
     */
    lunarId: string,

    /**
     * This is the organizationId of the organization this project is going to belong too
     */
    organizationId: string,

    /**
     * This is the id of the project we are going to create
     */
    projectId: string,

    /**
     * These are the new charts
     */
    newCharts: ILunarChart[]
}

interface ILunarUpdateNotesBody {
    /**
     * This is the lunar id of the user making the request
     */
    lunarId: string,

    /**
     * This is the organizationId of the organization this project is going to belong too
     */
    organizationId: string,

    /**
     * This is the id of the project we are going to create
     */
    projectId: string,

    /**
     * these are the new notes that will be in the db
     */
    newNotes: ILunarNote[]
}

export type { 
    ILunarCreateProjectBody,
    ILunarDeleteProjectBody,
    ILunarUpdateFiletreeBody,
    ILunarUpdateNameBody,
    ILunarUpdateChartsBody,
    ILunarUpdateNotesBody
}