## Introduction
This file contains all of the documentation for the email service

## Definition
```cs
public interface IEmailService
{
    void SendContactEmailSES(string name, string email, string subject, string msg);
    void SendVerificationEmailSES(string token, string address, string? name);
}
```

## Methods
### SendContactEmailSES 
```cs
void SendContactEmailSES(string name, string email, string subject, string msg);
```
When a user sends a contact email to the platform, this is the function that executes that request

**Parameters**
- `name` (this is the name of the user that is sending a message)
- `email` (the email of the user that is sending the message)
- `subject` (the title for the email)
- `msg` (this is the message in the email)

### SendVerificationEmailSES
```cs
void SendVerificationEmailSES(string token, string address, string? name);
```
This is the function that sends the verification token to the user in order to verify an account on the platform

**Parameters**
- `token` (this is the verification token that is being sent)
- `address` (the email address for the user)
- `name` (this is the name of the user who the verification token is being sent too)