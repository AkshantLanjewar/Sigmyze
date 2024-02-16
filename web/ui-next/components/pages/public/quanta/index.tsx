import { useCallback, useContext, useEffect, useState } from "react"
import { IsDatasetAuthorized, IsPublic } from "../../../data/quanta/quanta-publish-api"
import { useRouter } from "next/router"
import { UserContextData } from "../../../data/user/context"
import { IUserContext } from "../../../data/user/types"
import PublicQuantaPageView from "./view"
import { QuantaDatasetManagerData } from "../../../ui/quanta-dataset-manager"
import { IDatasetManagerState } from "../../../ui/quanta-dataset-manager/types"

interface IPublicQuantaPageProps {
    datasetId: string,
    setDatasetTitle: (val: string) => void
}

const PublicQuantaPage: React.FC<IPublicQuantaPageProps> = ({ datasetId, setDatasetTitle }) => {
    const [validated, setValidated] = useState(false)
    //state for title description etc
    const [datasetTitle, setInternalTitle] = useState<string | undefined>(undefined)
    const [internalId, setDatasetId] = useState<string | undefined>(undefined)
    const [description, setDescription] = useState<string | undefined>(undefined)
    
    const router = useRouter()

    const { authData } = useContext(UserContextData) as IUserContext
    const { primeDataset } = useContext(QuantaDatasetManagerData) as IDatasetManagerState
    
    useEffect(() => {
        authenticate()
    }, [datasetId])

    useEffect(() => {
        async function main() {
            if(validated === false)
                return

            //now we can pull the data for the dataset
            let primedDataset = await primeDataset(datasetId)
            if(primedDataset === undefined || primedDataset.dataset_name === undefined)
                return

            setDatasetTitle(primedDataset.dataset_name)
            setInternalTitle(primedDataset.dataset_name)
            setDatasetId(primedDataset.dataset_id)
            setDescription(primedDataset.dataset_description)
        }

        main()
    }, [validated])

    //methods for the public page
    const redirect = useCallback(() => {
        router.push('/datasets')
    }, [])

    const authenticate = useCallback(() => {
        async function main() {
            setValidated(false)
            let isPublic = await IsPublic(datasetId)
            if(isPublic === true) {
                setValidated(true)
                return
            }

            //now we need to check if the user is authenticated for this dataset's page
            let token = authData?.token
            if(token === undefined) {
                redirect()
                return
            }

            let authorized = await IsDatasetAuthorized(token, datasetId)
            if(authorized === false) {
                redirect()
                return
            }

            setValidated(true)
        }

        main()
    }, [datasetId, authData])

    return validated
        ? (
            <PublicQuantaPageView 
                datasetId={datasetId} 
                datasetTitle={datasetTitle}
                internalId={internalId}
                description={description}
            />
        )
        : null
}

export default PublicQuantaPage