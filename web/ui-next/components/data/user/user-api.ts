import { GenerateOptions, GET_Cacheless, server } from "../utils"
import { IStatus } from '../datasets/DatasetsTypes'
import { 
    IAuthResp, 
    ILoginPost, 
    ILogoutResp, 
    IRegisterPost, 
    IRegisterResp, 
    IResendPost, 
    IResendResp, 
    IUserDataResp, 
    IVerifyPost, 
    IVerifyResp 
} from "./types"

//Anonymous API methods

async function UserApi() : Promise<IStatus> {
    return await GET_Cacheless<IStatus>(`${server}/api/v1/auth`)
}

async function UserLogin(data: ILoginPost) : Promise<IAuthResp> {
    let url = `${server}/api/v1/auth/login`
    let options = GenerateOptions("POST", null, data as any)

    return await GET_Cacheless<IAuthResp>(url, options)
}

async function UserRegister(data: IRegisterPost) : Promise<IRegisterResp> {
    let url = `${server}/api/v1/auth/register`
    let options = GenerateOptions("POST", null, data as any)

    return await GET_Cacheless<IRegisterResp>(url, options)
}

//API Methods that require authentication 

async function UserData(token: string) : Promise<IUserDataResp> {
    let url = `${server}/api/v1/auth/user-data`
    let options = GenerateOptions("GET", token)

    return await GET_Cacheless<IUserDataResp>(url, options)
}

async function UserRefreshToken(token: string) : Promise<IAuthResp> {
    let url = `${server}/api/v1/auth/refresh-token`
    let options = GenerateOptions("POST", token)

    return await GET_Cacheless<IAuthResp>(url, options)
}

async function UserRevokeToken(token: string) : Promise<ILogoutResp> {
    let url = `${server}/api/v1/auth/revoke-token`
    let options = GenerateOptions("POST", token)

    return await GET_Cacheless<ILogoutResp>(url, options)
}

//Verification functions

async function UserVerify(token: string, data: IVerifyPost) : Promise<IVerifyResp> {
    let url = `${server}/api/v1/auth/verify`
    let options = GenerateOptions("POST", token, data)

    return await GET_Cacheless<IVerifyResp>(url, options)
}

async function UserResendVerification(token: string) : Promise<IResendResp> {
    let data = {
        Token: token
    } as IResendPost

    let url = `${server}/api/v1/auth/verify`
    let options = GenerateOptions("POST", token, data)

    return await GET_Cacheless<IResendResp>(url, options)
}

export { 
    UserApi,
    UserData,
    UserLogin,
    UserRegister,
    UserRefreshToken,
    UserRevokeToken,
    UserVerify,
    UserResendVerification 
}