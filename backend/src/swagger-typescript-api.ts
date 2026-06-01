import { exec } from 'child_process';
import { promisify } from 'node:util';
import path from 'path';
import fs from 'node:fs';

import { APIS, API_BASE_URL } from './config/index';

// `exec` is callback-based and returns a (non-thenable) ChildProcess, so awaiting
// it directly does NOT wait for completion. Promisify it so the curl download is
// guaranteed to finish before we hand the swagger file to the generator.
const execAsync = promisify(exec);

const PATH_TO_OUTPUT_DIR = path.resolve(process.cwd(), './src/data-contracts');

type Api = { name: string; version: string };

/**
 * Download the OpenAPI spec for a single API and generate its data contracts.
 * Download and generation are sequenced so the generator never reads a
 * half-written (truncated) spec. Specs are stored as YAML because some upstream
 * APIs return YAML even from their `/api-docs` endpoint.
 */
const generateForApi = async ({ name, version }: Api): Promise<void> => {
  const outputDir = `${PATH_TO_OUTPUT_DIR}/${name}`;

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  try {
    const specPath = `${outputDir}/swagger.yaml`;

    // `--fail` makes curl exit non-zero on HTTP errors instead of writing an
    // error page to disk and having the generator choke on it later.
    await execAsync(`curl --fail --silent --show-error -o ${specPath} ${API_BASE_URL}/${name}/${version}/api-docs`);
    console.log(`- ${name} ${version}`);

    const { stdout, stderr } = await execAsync(
      `npx swagger-typescript-api generate --path ${specPath} -o ${outputDir} --modular --no-client --extract-enums`,
    );

    if (stdout) console.log(`Data-contract-generator: ${stdout}`);
    if (stderr) console.log(`stderr: ${stderr}`);
  } catch (error) {
    console.log(`error (${name} ${version}): ${error.message}`);
  }
};

const main = async () => {
  console.log('Downloading and generating api-docs..');
  await Promise.all(APIS.map(generateForApi));
};

main();
