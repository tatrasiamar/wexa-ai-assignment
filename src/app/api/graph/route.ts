import { NextResponse } from 'next/server';
import { runQuery } from '@/lib/neo4j';

export async function GET() {
  try {
    const cypherQuery = `
      MATCH (upstream:Service)-[:DEPENDS_ON*1..2]->(downstream:Service)-[:READS_FROM]->(db:Database)
      RETURN upstream.name AS affectedService, db.name AS databaseName, downstream.name AS directDependency
    `;
    const result = await runQuery(cypherQuery);
    const dependencies = result.records.map((record) => ({
      affectedService: record.get('affectedService'),
      databaseName: record.get('databaseName'),
      directDependency: record.get('directDependency')
    }));
    return NextResponse.json({ dependencies }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Database is currently unreachable. Please check your connection.' }, { status: 503 });
  }
}
