import { spawnSync } from 'child_process';
import * as path from 'path';

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error(
      'No command provided.\nUsage: yarn console <command> [args...]',
    );
    process.exit(1);
  }

  const command = args[0];
  const commandArgs = args.slice(1);

  try {
    // resolve file path
    const commandPath = path.resolve(__dirname, `${command}.ts`);
    const tsNodePath = require.resolve('ts-node/dist/bin.js');

    // spawn ts-node to run the script
    const result = spawnSync(
      'node',
      [tsNodePath, commandPath, ...commandArgs],
      {
        stdio: 'inherit',
      },
    );

    process.exit(result.status ?? 0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();
