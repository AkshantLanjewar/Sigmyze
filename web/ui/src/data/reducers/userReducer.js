let default_state = {
    userModal: false,
    verifyModal: false,
    userState: "signedout",

    jwtToken: "",
    verified: "",

    email: "",
    username: "",
    role: ""
}

// three different states
// signedout : signed out of application
// verify    : verify state of user
// logged_in : fully logged in state

export default (state = default_state, action) => {
    let e_state = state

    switch(action.type) {
        case "userModal":
            e_state['userModal'] = action.payload
            return { ...e_state }
        case "verifyModal":
            e_state['verifyModal'] = action.payload
            return { ...e_state }
        case "loginAction":
            e_state['userState'] = action.payload
            return { ...e_state }
        case "authAction":
                e_state['jwtToken']  = action.payload.jwtToken
                e_state['verified']  = action.payload.verified
                e_state['userState'] = action.payload.userState

                return { ...e_state }
        case "userData":
                e_state['email']    = action.payload.email
                e_state['username'] = action.payload.username
                e_state['role']     = action.payload.role

                return { ...e_state }
        default:
            return state;        
    }
}