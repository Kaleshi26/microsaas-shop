import { Client } from 'opensearch';
const url = process.env.OPENSEARCH_URL || 'http://localhost:9200';
export const osClient = new Client({
  node: url,
  ssl: { rejectUnauthorized: false },
  auth: process.env.OPENSEARCH_USERNAME
    ? { username: process.env.OPENSEARCH_USERNAME, password: process.env.OPENSEARCH_PASSWORD || '' }
    : undefined
});