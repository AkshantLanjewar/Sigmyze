import ApplicationLayout from "../components/nav-elements/application-layout"

const DrivePage: React.FC = ({ }) => {
    return (
        <div>
            <ApplicationLayout
				title="Sigmyze Drive"
				description="Application Drive"
				location="/drive"
				protectedView={true}
			>
                
            </ApplicationLayout>
        </div>
    )
}

export default DrivePage