import "dotenv/config";
import inquirer from "inquirer";

/**
 * Updates usage for a specific add-on subscription in Outseta
 * @param {string} accountUid - The unique identifier for the account
 * @param {string} addOnUid - The unique identifier for the add-on
 * @param {number} amount - The usage amount to add
 * @returns {Promise<Object>} - The API response
 */
export async function updateUsageBasedPricing(accountUid, addOnUid, amount) {
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
      throw new Error(
        `/api/v1/crm/accounts/: [${accountResponse.status}] ${accountResponse.ErrorMessage || accountResponse.Message || ""}`
      );
    }

    const accountData = await accountResponse.json();
    console.info(`✅ Account data fetched for: ${accountUid}`);

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

    console.info(
      `✅ Found add-on subscription: ${targetAddOnSubscription.Uid}`
    );

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

    const data = await usageResponse.json();
    console.info("\n--- api/v1/billing/usage response ---");
    console.info(JSON.stringify(data, null, 2));
    console.info("------------------------------\n");

    if (!usageResponse.ok) {
      throw new Error(
        `/api/v1/billing/usage: [${usageResponse.status}] ${usageResponse.ErrorMessage || usageResponse.Message || ""}`
      );
    }

    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

// CLI execution
async function main() {
  const questions = [
    {
      type: "input",
      name: "accountUid",
      message: "Enter the Account UID:",
      validate: (input) => input.trim() !== "" || "Account UID is required",
    },
    {
      type: "input",
      name: "addOnUid",
      message: "Enter the Add-on UID:",
      validate: (input) => input.trim() !== "" || "Add-on UID is required",
    },
    {
      type: "input",
      name: "amount",
      message: "Enter the usage amount:",
      validate: (input) => {
        const value = parseInt(input, 10);
        if (isNaN(value) || value <= 0) {
          return "Amount must be a positive number";
        }
        return true;
      },
      filter: (input) => parseInt(input, 10),
    },
  ];

  try {
    const { accountUid, addOnUid, amount } = await inquirer.prompt(questions);

    console.log("\n🚀 Track usage...\n");

    const result = await updateUsageBasedPricing(accountUid, addOnUid, amount);
    console.log("\n🎉 Success! Usage record created");
    console.log("");
    console.log(`   Usage UID: ${result.Uid}`);
    console.log(`   Usage Date: ${result.UsageDate}`);
    console.log(`   Amount: ${result.Amount}`);
    console.log(`   Created: ${result.Created}`);
    console.log(`   Updated: ${result.Updated}`);
    console.log("");
  } catch (error) {
    // Suppress stack trace if user exited with Ctrl+C
    if (error && error.message && error.message.includes("SIGINT")) {
      console.log("Exited.");
      process.exit(0);
    }
    console.error(`\n💥 Failed to track usage: ${error.message || error}\n`);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
