const { execSync } = require('child_process');
const filter = process.env.npm_config_filter;
const command = filter ? `npx turbo run build --filter=${filter}` : `npx turbo run build`;
console.log(`> Running: ${command}`);
execSync(command, { stdio: 'inherit' });
