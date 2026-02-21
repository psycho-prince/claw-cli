import { Command } from 'commander';
import { Agent } from './agent.js';

const program = new Command();

program
  .name('claw')
  .description('Claw-CLI for secure autonomous agent execution')
  .version('1.0.0'); // Update version to 1.0.0

program.option('--server', 'Run Claw-CLI in server mode for ClawCloud');

program.command('do')
  .description('Execute a task with the autonomous agent')
  .argument('<task>', 'The task string for the agent to execute')
  .action(async (task: string) => {
    // Check if --server option was used
    if (program.opts().server) {
      console.error('Error: Cannot use "do" command with "--server" option.');
      process.exit(1);
    }
    console.log(`Starting agent for task: "${task}"`);
    const agent = new Agent();
    try {
      const result = await agent.run(task);
      console.log('Agent finished with result:', result);
    } catch (error: any) {
      console.error('Agent failed:', error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);

// If --server option is present, import the server file (which self-executes)
if (program.opts().server) {
  console.log('Claw-CLI starting in server mode...');
  // Importing server/index.js will execute its top-level code, which starts the Express server.
  // The 'CLAW_CLOUD_ENABLED' check inside server/index.ts will prevent it from running if false.
  import('../../dist/server/index.js').catch(error => { // Assuming server compiles to ../dist/server/index.js
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}
