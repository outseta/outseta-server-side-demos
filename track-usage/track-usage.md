# Track Usage Demo

## Purpose

Demonstrates how to update usage-based pricing for add-on subscriptions.

## What it does

- Fetches account data with subscription and add-on information
- Validates that the specified add-on exists and is usage-based
- Creates a new usage record with the specified amount
- Provides detailed logging and error handling

## Use cases

- Tracking API calls, storage usage, or other metered services
- Implementing usage-based billing for custom add-ons
- Automating usage reporting from external systems

## 📋 Prerequisites

- The [global prerequisites](README.md#prerequisites)
- An account with a usage-based add-on subscription

## 🚀 Run the demo

1. Follow the [Quick Start guide](README.md#-quick-start) to set up your environment
2. Run the demo script using this format:

```bash
node track-usage.js
```

When you run the script, you will be prompted to enter:

- The Account UID
- The Add-on UID
- The usage amount (must be a positive number)

**Example session**:

```bash
$ node track-usage.js
? Enter the Account UID: L9nqkRXQ
? Enter the Add-on UID: j9bpnkmn
? Enter the usage amount: 3

🚀 Track usage...

✅ Account data fetched for: L9nqkRXQ
✅ Found add-on subscription: <subscription-add-on-uid>

--- api/v1/billing/usage response ---
{
  "Uid": "<usage-uid>",
  "UsageDate": "2024-06-07T12:34:56.789Z",
  "Amount": 3,
  "Created": "2024-06-07T12:34:56.789Z",
  "Updated": "2024-06-07T12:34:56.789Z"
}
------------------------------

🎉 Success! Usage record created
   Usage UID: <usage-uid>
   Usage Date: 2024-06-07T12:34:56.789Z
   Amount: 3
   Created: 2024-06-07T12:34:56.789Z
   Updated: 2024-06-07T12:34:56.789Z
```

## 📖 Learn More

For a comprehensive overview of usage-based pricing concepts, see [Outseta's Usage-based (metered) pricing guide](https://go.outseta.com/support/kb/articles/dpWr3mnq/usage-based-metered-pricing).

## API Endpoints Used

- `GET /api/v1/crm/accounts/{uid}?fields=Uid,Name,CurrentSubscription.*,CurrentSubscription.SubscriptionAddOns.*,CurrentSubscription.SubscriptionAddOns.AddOn.*` - Fetch account with subscription details
- `POST /api/v1/billing/usage` - Create usage record

## Core Code Examples

### Fetching Account Data

```javascript
const accountResponse = await fetch(
  `https://${process.env.OUTSETA_SUBDOMAIN}.outseta.com/api/v1/crm/accounts/${accountUid}?fields=Uid,Name,CurrentSubscription.*,CurrentSubscription.SubscriptionAddOns.*,CurrentSubscription.SubscriptionAddOns.AddOn.*`,
  {
    method: "GET",
    headers: {
      Authorization: `Outseta ${process.env.OUTSETA_API_KEY}:${process.env.OUTSETA_API_SECRET}`,
      "Content-Type": "application/json",
    },
  }
);
```

### Validating Add-on Subscription

```javascript
// Find the correct add-on subscription
const addOnSubscriptions =
  accountData.CurrentSubscription.SubscriptionAddOns || [];
const targetAddOnSubscription = addOnSubscriptions.find(
  (subscriptionAddOn) => subscriptionAddOn.AddOn.Uid === addOnUid
);

// Check if add-on exists and is usage-based (BillingAddOnType 2)
if (!targetAddOnSubscription) {
  throw new Error(`Subscription for add-on with UID ${addOnUid} not found`);
}

if (targetAddOnSubscription.AddOn.BillingAddOnType !== 2) {
  throw new Error(`Add-on with UID ${addOnUid} is not a usage add-on`);
}
```

### Creating Usage Record

```javascript
const usageUpdatePayload = {
  UsageDate: new Date().toISOString(),
  Amount: amount,
  SubscriptionAddOn: {
    Uid: targetAddOnSubscription.Uid,
  },
};

const usageResponse = await fetch(
  `https://${process.env.OUTSETA_SUBDOMAIN}.outseta.com/api/v1/billing/usage`,
  {
    method: "POST",
    headers: {
      Authorization: `Outseta ${process.env.OUTSETA_API_KEY}:${process.env.OUTSETA_API_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(usageUpdatePayload),
  }
);
```
