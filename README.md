# Outseta API Demos

A collection of practical examples and scripts demonstrating how to interact with the Outseta Admin REST API. This repository is designed to help developers learn how to use the API effectively through real-world examples and best practices.

👉 **[Explore demos](#-available-demos)**

> **⚠️ Important Security Note**: The code in these demos is intended to be used only in secure server-side environments (for example, Zapier, Make, or your own custom server). Do not run this code in client-side (such as websites, web apps or mobile apps) contexts, as it could expose sensitive operations and compromise your security.

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

| Demo               | Guide                                   | Source                                   | Usage                   |
| ------------------ | --------------------------------------- | ---------------------------------------- | ----------------------- |
| Register User      | [Guide](auth-register/auth-register.md) | [Source](auth-register/auth-register.js) | `npm run auth-register` |
| Generate JWT Token | [Guide](auth-token/auth-token.md)       | [Source](auth-token/auth-token.js)       | `node auth-token.js`    |
| Create Plan        | [Guide](plans-create/plans-create.md)   | [Source](plans-create/plans-create.js)   | `node plans-create.js`  |
| Track Usage        | [Guide](track-usage/track-usage.md)     | [Source](track-usage/track-usage.js)     | `npm run track-usage`   |

---

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

> **⚠️ Important Security Note**: These API credentials should only be used in secure server-side environments. Never expose your API Key and Secret in client-side code or public repositories, as this could compromise your account security.

### Official Documentation

- **[Outseta API Documentation](https://developers.outseta.com/)**
- **[Outseta Support Knowledge Base](https://go.outseta.com/support/kb)**


## 🤝 Contributing

Want to add a new demo or improve existing ones? Check out our **[Contributing Guide](CONTRIBUTING.md)** for detailed development guidelines, code patterns, and contribution instructions.

## 📄 License

This project is licensed under the ISC License - see [package.json](package.json) for details.

## 📖 Learn More

- **[Outseta Documentation](https://go.outseta.com/support/kb)** - Official Outseta help
- **[Outseta API Documentation](https://documenter.getpostman.com/view/3613332/outseta-rest-api-v1/7TNfr6k)** - Complete API reference

## 🆘 Support

- **[GitHub Issues](https://github.com/outseta/outseta-api-demos/issues)** - Report bugs or request features
- **[Email Support](mailto:support@outseta.com)** - Direct support from Outseta

---

## ⚠️ Important Notes

- **Educational Purpose**: These demos are for educational purposes
- **Test First**: Always test thoroughly in a development environment before using in production
- **API Limits**: Be mindful of Outseta's API rate limits
- **Security**: Never commit your `.env` file or expose API credentials
