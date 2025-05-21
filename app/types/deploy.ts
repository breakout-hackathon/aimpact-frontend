export interface DeployResponse {
  "projectId": string;
  "deploymentId": string;
  "status": string;
  "isDeployed": boolean;
  "message": string;
  "finalUrl": string;
  "createdAt": string;
  "updatedAt": string;
}

export enum DeployStatusEnum {
  error = "ERROR",
  success = "SUCCESS",
  canceled = "CANCELED",
  queued = "QUEUED",
  building = "BUILDING", 
  initializing = "INITIALIZING",
  ready = "READY",
  unknown = "UNKNOWN",
}