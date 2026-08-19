import { NextResponse } from 'next/server';
import { runQuery } from '@/lib/neo4j';

export async function GET() {
  try {
    const query = `
      MATCH (n) WHERE n:Service OR n:Database
      RETURN n.name AS name, labels(n)[0] AS type
      ORDER BY type, name
    `;
    const result = await runQuery(query);
    const nodes = result.records.map(r => ({
      name: r.get('name'),
      type: r.get('type')
    }));
    return NextResponse.json({ nodes }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, type } = await request.json();
    if (!name || !type) return NextResponse.json({ error: 'Name and Type are required' }, { status: 400 });

    const query = type === 'Database' 
      ? `CREATE (n:Database {name: $name, type: 'Dynamic', status: 'Healthy'}) RETURN n`
      : `CREATE (n:Service {name: $name, status: 'Healthy'}) RETURN n`;
      
    await runQuery(query, { name });
    return NextResponse.json({ message: 'Created successfully' }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { name } = await request.json();
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

    const query = `
      MATCH (n) WHERE n.name = $name
      DETACH DELETE n
    `;
    await runQuery(query, { name });
    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
