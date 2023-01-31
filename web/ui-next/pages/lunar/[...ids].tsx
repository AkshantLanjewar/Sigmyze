import { GetServerSidePropsContext } from "next"
import { ILunarProps } from "."
import LunarPage, { pageStaticProps } from "../../components/lunar/page"

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

export default Lunar