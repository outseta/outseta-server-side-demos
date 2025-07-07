import "dotenv/config";
import { input, select, confirm } from "@inquirer/prompts";
import { changePlan, previewPlanChange } from "./change-plan.js";

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
 * Searches for accounts where the email address matches
 * the primary person's email address, and returns the account
 * with the most recent subscription
 * @param {string} email - The email address to search for
 * @returns {Promise<Array>} - Array of matching accounts
 */
async function findAccountsByEmail(email) {
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

  console.debug(
    `✅ Found ${data.items?.length || 0} account(s) for email: ${email}`
  );
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

  console.info("\n🔍 Searching for accounts...\n");
  const accounts = await findAccountsByEmail(email);

  if (accounts.length === 0) {
    throw new Error(`No accounts found for email: ${email}`);
  }

  if (accounts.length === 1) {
    const account = accounts[0];
    console.info(`\n✅ Found account: ${account.Name} (UID: ${account.Uid})`);

    // Show current plan if available
    if (account.CurrentSubscription?.Plan?.Name) {
      console.info(
        `   • Current plan: ${account.CurrentSubscription.Plan.Name}`
      );
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
    name: `${plan.Name} (UID: ${plan.Uid}) - ${plan.MonthlyRate}/month${
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
    console.info("");

    // Ask if changes should start immediately
    const startImmediately = await confirm({
      message: "Should the plan change start immediately?",
      default: false,
    });

    console.info("\n🔍 Previewing subscription plan change...\n");

    const preview = await previewPlanChange(
      account.Uid,
      newPlan.Uid,
      startImmediately
    );

    // Display preview information
    console.info("📋 Plan Change Preview:");
    console.info("");
    console.info(
      `   • Current Plan: ${
        account.CurrentSubscription?.Plan?.Name || "Unknown"
      }`
    );
    console.info(`   • New Plan: ${newPlan.Name}`);

    // Show invoice preview details
    if (preview.InvoiceDate) {
      console.info(
        `   • Invoice Date: ${new Date(
          preview.InvoiceDate
        ).toLocaleDateString()}`
      );
    }
    console.info(`   • Subtotal: $${preview.Subtotal}`);
    console.info(`   • Tax: $${preview.Tax}`);
    console.info(`   • Total: $${preview.Total}`);
    console.info(`   • Balance: $${preview.Balance}`);
    console.info(`   • Refunded: $${preview.Refunded}`);

    // Show line items if available
    if (preview.InvoiceDisplayItems && preview.InvoiceDisplayItems.length > 0) {
      console.info("");
      console.info("   📄 Invoice Line Items:");
      preview.InvoiceDisplayItems.forEach((item, index) => {
        console.info(
          `   ${index + 1}. ${item.Description || item.ProductName}`
        );
        console.info(`      Type: ${item.Type}`);
        console.info(`      Amount: ${item.Amount || 0}`);
        if (item.StartDate && item.EndDate) {
          console.info(
            `      Period: ${new Date(
              item.StartDate
            ).toLocaleDateString()} - ${new Date(
              item.EndDate
            ).toLocaleDateString()}`
          );
        }
        if (item.RenewalTerm) {
          console.info(`      Renewal Term: ${item.RenewalTerm}`);
        }
      });
    }
    console.info("");

    // Ask for confirmation
    const confirmed = await confirm({
      message: "Do you want to proceed with this plan change?",
      default: false,
    });

    if (!confirmed) {
      console.info("\n❌ Plan change cancelled.");
      return;
    }

    console.info("\n🚀 Changing subscription plan...\n");

    const result = await changePlan(account.Uid, newPlan.Uid, startImmediately);

    console.info("\n🎉 Success! Subscription plan changed.");
    console.info("");
    console.info(`   • Account: ${account.Name}`);
    console.info(`   • Subscription UID: ${result.Uid}`);
    console.info(`   • New Plan: ${newPlan.Name}`);
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
