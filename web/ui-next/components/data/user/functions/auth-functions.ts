import { showNotification } from "@mantine/notifications"
import { SetStateAction } from "react"
import { IAuthenticationData, ILoginPost, IRegisterPost, IUserData, IVerifyPost } from "../types"
import { UserLogin, UserRegister, UserRevokeToken, UserVerify } from "../user-api"

async function Login(
    email: string, 
    password: string,
    setAuthData: (value: SetStateAction<IAuthenticationData | undefined>) => void
) {
    let loginPost = {
        Email: email,
        Password: password
    } as ILoginPost

    let resp = await UserLogin(loginPost)
    if(resp.authorized === true) {
        //successs iwth the server authentication
        let nAuthenticationData = {} as IAuthenticationData
        nAuthenticationData.token = resp.token
        nAuthenticationData.verified_state = "verify"
        if(resp.verified === "yes")
            nAuthenticationData.verified_state = "logged_in"

        setAuthData({ ...nAuthenticationData })
    } else {
        //failure
        let message = resp.message
        switch(message) {
            case "pwd_bad":
            case "user_dne":
                showNotification({
                    title: "Login Error",
                    message: "The email and password you typed has no associated account with us",
                    color: 'red',
                    autoClose: 1000 * 10
                })

                break
            default:
                break
        }
    }
}

async function Register(
    email: string, 
    username: string, 
    password: string,
    setAuthData: (value: SetStateAction<IAuthenticationData | undefined>) => void,
    setUserData: (value: SetStateAction<IUserData | undefined>) => void
) {
    let registerPost = {
        Username: username,
        Email: email,
        Password: password
    } as IRegisterPost

    let resp = await UserRegister(registerPost)
    if(resp.registered === true) {
        //success
        let nAuthenticationData = {} as IAuthenticationData
        nAuthenticationData.token = resp.token
        nAuthenticationData.verified_state = "verify"

        let nUserData = {} as IUserData
        nUserData.email = email
        nUserData.username = username

        setUserData({ ...nUserData })
        setAuthData({ ...nAuthenticationData })
    } else {
        //failed
        let message = resp.message
        if(message === "user_exists")
            showNotification({
                title: "Register Error",
                message: "User already exists",
                color: 'red',
                autoClose: 1000 * 10
            })
    }
}

async function Verify(
    token: string, 
    code: string,
    setAuthData: (value: SetStateAction<IAuthenticationData | undefined>) => void
) {
    let verifyPost = {
        Token: token,
        Code: code
    } as IVerifyPost

    let resp = await UserVerify(token, verifyPost)
    if(resp.verified === true) {
        //success
        let nAuthenticationData = {} as IAuthenticationData
        nAuthenticationData.token = resp.token
        nAuthenticationData.verified_state = "logged_in"

        setAuthData({ ...nAuthenticationData })
    } else {
        //failure
        let message = resp.message
        let notificationMessage = null
        switch(message) {
            case "user_dne":
                notificationMessage = "Huh? Thats funny, we cant find this user on our end."
                break
            case "alr_verified":
                notificationMessage = "Huh? Thats funny, this user is already verified."
                break
            case "no_match":
                notificationMessage = "Verification code does not match."
            default: 
                break
        }

        if(notificationMessage !== null)
            showNotification({
                title: "Verify Error",
                message: notificationMessage,
                color: 'red',
                autoClose: 1000 * 10
            })
    }
}

async function Logout(
    token: string,
    setAuthData: (value: SetStateAction<IAuthenticationData | undefined>) => void,
    setUserData: (value: SetStateAction<IUserData | undefined>) => void
) {
    try {
        let resp = await UserRevokeToken(token)
    } catch {
        console.log('[Notice, Already Logged Out]')
    }

    setAuthData(undefined)
    setUserData(undefined)
}

export { 
    Login,
    Register,
    Verify,
    Logout 
}