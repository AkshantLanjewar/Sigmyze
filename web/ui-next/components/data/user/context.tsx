import { useLocalStorage } from "@mantine/hooks"
import { createContext, useEffect, useState } from "react"
import { FetchUserData, Login, Logout, RefreshToken, Register, ResendVerificationEmail, Verify } from "./functions"
import { IUserContext, IAuthenticationData, IUserData } from "./types"
import superjson from 'superjson'

interface IUserContextProps {
    children: React.ReactNode
}

const UserContextData = createContext<IUserContext | null>(null)

const UserContext: React.FC<IUserContextProps> = ({ children }) => {
    //setup the context state
    const [checkLoadedToggle, setCheckLoadedToggle] = useState(false)
    const [deserializedCalled, setDeserializedCalled] = useState(false)
    const [userData, setUserData] = useLocalStorage<IUserData | undefined>({ key: 'userData', defaultValue: undefined })
    const [authData, setAuthData] = useLocalStorage<IAuthenticationData | undefined | null>({ 
        key: 'authData', 
        defaultValue: { loaded: false } as IAuthenticationData,
        serialize: superjson.stringify,
        deserialize: (str) => (str === undefined ? initializeUserObject() : test(str))
    })

    useEffect(() => {
        if(checkLoadedToggle === false)
            return
        
        if(deserializedCalled === false)
            initializeUserObject()
    }, [checkLoadedToggle])

    function test(str: string) : any {
        let obj = superjson.parse<IAuthenticationData>(str)
        if(obj.loaded === false)
            initializeUserObject()

        setDeserializedCalled(true)
        return superjson.parse(str)
    }

    function initializeUserObject() : IAuthenticationData {
        let nUserObject = {} as IAuthenticationData
        nUserObject.logged_in = false

        setAuthData(nUserObject)
        setDeserializedCalled(true)
        return { loaded: false }
    }

    //setup the context value
    let contextValue = {} as IUserContext

    //state
    contextValue.authData = authData
    contextValue.userData = userData

    //whether state has been loaded
    contextValue.loaded = true
    if(authData?.loaded === false)
        contextValue.loaded = false
    //console.log(contextValue.loaded)

    //check whether logged in
    contextValue.loggedIn = false
    contextValue.verified = true
    let verifiedState = contextValue.authData?.verified_state

    if(contextValue.authData?.logged_in === true)
        contextValue.loggedIn = true
    if(verifiedState === "verify")
        contextValue.verified = false        

    //authentication functions
    contextValue.login = async (email: string, password: string) =>
        await Login(email, password, setAuthData)
    contextValue.register = async (email: string, username: string, password: string) =>
        await Register(email, username, password, setAuthData, setUserData)
    contextValue.verify = async (token: string, code: string) => 
        await Verify(token, code, setAuthData)
    contextValue.logout = async (token: string) => 
        await Logout(token, authData, setAuthData, setUserData)
    
    //util functions
    contextValue.resendVerificationEmail = async (token: string) =>
        await ResendVerificationEmail(token)
    contextValue.refreshToken = async (token: string) =>
        await RefreshToken(token, authData, setAuthData, setUserData)
    contextValue.fetchUserData = async (token: string) =>
        await FetchUserData(token, setUserData)

    //FEATURE: Theese effects auto renew the token
    async function TokenRefresh() {
        if(contextValue.loggedIn === false)
            return

        //refresh the token
        let token = authData?.token
        if(token === undefined)
            return

        await contextValue.refreshToken!(token)
    }

    useEffect(() => {
        const interval = setInterval(() => { 
            TokenRefresh() 
        }, 1000 * 60 * 10)

        return () => clearInterval(interval)
    }, [authData, contextValue.loggedIn])  
    
    useEffect(() => {
        async function main() {
            let token = authData?.token
            if(token === undefined)
                return
            if(authData?.logged_in !== true)
                return

            await FetchUserData(token, setUserData)
        }

        main()
    }, [authData])

    useEffect(() => {
        setTimeout(() => {
            setCheckLoadedToggle(true)
        }, 500)
    }, [])

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