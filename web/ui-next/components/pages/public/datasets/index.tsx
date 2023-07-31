import { memo } from "react"
import QuantaDatasetManager from "../../../ui/quanta-dataset-manager"
import PublicDatasetInner from "./page"

interface IDatasetsPage {
    
}

const PublicDatasetsPage: React.FC<IDatasetsPage> = memo(({ }) => {
    return (
        <>
            <QuantaDatasetManager>
                <PublicDatasetInner />
            </QuantaDatasetManager>
        </>
    )
})

export default PublicDatasetsPage