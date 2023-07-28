import { useCallback, useEffect, useState } from "react"
import { IFormPart, IMultiCollectedPayload, IRawFragmentTemplateProps, validateFormPart } from "./types"
import { v4 } from "uuid"
import MultiFormView from "./view"

interface IAddMultiFormProps {
    formParts?: IFormPart[],
    cancel: () => void,
    submit: (payload: IMultiCollectedPayload) => void
}

const MultiForm: React.FC<IAddMultiFormProps> = ({ formParts, cancel, submit }) => {
    const [formStep, setFormStep] = useState<number | undefined>(undefined)
    const [formSteps, setFormSteps] = useState<IFormPart[]>([])

    const [activeStep, setActiveStep] = useState<IFormPart | undefined>(undefined)
    const [activeFragment, setActiveFragment] = useState<JSX.Element | undefined>(undefined)
    const [collectedPayload, setCollectedPayload] = useState<IMultiCollectedPayload | undefined>(undefined)
    const [collectedBefore, setCollectedBefore] = useState<IMultiCollectedPayload | undefined>(undefined)
    const [activeValue, setActiveValue] = useState<string | undefined>(undefined)

    //effects for the multi form component
    //effect that sets the form parts and resets the multi form
    useEffect(() => {
        if(formParts === undefined)
            return

        //implement the part ids
        let newFormSteps: IFormPart[] = []
        for(let i = 0; i < formParts.length; i++) {
            let formPart = formParts[i]
            formPart.partId = v4()

            newFormSteps.push(formPart)
        }

        setFormSteps([ ...newFormSteps ])
        setFormStep(0) 
        setCollectedPayload({})
    }, [formParts])

    //effect that sets the active value
    useEffect(() => {
        let stepId = activeStep?.partId
        if(stepId === undefined || collectedPayload === undefined)
            return

        let payloadValue = collectedPayload[stepId]
        setActiveValue(payloadValue)
    }, [activeStep])

    //sets the form fragment based on the changed form step
    useEffect(() => {
        if(formStep === undefined || formStep > formSteps.length - 1)
            return

        let formPart = formSteps[formStep]
        if(validateFormPart(formPart) === false)
            return

        //switch and set the active fragment
        console.log(formPart)
        switch(formPart.type) {
            case "raw":
                let RawFragment = formPart.rawFragment!
                setActiveStep({ ...formPart })
                setActiveFragment((
                    <RawFragment
                        activeValue={activeValue}
                        collectedBefore={collectedBefore}
                        setSelected={(payload: string) => {
                            let activeId = activeStep?.partId
                            if(activeId === undefined)
                                return
            
                            setSelected(activeId, payload)
                        }} 
                    />
                ))

                break
            default:
                break
        }
    }, [formStep, formSteps])

    //now we need to build a collection of all the previously collected data within the correct output ids
    //move increment step func into a seperate function and call twice
    useEffect(() => {
        if(formStep === undefined || formStep > formSteps.length - 1 || collectedPayload === undefined || formParts === undefined)
            return

        let collectedKeys = Object.keys(collectedPayload)
        let newCollectedBefore: IMultiCollectedPayload = {}

        for(let i = 0; i < formStep; i++) {
            let formPart = formParts[i]
            let partId = formPart.partId
            if(partId === undefined || collectedKeys.includes(partId) === false)
                continue

            let collectedValue = collectedPayload[partId]
            let outputKey = formPart.outputKey
            if(collectedValue === undefined || outputKey === undefined)
                continue

            newCollectedBefore[outputKey] = collectedValue
        }

        setCollectedBefore({ ...newCollectedBefore })
    }, [formStep, collectedPayload, formParts])

    //now implement the methods in order to increment, decrement, and submit the multi part form
    const decrementStep = useCallback(() => {
        if(formStep === undefined)
            return
        if(formStep === 0) {
            cancel()
            return
        }

        let newFormStep = formStep - 1
        setFormStep(newFormStep)
    }, [cancel, formStep])

    const incrementStep = useCallback(() => {
        if(formStep === undefined)
            return
        if(formStep === formSteps.length - 1) {
            if(collectedPayload === undefined)
                return

            let submitPayload: IMultiCollectedPayload = {}
            let collectedKeys = Object.keys(collectedPayload)
            for(let i = 0; i < collectedKeys.length; i++) {
                let collectedKey = collectedKeys[i]
                let collectedValue = collectedPayload[collectedKey]

                //now we need to find the related object int he steps
                let relatedKey: string | undefined = undefined
                for(let x = 0; x < formSteps.length; x++) {
                    let relatedStep = formSteps[x]
                    if(relatedStep.partId === collectedKey)
                        relatedKey = relatedStep.outputKey
                }

                if(relatedKey === undefined)
                    continue

                submitPayload[relatedKey] = collectedValue
            }

            submit(submitPayload)
            return
        }

        let newFormStep = formStep + 1
        if(newFormStep > formSteps.length - 1)
            return

        setFormStep(newFormStep)
    }, [formStep, formSteps, collectedPayload])

    const setSelected = useCallback((fragmentId: string, payload: string) => {
        let newCollectedPayload = collectedPayload
        if(newCollectedPayload === undefined)
            newCollectedPayload = {}

        newCollectedPayload[fragmentId] = payload
        setCollectedPayload({ ...newCollectedPayload })
    }, [collectedPayload])

    return (
        <MultiFormView
            activeStep={activeStep}
            collectedBefore={collectedBefore}
            activeFragment={activeFragment}
            formStep={formStep}
            formSteps={formSteps}
            activeValue={activeValue}
            setSelected={setSelected}
            decrementStep={decrementStep}
            incrementStep={incrementStep}
        />
    )
}

export default MultiForm