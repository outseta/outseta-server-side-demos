# Change Plan Demo

## Purpose

Demonstrates how to change a user's subscription plan in Outseta using the API. This allows for upgrading or downgrading customer subscriptions programmatically.

## What it does

- Searches for user accounts by email address
- Handles multiple accounts per email (prompts for selection)
- Displays current subscription plan information
- Fetches available plans and filters out the current plan
- Previews the plan change with proration details and billing information
- Asks for confirmation before proceeding
- Updates the subscription with the selected new plan
- Provides detailed logging and error handling

## Use cases

- Implementing plan upgrade/downgrade flows in your application
- Automating subscription changes based on business rules
- Testing subscription management workflows

## 📋 Prerequisites

- The [global prerequisites](../README.md#prerequisites)
- An account with an active subscription in Outseta
- Available plans to upgrade or downgrade to

## 🚀 Run the demo

1. Follow the [Quick Start guide](../README.md#-quick-start) to set up your environment
2. Run the demo script:

```bash
npm run change-plan
```

When you run the script, you will be prompted to enter:

- The user's email address
- Account selection (if multiple accounts exist for the email)
- New plan selection from available plans

**Example session**:

```bash
$ npm run change-plan
? Enter the user's email address: jane@example.com

🔍 Searching for accounts...

✅ Found account: Acme Inc (UID: mN4qRt8V)
   • Current plan: Basic Plan

📦 Fetching available plans...
? Select a new plan: Premium Plan (UID: DQ2oVq9V) - 29.99/month - Enhanced features and priority support

🔍 Previewing subscription plan change...

📋 Plan Change Preview:

   • Current Plan: Basic Plan
   • New Plan: Premium Plan
   • Invoice Date: 7/16/2024
   • Subtotal: 0
   • Tax: 0
   • Total: 0
   • Balance: 0
   • Refunded: 0

   📄 Invoice Line Items:
   1. 16-Jul-24 - 16-Aug-24: Premium Plan
      Type: Charge
      Amount: 0
      Period: 7/16/2024 - 8/16/2024
      Renewal Term: Monthly

? Do you want to proceed with this plan change? Yes

🚀 Changing subscription plan...

✅ Account data fetched for: mN4qRt8V
✅ Found current subscription: Qw8nZp2R

--- api/v1/billing/subscriptions response ---
{
  "Uid": "Qw8nZp2R",
  "Account": {
    "Uid": "mN4qRt8V",
    "Name": "Acme Inc"
  },
  "Plan": {
    "Uid": "DQ2oVq9V",
    "Name": "Premium Plan",
    "MonthlyRate": 29.99
  },
  "BillingRenewalTerm": 2,
  "Quantity": 1,
  "StartDate": "2024-06-07T12:34:56.789Z",
  "RenewalDate": "2024-07-07T12:34:56.789Z",
  "Created": "2024-06-07T12:34:56.789Z",
  "Updated": "2024-06-07T12:45:32.123Z"
}
------------------------------

🎉 Success! Subscription plan changed.

   • Account: Acme Inc
   • Subscription UID: Qw8nZp2R
   • New Plan: Premium Plan
```

## API Endpoints Used

- `GET /api/v1/crm/accounts?PrimaryContact.Email={email}` - Search for accounts by email
- `GET /api/v1/crm/accounts/{uid}?fields=Uid,Name,CurrentSubscription.*` - Fetch account with subscription details
- `GET /api/v1/billing/plans` - Fetch available plans
- `PUT /api/v1/billing/subscriptions/{subscription_uid}/changesubscriptionpreview` - Preview subscription plan change
- `PUT /api/v1/billing/subscriptions/{subscription_uid}/changeSubscription` - Update subscription plan

## Core Code Examples

### Searching for Accounts by Email

```javascript
export async function findAccountsByEmail(email) {
  const response = await fetch(
    `https://${
      process.env.OUTSETA_SUBDOMAIN
    }.outseta.com/api/v1/crm/accounts?fields=Uid,Name,PrimaryContact.Email,CurrentSubscription.Plan.Name&PrimaryContact.Email=${encodeURIComponent(
      email
    )}`,
    {
      method: "GET",
      headers: {
        Authorization: `Outseta ${process.env.OUTSETA_API_KEY}:${process.env.OUTSETA_API_SECRET}`,
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      `/api/v1/crm/accounts: [${response.status}] ${
        data.ErrorMessage || data.Message || ""
      }`
    );
  }

  return data.items || [];
}
```

### Fetching Account with Subscription Details

```javascript
const accountResponse = await fetch(
  `https://${process.env.OUTSETA_SUBDOMAIN}.outseta.com/api/v1/crm/accounts/${accountUid}?fields=Uid,Name,CurrentSubscription.*`,
  {
    method: "GET",
    headers: {
      Authorization: `Outseta ${process.env.OUTSETA_API_KEY}:${process.env.OUTSETA_API_SECRET}`,
      "Content-Type": "application/json",
    },
  }
);
```

### Previewing Plan Change

```javascript
const previewPayload = {
  Plan: {
    Uid: newPlanUid,
  },
  BillingRenewalTerm: currentSubscription.BillingRenewalTerm,
  Account: {
    Uid: accountUid,
  },
};

const previewResponse = await fetch(
  `https://${process.env.OUTSETA_SUBDOMAIN}.outseta.com/api/v1/billing/subscriptions/${currentSubscription.Uid}/changesubscriptionpreview`,
  {
    method: "PUT",
    headers: {
      Authorization: `Outseta ${process.env.OUTSETA_API_KEY}:${process.env.OUTSETA_API_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(previewPayload),
  }
);
```

### Updating Subscription Plan

```javascript
const subscriptionUpdatePayload = {
  Plan: {
    Uid: newPlanUid,
  },
  BillingRenewalTerm: currentSubscription.BillingRenewalTerm,
  Account: {
    Uid: accountUid,
  },
};

const subscriptionResponse = await fetch(
  `https://${process.env.OUTSETA_SUBDOMAIN}.outseta.com/api/v1/billing/subscriptions/${currentSubscription.Uid}/changeSubscription`,
  {
    method: "PUT",
    headers: {
      Authorization: `Outseta ${process.env.OUTSETA_API_KEY}:${process.env.OUTSETA_API_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(subscriptionUpdatePayload),
  }
);
```

### Handling Multiple Accounts

The demo intelligently handles cases where a single email address might be associated with multiple accounts:

```javascript
if (accounts.length === 1) {
  // Single account - use automatically
  return accounts[0];
} else {
  // Multiple accounts - prompt user to select
  const accountChoices = accounts.map((account) => ({
    name: `${account.Name} (UID: ${account.Uid}) - Current plan: ${
      account.CurrentSubscription?.Plan?.Name || "None"
    }`,
    value: account.Uid,
  }));

  const selectedAccountUid = await select({
    message: "Select an account:",
    choices: accountChoices,
  });

  return accounts.find((account) => account.Uid === selectedAccountUid);
}
```
