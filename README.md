# Claw-CLI: The Security-First Agent That Actually Protects You

OpenClaw got hacked? Meet Claw-CLI — the security-first agent that actually protects you.

## 🚀 One-Command Install

```bash
npm install -g claw-cli # Coming soon!
```

**For Android Termux users:**
```bash
# TODO: Add specific Termux installation instructions here.
# Likely involves node.js setup, global npm install, and potentially Playwright browser dependencies.
```

## ✨ Features

*   **Security-First Design:** Unlike other agents, Claw-CLI operates on a "fail-closed" principle. Every action is explicitly allow-listed and validated, ensuring the LLM *cannot* execute arbitrary or unsafe commands.
*   **Sandboxed Execution:** All web automation occurs within an isolated browser environment, preventing unintended system access.
*   **User Confirmation for Sensitive Actions:** Critical operations (e.g., sending messages) require explicit user approval. You're always in control.
*   **Auditable Logs:** Every agent action and decision is logged for transparency and security auditing.
*   **Local-First, Single-User:** Designed for your personal machine, offering robust security without the complexities of multi-user environments.

## ⚔️ Claw-CLI vs. OpenClaw: A Security Showdown (February 2026)

| Feature             | OpenClaw (CVE-2026-25253, RCE, Command Injection) | Claw-CLI (Security-First by Design)         |
| :------------------ | :------------------------------------------------ | :------------------------------------------ |
| **Security Model**  | Permissive, Prone to LLM "hallucinations"        | **Fail-Closed, Explicit Allow-List**          |
| **CVE-2026-25253**  | **Vulnerable (8.8 RCE!)**                         | **Immune by Design**                          |
| **Command Injection** | **Widespread Vulnerabilities**                    | **Impossible: No Raw Shell Access**           |
| **Infostealers**    | **Key/Config Exposure Risk**                      | **Sandboxed, Isolated Environment**           |
| **Malicious Skills** | 900+ known, execution often unrestricted         | **Policy-Engine Verified: Safe by Default**   |
| **Control**         | LLM often dictates actions                         | **User Always Confirms Sensitive Actions**    |
| **Deployment**      | Any environment, often insecurely                 | **Local & Secure; ClawCloud for Managed**     |
| **Trust Model**     | Trust in LLM + Skill Developers                    | **Trust in Code, Auditable Policies**         |

## 🖼️ Demo (Coming Soon!)

<!-- TODO: Insert a stunning demo GIF here showing the CLI in action,
    executing a complex web task securely and requiring user confirmation. -->

## 🔒 Security Model: How Claw-CLI Protects You

Claw-CLI operates on a rigorous `Input -> Plan -> Policy -> Execute -> Audit` loop:

1.  **Input:** Your natural language task.
2.  **Plan:** An advanced LLM (like Gemini) breaks down your task into discrete, structured actions (JSON).
3.  **Policy (THE CORE):** Our battle-hardened policy engine intercepts *every single action*. If an action isn't explicitly allowed and safe, the *entire plan is rejected*. **No exceptions.**
4.  **Execute:** Approved actions run in a tightly sandboxed, read-only browser environment. Sensitive actions require your explicit `[Y/n]` confirmation.
5.  **Audit:** Every step is logged, providing full transparency and traceability.

**Claw-CLI NEVER executes raw shell commands. All actions are strictly constrained.**

## ☁️ Local vs. ClawCloud (Managed SaaS)

Claw-CLI is designed to be fully open-source and free for local, single-user use on your machine. This gives you maximum control and privacy.

For teams and businesses requiring advanced features, scalability, and managed infrastructure, we're building **ClawCloud**.

*   **Claw-CLI (Open-Source):**
    *   Local execution, single-user.
    *   Full privacy, data stays on your machine.
    *   No monthly fees.
    *   Self-managed setup.

*   **ClawCloud (Managed SaaS):**
    *   **All Claw-CLI features, plus:**
    *   Secure, hosted multi-tenant environment.
    *   Scalable execution for high-volume tasks.
    *   Team collaboration & access controls.
    *   Advanced analytics & reporting.
    *   Dedicated support.
    *   Guaranteed uptime & SLA.
    *   _Coming Soon: Premium LLM integrations, enhanced security auditing._

## 💰 ClawCloud Pricing (Teaser)

Starting at **₹499/month** for individuals, up to **₹1999/month** for enterprise teams. Early bird access for waitlist sign-ups!

## 🗺️ Roadmap (v1.0.0 and beyond)

*   **v1.0.0 (Current Release):** Production-ready, secure local CLI. Foundation for ClawCloud.
*   **v1.1.0:** Enhanced web automation capabilities, more browser actions.
*   **v1.2.0:** Improved LLM integration patterns, custom policy definitions.
*   **v2.0.0:** First release of ClawCloud managed service with full feature parity + team features.

Join the waitlist here: Sign up for ClawCloud Beta
https://forms.gle/uKuj7huVmLDSYzvT8
