import { NextResponse } from 'next/server';
import { runQuery } from '@/lib/neo4j';

export async function POST(request: Request) {
  try {
    const { source, target, relType } = await request.json();
    if (!source || !target || !relType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const safeRelType = relType === 'READS_FROM' ? 'READS_FROM' : 'DEPENDS_ON';

    const query = `
      MATCH (a) WHERE a.name = $source
      MATCH (b) WHERE b.name = $target
      MERGE (a)-[r:${safeRelType}]->(b)
      RETURN r
    `;
    
    await runQuery(query, { source, target });
    return NextResponse.json({ message: 'Relationship created' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
