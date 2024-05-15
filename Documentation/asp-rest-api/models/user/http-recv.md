## Introduction
This file contains all of the data models related to http requests to the user authentication endpoints.

## LoginPost
This is the body of the POST request for the login request within the platform.

### Definition
```cs
public class LoginPost
{
    public string Email { get; set; }
    public string Password { get; set; }
}
```

**Fields**
- `Email` (this is the email that is trying to login)
- `Password` (this is the plaintext password, sent over https)

## RegisterPost
This is the body of the POST request to create an account within the platform.

### Definition
```cs
public class RegisterPost
{
    public string Email { get; set; }
    public string? Username { get; set; }
    public string Password { get; set; }
}
```

**Fields**
- `Email` (this is the email for the account that is attempting to sign up)
- `Username` (this is the username for the new account)
- `Password` (this is the plaintext password, sent over https)

## VerifyPost
This is the body of the POST request that verifies an account within the platform.

### Definition
```cs
public class VerifyPost
{
    public string Token { get; set; }
    public string Code { get; set; }
}
```

**Fields**
- `Token` (this is session token to validate the request)
- `Code` (this was the code that was sent to the email on user signup)

## ResendPost
This is the body of the POST request that resends the verification email to a user.

### Definition
```cs
public class ResendPost
{
    public string Token { get; set; }
}
```

**Fields**
- `Token` (this is session token to validate the request)

## MessagePost
This is the body of the POST request to send an about us message

### Definition
```cs
public class MessagePost
{
    public string Name { get; set; }
    public string EMail { get; set; }
    public string Subject { get; set; }
    public string Message { get; set; }
}
```

**Fields**
- `Name` (the user given name for the message)
- `EMail` (the user given email that sent the message thru the website)
- `Subject` (the subject of the message)
- `Message` (the actual content of the message)