## Introduction + API Root
This document contains all of the api calls contained within the Auth controller, which handles user authentication into the website.

**URL Base**: `/api/v1/auth` \
**Allows Anonymous Access**: `false` \
**Consumed Services**:
- `IUserService`: docs can be found [here](../services/auth/user-service.md)
- `IEmailService`: docs can be found [here](../services/utility-services/email-service.md)

## Status Check 
This is the function to check if the AUTH api endpoints are working on the REST api service. 

**URL**: `/` \
**Allows Anonymous Access**: `true` \
**Method**: `GET`

### Successful Response
Returns a JSON-ified version of the [api status message](../models/api-status.md)
```json
{
    "error": false,
    "msg": "Auth Working"
}
```
### Sample Call
```bash
curl /api/v1/auth/
```

## Get User Data
This is the API endpoint that handles the retreival of a user's user data from the database

**URL**: `/user-data` \
**Allows Anonymous Access**: `false` \
**Method**: `GET`

### Successfull Response
This function returns the JSON-ified version of the [user data resp](../models/user/http-resp.md#userdataresp)
```json
{
    "username": "Schwag Username",
    "email": "example-email@sigmyze.com",
    "verified": true,
    "role": "admin" | "user"
}
```

*Role Field Values*: The role field can take the following values with the following meanings:
- `admin` (the user is an admin on the sigmyze platform)
- `user` (the user is a normal user on the sigmyze platform)

### Sample Call
```bash
curl /api/v1/auth/user-data
```

## SendAboutMessage
This is the url endpoint that handles sending an about us message to the sigmyze administrators to initiate contact.

**URL**: `/send-about-message` \
**Allows Anonymous Access**: `true` \
**Method**: `POST`

### POST Body
The POST body is a json-ified version of the [message post body](../models/user/http-recv.md#messagepost)
```json
{
    "name": "example name",
    "email": "random-email@hotmail.com",
    "subject": "Random Subject",
    "message": "Message Body"
}
```

### Successful Response
Returns a JSON-ified version of the [api status message](../models/api-status.md)
```json
{
    "error": false,
    "msg": "Auth Working"
}
```

### Sample Call
```bash
curl /api/v1/auth/send-about-message
```

## Login 
This is the endpoint that handles authenticating into the API

**URL**: `/login` \
**Allows Anonymous Access**: `true` \
**Method**: `POST`

### POST Body
The POST body is a json-ified version of the [login post body](../models/user/http-recv.md#loginpost)
```json
{
    "Email": "example-email@gmail.com",
    "Password": "random-plaintext-pwd"
}
```

### Successful Response
This endpoint returns a JSON-ified version of the [auth resp](../models/user/http-resp.md#authresp) response
```json
{
    "authorized": true,
    "message": "auth",
    "token": "...",
    "verified": true,
    "role": "admin" | "user",
    "lunarId": "..."
}
```

### Error Response
When an error occurs, only two fields matter, which are shown below
```json
{
    "authorized": false,
    "message": "..."
}
```

The two error messages are:
- `user_dne` (user does not exist within the platform)
- `pwd_bad` (the password did not match up with the stored one)

### Sample Call
```bash
curl /api/v1/auth/login
```

## Register
This is the endpoint that handles the registering of a new user onto the platform

**URL**: `/register` \
**Allows Anonymous Access**: `true` \
**Method**: `POST`

### POST Body
The POST body is a json-ified version of the [register post body](../models/user/http-recv.md#registerpost)
```json
{
    "Email": "example-email@gmail.com",
    "Password": "random-plaintext-pwd",
    "Username": "random uname"
}
```

### Successful Response
This endpoint returns a JSON-ified version of the [auth resp](../models/user/http-resp.md#authresp) response
```json
{
    "authorized": true,
    "message": "auth",
    "token": "...",
    "verified": false,
    "role": "admin" | "user",
    "lunarId": "..."
}
```

### Error Response
When an error occurs, only two fields matter, which are shown below
```json
{
    "authorized": false,
    "message": "..."
}
```

The only error message possible is:
- `user_exists` (the user has already existed within the platform)

### Sample Call
```bash
curl /api/v1/auth/register
```

## Refresh Token
This is the function that handles refreshing a user's JWT access token

**URL**: `/refresh-token` \
**Allows Anonymous Access**: `false` \
**Method**: `POST`

### Successful Response
This endpoint returns a JSON-ified version of the [auth resp](../models/user/http-resp.md#authresp) response
```json
{
    "authorized": true,
    "message": "auth",
    "token": "...",
    "verified": true,
    "role": "admin" | "user",
    "lunarId": "..."
}
```

### Error Response
When an error occurs, only two fields matter, which are shown below
```json
{
    "authorized": false,
    "message": "..."
}
```

The error messages possible are:
- `token_dne` (the token that is trying to be refreshed does not exist)
- `token_n_active` (the user is trying to refresh an expired token)

### Sample Call
```bash
curl /api/v1/auth/refresh-token
```

## Revoke Token
This is the endpoint that handles a token logging out from the API service

**URL**: `/revoke-token` \
**Allows Anonymous Access**: `false` \
**Method**: `POST`

### Successful Response
This endpoint returns a JSON-ified version of the [logout response model](../models/user/http-resp.md#logoutresp)
```json
{
    "logged_out": true,
    "message": "logged_out"
}
```

### Error Response
When an error occurs, the message format is as follows
```json
{
    "logged_out": false,
    "message": "..."
}
```

Where the message can take the following values:
- `need_token` (the refresh token is not present within the cookies)
- `bad_token` (an invalid token is trying to log out of the platform)

### Sample Call
```bash
curl /api/v1/auth/revoke-token
```

## Verify
This is the endpoint that handles verifying a user with the token that was sent over email

**URL**: `/verify` \
**Allows Anonymous Access**: `false` \
**Method**: `POST`

### POST Body
The body of the post is the JSON-ified version of the [verify post datastructure](../models/user/http-recv.md#verifypost)
```json
{
    "Token": "{user_auth_token}",
    "Code": "..."
}
```

### Successfull Response
The endpoint returns a JSON-ified version of the [verify resp datastructure](../models/user/http-resp.md#verifyresp)
```json
{
    "verified": true,
    "token": "{new_auth_token}",
    "message": "verified"
}
```

### Error Response
The only fields that are important to error checking are
```json
{
    "verified": false,
    "message": "..."
}
```

Where the message can take the following values based on the error:
- `user_dne` (the token provided points to a user that does not exist)
- `alr_verified` (the user is already verified within the platform)
- `no_match` (the token does not match with the token to be verified on the database)

### Sample Call
```bash
curl /api/v1/auth/verify
```

## Resend Verification
This is the function that resends the verification code to the email for a user

**URL**: `/resend-verification` \
**Allows Anonymous Access**: `false` \
**Method**: `POST`

### POST Body
The body of the post is the JSON-ified version of the [resend post datastructure](../models/user/http-recv.md#resendpost)
```json
{
    "token": "{auth_token}"
}
```

### Successfull Response
The endpoint returns a JSON-ified version of the [resend response datastructure](../models/user/http-resp.md#resendresp)
```json
{
    "resent": true
}
```

### Sample Call
```bash
curl /api/v1/auth/resend-verification
```