import React, { useEffect, useState } from "react"

import {
    Button,
    Modal,
    Stepper,
    Stack,
    Group
} from '@mantine/core'

import { AiFillDatabase } from 'react-icons/ai'
import { BsBarChart } from 'react-icons/bs'

import DatasetView from "./datasets/datasets"
import Indicators  from './indicators/indicators'

import { connect } from "react-redux"
import { AddLunarIndicator } from "../../../../data/actions/lunarActions"
import { AddProjectIndicator }      from "../../../../data/actions/projectActions"

const AddIndicator = ({ opened, setOpened, addProjectIndicator }) => {
    const [step, setStep]           = useState(0)
    const [active_d, setActive_d]   = useState("")
    const [indicator, setActiveInd] = useState("")

    function nextStep() {
        if(step == 0 && active_d !== "")
            setStep(1)
        if(step == 1 && indicator !== "") {
            setOpened(false)
            addProjectIndicator(indicator)
        }
    }

    const prevStep = () => setStep((current) => (current > 0 ? current - 1 : current));

    let views = [ 
        <DatasetView setDataset={setActive_d} activeDataset={active_d} />, 
        <Indicators dataset={active_d} setIndicator={setActiveInd} /> 
    ]

    function Reset() {
        setStep(0)
        setActive_d("")
        setActiveInd("")
    }

    useEffect(() => {
        Reset()
    }, [opened])

    return (
        <Modal 
            opened={opened} 
            onClose={() => { setOpened(false) }}
            centered
            size={"75%"}
            withCloseButton={false}
            overflow={"inside"}
        >
            <Stack>
                <div>
                    {views[step]}
                </div>

                <Stepper 
                    active={step} 
                    onStepClick={setStep}
                    radius={"sm"}
                    size={"sm"}
                    color={"gray"}
                >
                    <Stepper.Step icon={ <AiFillDatabase size={18} /> } label="Dataset" allowStepSelect={false} />
                    <Stepper.Step icon={ <BsBarChart size={18} /> } label="Indicator" allowStepSelect={false} />
                </Stepper>

                <Group position={"center"}>
                    <Button variant={"default"} onClick={prevStep}>Back</Button>
                    {step > 0
                        ? <Button onClick={nextStep} disabled={ indicator == "" }>Add</Button>
                        : <Button onClick={nextStep} disabled={ active_d == "" }>Next</Button>
                    }
                </Group>
            </Stack>
        </Modal>
    )
}

const mapDispatchToProps = dispatch => ({
    AddLunarIndicator: (payload) => dispatch(AddLunarIndicator(payload)),
    addProjectIndicator: (payload) => dispatch(AddProjectIndicator(payload))
})

const mapStateToProps = state => ({
    indicators: state.lunar.indicators
})

export default connect(mapStateToProps, mapDispatchToProps)(AddIndicator)