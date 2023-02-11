//Response Types

interface IUserDataResp {
    username: string,
    email: string,
    verified: string,
    role: string
}

interface IResendResp {
    resent: boolean
}

interface IVerifyResp {
    verified: boolean,
    message?: string,
    token: string
}

interface ILogoutResp {
    logged_out: boolean,
    message?: string
}

interface IRegisterResp {
    registered: boolean,
    message?: string,
    token?: string
}

interface IAuthResp {
    authorized: boolean,
    token?: string,
    message?: string,
    verified?: string,
    role?: string
}

//Request Types

interface ILoginPost {
    Email: string,
    Password: string
}

interface IRegisterPost {
    Email: string,
    Username?: string
    Password: string
}

interface IVerifyPost {
    Token: string,
    Code: string
}

interface IResendPost {
    Token: string
}

interface ISendAboutMessage {
    name: string,
    email: string,
    subject: string,
    message: string
}

export type { 
    IUserDataResp,
    IResendResp,
    IVerifyResp,
    ILogoutResp,
    IRegisterResp,
    IAuthResp,
    ILoginPost,
    IRegisterPost,
    IVerifyPost,
    IResendPost,
    ISendAboutMessage 
}