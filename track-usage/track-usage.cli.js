import "dotenv/config";
import { input, number } from "@inquirer/prompts";
import { updateUsageBasedPricing } from "./track-usage.js";

// CLI execution
async function main() {
  try {
    const accountUid = await input({
      message: "Enter the Account UID:",
      required: true,
    });

    const addOnUid = await input({
      message: "Enter the Add-on UID:",
      required: true,
    });

    const amount = await number({
      message: "Enter the usage amount:",
      min: 1,
      required: true,
    });

    console.log("\n🚀 Track usage...\n");

    const result = await updateUsageBasedPricing(accountUid, addOnUid, amount);
    console.log("\n🎉 Success! Usage record created");
    console.log("");
    console.log(`   • Usage UID: ${result.Uid}`);
    console.log(`   • Usage Date: ${result.UsageDate}`);
    console.log(`   • Amount: ${result.Amount}`);
    console.log(`   • Created: ${result.Created}`);
    console.log(`   • Updated: ${result.Updated}`);
    console.log("");
  } catch (error) {
    // Suppress stack trace if user exited with Ctrl+C
    if (error instanceof Error && error.name === "ExitPromptError") {
      // noop; silence this error
    } else {
      console.error(`\n💥 Failed to track usage: ${error.message || error}\n`);
      process.exit(1);
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
