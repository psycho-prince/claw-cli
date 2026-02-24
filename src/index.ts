
import { Command } from 'commander';
import { Agent } from './agent.js';
import { runDoctor } from './doctor.js';
import { runInit } from './init.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pkg = require('../package.json');


const program = new Command();

program
  .name('claw')
  .description('Claw-CLI for secure autonomous agent execution')
  .version(pkg.version)
  .option('--server', 'Run Claw-CLI in server mode for ClawCloud');

program.command('do')
  .description('Execute a task with the autonomous agent')
  .argument('<task>', 'The task string for the agent to execute')
  .action(async (task: string) => {
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

program.command('doctor')
    .description('Check if all dependencies and configurations are set up correctly')
    .action(runDoctor);

program.command('init')
    .description('Initialize Claw-CLI configuration and .env file')
    .action(runInit);


// Handle server mode separately
if (process.argv.includes('--server')) {
    console.log('Claw-CLI starting in server mode...');
    import('./server.js').catch(error => {
        console.error('Failed to start server:', error);
        process.exit(1);
    });
} else {
    program.parse(process.argv);
}
