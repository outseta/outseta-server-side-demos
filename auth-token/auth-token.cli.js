import "dotenv/config";
import { input } from "@inquirer/prompts";
import { loginUser } from "./auth-token.js";

process.on("SIGINT", () => {
  console.log("\nExited.");
  process.exit(0);
});

// CLI execution
async function main() {
  try {
    console.log("🔑 Login");
    const email = await input({
      message: "  Email:",
    });

    console.log("\n🚀 Generating token for user...\n");
    const { access_token, expires_in, token_type } = await loginUser({ email });
    console.log(`\n🎉 Success! Token generated.\n`);
    console.log(`   Token type: ${token_type}`);
    console.log(`   JWT: ${access_token.substring(0, 40)}...`);
    console.log(`   Expires in: ${expires_in} seconds\n`);
  } catch (error) {
    // Suppress stack trace if user exited with Ctrl+C
    if (error && error.message && error.message.includes("SIGINT")) {
      console.log("Exited.");
      process.exit(0);
    }
    console.error(`\n💥 Failed to generate token: ${error.message || error}\n`);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
