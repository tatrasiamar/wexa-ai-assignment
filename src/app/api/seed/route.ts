import { NextResponse } from 'next/server';
import { runQuery } from '@/lib/neo4j';

export async function POST() {
  try {
    // Wipe the database clean first
    await runQuery('MATCH (n) DETACH DELETE n');

    // Insert realistic IT Infrastructure data
    const seedQuery = `
      CREATE (t1:Team {name: 'Frontend Team', id: 'team-frontend'})
      CREATE (t2:Team {name: 'Backend Core', id: 'team-backend'})
      CREATE (t3:Team {name: 'Data Platform', id: 'team-data'})

      CREATE (db1:Database {name: 'Users DB', type: 'PostgreSQL', status: 'Healthy'})
      CREATE (db2:Database {name: 'Analytics DB', type: 'ClickHouse', status: 'Healthy'})

      CREATE (s1:Service {name: 'Web Dashboard', status: 'Healthy'})-[:OWNED_BY]->(t1)
      CREATE (s2:Service {name: 'Auth API', status: 'Healthy'})-[:OWNED_BY]->(t2)
      CREATE (s3:Service {name: 'Payment Gateway', status: 'Healthy'})-[:OWNED_BY]->(t2)
      CREATE (s4:Service {name: 'Reporting Engine', status: 'Healthy'})-[:OWNED_BY]->(t3)

      CREATE (s1)-[:DEPENDS_ON]->(s2)
      CREATE (s1)-[:DEPENDS_ON]->(s3)
      CREATE (s1)-[:DEPENDS_ON]->(s4)
      CREATE (s4)-[:DEPENDS_ON]->(s2)
      
      CREATE (s2)-[:READS_FROM]->(db1)
      CREATE (s3)-[:READS_FROM]->(db1)
      CREATE (s4)-[:READS_FROM]->(db2)
      CREATE (s4)-[:READS_FROM]->(db1)
    `;

    await runQuery(seedQuery);
    
    return NextResponse.json({ message: 'Graph Database seeded successfully!' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
