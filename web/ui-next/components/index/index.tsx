import { useRouter } from "next/router"
import { useContext, useEffect } from "react"
import { UserContextData } from "../data/user/context"
import { IUserContext } from "../data/user/types"
import Footer from "../nav-elements/footer/footer"

const IndexPage: React.FC = ({ }) => {
    const { loggedIn } = useContext(UserContextData) as IUserContext
    const router = useRouter()

    useEffect(() => {
        if(loggedIn === true)
            router.replace('/drive')
    }, [])
    
    return (
        <div style={{ width: '100%', height: '100%' }}>
            
            <Footer />
        </div>
    )
}

export default IndexPage