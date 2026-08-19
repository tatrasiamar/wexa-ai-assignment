import neo4j from "neo4j-driver";
const uri = process.env.NEO4J_URI || "";
const username = process.env.NEO4J_USERNAME || "";
const password = process.env.NEO4J_PASSWORD || "";
export const driver = neo4j.driver(uri, neo4j.auth.basic(username, password));
export async function runQuery(query: string, params: Record<string, any> = {}) {
  const session = driver.session();
  try { return await session.run(query, params); } finally { await session.close(); }
}
