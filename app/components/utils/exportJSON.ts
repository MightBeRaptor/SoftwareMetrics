// /components/utils/exportJSON.ts
import { Node, Edge } from 'reactflow';

export interface ActorJSON {
  id: string;
  name: string;
}

export interface UseCaseJSON {
  id: string;
  name: string;
}

export interface SystemJSON {
  systemId: string;
  systemName: string;
  useCases: string[]; // IDs of use cases
}

export interface RelationshipJSON {
  source: string;
  target: string;
  type: string; // e.g., 'association', 'extends', 'includes'
}

// Check if a use case node is inside a system boundary
export function isInsideSystem(useCase: Node, systemNode: Node) {
  const { x: ux, y: uy } = useCase.position;
  const { x: sx, y: sy } = systemNode.position;
  const width = systemNode.data.width ?? 300; // default width
  const height = systemNode.data.height ?? 200; // default height
  return ux >= sx && ux <= sx + width && uy >= sy && uy <= sy + height;
}

// Generate the JSON representation of the UML diagram
export function generateUseCaseJSON(nodes: Node[], edges: Edge[]) {
  // Actors
  const actors: ActorJSON[] = nodes
    .filter((n) => n.type === 'actor')
    .map((n) => ({ id: n.id, name: n.data.label }));

  // Use cases
  const useCases: UseCaseJSON[] = nodes
    .filter((n) => n.type === 'usecase')
    .map((n) => ({ id: n.id, name: n.data.label }));

  // Systems
  const systems: SystemJSON[] = nodes
    .filter((n) => n.type === 'boundary')
    .map((system) => ({
      systemId: system.id,
      systemName: system.data.label,
      useCases: useCases
        .filter((uc) =>
          isInsideSystem(nodes.find((n) => n.id === uc.id)!, system)
        )
        .map((uc) => uc.id),
    }));

  // Relationships
  const relationships: RelationshipJSON[] = edges.map((e) => ({
    source: e.source,
    target: e.target,
    type: e.data?.label ?? 'association',
  }));

  return {
    actors,
    useCases,
    systems,
    relationships,
  };
}
