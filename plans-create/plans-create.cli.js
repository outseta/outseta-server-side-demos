import "dotenv/config";
import { input, select, confirm } from "@inquirer/prompts";
import { createPlan, getPlanFamilies } from "./plans-create.js";

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
    const selectedPlanFamilyUid = await select({
      message: "Select a plan family:",
      choices: planFamilyChoices,
    });
    const selectedPlanFamily = planFamilies.find(
      (pf) => pf.Uid === selectedPlanFamilyUid
    );
    console.log(
      `\n✅ Selected plan family: ${selectedPlanFamily.Name} (UID: ${selectedPlanFamily.Uid})\n`
    );

    // Prompt for plan details
    const name = await input({
      message: "Plan Name:",
      default: "Test Plan",
    });

    let monthlyRate;
    while (true) {
      const monthlyRateInput = await input({
        message: "Monthly Rate (USD):",
        default: "9.99",
      });
      const value = parseFloat(monthlyRateInput);
      if (isNaN(value) || value < 0) {
        console.log("Please enter a valid positive number");
        continue;
      }
      monthlyRate = value;
      break;
    }

    let trialPeriodDays;
    while (true) {
      const trialPeriodInput = await input({
        message: "Trial Period Days:",
        default: "14",
      });
      const value = parseFloat(trialPeriodInput);
      if (isNaN(value) || value < 0) {
        console.log("Please enter a valid positive number");
        continue;
      }
      trialPeriodDays = value;
      break;
    }

    const isActive = await confirm({
      message: "Is Active?",
      default: true,
    });

    const answers = {
      name,
      monthlyRate,
      trialPeriodDays,
      isActive,
      planFamilyUid: selectedPlanFamilyUid,
    };

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
    if (error instanceof Error && error.name === 'ExitPromptError') {
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
