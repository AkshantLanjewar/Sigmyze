import { MantineProvider } from "@mantine/core"
import { theme } from "../components/default-theme"
import { NotificationsProvider } from "@mantine/notifications"
import { IDatasetCacheObject } from "../components/ui/quanta-dataset-manager/types"
import QuantaContext from "../components/data/quanta/context"
import UserContext from "../components/data/user/context"
import OrganizationContext from "../components/data/organization/context"
import { IQuantaIndicator } from "../components/quanta/quanta-indicator-manager/types"
import { v4 } from "uuid"

interface IApplicationTestingWrapper {
    children: React.ReactNode
}

const ApplicationTestingWrapper: React.FC<IApplicationTestingWrapper> = ({ children }) => {
    return (
        <UserContext testing={true}>
            <OrganizationContext testing={true}>
                <MantineProvider
                    withGlobalStyles
                    withNormalizeCSS
                    withCSSVariables 
                    theme={theme}
                >
                    <NotificationsProvider>
                        {children}
                    </NotificationsProvider>
                </MantineProvider>
            </OrganizationContext>
        </UserContext>
    )
}

//design all the data that can be mocked into the context
interface IQuantaContextTestingWrapper {
    data?: IDatasetCacheObject,
    dummyIndicators?: IQuantaIndicator[]
    children: React.ReactNode
}

const QuantaContextTestingWrapper: React.FC<IQuantaContextTestingWrapper> = ({ data, dummyIndicators, children }) => {
    return (
        <QuantaContext
            quantaId={null}
            organizationId={null}
            primeData={data}
            dummyIndicators={dummyIndicators}
        >
            {children}
        </QuantaContext>
    )
}

export { 
    ApplicationTestingWrapper,
    QuantaContextTestingWrapper
}