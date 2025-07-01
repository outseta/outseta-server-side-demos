# Outseta API Demos

A collection of practical examples and scripts demonstrating how to interact with the Outseta API. This repository is designed to help newcomers to Outseta learn how to use the API properly through real-world examples.

## 🎯 Purpose

These demos showcase common Outseta API operations and patterns, making it easier for developers to:

- Understand Outseta's API structure and capabilities
- Implement common business logic with Outseta
- Learn best practices for API integration
- Build reliable automation workflows

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- Outseta API credentials (API Key and Secret)
- Basic understanding of JavaScript/Node.js

## 🚀 Quick Start

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd outseta-api-demos
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   OUTSETA_API_KEY=your_api_key_here
   OUTSETA_API_SECRET=your_api_secret_here
   OUTSETA_SUBDOMAIN=your_subdomain_here
   ```

4. **Run a demo**
   ```bash
   node track-usage.js <account-uid> <add-on-uid> <amount>
   ```

## 📚 Available Demos

### Track Usage (`track-usage.js`)

**Purpose**: Demonstrates how to update usage-based pricing for add-on subscriptions.

**What it does**:

- Fetches account data with subscription and add-on information
- Validates that the specified add-on exists and is usage-based
- Creates a new usage record with the specified amount
- Provides detailed logging and error handling

**Use cases**:

- Tracking API calls, storage usage, or other metered services
- Implementing usage-based billing for custom add-ons
- Automating usage reporting from external systems

**📖 Learn More**: For a comprehensive overview of usage-based pricing concepts, see [Outseta's Usage-based (metered) pricing guide](https://go.outseta.com/support/kb/articles/dpWr3mnq/usage-based-metered-pricing).

**Usage**:

```bash
node track-usage.js <account-uid> <add-on-uid> <amount>
```

**Example**:

```bash
node track-usage.js abc123 def456 10
```

**API Endpoints Used**:

- `GET /api/v1/crm/accounts/{uid}` - Fetch account with subscription details
- `POST /api/v1/billing/usage` - Create usage record

## 🔧 Configuration

### Environment Variables

All scripts use the following environment variables:

| Variable             | Description             | Required |
| -------------------- | ----------------------- | -------- |
| `OUTSETA_API_KEY`    | Your Outseta API key    | Yes      |
| `OUTSETA_API_SECRET` | Your Outseta API secret | Yes      |
| `OUTSETA_SUBDOMAIN`  | Your Outseta subdomain  | Yes      |

## 🛠️ Development

### Project Structure

```
outseta-api-demos/
├── README.md
├── package.json
├── track-usage.js
├── .env.example (example .env file)
└── .env (create this file)

```

### Adding New Demos

When adding new demo scripts:

1. Follow the existing naming convention (`kebab-case.js`)
2. Include comprehensive JSDoc comments
3. Add proper error handling and logging
4. Update this README with documentation
5. Include usage examples and API endpoints used

### Code Style

- Use async/await for API calls
- Include detailed console logging for debugging
- Provide clear error messages
- Export functions for programmatic use
- Include CLI interface when appropriate

## 🔍 API Reference

For detailed API documentation, visit:

- [Outseta API Documentation](https://developers.outseta.com/)

### Common API Patterns

**Authentication**:

```javascript
headers: {
  Authorization: `Outseta ${process.env.OUTSETA_API_KEY}:${process.env.OUTSETA_API_SECRET}`,
  "Content-Type": "application/json",
}
```

**Error Handling**:

```javascript
if (!response.ok) {
  throw new Error(`API request failed: ${response.status}`);
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add your demo script
4. Update the README
5. Submit a pull request

## 📄 License

ISC License - see [package.json](package.json) for details.

## 🆘 Support

- **[Outseta Documentation](https://go.outseta.com/support/kb)**
- **[Outseta API Documentation](https://documenter.getpostman.com/view/3613332/outseta-rest-api-v1/7TNfr6k)**
- **Issues**: [Create an issue in this repository](https://github.com/outseta/outseta-api-demos/issues)
- **Questions**: Email [support@outseta.com](mailto:support@outseta.com)

---

**Note**: These demos are for educational purposes. Always test thoroughly in a development environment before using in production.
