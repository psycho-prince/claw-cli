# claw-cli

## Alpha v0.1.0

`claw-cli` is a secure, CLI-first autonomous agent framework designed for a single, trusted user. It provides a foundational toolkit for executing tasks planned by Large Language Models (LLMs) within stringent, policy-enforced security boundaries.

### Project Purpose

The purpose of this project is to provide a highly controlled, auditable, and extensible command-line interface for leveraging LLM planning capabilities. It is built for power users who need to automate local tasks with an absolute focus on safety, explicit control, and environmental awareness.

### What `claw-cli` IS

*   **A CLI-First Tool:** A command-line interface that uses an LLM for planning and a local runtime for sandboxed execution.
*   **Security-First:** Designed with a "fail-closed" philosophy. Actions are denied by default and must be explicitly permitted by a security policy.
*   **Single-User:** Intended for a single, trusted operator on their local machine. It is not designed for multi-tenant or server-side execution.
*   **Auditable:** All agent actions—from planning to execution—are logged to ensure transparency and traceability.

### What `claw-cli` IS NOT

*   **A General-Purpose Shell Agent:** It does **not** execute arbitrary shell commands. All capabilities are constrained by a pre-defined and user-controllable policy.
*   **A System-Wide Daemon:** It does not run as a background service with elevated privileges.
*   **Self-Modifying:** The agent cannot alter its own core security logic or policies during runtime.
*   **A Chatbot:** Its primary interface is the command line, focused on task execution, not conversation.

### Status: v0.1.0-alpha

This project is in an early alpha stage. The core architecture is in place, but features are limited as the primary focus is on establishing a secure and reliable foundation. Expect breaking changes in future releases.

### Further Reading

For detailed architecture, security rationale, and CLI usage examples, see [`CLI_AGENT_README.md`](./CLI_AGENT_README.md).
