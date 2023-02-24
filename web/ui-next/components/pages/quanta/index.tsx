import QuantaContext from "../../data/quanta/context"
import ApplicationLayout from "../../nav-elements/application-layout"

const QuantaPage: React.FC = ({ }) => {
    return (
        <div>
            <ApplicationLayout
                title="Sigmyze: Quanta Editor"
                description="The sigmyze Quanta Editor"
                location="/quanta"
                protectedView={true}
            >
                <QuantaContext>
                    <div style={{ height: '100%' }}> 
                    
                    </div>
                </QuantaContext>
            </ApplicationLayout>
        </div>
    )
}

export default QuantaPage