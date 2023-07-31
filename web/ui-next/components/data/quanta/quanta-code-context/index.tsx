import { createContext, useCallback, useContext, useEffect, useState } from "react"
import { IQuantaCodeContext } from "./state"
import { IQuantaCodeShort } from "./types"
import { deleteSelector, fetchSelectors } from "./functions"
import { UserContextData } from "../../user/context"
import { IUserContext } from "../../user/types"
import { QuantaUIContextData } from "../ui-context"
import { IQuantaUIState } from "../ui-context/state"

interface IQuantaCodeContextProps {
    children?: JSX.Element | never[],
    quantaId: string | null
}

const QuantaCodeContextData = createContext<IQuantaCodeContext | null>(null)

const QuantaCodeContex: React.FC<IQuantaCodeContextProps> = ({ children, quantaId }) => {
    const [codeItems, setCodeItems] = useState<IQuantaCodeShort[]>([])
    const [fetchToggle, setFetchToggle] = useState(false)

    const toggleFetch = () => setFetchToggle(!fetchToggle)

    //context items
    const { authData } = useContext(UserContextData) as IUserContext

    useEffect(() => {
        async function main() {
            let token = authData?.token
            if(quantaId === null || token === undefined)
                return

            let nCodeItems = await fetchSelectors(quantaId, token)
            if(nCodeItems === undefined)
                return

            setCodeItems([ ...nCodeItems ])
        }

        main()
    }, [fetchToggle, authData, quantaId])

    //functions/selectors.ts
    const deleteSelectorCallback = useCallback(async (codeId: string) => {
        await deleteSelector(
            quantaId,
            authData,
            codeId,
            toggleFetch
        )
    }, [quantaId, authData, toggleFetch])
    
    let value: IQuantaCodeContext = {
        codeItems,

        toggleFetch,
        deleteSelector: deleteSelectorCallback
    }
    
    return (
        <>
            <QuantaCodeContextData.Provider value={value}>
                <div style={{ width: "100%", height: "100%" }}>
                    {children}
                </div>
            </QuantaCodeContextData.Provider>
        </>
    )
}

export { QuantaCodeContextData }
export default QuantaCodeContex