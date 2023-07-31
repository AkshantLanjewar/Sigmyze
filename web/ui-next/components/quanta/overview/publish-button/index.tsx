import { SetStateAction, useCallback, useContext, useEffect, useState } from "react"
import { QuantaContextData } from "../../../data/quanta/context"
import { IQuantaState } from "../../../data/quanta/types"
import { UserContextData } from "../../../data/user/context"
import { IUserContext } from "../../../data/user/types"
import { IsPublished } from "../../../data/quanta/quanta-publish-api"
import PublishButtonView from "./view"

interface IPublishButtonProps {
    setPublishOpen: (value: SetStateAction<boolean>) => void,
    setUnpublishOpen: (value: SetStateAction<boolean>) => void
}

const PublishButton: React.FC<IPublishButtonProps> = ({ setPublishOpen, setUnpublishOpen }) => {
    const [publishedState, setPublishedState] = useState(false)

    const { publishUpdate, quantaId } = useContext(QuantaContextData) as IQuantaState
    const { authData } = useContext(UserContextData) as IUserContext
    
    useEffect(() => {
        getPublishedState()
    }, [publishUpdate, quantaId, authData])

    const getPublishedState = useCallback(() => {
        async function main() {
            let token = authData?.token
            if(token === undefined || quantaId === null)
                return

            let isPublished = await IsPublished(token, quantaId)
            setPublishedState(isPublished)
        }

        main()
    }, [quantaId, authData])
    
    return (
        <PublishButtonView
            publishedState={publishedState}
            setPublishOpen={setPublishOpen}
            setUnpublishOpen={setUnpublishOpen}
        />
    )
}

export default PublishButton