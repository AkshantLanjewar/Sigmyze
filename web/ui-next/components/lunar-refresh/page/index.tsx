import { memo, useCallback, useEffect, useState } from "react"
import ApplicationLayout from "../../nav-elements/application-layout"
import QuantaDatasetManager from "../../ui/quanta-dataset-manager"
import { IPortalButton } from "../types"
import { PORTAL_BUTTONS_CHART, PORTAL_BUTTONS_FOLDER, PORTAL_BUTTONS_NOTE } from "./portal-buttons"

interface ILunarRefreshProps {
    testingPortal?: string
}

const LunarRefresh: React.FC<ILunarRefreshProps> = ({ testingPortal }) => {
    const [title, setTitle] = useState<string>("Sigmyze::Lunar")
    const [portalButtons, setPortalButtons] = useState<IPortalButton[]>([])

    const assignPortalButtons = useCallback((portalId: string) => {
        switch(portalId) {
            case "folder":
                setPortalButtons([ ...PORTAL_BUTTONS_FOLDER ])
                break
            case "chart":
                setPortalButtons([ ...PORTAL_BUTTONS_CHART ])
                break
            case "note":
                setPortalButtons([ ...PORTAL_BUTTONS_NOTE ])
                break
            default:
                return
        }
    }, [])

    useEffect(() => {
        if(testingPortal === undefined)
            return

        assignPortalButtons(testingPortal)
    }, [testingPortal])

    return (
        <View 
            title={title}
            portalButtons={portalButtons} 
        />
    )
}

//here is the view component for the LunarRefresh
interface IViewProps {
    title: string,
    portalButtons: IPortalButton[]
}

const View: React.FC<IViewProps> = memo(({ title, portalButtons }) => (
    <div style={{ width: "100vw", height: "100vh" }}>
        <ApplicationLayout
            title={title}
            description=""
            location="/lunar"
            protectedView={true}
            portalButtons={portalButtons}
        >
            <QuantaDatasetManager>
                <div style={{ width: "100%", height: "100%" }}>
                    
                </div>
            </QuantaDatasetManager>
        </ApplicationLayout>
    </div>
))

export default LunarRefresh