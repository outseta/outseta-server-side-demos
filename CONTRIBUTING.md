# Contributing to Outseta API Demos

We welcome contributions! This guide will help you understand how to develop and contribute to this project effectively.

## 🛠️ Development

### Project Structure

```
outseta-admin-api-demos/
├── README.md              # Project overview and documentation
├── package.json           # Project dependencies and scripts
├── CONTRIBUTING.md        # This file
├── <demo-name>/           # Demo directory
│   ├── <demo-name>.js     # Demo script
│   ├── <demo-name>.md     # Demo documentation
│   └── <demo-name>.cli.js # CLI interface
├── .env.example           # Environment variables template
└── .env                   # Your environment variables (create this)
```

### Demo Structure

Each feature follows a three-file structure:

- `[feature].cli.js` - CLI interface: data fetching for prompts and user interaction
- `[feature].js` - Core business logic only
- `[feature].md` - Documentation

### Adding New Demos

1. Create the demo script (`<demo-name>.js`), see [demo-name].js Structure
2. Create documentation (`<demo-name>.md`), see [demo-name].md Structure
3. Create the CLI interface (`<demo-name>.cli.js`), see [demo-name].cli.js Structure
4. Update the main [README.md](README.md)
   - Add the demo to the [Available Demos](#-available-demos) section
   - Follow the established format
5. Update the [package.json](package.json)
   - Add the demo to the `scripts` section `npm run <demo-name>/<demo-name>.cli.js`

### <demo-name>.md Structure

```markdown
# [Demo Name] Demo

## Purpose

[Brief explanation of what this demonstrates]

## What it does

[Bullet points of key actions]

## Use cases

[Real-world scenarios where this would be useful]

## 📋 Prerequisites

- The [global prerequisites](README.md#prerequisites)
- [Any demo-specific requirements]

## 🚀 Run the demo

[Instructions and example session with code blocks]

## API Endpoint(s) Used

[List of endpoints with links to documentation]

## Core Code Example(s)

[Key code snippets showing the main API calls]
```

### <demo-name>.js Structure

**Core Business Logic Only** - This file should contain only the main API operations, not data fetching for prompts or user interface logic.

#### ES6 Module Import

```javascript
import "dotenv/config";
```

#### Function Documentation

```javascript
/**
 * Creates a new plan in Outseta
 * @param {Object} planDetails - The plan details (name, price, planFamilyUid, etc.)
 * @returns {Promise<Object>} - The API response
 */
export async function demoFunction({ someParam, anotherParam }) {
  // Implementation here
}
```

#### Headers

```javascript
const headers = {
  Authorization: `Outseta ${process.env.OUTSETA_API_KEY}:${process.env.OUTSETA_API_SECRET}`,
  "Content-Type": "application/json",
};
```

#### Error Handling

```javascript
if (!accountResponse.ok) {
  throw new Error(
    `/api/v1/some/endpoint: [${accountResponse.status}] ${
      accountResponse.ErrorMessage || accountResponse.Message || ""
    }`
  );
}
```

#### Console Logging

```javascript
const data = await response.json();
console.debug(`✅ Data fetched for: ${someParam}`);

console.debug("\n--- api/v1/some/endpoint response ---");
console.debug(JSON.stringify(data, null, 2));
console.debug("------------------------------\n");
```

### <demo-name>.cli.js Structure

#### CLI Pattern

**Module Setup:**

```javascript
import "dotenv/config";
import { input, select, confirm, number } from "@inquirer/prompts";
import { someFunction } from "./some-feature.js";
```

**Data Fetching for Prompts:**

```javascript
/**
 * Fetches data needed for prompts (e.g., available options for select lists)
 * @returns {Promise<Array>} - Array of options
 */
async function getAvailableOptions() {
  const response = await fetch(
    `https://${process.env.OUTSETA_SUBDOMAIN}.outseta.com/api/v1/some/endpoint`,
    {
      method: "GET",
      headers: {
        Authorization: `Outseta ${process.env.OUTSETA_API_KEY}:${process.env.OUTSETA_API_SECRET}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`API Error: [${response.status}] ${response.statusText}`);
  }

  const data = await response.json();
  return data.items || data;
}
```

**Prompt Functions:**

```javascript
/**
 * Prompts for specific data with validation
 * @returns {Promise<Object>} - User selections
 */
async function promptForSelection() {
  console.info("\n📦 Fetching available options...");
  const options = await getAvailableOptions();

  const choices = options.map((option) => ({
    name: `${option.Name} (UID: ${option.Uid})`,
    value: option.Uid,
  }));

  const selection = await select({
    message: "Select an option:",
    choices: choices,
  });

  return options.find((option) => option.Uid === selection);
}
```

**Main Function Structure:**

```javascript
async function main() {
  try {
    const selection = await promptForSelection();
    const details = await promptForDetails();

    console.info("\n🚀 Processing...\n");

    const result = await demoFunction({
      selectedUid: selection.Uid,
      ...details,
    });

    console.info(`\n🎉 Success! Operation completed.\n`);
    console.info(`   Result UID: ${result.Uid}`);
    console.info(`   Result Name: ${result.Name}`);
    console.info(`   Result SomeProperty: ${result.SomeProperty}`);
  } catch (error) {
    // Error handling with special case for Ctrl+C
    if (error instanceof Error && error.name === "ExitPromptError") {
      // noop; silence this error
    } else {
      console.error(`\n💥 Failed: ${error.message || error}\n`);
      process.exit(1);
    }
  }
}
```

**Entry Point:**

```javascript
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
```

## 🤝 How to Contribute

Here's how to get started:

1. **Fork** the repository
2. **Create** a demo branch (`git checkout -b demo/amazing-demo`)
3. **Add** your demo following the guidelines above
4. **Update** the README with your new demo
5. **Test** your changes thoroughly
6. **Submit** a pull request

### Contribution Guidelines

- Follow the existing code style and structure
- Include comprehensive documentation
- Add appropriate error handling
- Test with real Outseta credentials
- Update the README with your new demo
