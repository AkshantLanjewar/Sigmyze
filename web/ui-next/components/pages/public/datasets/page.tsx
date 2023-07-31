import { useContext, useEffect, useState } from "react"
import { QuantaDatasetManagerData } from "../../../ui/quanta-dataset-manager"
import { IDatasetManagerState } from "../../../ui/quanta-dataset-manager/types"
import { IDatasetCard } from "../../../data/quanta/dataset-api"
import PublicDatasetView from "./page-view"
import { useRouter } from "next/router"

interface IPublicDatasetInner {

}

const PublicDatasetInner: React.FC<IPublicDatasetInner> = ({ }) => {
    const [datasetCards, setDatasetCards] = useState<IDatasetCard[]>([])
    
    const { getPublicDatasetCards } = useContext(QuantaDatasetManagerData) as IDatasetManagerState
    const router = useRouter()

    useEffect(() => {
        async function main() {
            let newCards = await getPublicDatasetCards()
            if(newCards === undefined)
                return

            setDatasetCards([ ...newCards ])
        }

        main()
    }, [])

    return <PublicDatasetView datasetCards={datasetCards} router={router} />
}

export default PublicDatasetInner