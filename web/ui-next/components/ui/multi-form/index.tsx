import { useEffect, useState } from "react"
import { IFormPart } from "./types"

interface IAddMultiFormProps {
    formParts?: IFormPart[]
}

const MultiForm: React.FC<IAddMultiFormProps> = ({ formParts }) => {
    const [formStep, setFormStep] = useState<number | undefined>(undefined)
    const [formSteps, setFormSteps] = useState<IFormPart[]>([])

    //effects for the multi form component
    useEffect(() => {
        if(formParts === undefined)
            return

        setFormSteps([ ...formParts ])
        setFormStep(0)
    }, [formParts])

    useEffect(() => {
        if(formStep === undefined || formSteps.length === 0)
            return
    }, [formStep])
    
    return null
}

export default MultiForm