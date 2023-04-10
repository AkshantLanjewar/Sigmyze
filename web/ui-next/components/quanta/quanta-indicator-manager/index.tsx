import { createContext, useContext, useEffect, useState } from "react"
import { IQuantaIndicator, IQuantaIndicatorManager } from "./types"
import { QuantaContextData } from "../../data/quanta/context"
import { IQuantaState } from "../../data/quanta/types"
import { UserContextData } from "../../data/user/context"
import { IUserContext } from "../../data/user/types"
import { GetQuantaIndicators } from "../../data/quanta/quanta-api"

const QuantaIndicatorManagerData = createContext<IQuantaIndicatorManager | null>(null)

interface IQuantaIndicatorManagerProps {
    children?: JSX.Element | never[]
}

const QuantaIndicatorManager: React.FC<IQuantaIndicatorManagerProps> = ({ children }) => {
    const { quantaId, organizationId, toggleUpdateEditorIndicators } = useContext(QuantaContextData) as IQuantaState
    const { authData } = useContext(UserContextData) as IUserContext

    const [indicators, setIndicators] = useState<IQuantaIndicator[]>([])
    
    async function main() {
        let token = authData?.token
        if(quantaId === null || token === undefined || organizationId === null)
            return

        let _indicators = await GetQuantaIndicators(token, organizationId, quantaId)
        if(_indicators === undefined)
            return

        setIndicators([ ..._indicators ])
    }

    useEffect(() => {
        main()
    }, [])

    useEffect(() => {
        main()
    }, [toggleUpdateEditorIndicators])

    let value: IQuantaIndicatorManager = {
        indicators: indicators
    }

    return (
        <>
            <QuantaIndicatorManagerData.Provider value={value}>
                <div style={{ width: "100%", height: "100%" }}>
                    {children}
                </div>
            </QuantaIndicatorManagerData.Provider>
        </>
    )
}

export { QuantaIndicatorManagerData }
export default QuantaIndicatorManager