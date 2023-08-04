import LunarPage from "../../components/pages/lunar/page"

export const DefaultIndicatorTable = {
    weo: "USA"
}

interface ILunarProps {
}

const Lunar: React.FC<ILunarProps> = ({  }) => {
    return (
        <div>
            <LunarPage />
        </div>
    )
}

export type { ILunarProps }
export default Lunar