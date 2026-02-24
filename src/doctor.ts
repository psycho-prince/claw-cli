import chalk from 'chalk';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

// This file contains the logic for the `claw doctor` command.
// It checks for common issues in the user's environment.

async function checkNodeVersion() {
    const version = process.versions.node;
    const major = parseInt(version.split('.')[0], 10);
    if (major < 18) {
        return { success: false, message: `Node.js version is ${version}, but v18+ is required.` };
    }
    return { success: true, message: `Node.js version: ${version}` };
}

async function checkPlaywright() {
    try {
        // This is a proxy for checking if the browsers are installed.
        // A more robust check would be to actually try and launch a browser.
        execSync('npx playwright-cli --version', { stdio: 'ignore' });
        return { success: true, message: 'Playwright seems to be installed.' };
    } catch (error) {
        return { success: false, message: 'Playwright browsers are not installed. Please run: npx playwright install --with-deps' };
    }
}

async function checkGeminiKey() {
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf-8');
        if (/^GEMINI_API_KEY=./m.test(envContent)) {
            return { success: true, message: 'GEMINI_API_KEY found in .env file.' };
        }
    }
    return { success: false, message: 'GEMINI_API_KEY not found. Please add it to your .env file.' };
}

export async function runDoctor() {
    console.log(chalk.bold.cyan('Running `claw doctor`...'));
    const checks = [
        await checkNodeVersion(),
        await checkPlaywright(),
        await checkGeminiKey(),
    ];

    let allGood = true;
    checks.forEach(check => {
        if (check.success) {
            console.log(chalk.green('✅ ' + check.message));
        } else {
            console.log(chalk.red('❌ ' + check.message));
            allGood = false;
        }
    });

    if (allGood) {
        console.log(chalk.bold.green('\nAll checks passed! Claw-CLI is ready to go.'));
    } else {
        console.log(chalk.bold.yellow('\nPlease fix the issues above to ensure Claw-CLI works correctly.'));
        process.exit(1);
    }
}
