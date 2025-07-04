# Create Plan Demo

## Purpose

Demonstrates how to create a new subscription plan in Outseta using the API. This is useful for automating plan setup in development or QA environments.

## What it does

- Prompts for plan details (name, price, etc.)
- Creates a new plan in Outseta
- Logs the created plan or any errors

## Use cases

- Creating a new billing plan programmatically
  - For example, to use with the [Register User Demo](../auth-register/auth-register.md)
  - Or automate Outseta setup for a new client

## 🗒️ Prerequisites

- The [global prerequisites](README.md#prerequisites)

## 🚀 Run the demo

1. Follow the [Quick Start guide](README.md#-quick-start) to set up your environment
2. Run the demo script:

```bash
npm run plans-create
```

The script will interactively prompt you for plan details. No command-line arguments are needed.

**Example session**:

```bash
$ npm run plans-create

📦 Fetching available plan families...
✔ Select a plan family: Default (UID: E9Lw82Qw)
✔ Plan Name: More CLI
✔ Monthly Rate (USD): 9.99
✔ Trial Period Days: 0
✔ Minimum Quantity: 0
✔ Is Active? Yes

🚀 Creating plan...

--- api/v1/billing/plans response ---
{
  "_objectType": "Plan",
  "Name": "More CLI",
  "PlanFamily": {
    "Name": "Default",
    "Uid": "E9Lw82Qw"
  },
  "MonthlyRate": 9.99,
  "IsActive": true,
  "TrialPeriodDays": 0,
  "MinimumQuantity": 0,
  "Uid": "DQ2oVq9V",
  ...
}
------------------------------

🎉 Success! Plan created.

   Plan UID: DQ2oVq9V
   Plan Name: More CLI
   Monthly Rate: 9.99
   Trial Period Days: 0
   Is Active: true

```

## API Endpoint Used

- `POST /api/v1/billing/plans` – Create a new plan

## Core Code Example

```javascript
const payload = {
  AccountRegistrationMode: 1,
  IsActive: isActive,
  Name: name,
  PlanFamily: { Uid: planFamilyUid },
  MonthlyRate: monthlyRate,
  TrialPeriodDays: trialPeriodDays,
};

const response = await fetch("https://api.outseta.com/v1/billing/plans", {
  method: "POST",
  headers: {
    Authorization: `Outseta ${process.env.OUTSETA_API_KEY}:${process.env.OUTSETA_API_SECRET}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(payload),
});
```
