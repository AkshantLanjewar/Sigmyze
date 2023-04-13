interface ISelectorPaneState {
    initialized: boolean,

    //funcs
    compileProject: (projectData: string) => Promise<any>
}

export type { ISelectorPaneState }