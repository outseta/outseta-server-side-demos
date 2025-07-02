import "dotenv/config";
import inquirer from "inquirer";
// Removed axios import

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
  if (!response.ok) {
    throw new Error(
      `/api/v1/billing/planfamilies: [${response.status}] ${response.statusText}`
    );
  }
  const data = await response.json();
  return data.items;
}

/**
 * Creates a new plan in Outseta
 * @param {Object} planDetails - The plan details (name, price, planFamilyUid, etc.)
 * @returns {Promise<Object>} - The API response
 */
async function createPlan({
  name,
  monthlyRate,
  planFamilyUid,
  trialPeriodDays,
  isActive,
}) {
  const payload = {
    AccountRegistrationMode: 1,
    IsActive: isActive,
    Name: name,
    PlanFamily: { Uid: planFamilyUid },
    MonthlyRate: monthlyRate,
    TrialPeriodDays: trialPeriodDays,
  };

  const response = await fetch(
    `https://${process.env.OUTSETA_SUBDOMAIN}.outseta.com/api/v1/billing/plans`,
    {
      method: "POST",
      headers: {
        Authorization: `Outseta ${process.env.OUTSETA_API_KEY}:${process.env.OUTSETA_API_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );
  const data = await response.json();

  console.info("--- api/v1/billing/plans response ---");
  console.info(JSON.stringify(data, null, 2));
  console.info("------------------------------");

  if (!response.ok) {
    throw new Error(
      `/api/v1/billing/plans: [${response.status}] ${data.ErrorMessage || data.Message || response.statusText}`
    );
  }
  return data;
}

// Graceful SIGINT (Ctrl+C) handling
process.on("SIGINT", () => {
  console.log("\nExited.");
  process.exit(0);
});

// CLI execution
async function main() {
  try {
    // Fetch and select plan family
    console.log("\n📦 Fetching available plan families...");
    const planFamilies = await getPlanFamilies();
    if (!Array.isArray(planFamilies) || planFamilies.length === 0) {
      throw new Error("No plan families found.");
    }
    const planFamilyChoices = planFamilies.map((pf) => ({
      name: `${pf.Name} (UID: ${pf.Uid})${pf.Description ? " - " + pf.Description.replace(/<[^>]+>/g, "") : ""}`,
      value: pf.Uid,
    }));
    const { selectedPlanFamilyUid } = await inquirer.prompt([
      {
        type: "list",
        name: "selectedPlanFamilyUid",
        message: "Select a plan family:",
        choices: planFamilyChoices,
      },
    ]);
    const selectedPlanFamily = planFamilies.find(
      (pf) => pf.Uid === selectedPlanFamilyUid
    );
    console.log(
      `\n✅ Selected plan family: ${selectedPlanFamily.Name} (UID: ${selectedPlanFamily.Uid})\n`
    );

    // Prompt for plan details
    const questions = [
      {
        type: "input",
        name: "name",
        message: "Plan Name:",
        default: "Test Plan",
      },
      {
        type: "input",
        name: "monthlyRate",
        message: "Monthly Rate (USD):",
        default: "9.99",
        validate: (input) => {
          const value = parseFloat(input);
          if (isNaN(value) || value < 0) {
            return "Please enter a valid positive number";
          }
          return true;
        },
        filter: (input) => parseFloat(input),
      },
      {
        type: "number",
        name: "trialPeriodDays",
        message: "Trial Period Days:",
        default: 14,
      },
      {
        type: "confirm",
        name: "isActive",
        message: "Is Active?",
        default: true,
      },
    ];

    const answers = await inquirer.prompt(questions);
    answers.planFamilyUid = selectedPlanFamilyUid;
    console.log("\n🚀 Creating plan...\n");
    const plan = await createPlan(answers);
    console.log(`\n🎉 Success! Plan created.\n`);
    console.log(`   Plan UID: ${plan.Uid}`);
    console.log(`   Plan Name: ${plan.Name}`);
    console.log(`   Monthly Rate: ${plan.MonthlyRate}`);
    console.log(`   Trial Period Days: ${plan.TrialPeriodDays}`);
    console.log(`   Is Active: ${plan.IsActive}`);
    console.log("");
  } catch (error) {
    // Suppress stack trace if user exited with Ctrl+C
    if (error && error.message && error.message.includes("SIGINT")) {
      console.log("Exited.");
      process.exit(0);
    }
    console.error(`\n💥 Failed to create plan: ${error.message || error}\n`);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { createPlan };
