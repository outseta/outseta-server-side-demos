import "dotenv/config";
import { input, select, confirm, number } from "@inquirer/prompts";
import { createPlan } from "./create-plan.js";

process.on("SIGINT", () => {
  console.log("\nExited.");
  process.exit(0);
});

/**
 * Fetches available plan families from Outseta
 * @returns {Promise<Array>} - Array of plan family objects
 */
async function getPlanFamilies() {
  const response = await fetch(
    `https://${process.env.OUTSETA_SUBDOMAIN}.outseta.com/api/v1/billing/planfamilies`,
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
      `/api/v1/billing/planfamilies: [${response.status}] ${response.statusText}`
    );
  }

  return data.items;
}

/**
 * Prompts for plan family
 * @returns {Promise<Object>} - Plan family
 */
async function promptForPlanFamily() {
  // Fetch and select plan family
  console.info("\n📦 Fetching available plan families...");
  const planFamilies = await getPlanFamilies();
  if (!Array.isArray(planFamilies) || planFamilies.length === 0) {
    throw new Error("No plan families found.");
  }
  const planFamilyChoices = planFamilies.map((pf) => ({
    name: `${pf.Name} (UID: ${pf.Uid})${
      pf.Description ? " - " + pf.Description.replace(/<[^>]+>/g, "") : ""
    }`,
    value: pf.Uid,
  }));
  const selectedPlanFamilyUid = await select({
    message: "Select a plan family:",
    choices: planFamilyChoices,
  });
  const selectedPlanFamily = planFamilies.find(
    (pf) => pf.Uid === selectedPlanFamilyUid
  );
  return selectedPlanFamily;
}

/**
 * Prompts for plan details
 * @returns {Promise<Object>} - Plan details
 */
async function promptForPlanDetails() {
  // Prompt for plan details
  const name = await input({
    message: "Plan Name:",
    default: `Test Plan ${Date.now()}`, // Use timestamp for uniqueness
  });

  const monthlyRate = await number({
    message: "Monthly Rate (USD):",
    default: 9.99,
  });

  const trialPeriodDays = await number({
    message: "Trial Period Days:",
    default: 14,
  });

  const isActive = await confirm({
    message: "Is Active?",
    default: true,
  });

  return {
    name,
    monthlyRate,
    trialPeriodDays,
    isActive,
  };
}

// CLI execution
async function main() {
  try {
    const planFamily = await promptForPlanFamily();
    const planDetails = await promptForPlanDetails();

    console.info("\n🚀 Creating plan...\n");

    const plan = await createPlan({
      planFamilyUid: planFamily.Uid,
      ...planDetails,
    });

    console.info(`\n🎉 Success! Plan created.\n`);
    console.info(`   • Plan UID: ${plan.Uid}`);
    console.info(`   • Plan Name: ${plan.Name}`);
    console.info(`   • Monthly Rate: ${plan.MonthlyRate}`);
    console.info(`   • Trial Period Days: ${plan.TrialPeriodDays}`);
    console.info(`   • Is Active: ${plan.IsActive}`);
    console.info("");
  } catch (error) {
    // Suppress stack trace if user exited with Ctrl+C
    if (error instanceof Error && error.name === "ExitPromptError") {
      // noop; silence this error
    } else {
      console.error(`\n💥 Failed to create plan: ${error.message || error}\n`);
      process.exit(1);
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
