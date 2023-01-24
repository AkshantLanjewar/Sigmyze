import OrganizationContext from "../../data/organization/context"
import DriveToolbar from "../drive/drive-toolbar/drive-toolbar"

const DriveView: React.FC = ({ }) => {
    return (
        <div style={{ width: '100%', height: '100%' }}>
            <OrganizationContext>
                <DriveToolbar />
            </OrganizationContext>
        </div>
    )
}

export default DriveView