# Auth Controller

**[Protected]** <br />
`api/v1/auth` <br />

This endpoint handles all operations regarding [user](../Models/user.md) authentication.
It interfaces with the db to check credentials, and issues a verifiable JWT token.

### Dependent Services
| Service              | Service Interface                                  | Service Description                                 |
|----------------------|----------------------                              |---------------------------------------------        |
| UserService          | [IUserService](../Services/Auth/IUserService.md)   | handles authentication and token generation         |
| UserDBService        | [IUserAuth](../Services/Auth/IUserAuth.md)         | handles interfacing with the database for users     |
| HashService          | [IHashService](../Services/Auth/IHashService.md)   | this handles creating the hashes for the controller |
| EmailService         | [IEmailService](../Services/Auth/IEmailService.md) | this handles sending of emails for the controller   |

### Required HTTP Headers
Since this is a protected route each request needs certain HTTP headers
which are detailed below. <br />
**Note:** If route has the line **Anonymous Route**, the below headers are not required.

| Key           | Description         |
|---------------|---------------------| 
| Authorization | Bearer ${jwt_token} |


## Endpoint

### Status Check 
**Anonymous Route** <br />
This is a status check to see if the endpoint is working or not.

```http title="HTTP Request"
GET /api/v1/auth
```

#### Response Object
| Key           | Type                                                | Description                               |
|---------------|--------------------                                 |-------------------------------------------|
| status        | [APIStatusMessage](../Models/api_status_message.md) | Status of the controller (not used atm)   |

### Get User Data
This endpoint retrieves [user](../Models/user.md) data based on the provided jwt token.

```http title="HTTP Request"
GET /api/v1/auth/user-data
```

#### Response Object
| Key           | Type               | Description                               |
|---------------|--------------------|-------------------------------------------|
| username      | string             | this is the username for the [user](../Models/user.md)         |
| email         | string             | this is the email for the [user](../Models/user.md)            |
| verified      | string             | verified state of [user](../Models/user.md)                    |
| role          | string             | role of the [user](../Models/user.md) (used?)                  |

### Login
**Anonymous Route** <br />
This is the route to login and authenticate [users](../Models/user.md) with the website.

```http title="HTTP Request"
POST /api/v1/auth/login
```

#### Request Body (JSON Format)
| Key           | Type               | Description                                             |
|---------------|--------------------|-------------------------------------------              |
| email         | string             | email for the user logging in                           |
| password      | string             | password in plaintext for the user trying to login      |

#### Response Object
| Key           | Type               | Description                               |
|---------------|--------------------|-------------------------------------------|
| authorized    | bool               | Whether action was successful or not      |
| token         | string             | JWT token                                 |
| message       | string             | potential message if action failed        |
| verified      | string             | verified state of [user](../Models/user.md)                    |
| role          | string             | role of the [user](../Models/user.md) (used?)                  |

### Register
**Anonymous Route** <br />
This endpoint allows new [users](../Models/user.md) to create accounts within the system.
After registering, the server sends out an email with a verification code.

```http title="HTTP Request"
POST /api/v1/auth/register
```

#### Request Body (JSON Format)
| Key           | Type               | Description                                             |
|---------------|--------------------|-------------------------------------------              |
| email         | string             | this is the email for the [user](../Models/user.md) signing up               |
| username      | string             | Username for [user](../Models/user.md) signing up                            |
| password      | string             | Password in plaintext for [user](../Models/user.md) signing up               |

#### Response Object
| Key           | Type               | Description                                             |
|---------------|--------------------|-------------------------------------------              |
| registered    | bool               | whether [user](../Models/user.md) was registered or not                      |
| message       | string             | message if the action failed                            |
| token         | string             | JWT authentication token                                |

### Logout
This endpoint logs [users](../Models/user.md) out, revoking their token from the system.

```http title="HTTP Request"
POST /api/v1/auth/revoke-token
```

#### Response Object
| Key           | Type               | Description                                             |
|---------------|--------------------|-------------------------------------------              |
| logged_out    | bool               | Is logout action successfull                            |
| message       | string             | message if the action failed                            |

### Refresh Token
since tokens expire, you can refresh the token and get a new one without having to reauthenticate

```http title="HTTP Request"
POST /api/v1/auth/refresh-token
```

#### Response Object
| Key           | Type               | Description                               |
|---------------|--------------------|-------------------------------------------|
| authorized    | bool               | Whether action was successful or not      |
| token         | string             | JWT token                                 |
| message       | string             | potential message if action failed        |
| verified      | string             | verified state of [user](../Models/user.md)                    |
| role          | string             | role of the [user](../Models/user.md) (used?)                  |

### Verify
**Anonymous Route** <br />
This endpoint verifies [users](../Models/user.md) allowing them to access the full suite of features.

```http title="HTTP Request"
POST /api/v1/auth/verify
```

#### Request Body (JSON Format)
| Key           | Type               | Description                                             |
|---------------|--------------------|-------------------------------------------              |
| Token         | string             | This is the jwt token (redundent remove eventually)     |
| Code          | string             | The verification code that was sent in the email        |

#### Response Object
| Key           | Type               | Description                                             |
|---------------|--------------------|-------------------------------------------              |
| verified      | bool               | whether [user](../Models/user.md) was verified or not                        |
| message       | string             | this is the message of the verification action          |
| token         | string             | new JWT token                                           |

### Resend Verification Code
This endpoint resends the verification email containing the code

```http title="HTTP Request"
POST /api/v1/auth/resend-verification
```

#### Request Body (JSON Format)
| Key           | Type               | Description                                             |
|---------------|--------------------|-------------------------------------------              |
| Token         | string             | This is the jwt token (redundent remove eventually)     |

#### Response Object
| Key           | Type               | Description                                             |
|---------------|--------------------|-------------------------------------------              |
| resent        | bool               | whether email was resent or not                         |