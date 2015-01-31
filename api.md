# BioAuth Web API

### General Overview

1. User signup:
    1. User signs up with their email on our website.
    2. They install an authentication app, such as BioAuth, on their phone, which is connected to a Nymi band.
    3. The app authorizes with the BioAuth website using OAuth, and updates their device ID and a public key obtained from their Nymi band.
2. Third party authentication:
    1. The user signs in with their credentials on a third party website in which BioAuth is enabled.
    2. The third party website trades their client ID and the user email for a token, which has a status of `pending`. They then redirect their client to the BioAuth site.
    3. A push notification is sent to the user's mobile device. On that device, the user connects their Nymi band and signs an SHA1 hash of the token.
    4. The mobile device sends the original token and the generated signature back to the BioAuth site, again authenticating via OAuth. The backend verifies the signature and sets the token's status to be `accepted` or `rejected`.
    5. Up to this point the user has been waiting on a page with instructions to authenticate on their mobile device. At this point they're redirected back to the third party site.
    6. The third party site calls back to the BioAuth API to get the status of the token, and respond accordingly.

## User Endpoints

 * `get /user/login` starts a sign-in with a client API. A `clientId` and `redirectUri` are expected in the query string. At the end of the authentication flow, they're directed to that URL like
```
<uri>/#access_token=<token>&expires_in=<tiemstamp>&token_type=Bearer`
```
* `post /user/update` You must authenticate to access this endpoint. Expects a `pk` (hex string of the user's public key) and `device` (hex string of the device id) in the request body. Returns a JSON representation of the user.
```
{
    "id": 1,
    "email": "connor@peet.io",
    "username": "connor"
}
```
* `post /external/attempt` Attempts to start a 2fa access for the user. Expects the client `id` in the request body and the user `email` as well. Returns a token for later use.
```
{
    "token": "f9d0fd2bbf3d57929fb0eb746380dad4d20872c7875eac9e"
}
```
 * `get /external/land` Landing page awaiting user authentication. Expects the `token`, from above, to be passed in the query string, and `redirectUri` to send them to when they complete authorization.
 * `post /external/verify` Verifies the token. Expects the `token` to be passed in the request body, as well as a hex string representing for the `signature`. Possible responses:
```
HTTP 404 Not Found
Invalid token.

HTTP 400 Bad Request
Invalid signature.

HTTP 200 OK
{
    "created_at": "2015-01-31T20:57:05.000Z",
    "expiration": "2015-01-31T21:57:05.000Z",
    "id": 1,
    "status": "accepted",
    "token": "f9d0fd2bbf3d57929fb0eb746380dad4d20872c7875eac9e",
    "user": 1
}
```
 * `get /external/:token` Gets a token information. This should be used to verify accepted status after redirection, for instance.
```
{
    "created_at": "2015-01-31T20:57:05.000Z",
    "expiration": "2015-01-31T21:57:05.000Z",
    "id": 1,
    "status": "accepted",
    "token": "f9d0fd2bbf3d57929fb0eb746380dad4d20872c7875eac9e",
    "user": 1
}
```
