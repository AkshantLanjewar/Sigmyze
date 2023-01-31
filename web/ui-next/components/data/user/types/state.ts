interface IUserContext {
    authData?: IAuthenticationData | null,
    userData?: IUserData,

    //easy check to see if loggedIn or not
    loggedIn?: boolean,
    verified?: boolean

    //authentication functions
    login?: (email: string, password: string) => Promise<void>,
    register?: (email: string, username: string, password: string) => Promise<void>,
    verify?: (token: string, code: string) => Promise<void>,
    logout?: (token: string) => Promise<void>,

    //util functions
    resendVerificationEmail?: (token: string) => Promise<void>,
    refreshToken?: (token: string) => Promise<void>,
    fetchUserData?: (token: string) => Promise<void>
}

type VerifiedStates = "signedout" | "verify" | "logged_in"

interface IAuthenticationData {
    token?: string,
    verified_state?: VerifiedStates
}

interface IUserData {
    username: string,
    email: string
}

export type { 
    IUserContext,
    IUserData,
    IAuthenticationData,
    VerifiedStates 
}