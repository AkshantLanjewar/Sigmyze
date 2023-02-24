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
                <div>
                    
                </div>
            </ApplicationLayout>
        </div>
    )
}

export default QuantaPage