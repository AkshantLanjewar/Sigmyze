interface IFormPart {
    //this is the title for the form part in the multi part form
    title?: string,
    //this is the type used to build the form, whether it is a raw JSX element, or a form builder
    type?: "raw" | "builder",
    //this is the raw component used if it is the raw type
    rawFragment?: JSX.Element
}

export type { IFormPart }