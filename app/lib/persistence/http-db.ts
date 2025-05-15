import { BACKEND_HOST } from "~/utils/constants";
import type { Snapshot } from "./types";
import type { ChatHistoryItem } from "./useChatHistory";
import type { IChatMetadata } from "./db";
import type { Message } from "ai";
import type { FileMap } from "../stores/files";

interface HttpProject {
  id: string;
  name: string;
  description?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface HttpChat {
  projectId: string;
  messages: Message[];
  metadata?: IChatMetadata;
  createdAt: string;
}

interface HttpSnapshot {
  projectId: string;
  files: FileMap;
  chatIndex: string;
  summary?: string;
  updatedAt: string;
}

export async function getProject(projectId: string): Promise<HttpProject> {
  const response = await fetch(`${BACKEND_HOST}/project/${projectId}`);
  return await response.json() as HttpProject;
}

export async function createProject(name: string): Promise<string> {
  const response = await fetch(`${BACKEND_HOST}/project`, {
    method: 'POST',
    body: JSON.stringify({ name })
  });
  const project = await response.json() as HttpProject;
  return project.id;
}

export async function getMessages(projectId: string): Promise<ChatHistoryItem> {
  const response = await fetch(`${BACKEND_HOST}/project/${projectId}/chat`);
  const storedMessages = await response.json() as HttpChat;
  
  return {
    id: projectId,
    urlId: projectId,
    messages: storedMessages.messages,
    timestamp: new Date(storedMessages.createdAt).toISOString(),
    metadata: storedMessages.metadata,
  };
}

export async function setMessages(projectId: string, messages: Message[], description?: string, metadata?: IChatMetadata): Promise<void> {
  await fetch(`${BACKEND_HOST}/project/${projectId}/chat`, {
    method: 'POST',
    body: JSON.stringify({ messages, description, metadata }),
  });
}

export async function getSnapshot(projectId: string): Promise<Snapshot | undefined> {
  const response = await fetch(`${BACKEND_HOST}/project/${projectId}/snapshot`);
  const snapshot = await response.json() as HttpSnapshot;

  return {
    chatIndex: snapshot.chatIndex,
    files: snapshot.files,
    summary: snapshot.summary,
  };
};

export async function setSnapshot(projectId: string, snapshot: Snapshot): Promise<void> {
  await fetch(`${BACKEND_HOST}/project/${projectId}/snapshot`, {
    method: 'POST',
    body: JSON.stringify(snapshot),
  });
}
