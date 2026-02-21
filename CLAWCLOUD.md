# ClawCloud Private Fork Instructions

This document provides instructions for setting up a private fork of Claw-CLI for ClawCloud development and deployment.

## 1. Create a Private Repository

Start by creating a private GitHub repository (or equivalent) from this open-source `claw-cli` project.

## 2. Configure Environment Variables

Create a `.env` file in your project root, adapting from `.env.example`. Ensure you set `CLAW_CLOUD_ENABLED=true` and provide secure values for:

*   `JWT_SECRET` (Use a strong, randomly generated key)
*   `STRIPE_SECRET_KEY`
*   `STRIPE_WEBHOOK_SECRET`
*   `DATABASE_URL` (For production, consider a managed database like PostgreSQL, not SQLite)
*   `ADMIN_API_KEY` (Strong, randomly generated key)
*   `GEMINI_API_KEY` (Or other LLM API keys)

## 3. Customize and Extend

*   **Integrate Agent Logic:** In `server/index.ts`, replace the simulated agent execution with actual calls to the `Agent` class, ensuring proper multi-tenancy and resource isolation.
*   **Database:** Migrate from `better-sqlite3` to a production-grade database (e.g., PostgreSQL, MongoDB) and update database schema and ORM accordingly.
*   **Advanced User Management:** Implement password hashing, session management, and potentially OAuth/SSO.
*   **Stripe Integration:** Fully implement Stripe webhook handlers for subscription lifecycle management.
*   **Deployment:** Adapt `Dockerfile`, `docker-compose.yml`, and `render.yaml` for your specific cloud provider and infrastructure.
*   **Monitoring & Logging:** Integrate with your preferred monitoring, alerting, and centralized logging solutions.

## 4. Continuous Integration/Continuous Deployment (CI/CD)

Set up a robust CI/CD pipeline for automated testing, building, and deployment of your ClawCloud instance.

## 5. Maintain Security

Regularly review and update dependencies. Conduct security audits and penetration testing. Stay informed about new threats and vulnerabilities.
