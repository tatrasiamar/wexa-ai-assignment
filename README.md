# IT Infrastructure Dependency Tracker (Wexa AI Assignment)

## The Use Case
This application is an Enterprise IT Infrastructure Dependency Tracker. Modern microservice architectures consist of hundreds of interconnected APIs, databases, and teams. When a critical database or service goes down, understanding the "Blast Radius" (which downstream user-facing applications will fail) is critical for incident response.

### Why a Graph Database?
In a traditional Relational Database (SQL), mapping out dependencies requires complex, slow, and recursive "JOIN" operations to trace paths of unknown depths. 

A Graph Database (CognoDB/Neo4j) is the perfect solution because relationships are treated as first-class citizens. By modeling infrastructure as a graph, we can perform lightning-fast multi-hop traversals to instantly map the full blast radius of an outage across an entire organization.

## Data Model Diagram
`mermaid
graph TD
    S1[Web Dashboard] -- DEPENDS_ON --> S2[Auth API]
    S1 -- DEPENDS_ON --> S3[Payment Gateway]
    S1 -- DEPENDS_ON --> S4[Reporting Engine]
    S4 -- DEPENDS_ON --> S2
    
    S2 -- READS_FROM --> DB1[(Users DB)]
    S3 -- READS_FROM --> DB1
    S4 -- READS_FROM --> DB2[(Analytics DB)]
    S4 -- READS_FROM --> DB1
    
    S1 -- OWNED_BY --> T1{Frontend Team}
    S2 -- OWNED_BY --> T2{Backend Core}
    S3 -- OWNED_BY --> T2
    S4 -- OWNED_BY --> T3{Data Platform}
`

## Main Cypher Query Explained
The core logic of the application relies on a multi-hop traversal query to map dependencies that ultimately rely on a database.

`cypher
MATCH (upstream:Service)-[:DEPENDS_ON*1..2]->(downstream:Service)-[:READS_FROM]->(db:Database)
RETURN upstream.name AS affectedService, db.name AS databaseName, downstream.name AS directDependency
`
*   upstream:Service: The origin service.
*   [:DEPENDS_ON*1..2]: A variable-length relationship finding dependencies up to 2 hops away.
*   downstream:Service: The direct service accessing the database.
*   [:READS_FROM]->(db:Database): The target database.

## Setup Instructions

1. **Install Dependencies**
   `ash
   npm install
   `

2. **Environment Variables**
   Create a .env.local file in the root directory and add your CognoDB credentials:
   `env
   NEO4J_URI=bolt+s://[your-instance].databases.cognodb.cloud
   NEO4J_USERNAME=cognodb
   NEO4J_PASSWORD=your_password
   `

3. **Seed the Database**
   Start the development server and trigger the API seed route:
   `ash
   npm run dev
   curl -X POST http://localhost:3000/api/seed
   `

4. **View the Dashboard**
   Open http://localhost:3000 in your browser to explore the infrastructure graph.
