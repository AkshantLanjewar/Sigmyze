import { useContext } from "react"
import { UserContextData } from "../data/user/context"
import { IUserContext } from "../data/user/types"
import DriveView from "./views/driveView"
import PublicView from "./views/publicView"

const IndexPage: React.FC = ({ }) => {
    const { loggedIn } = useContext(UserContextData) as IUserContext
    
    return (
        <div style={{ width: '100%', height: '100%' }}>
            {loggedIn
                ? <DriveView />
                : <PublicView />
            }
        </div>
    )
}

export default IndexPage