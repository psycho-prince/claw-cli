# CLI Agent Architecture & Usage

This document provides a detailed explanation of the `claw-cli` autonomous agent, including its architecture, security model, and usage instructions.

## Agent Loop

The agent's operation follows a strict, five-stage loop to ensure security and predictability:

1.  **Input:** The agent receives a high-level task from the user via the command-line interface.
2.  **Plan:** A Large Language Model (LLM) planner receives the task and decomposes it into a structured series of discrete, low-level actions. This plan is returned as a JSON object.
3.  **Policy:** The agent's security policy engine intercepts the plan. Each proposed action is rigorously validated against a set of allow-listed, predefined capabilities. If any action is not recognized or violates the policy, the entire plan is rejected before execution.
4.  **Execute:** If the plan is approved, the executor module runs each action one by one. **Execution is sandboxed and read-only by design.** The executor operates with minimal privileges and has no access to shell commands or destructive file system operations.
5.  **Audit:** The outcome of the execution, along with the original task and plan, is logged. This creates a transparent and traceable record of the agent's activities.

## Architecture Overview

*   **CLI Entrypoint (`agent-cli/src/index.ts`):** Parses user commands and initiates the agent loop.
*   **Agent (`agent-cli/src/agent.ts`):** Orchestrates the `input → plan → policy → execute → audit` flow.
*   **Planner (`agent-cli/src/planner.ts`):** Interfaces with the LLM to generate action plans.
*   **Policy (`agent-cli/src/policy.ts`):** The security core. Defines and enforces the set of permissible actions.
*   **Executor (`agent-cli/src/executor.ts`):** The sandboxed runtime that performs the validated actions.

## Security Rationale

The agent is built with a security-first mindset. Its primary goal is to prevent the LLM from causing unintended side effects.

*   The agent **NEVER** executes raw shell commands.
*   All actions are constrained by a rigid, auditable policy.
*   File system access is read-only by default and limited to non-sensitive paths.
*   Network access is disabled by default and must be explicitly enabled via policy for specific endpoints.
*   The agent cannot modify its own source code or security policies.

## CLI Usage Examples

**Prerequisites:** Ensure Node.js and npm are installed.

1.  **Install & Build:**
    ```bash
    # Navigate to the agent's directory
    cd openclaw/agent-cli

    # Install dependencies
    npm install

    # Compile TypeScript
    npm run build
    ```

2.  **Run the Agent:**
    From the `openclaw` directory, execute the agent with a task.

    ```bash
    # Example: Ask the agent to list files in the current directory
    node agent-cli/dist/index.js do "list all files in the current directory"

    # Example: Ask the agent to read a specific, non-sensitive file
    node agent-cli/dist/index.js do "read the contents of the README.md file"
    ```
