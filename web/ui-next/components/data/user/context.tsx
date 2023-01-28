import { createContext, useEffect, useState } from "react"
import { FetchUserData, Login, Logout, RefreshToken, Register, ResendVerificationEmail, Verify } from "./functions"
import { IUserContext, IAuthenticationData, IUserData } from "./types"

interface IUserContextProps {
    children: React.ReactNode
}

const UserContextData = createContext<IUserContext | null>(null)

const UserContext: React.FC<IUserContextProps> = ({ children }) => {
    //setup the context state
    const [authData, setAuthData] = useState<IAuthenticationData | undefined>(undefined)
    const [userData, setUserData] = useState<IUserData | undefined>(undefined)

    //setup the context value
    let contextValue = {} as IUserContext

    //state
    contextValue.authData = authData
    contextValue.userData = userData

    //check whether logged in
    contextValue.loggedIn = false
    contextValue.verified = false
    let verifiedState = contextValue.authData?.verified_state

    if(contextValue.authData !== undefined && (verifiedState === "logged_in" || verifiedState === "verify")) {
        contextValue.loggedIn = true
        contextValue.verified = true
    }

    if(contextValue.loggedIn === true && verifiedState === "verify")
        contextValue.verified = false        

    //authentication functions
    contextValue.login = async (email: string, password: string) =>
        await Login(email, password, setAuthData)
    contextValue.register = async (email: string, username: string, password: string) =>
        await Register(email, username, password, setAuthData, setUserData)
    contextValue.verify = async (token: string, code: string) => 
        await Verify(token, code, setAuthData)
    contextValue.logout = async (token: string) => 
        await Logout(token, setAuthData, setUserData)
    
    //util functions
    contextValue.resendVerificationEmail = async (token: string) =>
        await ResendVerificationEmail(token)
    contextValue.refreshToken = async (token: string) =>
        await RefreshToken(token, setAuthData, setUserData)
    contextValue.fetchUserData = async (token: string) =>
        await FetchUserData(token, setUserData)

    //FEATURE: Theese effects auto renew the token
    async function TokenRefresh() {
        if(contextValue.loggedIn !== true)
            return

        //refresh the token
        let token = authData?.token
        if(token === undefined)
            return

        await contextValue.refreshToken!(token)
    }

    setInterval(() => { TokenRefresh() }, 1000 * 60 * 10)

    return (
        <>
            <UserContextData.Provider value={contextValue}>
                <div style={{ width: '100%', height: '100%' }}>
                    {children}
                </div>
            </UserContextData.Provider>
        </>
    )
}

export { UserContextData }
export default UserContext