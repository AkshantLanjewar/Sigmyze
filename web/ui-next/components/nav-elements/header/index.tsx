import styles from './header.module.scss'
import { Header as MantineHeader } from '@mantine/core'
import LoggedOutView from './views/logged_out'
import { useContext, useEffect } from 'react'
import { UserContextData } from '../../data/user/context'
import { IUserContext } from '../../data/user/types'
import LoggedInDefault from './views/logged_in_default'
import LoggedInSecure from './views/logged_in_secure'
import { useRouter } from 'next/router'

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
    const router = useRouter()

    let view = <LoggedOutView />
    if(userContext.loggedIn === true)
        view = <LoggedInDefault />
    if(userContext.loggedIn === true && protectedView === true)
        view = <LoggedInSecure />

    useEffect(() => {
        if(userContext.loggedIn === false)
            return
        if(userContext.loggedIn === true && userContext.verified === false && router.asPath !== '/auth/verify')
            router.push('/auth/verify')
    }, [userContext.loggedIn, userContext.verified])

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