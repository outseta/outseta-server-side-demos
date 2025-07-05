# Register Account (User) Demo

## Purpose

Demonstrates how to register a new Account with a Person attached (aka. registering a new user) with the Outseta API, including custom fields and plan selection.

## What it does

- Prompts for a subscription plan
- Prompts for person details (email, first name, last name, coffee preference)
- Prompts for account details (name, maskot)
- Creates a new Account and Person in Outseta
- Subscribed the Account to the selected plan
- Logs the created Account and Person or any errors

## Outseta: Account vs. Person

- **Account**: Represents a company, organization, or team. Each Account can have one or more associated people (users). In this demo, the Account is created with a `Name` (company name) and a custom field `Maskot`.
- **Person**: Represents an individual user. Each Person is associated with zero, one or multiple Accounts. In this demo, the Person is created with their name, email, and a custom field `CoffeePreference`.

This separation allows Outseta to support both B2B (multiple users per company) and B2C (one user per account) use cases.

It also allows for people who have not yet subscribed to a plan, but has registered interest through a lead form, email list subscription, etc.

## Use cases

- Onboarding new users programmatically
- Testing registration flows
- Automating user creation for demos or QA

## 📋 Prerequisites

- The [global prerequisites](README.md#prerequisites)
- A plan must exist in Outseta (for example, via the [create-plan](create-plan/create-plan.md) demo)

## 🚀 Run the demo

1. Follow the [Quick Start guide](README.md#-quick-start) to set up your environment
2. Run the demo script:

```bash
npm run register-account
```

The script will interactively prompt you for Person details (email, first name, last name, coffee preference), Account details (company name, maskot), and then for a subscription plan. No command-line arguments are needed.

### Plan Selection

- The script will fetch available subscription plans from Outseta and prompt you to select one before registering the user and account.
- Each new account will be created with a subscription to the selected plan.

**Example session**:

```bash
$ npm run register-account

📦 Fetching available plans...
? Select a plan: Basic (UID: wQXw3omK)

✅ Selected plan: Basic (UID: wQXw3omK)

👤 Enter Person details:
  Email: jane@example.com
  First Name: Jane
  Last Name: Doe
  Coffee Preference: Latte

🏢 Enter Account details:
  Company Name: Acme Inc
  Company Maskot: Roadrunner

🚀 Registering user...

--- api/v1/crm/registrations response ---
{
  "_objectType": "Account",
  "Name": "Acme Inc",
  "ClientIdentifier": null,
  "InvoiceNotes": "",
  "IsDemo": false,
  "BillingAddress": null,
  "MailingAddress": null,
  "AccountStage": 2,
  "PaymentInformation": null,
  "PersonAccount": [
    {
      "_objectType": "PersonAccount",
      "Person": null,
      "Account": null,
      "IsPrimary": true,
      "ReceiveInvoices": false,
      "ActivityEventData": null,
      "Uid": "aB3kLm9Q",
      "Created": "2024-06-01T12:00:00Z",
      "Updated": "2024-06-01T12:00:00Z"
    }
  ],
  "StripeInvoices": [],
  "StripePaymentMethods": [],
  "StripeSubscriptions": [],
  "Subscriptions": [
    {
      "_objectType": "Subscription",
      "BillingRenewalTerm": 2,
      "Account": null,
      "Plan": null,
      "Quantity": 1,
      "StartDate": "2024-06-01T12:00:00Z",
      "EndDate": null,
      "ExpirationDate": null,
      "RenewalDate": "2024-07-01T12:00:00Z",
      "NewRequiredQuantity": null,
      "IsPlanUpgradeRequired": false,
      "PlanUpgradeRequiredMessage": null,
      "SubscriptionAddOns": null,
      "DiscountCouponSubscriptions": null,
      "DiscountCode": null,
      "DiscountCouponExpirationDate": null,
      "LatestInvoice": null,
      "Rate": 0,
      "ActivityEventData": null,
      "Uid": "Qw8nZp2R",
      "Created": "2024-06-01T12:00:00Z",
      "Updated": "2024-06-01T12:00:00Z"
    }
  ],
  "Deals": [],
  "LastLoginDateTime": null,
  "AccountSpecificPageUrl1": null,
  "AccountSpecificPageUrl2": null,
  "AccountSpecificPageUrl3": null,
  "AccountSpecificPageUrl4": null,
  "AccountSpecificPageUrl5": null,
  "AccountSpecificPageUrl6": null,
  "AccountSpecificPageUrl7": null,
  "AccountSpecificPageUrl8": null,
  "AccountSpecificPageUrl9": null,
  "AccountSpecificPageUrl10": null,
  "RewardFulReferralId": null,
  "TaxIds": [],
  "TaxStatus": "none",
  "AccountStageLabel": "Trialing",
  "CurrentSubscription": {
    "_objectType": "Subscription",
    "BillingRenewalTerm": 2,
    "Account": null,
    "Plan": null,
    "Quantity": 1,
    "StartDate": "2024-06-01T12:00:00Z",
    "EndDate": null,
    "ExpirationDate": null,
    "RenewalDate": "2024-07-01T12:00:00Z",
    "NewRequiredQuantity": null,
    "IsPlanUpgradeRequired": false,
    "PlanUpgradeRequiredMessage": null,
    "SubscriptionAddOns": null,
    "DiscountCouponSubscriptions": null,
    "DiscountCode": null,
    "DiscountCouponExpirationDate": null,
    "LatestInvoice": null,
    "Rate": 0,
    "ActivityEventData": null,
    "Uid": "Qw8nZp2R",
    "Created": "2024-06-01T12:00:00Z",
    "Updated": "2024-06-01T12:00:00Z"
  },
  "DomainName": null,
  "HasLoggedIn": false,
  "LatestSubscription": {
    "_objectType": "Subscription",
    "BillingRenewalTerm": 2,
    "Account": null,
    "Plan": null,
    "Quantity": 1,
    "StartDate": "2024-06-01T12:00:00Z",
    "EndDate": null,
    "ExpirationDate": null,
    "RenewalDate": "2024-07-01T12:00:00Z",
    "NewRequiredQuantity": null,
    "IsPlanUpgradeRequired": false,
    "PlanUpgradeRequiredMessage": null,
    "SubscriptionAddOns": null,
    "DiscountCouponSubscriptions": null,
    "DiscountCode": null,
    "DiscountCouponExpirationDate": null,
    "LatestInvoice": null,
    "Rate": 0,
    "ActivityEventData": null,
    "Uid": "Qw8nZp2R",
    "Created": "2024-06-01T12:00:00Z",
    "Updated": "2024-06-01T12:00:00Z"
  },
  "LifetimeRevenue": 0,
  "Nonce": null,
  "PrimaryContact": {
    "_objectType": "Person",
    "Email": "jane@example.com",
    "FirstName": "Jane",
    "LastName": "Doe",
    "MailingAddress": null,
    "PasswordLastUpdated": null,
    "PasswordMustChange": false,
    "PhoneMobile": "",
    "PhoneWork": "",
    "ProfileImageS3Url": null,
    "Title": null,
    "Timezone": null,
    "Language": "*",
    "IPAddress": "203.0.113.42",
    "Referer": null,
    "UserAgent": "node",
    "LastLoginDateTime": null,
    "OAuthGoogleProfileId": null,
    "PersonAccount": null,
    "DealPeople": null,
    "LeadFormSubmissions": null,
    "EmailListPerson": null,
    "Account": null,
    "AccountUids": null,
    "FullName": "Jane Doe",
    "HasLoggedIn": false,
    "OAuthIntegrationStatus": 0,
    "OptInToEmailList": false,
    "Password": null,
    "UserAgentPlatformBrowser": "Unknown (Unknown)",
    "HasUnsubscribed": false,
    "DiscordUser": null,
    "IsConnectedToDiscord": false,
    "SchemaLessDataLoaded": false,
    "ActivityEventData": null,
    "Uid": "zX7pLm2Q",
    "Created": "2024-06-01T12:00:00Z",
    "Updated": "2024-06-01T12:00:00Z",
    "CoffeePreference": "Latte"
  },
  "PrimarySubscription": null,
  "RecaptchaToken": null,
  "StripePrice": null,
  "TaxId": null,
  "TaxIdIsInvalid": false,
  "TaxIdType": null,
  "WebflowSlug": null,
  "StripeId": null,
  "IsLivemode": false,
  "LastEventCreated": null,
  "SchemaLessDataLoaded": false,
  "ActivityEventData": null,
  "Uid": "mN4qRt8V",
  "Created": "2024-06-01T12:00:00Z",
  "Updated": "2024-06-01T12:00:00Z",
  "Maskot": "Roadrunner"
}
------------------------------

📮 A confirmation email has been sent to the user. They must follow the link in the email to set their password and activate their account before logging in.

   Email: jane@example.com
   First Name: Jane
   Last Name: Doe
   Coffee Preference: Latte
   Company Name: Acme Inc
   Company Maskot: Roadrunner

ℹ️ You may generate a token on their behalf in a server side environment (even before they have set their password) using the [generate-jwt](generate-jwt.md) demo.
```

## API Endpoint Used

- `POST /api/v1/crm/registrations` – Register a new user
  - [Register Account API Documentation](https://documenter.getpostman.com/view/3613332/outseta-rest-api-v1/7TNfr6k#6056bd40-c846-4ffe-b545-ae0923511676)

## Core Code Example

```javascript
const payload = {
  Name: "Acme Inc",
  Maskot: "Roadrunner",
  Subscriptions: [
    {
      Plan: { Uid: "wQXw3omK" },
      BillingRenewalTerm: "2",
    },
  ],
  PersonAccount: [
    {
      IsPrimary: true,
      Person: {
        Email: "jane@example.com",
        FirstName: "Jane",
        LastName: "Doe",
        CoffeePreference: "Latte",
      },
    },
  ],
};

const response = await fetch("https://api.outseta.com/v1/crm/ registrations", {
  method: "POST",
  headers: {
    Authorization: `Outseta ${process.env.OUTSETA_API_KEY}:${process.env.OUTSETA_API_SECRET}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(payload),
});
```
