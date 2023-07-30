import { useCallback, useContext, useEffect, useState } from "react"
import { IsDatasetAuthorized, IsPublic } from "../../../data/quanta/quanta-publish-api"
import { useRouter } from "next/router"
import { UserContextData } from "../../../data/user/context"
import { IUserContext } from "../../../data/user/types"
import PublicQuantaPageView from "./view"

interface IPublicQuantaPageProps {
    datasetId: string
}

const PublicQuantaPage: React.FC<IPublicQuantaPageProps> = ({ datasetId }) => {
    const [validated, setValidated] = useState(false)
    
    const router = useRouter()

    const { authData } = useContext(UserContextData) as IUserContext
    
    useEffect(() => {
        authenticate()
    }, [datasetId])

    useEffect(() => {
        if(validated === false)
            return

        //now we can pull the data for the dataset
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
        ? <PublicQuantaPageView datasetId={datasetId} />
        : null
}

export default PublicQuantaPage