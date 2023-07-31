import { useState } from 'react'
import { GetServerSidePropsContext } from "next"
import ApplicationLayout from "../../../components/nav-elements/application-layout"
import PublicQuantaPage from "../../../components/pages/public/quanta"
import QuantaDatasetManager from "../../../components/ui/quanta-dataset-manager"

interface IPublicDatasetProps {
    datasetId: string
}

const PublicQuantaDataset: React.FC<IPublicDatasetProps> = ({ datasetId }) => {
    const [datasetTitle, setDatasetTitle] = useState<string>("CHANGE_ME")

    return (
        <>
            <ApplicationLayout
                title={datasetTitle}
                description=""
                location={`/public/quanta/${datasetId}`}
                protectedView={false}
                darken={true}
            >
                <div style={{ width: "100%", height: "100%" }}>
                    <QuantaDatasetManager>
                        <PublicQuantaPage datasetId={datasetId} setDatasetTitle={setDatasetTitle} />
                    </QuantaDatasetManager>
                </div>
            </ApplicationLayout>
        </>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    if(context.params === undefined)
        return
    
    let contextKeys = Object.keys(context.params)
    let datasetId = context.params.datasetId as string | undefined
    if(contextKeys.includes('datasetId') === false)
        return

    return {
        props: {
            datasetId: datasetId
        }
    }
}

export default PublicQuantaDataset