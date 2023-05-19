import { GetServerSidePropsContext } from "next"
import { IAddIndicatorData } from "../../components/lunar/explorer-modals/add-indicator"
import LunarPage, { pageStaticProps } from "../../components/pages/lunar/page"

export const DefaultIndicatorTable = {
    weo: "USA"
}

interface ILunarProps {
    pkg: IAddIndicatorData
}

const Lunar: React.FC<ILunarProps> = ({ pkg }) => {
    return (
        <div>
            <LunarPage pkg={pkg} />
        </div>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    return await pageStaticProps()
}

export type { ILunarProps }
export default Lunar