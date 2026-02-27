import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { chromium } from 'playwright';

const port = 4173;
const baseUrl = `http://127.0.0.1:${port}`;

const answersByQuestion = new Map([
  ['15 + 23 = ?', '38'],
  ['27 + 34 = ?', '61'],
  ['45 + 28 = ?', '73'],
  ['56 + 37 = ?', '93'],
  ['68 + 45 = ?', '113'],
  ['129 + 84 = ?', '213'],
  ['247 + 158 = ?', '405'],
  ['356 + 279 = ?', '635'],
  ['478 + 346 = ?', '824'],
  ['589 + 467 = ?', '1056']
]);

const waitForServer = async () => {
  for (let i = 0; i < 120; i += 1) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // retry
    }
    await delay(250);
  }
  throw new Error('Timed out waiting for Vite server.');
};

const run = async () => {
  const server = spawn('pnpm', ['exec', 'vite', '--host', '127.0.0.1', '--port', String(port)], {
    stdio: 'pipe'
  });

  let serverOutput = '';
  server.stdout.on('data', (chunk) => {
    serverOutput += chunk.toString();
  });
  server.stderr.on('data', (chunk) => {
    serverOutput += chunk.toString();
  });

  try {
    await waitForServer();

    let browser;
    try {
      browser = await chromium.launch();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes("Executable doesn't exist")) {
        console.warn('Skipping Playwright E2E test: browser executable is not installed in this environment.');
        return;
      }
      throw error;
    }

    const page = await browser.newPage();

    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });

    await page.getByPlaceholder('Escribe tu nombre...').fill('Tester');
    await page.getByRole('button', { name: '🧙' }).click();
    await page.getByRole('button', { name: '🎮 ¡Comenzar Aventura!' }).click();

    await page.getByRole('button', { name: /Reino de la Energía/i }).click();

    for (let i = 0; i < answersByQuestion.size; i += 1) {
      const questionText = (await page.locator('.text-6xl.font-bold.text-gray-800').first().innerText()).trim();
      const answer = answersByQuestion.get(questionText);
      assert.ok(answer, `No answer mapping found for question: ${questionText}`);

      await page.getByRole('button', { name: answer, exact: true }).click();
      await page.waitForTimeout(1300);
    }

    await page.getByText('¡Nivel Completado!').waitFor({ timeout: 5000 });

    await browser.close();
    console.log('E2E passed: user completes level 1 successfully.');
  } finally {
    server.kill('SIGTERM');
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
