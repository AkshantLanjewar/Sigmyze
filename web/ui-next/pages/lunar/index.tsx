import LunarRefresh from "../../components/lunar-refresh/page"
export const DefaultIndicatorTable = {
    weo: "USA"
}

interface ILunarProps {
}

const Lunar: React.FC<ILunarProps> = ({  }) => {
    return (
        <div>
            <LunarRefresh />
        </div>
    )
}

export type { ILunarProps }
export default Lunar