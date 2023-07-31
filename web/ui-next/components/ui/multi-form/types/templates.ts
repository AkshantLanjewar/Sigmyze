import { IMultiCollectedPayload } from "."

interface IRawFragmentTemplateProps {
    activeValue: string | undefined,
    collectedBefore: IMultiCollectedPayload | undefined,
    setSelected: (payload: string) => void
}

export type { IRawFragmentTemplateProps }