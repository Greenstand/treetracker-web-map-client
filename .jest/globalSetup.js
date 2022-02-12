import { loadEnvConfig } from '@next/env';

export default async () => {
  const projectDir = process.cwd();
  loadEnvConfig(projectDir);
};
