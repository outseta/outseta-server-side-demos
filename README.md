# Outseta API Demos

A collection of practical examples and scripts demonstrating how to interact with the Outseta REST API. This repository is designed to help developers learn how to use the API effectively through real-world examples and best practices.

👉 **[Explore demos](#-available-demos)**

## 🎯 Purpose

These demos showcase common Outseta API operations and patterns, making it easier for developers to:

- **Understand** Outseta's API structure and capabilities
- **Implement** common business logic with Outseta
- **Learn** best practices for API integration
- **Build** reliable automation workflows

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.0.0 or higher
- **Outseta API credentials** (API Key and Secret)
- **Basic understanding** of JavaScript/Node.js
- **Git** for cloning the repository

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd outseta-scripts
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your Outseta credentials:

```env
OUTSETA_API_KEY=your_api_key_here
OUTSETA_API_SECRET=your_api_secret_here
OUTSETA_SUBDOMAIN=your_subdomain_here
```

### 4. Run a Demo

Each demo has specific usage instructions. See the [Available Demos](#-available-demos) section below.

**Example:**

```bash
node track-usage.js L9nqkRXQ j9bpnkmn 3
```

## 📚 Available Demos

### Track Usage ([Guide](track-usage.md) | [Source Code](track-usage.js))

**Purpose**: Update usage-based pricing for add-on subscriptions

**Use Cases**:

- Tracking API calls, storage usage, or other metered services
- Implementing usage-based billing for custom add-ons
- Automating usage reporting from external systems

**Usage**:

```bash
node track-usage.js <account-uid> <add-on-uid> <amount>
```

**Example**:

Add _3_ units of usage to the add-on with UID _j9bpnkmn_ for the account with UID _L9nqkRXQ_.

```bash
node track-usage.js L9nqkRXQ j9bpnkmn 3
```

---

_More demos coming soon!_

## 🔧 Configuration

### Environment Variables

All scripts require the following environment variables:

| Variable             | Description             | Required | Example        |
| -------------------- | ----------------------- | -------- | -------------- |
| `OUTSETA_API_KEY`    | Your Outseta API key    | ✅ Yes   | `abc123def456` |
| `OUTSETA_API_SECRET` | Your Outseta API secret | ✅ Yes   | `xyz789uvw012` |
| `OUTSETA_SUBDOMAIN`  | Your Outseta subdomain  | ✅ Yes   | `mycompany`    |

### Getting Your Credentials

1. Log into your Outseta account
   Navigate to **Settings → Integrations → API Keys**
2. Locate the **Add API Key** button to generate a new API Key and Secret
3. Add the API Key and Secret to your `.env` file

## 🛠️ Development

### Project Structure

```
outseta-scripts/
├── README.md              # This file
├── package.json           # Project dependencies
├── <demo-name>.js         # Demo script
├── <demo-name>.md         # Demo documentation
├── .env.example           # Environment variables template
└── .env                   # Your environment variables (create this)
```

### Adding New Demos

When adding new demo scripts, follow this structure:

1. Create the demo script (`<demo-name>.js`)

   - Follow the structure of existing demos
   - Include comprehensive error handling
   - Add detailed console logging
   - Export functions for programmatic use

2. Create documentation (`<demo-name>.md`)

   - Explain the purpose and use cases
   - Provide clear usage instructions
   - Include code examples
   - Document API endpoints used

3. Update this README
   - Add the demo to the [Available Demos](#-available-demos) section
   - Follow the established format

### Code Style Guidelines

- ✅ Use **async/await** for API calls
- ✅ Include **detailed console logging** for debugging
- ✅ Provide **clear error messages** with context
- ✅ Export **functions** for programmatic use
- ✅ Include **CLI interface** when appropriate
- ✅ Add **JSDoc comments** for functions
- ✅ Use **consistent error handling** patterns

## 🔍 API Reference

### Official Documentation

- **[Outseta API Documentation](https://developers.outseta.com/)**
- **[Outseta Support Knowledge Base](https://go.outseta.com/support/kb)**

### Common API Patterns

#### Headers

```javascript
const headers = {
  Authorization: `Outseta ${process.env.OUTSETA_API_KEY}:${process.env.OUTSETA_API_SECRET}`,
  "Content-Type": "application/json",
};
```

#### Error Handling

```javascript
if (!response.ok) {
  const data = await response.json();
  throw new Error(
    `API request failed: ${response.status} - ${data.ErrorMessage}`
  );
}
```

#### Response Validation

```javascript
const data = await response.json();
if (!data || !data.Uid) {
  throw new Error("Invalid response format from API");
}
```

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-demo`)
3. **Add** your demo script following the guidelines above
4. **Update** the README with your new demo
5. **Test** your changes thoroughly
6. **Submit** a pull request

### Contribution Guidelines

- Follow the existing code style and structure
- Include comprehensive documentation
- Add appropriate error handling
- Test with real Outseta credentials
- Update the README with your new demo

## 📄 License

This project is licensed under the ISC License - see [package.json](package.json) for details.

## 🆘 Support & Resources

### Getting Help

- **[Outseta Documentation](https://go.outseta.com/support/kb)** - Official Outseta help
- **[Outseta API Documentation](https://documenter.getpostman.com/view/3613332/outseta-rest-api-v1/7TNfr6k)** - Complete API reference
- **[GitHub Issues](https://github.com/outseta/outseta-api-demos/issues)** - Report bugs or request features
- **[Email Support](mailto:support@outseta.com)** - Direct support from Outseta

### Additional Resources

- **[Usage-based Pricing Guide](https://go.outseta.com/support/kb/articles/dpWr3mnq/usage-based-metered-pricing)** - Learn about metered billing
- **[Outseta Developer Community](https://developers.outseta.com/)** - Connect with other developers

---

## ⚠️ Important Notes

- **Educational Purpose**: These demos are for educational purposes
- **Test First**: Always test thoroughly in a development environment before using in production
- **API Limits**: Be mindful of Outseta's API rate limits
- **Security**: Never commit your `.env` file or expose API credentials

---

**Ready to get started?** Check out the [Track Usage demo](#-track-usage) for a practical example!
