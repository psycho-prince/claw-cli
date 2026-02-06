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

### Getting Started

The CLI agent, in its current committed state, **will not work directly** after cloning the repository.

This is because the `node_modules` directory (containing project dependencies) and the `dist` directory (containing the compiled JavaScript code) were explicitly excluded from the commit as per the strict safety rules: "YOU MUST NEVER: Stage node_modules or any dependency directory".

To make the CLI agent runnable after cloning the repository, a user will need to perform the following steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/psycho-prince/claw-cli.git
    cd claw-cli/openclaw
    ```
2.  **Navigate into the `agent-cli` directory:**
    ```bash
    cd agent-cli
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Build the project:**
    ```bash
    npm run build
    ```
5.  **Run the agent:**
    ```bash
    node dist/index.js do "your task string here"
    ```

If you wish for the `node_modules` and `dist` directories to be included in the repository so that the agent works "out of the box", you must explicitly instruct me to stage and commit these directories, which would override the current "YOU MUST NEVER" rule.

### Further Reading

For detailed architecture, security rationale, and CLI usage examples, see [`CLI_AGENT_README.md`](./CLI_AGENT_README.md).