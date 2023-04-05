import { useRouter } from "next/router"
import ApplicationLayout from "../../components/nav-elements/application-layout"
import QuantaPage from "../../components/pages/quanta"

const Quanta: React.FC = ({ }) => {
    return (
        <div>
            <ApplicationLayout
                title="Sigmyze: Quanta Editor"
                description="The sigmyze Quanta Editor"
                location="/quanta"
                protectedView={true}
            >
                <div style={{ height: '100%' }}>
                    <QuantaPage />
                </div>
            </ApplicationLayout>
        </div>
    )
}

export default Quanta