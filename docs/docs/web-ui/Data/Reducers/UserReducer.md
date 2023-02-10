# UserReducer
This is the reducer concerned with the user state.

## Implementation
```js
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
```

## Members

### userModal
`bool`
> This is open/close state for the authentication modal

### verifyModal
`bool`
> This is the open/close state for the verify modal

### userState
`string`
> This is the state the user is in right now. <br />
> **signout** -> the user is not logged into the system <br />
> **verify** -> the user is logged in, but hasnt verified his account yet <br />
> **logged_in** -> the user is logged in completely with a full access account <br />

### jwtToken
`string`
> This is the JWT token if the user is authenticated, used for protected routes

### verified
`string`
> not sure, but set in the authAction function

### email
`string`
> This is the email for the user

### username
`string`
> This is the username for the user

### role
`string`
> This is the role for the user

## Functions (stored in actions)

### userModal
> This function sets the [userModal](#usermodal) state.
> Payload acts as prop, which is a boolean true or false for opened/closed.

### verifyModal
> This function sets the [verifyModal](#verifymodal) state.
> Payload acts as a prop, which is the boolean true/false for opened/closed

### authAction
> This is the function for loading any authentication data into state. <br />
> **Payload:** <br />
> **jwtToken** -> This is the [JWT token](#jwttoken) that was returned from logging in / registering. <br />
> **verified** -> This is new [verified](#verified) state. <br /> 
> **userState** -> This is the new [userState](#userstate) state for the user. <br />

### userData
> This is the functino for loading user data into state. <br />
> **Payload:** <br />
> **email** -> This is the new [email](#email) state. <br />
> **username** -> This is the new [username](#username) state. <br />
> **role** -> This is the new [role](#role) state. <br />