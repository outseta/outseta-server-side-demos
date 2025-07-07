import "dotenv/config";
import { input } from "@inquirer/prompts";
import { loginUser } from "./generate-jwt.js";

async function promptForEmail() {
  const email = await input({
    message: "  Email:",
    required: true,
  });
  return { email };
}

// CLI execution
async function main() {
  try {
    console.info("🔑 Login");
    const { email } = await promptForEmail();

    console.info("\n🚀 Generating token for user...\n");
    const { access_token, expires_in, token_type } = await loginUser({ email });
    console.info(`\n🎉 Success! Token generated.\n`);
    console.info(`   • Token type: ${token_type}`);
    console.info(`   • JWT: ${access_token.substring(0, 40)}...`);
    console.info(`   • Expires in: ${expires_in} seconds\n`);
  } catch (error) {
    // Suppress stack trace if user exited with Ctrl+C
    if (error instanceof Error && error.name === "ExitPromptError") {
      // noop; silence this error
    } else {
      console.error(
        `\n💥 Failed to generate token: ${error.message || error}\n`
      );
      process.exit(1);
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
