#!/usr/bin/env node

require("dotenv").config();

/**
 * Updates usage for a specific add-on subscription in Outseta
 * @param {string} accountUid - The unique identifier for the account
 * @param {string} addOnUid - The unique identifier for the add-on
 * @param {number} amount - The usage amount to add
 * @returns {Promise<Object>} - The API response
 */
async function updateUsageBasedPricing(accountUid, addOnUid, amount) {
  try {
    // Step 1: Fetch the account with subscription add-on info
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

    if (!accountResponse.ok) {
      throw new Error(`Failed to fetch account: ${accountResponse.status}`);
    }

    const accountData = await accountResponse.json();
    console.log("✅ Account data fetched for:", accountUid);

    // Step 2: Find the correct add-on subscription
    const addOnSubscriptions =
      accountData.CurrentSubscription.SubscriptionAddOns || [];
    const targetAddOnSubscription = addOnSubscriptions.find(
      (subscriptionAddOn) => {
        return subscriptionAddOn.AddOn.Uid === addOnUid;
      }
    );

    // Check if the add-on is found
    if (!targetAddOnSubscription) {
      throw new Error(
        `Subscription for add-on with UID ${addOnUid} not found for account ${accountUid}`
      );
    }

    // Check if the add-on is a usage add-on (BillingAddOnType 2)
    if (targetAddOnSubscription.AddOn.BillingAddOnType !== 2) {
      throw new Error(
        `Add-on with UID ${addOnUid} is not a usage add-on for account ${accountUid}`
      );
    }

    console.log("✅ Found add-on subscription:", targetAddOnSubscription.Uid);

    // Step 3: Update usage for the add-on subscription
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

    if (!usageResponse.ok) {
      throw new Error(`Failed to update usage: ${usageResponse.status}`);
    }

    const usageData = await usageResponse.json();
    console.log("✅ Usage updated successfully:", usageData.Uid);
    return usageData;
  } catch (error) {
    console.error("❌ Error updating usage-based pricing:", error.message);
    throw error;
  }
}

// CLI execution
async function main() {
  // Get command line arguments
  const args = process.argv.slice(2);

  if (args.length !== 3) {
    console.log(
      "Usage: node track-usage.js <account-uid> <add-on-uid> <amount>"
    );
    console.log("Example: node track-usage.js abc123 def456 10");
    process.exit(1);
  }

  const [accountUid, addOnUid, amount] = args;
  const usageAmount = parseInt(amount, 10);

  if (isNaN(usageAmount) || usageAmount <= 0) {
    console.error("❌ Amount must be a positive number");
    process.exit(1);
  }

  console.log("🚀 Starting usage update...");
  console.log(`   Account UID: ${accountUid}`);
  console.log(`   Add-on UID: ${addOnUid}`);
  console.log(`   Amount: ${usageAmount}`);
  console.log("");

  try {
    const result = await updateUsageBasedPricing(
      accountUid,
      addOnUid,
      usageAmount
    );
    console.log("");
    console.log("🎉 Success! Usage record created");
    console.log(`   Usage ID: ${result.Uid}`);
    console.log(`   Quantity: ${result.Quantity}`);
    console.log(`   Created: ${result.CreatedDateTime}`);
  } catch (error) {
    console.log("");
    console.error("💥 Failed to update usage");
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { updateUsageBasedPricing };
