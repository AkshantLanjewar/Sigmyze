import { showNotification } from "@mantine/notifications"
import { SetStateAction } from "react"
import { IAuthenticationData, IUserData } from "../types"
import { UserData, UserRefreshToken, UserResendVerification } from "../user-api"
import { Logout } from "./auth-functions"

async function ResendVerificationEmail(token: string) {
    let resp = await UserResendVerification(token)
    if(resp.resent !== true)
        showNotification({
            title: "Verify Error",
            message: "There was an internal error sending the email, please try again",
            color: 'red',
            autoClose: 1000 * 10
        })
}

async function RefreshToken(
    token: string,
    authData: IAuthenticationData | null | undefined,
    setAuthData: (value: SetStateAction<IAuthenticationData | undefined | null>) => void,
    setUserData: (value: SetStateAction<IUserData | undefined>) => void
) {
    try {
        let resp = await UserRefreshToken(token)
        if(resp.authorized === true) {
            //success
            let nAuthenticationData = {} as IAuthenticationData
            nAuthenticationData.token = resp.token
            nAuthenticationData.verified_state = "verify"
            nAuthenticationData.logged_in = true
            nAuthenticationData.lunarId = authData?.lunarId

            if(resp.verified === "yes")
                nAuthenticationData.verified_state = "logged_in"
            
            setAuthData({ ...nAuthenticationData })
        }
    } catch (error) {
        //failure
        console.debug(`[Refresh Error]: ${error}`)
        await Logout(token, authData, setAuthData, setUserData)
        showNotification({
            title: "Auth Error",
            message: "We logged you out after a while for your own security",
            color: 'red',
            autoClose: 1000 * 10
        })
    }
}

async function FetchUserData(token: string, setUserData: (value: SetStateAction<IUserData | undefined>) => void) {
    let resp = await UserData(token)
    let nUserData = {
        email: resp.email,
        username: resp.username
    } as IUserData

    setUserData({ ...nUserData })
}

export { 
    ResendVerificationEmail,
    RefreshToken,
    FetchUserData 
}