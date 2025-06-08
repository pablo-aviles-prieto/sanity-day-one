import { createClient } from 'next-sanity';

export const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2024-11-01',
  useCdn: false,
});
