# Register User Demo

## Purpose

Demonstrates how to register a new user (Person + Account) with the Outseta API, including custom fields and plan selection. This script does not handle login.

## What it does

- Registers a new user (creates both a Person and an Account)
- Prompts the user to select a subscription plan
- Adds a custom field `Maskot` to the Account and `CoffeePreference` to the Person
- Instructs the user to check their email to set their password
- Provides detailed logging and error handling

## Outseta: Account vs. Person

- **Account**: Represents a company, organization, or team. Each Account can have one or more associated people (users). In this demo, the Account is created with a `Name` (company name) and a custom field `Maskot`.
- **Person**: Represents an individual user. Each Person is associated with an Account. In this demo, the Person is created with their name, email, and a custom field `CoffeePreference`.

This separation allows Outseta to support both B2B (multiple users per company) and B2C (one user per account) use cases.

## Use cases

- Onboarding new users programmatically
- Testing registration flows
- Automating user creation for demos or QA

## 📋 Prerequisites

- The [global prerequisites](README.md#prerequisites)
- A plan must exist in Outseta (for example, via the [plans-create](plans-create.md) demo)

## 🚀 Run the demo

1. Follow the [Quick Start guide](README.md#-quick-start) to set up your environment
2. Run the demo script:

```bash
npm run auth-register
```

The script will interactively prompt you for Person details (email, first name, last name, coffee preference), Account details (company name, maskot), and then for a subscription plan. No command-line arguments are needed.

### Plan Selection

- The script will fetch available subscription plans from Outseta and prompt you to select one before registering the user and account.
- Each new account will be created with a subscription to the selected plan.

**Example session**:

```bash
$ npm run auth-register

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
      "Uid": "<membership-uid>",
      "Created": "<membership-created-date>",
      "Updated": "<membership-updated-date>"
    }
  ],
  "StripeInvoices": [],
  "StripePaymentMethods": [],
  "StripeSubscriptions": [],
  "Subscriptions": [
    {
      "_objectType": "Subscription",
      "BillingRenewalTerm": <billing-renewal-term>,
      "Account": null,
      "Plan": null,
      "Quantity": null,
      "StartDate": "<start-date>",
      "EndDate": null,
      "ExpirationDate": null,
      "RenewalDate": "<renewal-date>",
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
      "Uid": "<subscription-uid>",
      "Created": "<created-date>",
      "Updated": "<updated-date>"
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
    "BillingRenewalTerm": <billing-renewal-term>,
    "Account": null,
    "Plan": null,
    "Quantity": null,
    "StartDate": "<start-date>",
    "EndDate": null,
    "ExpirationDate": null,
    "RenewalDate": "<renewal-date>",
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
    "Uid": "<subscription-uid>",
    "Created": "<created-date>",
    "Updated": "<updated-date>"
  },
  "DomainName": null,
  "HasLoggedIn": false,
  "LatestSubscription": {
    "_objectType": "Subscription",
    "BillingRenewalTerm": <billing-renewal-term>,
    "Account": null,
    "Plan": null,
    "Quantity": null,
    "StartDate": "<start-date>",
    "EndDate": null,
    "ExpirationDate": null,
    "RenewalDate": "<renewal-date>",
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
    "Uid": "<subscription-uid>",
    "Created": "<created-date>",
    "Updated": "<updated-date>"
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
    "IPAddress": "<ip-address>",
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
    "Uid": "<person-uid>",
    "Created": "<created-date>",
    "Updated": "<updated-date>",
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
  "Uid": "<account-uid>",
  "Created": "<account-created-date>",
  "Updated": "<account-updated-date>",
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

ℹ️ You may generate a token on their behalf in a server side environment (even before they have set their password) using the [auth-token](auth-token.md) demo.
```
