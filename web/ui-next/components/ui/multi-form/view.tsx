import { Button, Group, Title } from "@mantine/core";
import { memo } from "react";
import { IFormPart, IMultiCollectedPayload, IRawFragmentTemplateProps } from "./types";

interface IViewProps {
    activeStep: IFormPart | undefined,
    collectedBefore: IMultiCollectedPayload | undefined,
    activeFragment: JSX.Element | undefined,
    formStep: number | undefined,
    formSteps: IFormPart[],
    activeValue: string | undefined,
    setSelected: (fragmentId: string, payload: string) => void,
    decrementStep: () => void,
    incrementStep: () => void
}

const MultiFormView: React.FC<IViewProps> = memo(({
    activeStep,
    collectedBefore,
    activeFragment,
    formStep,
    formSteps,
    activeValue,
    setSelected,
    decrementStep,
    incrementStep
}) => (
    <div style={{ width: "100%", height: "100%", padding: "2em" }}>
        <Title
            order={2}
            weight={700}
            mb={"md"}
        >
            {activeStep?.title}
        </Title>

        <Group 
            sx={{ width: "100%" }} 
            position={"center"} 
            mb={"xs"}
        >
            {activeFragment}
        </Group>

        <Group
            sx={{ width: "100%" }}
            position={"center"}
            spacing={"lg"}
        >
            <Button
                variant={"light"}
                color={"red"}
                radius={"xl"}
                size={"md"}
                disabled={formStep === undefined}
                onClick={() => decrementStep()}
            >
                {(formStep === 0 && formStep !== undefined)
                    ? "Cancel"
                    : "Previous"
                }
            </Button>

            <Button
                variant={"light"}
                color={"indigo"}
                radius={"xl"}
                size={"md"}
                disabled={formStep === undefined || activeValue === undefined}
                onClick={() => incrementStep()}
            >
                {(formStep === formSteps.length - 1 && formStep !== undefined)
                    ? "Submit"
                    : "Next"
                }
            </Button>
        </Group>
    </div>
))

export default MultiFormView