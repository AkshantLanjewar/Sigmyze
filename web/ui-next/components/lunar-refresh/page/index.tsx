import { memo, useState } from "react"
import ApplicationLayout from "../../nav-elements/application-layout"
import QuantaDatasetManager from "../../ui/quanta-dataset-manager"

const LunarRefresh: React.FC = ({ }) => {
    const [title, setTitle] = useState<string>("Sigmyze::Lunar")

    return <View title={title} />
}

//here is the view component for the LunarRefresh
interface IViewProps {
    title: string
}

const View: React.FC<IViewProps> = memo(({ }) => (
    <div style={{ width: "100vw", height: "100vh" }}>
        <ApplicationLayout
            title="Sigmyze: Lunar Editor"
            description=""
            location="/lunar"
            protectedView={true}
        >
            <QuantaDatasetManager>
                <div style={{ width: "100%", height: "100%" }}>
                    
                </div>
            </QuantaDatasetManager>
        </ApplicationLayout>
    </div>
))

export default LunarRefresh