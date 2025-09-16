import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import * as path from 'path';

function stripAnsi(str: string) {
  return str.replace(/\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g, '');
}

function toClassName(fileName: string) {
  return fileName
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function main() {
  const name = process.argv[2];
  if (!name) {
    console.error(
      'Please provide a migration name.\nUsage: yarn migration:create create_users_table',
    );
    process.exit(1);
  }

  const fileName = `${name}_migration`;

  const command = `npx ts-node -P ./tsconfig.json -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:create ./src/common/database/migrations/${fileName}`;

  let rawOutput: string;
  try {
    rawOutput = execSync(command, { stdio: 'pipe' }).toString();
  } catch (err: any) {
    console.error(err.stdout?.toString() || err.message);
    process.exit(1);
  }

  // Clean ANSI colors
  const cleaned = stripAnsi(rawOutput);

  // Extract generated file path
  const match = cleaned.match(/(\/[^\s]+\.ts)/);
  if (!match) {
    console.error('Could not detect migration file');
    console.error('RAW OUTPUT:', JSON.stringify(cleaned));
    process.exit(1);
  }

  const generatedPath = match[1];

  // Patch migration file
  let content = readFileSync(generatedPath, 'utf8');

  // Convert to class name
  const baseName = path.basename(generatedPath, '.ts');

  // Match the leading timestamp and the rest
  const matchBaseName = baseName.match(/^(\d+)-(.+)$/);

  let className: string;

  if (matchBaseName) {
    const [, timestamp, namePart] = matchBaseName;
    className = `${toClassName(namePart)}${timestamp}`;
  } else {
    className = toClassName(baseName);
  }

  content = content.replace(
    /implements MigrationInterface\s*{/,
    `implements MigrationInterface {\n    name = '${className}';`,
  );

  writeFileSync(generatedPath, content, 'utf8');
  console.info(`[INFO] Migration created: ${generatedPath}`);
}

main();
