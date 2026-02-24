
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import os from 'os';

const CLAW_DIR = path.join(os.homedir(), '.claw');
const CONFIG_FILE = path.join(CLAW_DIR, 'config.json');
const ENV_FILE = path.join(process.cwd(), '.env');

const defaultConfig = {
    "version": "1.0",
    "llm": {
        "provider": "gemini",
        "model": "gemini-1.5-pro-latest"
    },
    "security": {
        "mode": "fail-closed",
        "allow_list": [
            "browse",
            "read",
            "click",
            "type",
            "ask"
        ]
    }
};

const defaultEnv = `GEMINI_API_KEY="YOUR_API_KEY_HERE"
`;

export async function runInit() {
    console.log(chalk.bold.cyan('Running `claw init`...'));

    // Create ~/.claw directory
    if (!fs.existsSync(CLAW_DIR)) {
        fs.mkdirSync(CLAW_DIR);
        console.log(chalk.green(`Created directory: ${CLAW_DIR}`));
    } else {
        console.log(chalk.yellow(`Directory already exists: ${CLAW_DIR}`));
    }

    // Create ~/.claw/config.json
    if (!fs.existsSync(CONFIG_FILE)) {
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2));
        console.log(chalk.green(`Created config file: ${CONFIG_FILE}`));
    } else {
        console.log(chalk.yellow(`Config file already exists: ${CONFIG_FILE}`));
    }

    // Create .env file
    if (!fs.existsSync(ENV_FILE)) {
        fs.writeFileSync(ENV_FILE, defaultEnv);
        console.log(chalk.green(`Created .env file in current directory. Please add your GEMINI_API_KEY.`));
    } else {
        console.log(chalk.yellow(`.env file already exists in current directory.`));
    }

    console.log(chalk.bold.green('
Initialization complete!'));
    console.log(chalk.yellow('Please edit the .env file to add your Gemini API key.'));
}
