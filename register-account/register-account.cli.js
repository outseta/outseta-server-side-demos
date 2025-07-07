import "dotenv/config";
import { input, select } from "@inquirer/prompts";
import { registerUser } from "./register-account.js";

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
  return data.items;
}

async function promptForPlan() {
  const plans = await getPlans();
  if (!Array.isArray(plans) || plans.length === 0) {
    throw new Error("No plans found.");
  }
  const planChoices = plans.map((plan) => ({
    name: `${plan.Name} (UID: ${plan.Uid}) - ${
      plan.Description ? plan.Description.replace(/<[^>]+>/g, "") : ""
    }`,
    value: plan.Uid,
  }));
  const selectedPlanUid = await select({
    message: "Select a plan:",
    choices: planChoices,
  });
  const selectedPlan = plans.find((p) => p.Uid === selectedPlanUid);
  return selectedPlan;
}

async function promptForPersonDetails() {
  // Person and account details
  console.log("👤 Enter Person details:");
  const email = await input({
    message: "  Email:",
    default: `jane+${Date.now()}@example.com`,
  });
  const firstName = await input({
    message: "  First Name:",
    default: "Jane",
  });
  const lastName = await input({
    message: "  Last Name:",
    default: "Doe",
  });
  const coffeePreference = await input({
    message: "  Coffee Preference:",
    default: "Latte",
  });

  return { email, firstName, lastName, coffeePreference };
}

async function promptForAccountDetails() {
  // Account details
  console.log("🏢 Enter Account details:");
  const accountName = await input({
    message: "  Name:",
    default: "Acme Inc",
  });
  const accountMascot = await input({
    message: "  Mascot:",
    default: "Roadrunner",
  });
  return { accountName, accountMascot };
}

// CLI execution
async function main() {
  try {
    const plan = await promptForPlan();
    const personDetails = await promptForPersonDetails();
    const accountDetails = await promptForAccountDetails();

    console.log("\n🚀 Registering user...\n");
    const { PrimaryContact, Name, Mascot } = await registerUser({
      planUid: plan.Uid,
      ...accountDetails,
      ...personDetails,
    });

    console.warn(
      "📮 A confirmation email has been sent to the user. They must follow the link in the email to set their password and activate their account before logging in."
    );
    console.info("");
    console.info(`   • Email: ${PrimaryContact?.Email}`);
    console.info(`   • First Name: ${PrimaryContact?.FirstName}`);
    console.info(`   • Last Name: ${PrimaryContact?.LastName}`);
    console.info(`   • Coffee Preference: ${PrimaryContact?.CoffeePreference}`);
    console.info(`   • Company Name: ${Name}`);
    console.info(`   • Company Mascot: ${Mascot}`);
    console.info("");

    console.info(
      "\nℹ️ You may generate a token on their behalf in a server side environment (even before they have set their password), see auth-token demo.\n"
    );
  } catch (error) {
    // Suppress stack trace if user exited with Ctrl+C
    if (error instanceof Error && error.name === "ExitPromptError") {
      // noop; silence this error
    } else {
      console.error(`💥 Failed to register user: ${error.message || error}\n`);
      process.exit(1);
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
