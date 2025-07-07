# JWT Token Verification Demo

## Purpose

Demonstrates how to verify Outseta JWT access tokens server-side using two different methods. This is essential for securing your application by ensuring tokens are valid before trusting their payload.

## What it does

- Prompts for a JWT access token to verify
- Offers choice between two verification methods:
  1. **JWK Set verification** - Uses your domain's public key to cryptographically verify the token
  2. **Profile Endpoint verification** - Makes an API call to verify the token is still valid
- Decodes and displays user information from the verified token
- Provides detailed logging and error handling for troubleshooting

## Use cases

- **API authentication** - Verify tokens in your backend before processing API requests
- **Middleware implementation** - Create authentication middleware for your web application
- **Security validation** - Ensure tokens haven't been tampered with or expired
- **User identification** - Extract user information from verified tokens for authorization
- **Token debugging** - Inspect and validate tokens during development

## 📋 Prerequisites

- The [global prerequisites](../README.md#prerequisites)
- A valid JWT access token (can be generated using the [generate-jwt](../generate-jwt/generate-jwt.md) demo)

## 🚀 Run the demo

1. Follow the [Quick Start guide](../README.md#-quick-start) to set up your environment
2. Run the demo script:

```bash
npm run verify-jwt
```

When you run the script, you will be prompted to enter:

- The JWT access token to verify
- Your preferred verification method

**Example session**:

```bash
$ npm run verify-jwt
🔐 JWT Token Verification
This demo verifies Outseta JWT access tokens using two methods:

1. JWK Set verification - Uses your domain's public key
2. Profile Endpoint verification - Makes an API call to verify the token

  JWT Token to verify: eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
  Verification method: Both methods (JWK Set + Profile Endpoint) - Recommended

🚀 Verifying JWT token...

🔐 Method 1: Verifying with JWK Set
🔍 Verifying token with JWK Set...
✅ Token verified successfully with JWK Set

🔐 Method 2: Verifying with Profile Endpoint
🔍 Verifying token with Profile endpoint...
✅ Token verified successfully with Profile endpoint

🎉 JWT Verification Complete!

📋 User Information (from JWK Set verification):
   • Person UID: abcd1234-5678-90ef-ghij-klmnopqrstuv
   • Email: jane@example.com
   • Name: Jane Doe
   • Account UID: wxyz9876-5432-10ab-cdef-ghijklmnopqr
   • Is Primary: true
   • Issued At: 12/15/2024, 10:30:00 AM
   • Expires At: 12/15/2024, 11:30:00 AM

👤 Extended Profile Information (from Profile Endpoint):
   • Person UID: abcd1234-5678-90ef-ghij-klmnopqrstuv
   • Email: jane@example.com
   • First Name: Jane
   • Last Name: Doe
   • Account Name: Example Company
   • Account UID: wxyz9876-5432-10ab-cdef-ghijklmnopqr

✅ Token is valid and verified!
```

## What happens next?

- **Valid token**: The script will display user information extracted from the token and confirm it's verified
- **Invalid token**: An error message will be shown indicating why verification failed (expired, tampered, invalid format, etc.)
- **Network issues**: Appropriate error messages for connection problems or API errors

## Verification Methods Explained

### Method 1: JWK Set Verification

- **How it works**: Downloads your domain's public key from `https://your-domain.outseta.com/.well-known/jwks` and uses it to cryptographically verify the token signature
- **Pros**: Fast, works offline, cryptographically secure
- **Cons**: Requires the `jose` library, slightly more complex implementation

### Method 2: Profile Endpoint Verification

- **How it works**: Makes an API call to `/api/v1/profile` using the token; if the call succeeds, the token is valid
- **Pros**: Simple implementation, also returns additional user profile data
- **Cons**: Requires network call, slower than JWK verification

### Which method to choose?

- **Use JWK Set** for high-performance applications where you need to verify many tokens quickly
- **Use Profile Endpoint** when you also need fresh user profile data or prefer simpler implementation
- **Use both** for maximum security and additional profile information

## API Endpoints Used

- `GET /.well-known/jwks` – Retrieve the JSON Web Key Set for token verification
- `GET /api/v1/profile?fields=*` – Verify token and retrieve user profile information

## Core Code Examples

### JWK Set Verification

```javascript
import { jwtVerify, createRemoteJWKSet } from "jose";

// Create the remote JWK Set
const JWKS = createRemoteJWKSet(
  new URL(
    `https://${process.env.OUTSETA_SUBDOMAIN}.outseta.com/.well-known/jwks`
  )
);

// Verify the token
const { payload } = await jwtVerify(token, JWKS);

console.log("PersonUid:", payload.sub);
console.log("Email:", payload.email);
console.log("Name:", payload.name);
console.log("AccountUid:", payload["outseta:accountUid"]);
console.log("IsPrimary:", payload["outseta:isPrimary"]);
```

### Profile Endpoint Verification

```javascript
import { decodeJwt } from "jose";

// Make request to profile endpoint
const response = await fetch(
  `https://${process.env.OUTSETA_SUBDOMAIN}.outseta.com/api/v1/profile?fields=*`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

if (!response.ok) {
  throw new Error("Token verification failed");
}

const profile = await response.json();
const payload = decodeJwt(token); // Decode for additional info

console.log("PersonUid:", payload.sub, profile.Uid);
console.log("Email:", payload.email, profile.Email);
console.log("Avatar:", profile.ProfileImageS3Url);
```

## Security Notes

- Always verify JWT tokens before trusting their content
- Never expose tokens in client-side logs or URLs
