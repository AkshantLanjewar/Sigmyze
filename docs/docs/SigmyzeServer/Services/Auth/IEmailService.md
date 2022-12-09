# IEmailService
This service handles the sending of emails for the server.
Currently only used to send the verification code.

## Implementation
```cs
public interface IEmailService
{
    Task SendVerificationEmail(string token, string address, string? name);
}
```

## Methods

### SendVerificationEmail(string token, string address, string? name)
`Task`
> This method sends the verification email.
> It requires the verification token, the email address of the receiver,
> and the name of the user, to compose and send the email.