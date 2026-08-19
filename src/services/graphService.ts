import { runQuery } from '@/lib/neo4j';
import { Dependency, GraphNode } from '@/types';

export const graphService = {
  async getBlastRadius(): Promise<Dependency[]> {
    const cypherQuery = `
      MATCH (upstream:Service)-[:DEPENDS_ON*1..2]->(downstream:Service)-[:READS_FROM]->(db:Database )
      RETURN upstream.name AS affectedService, db.name AS databaseName, downstream.name AS directDependency
    `;
    const result = await runQuery(cypherQuery, );
    return result.records.map((record) => ({
      affectedService: record.get('affectedService'),
      databaseName: record.get('databaseName'),
      directDependency: record.get('directDependency')
    }));
  },

  async getAllNodes(): Promise<GraphNode[]> {
    const query = `
      MATCH (n) WHERE n:Service OR n:Database
      RETURN n.name AS name, labels(n)[0] AS type
      ORDER BY type, name
    `;
    const result = await runQuery(query);
    return result.records.map(r => ({
      name: r.get('name'),
      type: r.get('type')
    }));
  },

  async createNode(name: string, type: string) {
    const query = type === 'Database' 
      ? `CREATE (n:Database {name: $name, type: 'Dynamic', status: 'Healthy'}) RETURN n`
      : `CREATE (n:Service {name: $name, status: 'Healthy'}) RETURN n`;
    await runQuery(query, { name });
  },

  async deleteNode(name: string) {
    const query = `MATCH (n) WHERE n.name = $name DETACH DELETE n`;
    await runQuery(query, { name });
  },

  async createRelationship(source: string, target: string, relType: string) {
    const safeRelType = relType === 'READS_FROM' ? 'READS_FROM' : 'DEPENDS_ON';
    const query = `
      MATCH (a) WHERE a.name = $source
      MATCH (b) WHERE b.name = $target
      MERGE (a)-[r:${safeRelType}]->(b)
      RETURN r
    `;
    await runQuery(query, { source, target });
  },

  async seedDatabase() {
    await runQuery('MATCH (n) DETACH DELETE n');
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
  }
};

