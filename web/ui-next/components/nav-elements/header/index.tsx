import styles from './header.module.scss'
import { Header as MantineHeader } from '@mantine/core'
import LoggedOutView from './views/logged_out'
import { useContext } from 'react'
import { UserContextData } from '../../data/user/context'
import { IUserContext } from '../../data/user/types'
import LoggedInDefault from './views/logged_in_default'
import LoggedInSecure from './views/logged_in_secure'

interface IHeaderProps {
    protectedView: boolean,
    darken?: boolean
}

/**
 * @description
 *  produces a navbar based on the application state.
 *  if logged out and on an unprotected page, it serves logged_out.tsx 
 *  if logged in and on an unprotected page it serves logged_in_default.tsx
 *  if logged in and on a secured page, it serves logged_in_secure.tsx
 * @param protectedView
 *  whether or not the current view requires authentication
 * @param darken
 *  this checks whether or not to set the background color to its darker variant
 * @returns navbar based on the state
 */
const Header: React.FC<IHeaderProps> = ({ protectedView, darken }) => {
    const userContext = useContext(UserContextData) as IUserContext
    let view = <LoggedOutView />
    if(userContext.loggedIn === true)
        view = <LoggedInDefault />
    if(userContext.loggedIn === true && protectedView === true)
        view = <LoggedInSecure />

    return (
        <MantineHeader height={60}>
            <div 
                className={`
                    ${styles.header} 
                    ${darken && styles.darken} 
                    ${userContext.loggedIn === true && protectedView === true && styles.reducedPadding}
                `}
            >
                {view}
            </div>
        </MantineHeader>
    )
}

export default Header