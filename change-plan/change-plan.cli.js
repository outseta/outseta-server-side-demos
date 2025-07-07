import "dotenv/config";
import { input, select } from "@inquirer/prompts";
import { changePlan, findAccountsByEmail } from "./change-plan.js";

/**
 * Fetches available plans from Outseta
 * @returns {Promise<Array>} - Array of plan objects
 */
async function getPlans() {
  const response = await fetch(
    `https://${process.env.OUTSETA_SUBDOMAIN}.outseta.com/api/v1/billing/plans`,
    {
      method: "GET",
      headers: {
        Authorization: `Outseta ${process.env.OUTSETA_API_KEY}:${process.env.OUTSETA_API_SECRET}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch plans: ${response.status}`);
  }

  const data = await response.json();
  return data.items || [];
}

/**
 * Prompts for user email and handles account selection if multiple accounts exist
 * @returns {Promise<Object>} - Selected account
 */
async function promptForAccount() {
  const email = await input({
    message: "Enter the user's email address:",
    required: true,
  });

  console.info("\n🔍 Searching for accounts...");
  const accounts = await findAccountsByEmail(email);

  if (accounts.length === 0) {
    throw new Error(`No accounts found for email: ${email}`);
  }

  if (accounts.length === 1) {
    const account = accounts[0];
    console.info(`\n✅ Found account: ${account.Name} (UID: ${account.Uid})`);

    // Show current plan if available
    if (account.CurrentSubscription?.Plan?.Name) {
      console.info(`   Current plan: ${account.CurrentSubscription.Plan.Name}`);
    }

    return account;
  }

  // Multiple accounts found - let user select
  console.info(`\n📋 Found ${accounts.length} accounts for ${email}:`);

  const accountChoices = accounts.map((account) => ({
    name: `${account.Name} (UID: ${account.Uid})${
      account.CurrentSubscription?.Plan?.Name
        ? ` - Current plan: ${account.CurrentSubscription.Plan.Name}`
        : " - No active subscription"
    }`,
    value: account.Uid,
  }));

  const selectedAccountUid = await select({
    message: "Select an account:",
    choices: accountChoices,
  });

  const selectedAccount = accounts.find(
    (account) => account.Uid === selectedAccountUid
  );
  return selectedAccount;
}

/**
 * Prompts for plan selection
 * @param {Object} currentAccount - The current account object
 * @returns {Promise<Object>} - Selected plan
 */
async function promptForPlan(currentAccount) {
  console.info("\n📦 Fetching available plans...");
  const plans = await getPlans();

  if (!Array.isArray(plans) || plans.length === 0) {
    throw new Error("No plans found.");
  }

  // Filter out the current plan if it exists
  const currentPlanUid = currentAccount.CurrentSubscription?.Plan?.Uid;
  const availablePlans = currentPlanUid
    ? plans.filter((plan) => plan.Uid !== currentPlanUid)
    : plans;

  if (availablePlans.length === 0) {
    throw new Error("No other plans available for upgrade/downgrade.");
  }

  const planChoices = availablePlans.map((plan) => ({
    name: `${plan.Name} (UID: ${plan.Uid}) - $${plan.MonthlyRate}/month${
      plan.Description ? ` - ${plan.Description.replace(/<[^>]+>/g, "")}` : ""
    }`,
    value: plan.Uid,
  }));

  const selectedPlanUid = await select({
    message: "Select a new plan:",
    choices: planChoices,
  });

  const selectedPlan = availablePlans.find(
    (plan) => plan.Uid === selectedPlanUid
  );
  return selectedPlan;
}

// CLI execution
async function main() {
  try {
    const account = await promptForAccount();

    // Validate account has subscription
    if (!account.CurrentSubscription) {
      throw new Error(
        `Account "${account.Name}" does not have an active subscription to change.`
      );
    }

    const newPlan = await promptForPlan(account);

    console.info("\n🚀 Changing subscription plan...\n");

    const result = await changePlan(account.Uid, newPlan.Uid);

    console.info("\n🎉 Success! Subscription plan changed.");
    console.info("");
    console.info(`   Account: ${account.Name}`);
    console.info(`   Subscription UID: ${result.Uid}`);
    console.info(`   New Plan: ${newPlan.Name}`);
    console.info(`   Monthly Rate: $${newPlan.MonthlyRate}`);
    console.info("");
  } catch (error) {
    // Suppress stack trace if user exited with Ctrl+C
    if (error instanceof Error && error.name === "ExitPromptError") {
      // noop; silence this error
    } else {
      console.error(`\n💥 Failed to change plan: ${error.message || error}\n`);
      process.exit(1);
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
