export interface Dependency {
  affectedService: string;
  databaseName: string;
  directDependency: string;
}

export interface GraphNode {
  name: string;
  type: string;
}
