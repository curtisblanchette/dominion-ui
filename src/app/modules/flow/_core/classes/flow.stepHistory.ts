export interface FlowStepHistoryEntry {
  id: string;
  variables: {
    [ key:string ] : string| number | boolean | Date;
  } | undefined;
  elapsed: number;
  timestamp:number;
}
