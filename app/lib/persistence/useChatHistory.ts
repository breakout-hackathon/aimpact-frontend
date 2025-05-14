import { useLoaderData, useNavigate, useSearchParams } from '@remix-run/react';
import { useState, useEffect, useCallback } from 'react';
import { atom } from 'nanostores';
import { generateId, type JSONValue, type Message } from 'ai';
import { toast } from 'react-toastify';
import { workbenchStore } from '~/lib/stores/workbench';
import { logStore } from '~/lib/stores/logs';
import type { FileMap } from '~/lib/stores/files';
import type { ContextAnnotation } from '~/types/context';
import { webcontainer } from '~/lib/webcontainer';
import { BACKEND_HOST } from '~/utils/constants';

export interface ProjectChat {
  projectId: string;
  messages: Message[];
  updatedAt: string;
  metadata?: {
    gitUrl?: string;
    gitBranch?: string;
    netlifySiteId?: string;
  };
}

export const chatMetadata = atom<ProjectChat['metadata'] | undefined>(undefined);

export function useChatHistory() {
  const navigate = useNavigate();
  const { projectId } = useLoaderData<{ projectId?: string }>();
  const [searchParams] = useSearchParams();

  const [archivedMessages, setArchivedMessages] = useState<Message[]>([]);
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    if (!projectId) {
      setReady(true);
      return;
    }

    // Load project chat history
    fetch(`${BACKEND_HOST}/project/${projectId}/chat`)
      .then(async (response) => {
        if (!response.ok) throw new Error('Failed to load chat history');
        
        const data: ProjectChat = await response.json();
        const rewindId = searchParams.get('rewindTo');
        
        // Handle message filtering based on rewind
        let filteredMessages = data.messages;
        if (rewindId) {
          const rewindIndex = data.messages.findIndex((m) => m.id === rewindId);
          if (rewindIndex >= 0) {
            filteredMessages = data.messages.slice(0, rewindIndex + 1);
          }
        }

        setInitialMessages(filteredMessages);
        chatMetadata.set(data.metadata);
        setReady(true);
      })
      .catch((error) => {
        console.error(error);
        logStore.logError('Failed to load chat history', error);
        toast.error('Failed to load chat history: ' + error.message);
        setReady(true);
      });
  }, [projectId, searchParams]);

  const takeSnapshot = useCallback(
    async (chatIdx: string, files: FileMap, chatSummary?: string) => {
      if (!projectId) return;

      try {
        await fetch(`${BACKEND_HOST}/project/${projectId}/snapshot`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            files,
            summary: chatSummary
          })
        });
      } catch (error) {
        console.error('Failed to save snapshot:', error);
        toast.error('Failed to save chat snapshot.');
      }
    },
    [projectId]
  );

  const restoreSnapshot = useCallback(async (snapshot?: { files: FileMap }) => {
    const container = await webcontainer;
    if (!snapshot?.files) return;

    Object.entries(snapshot.files).forEach(async ([key, value]) => {
      if (key.startsWith(container.workdir)) {
        key = key.replace(container.workdir, '');
      }

      if (value?.type === 'folder') {
        await container.fs.mkdir(key, { recursive: true });
      }
    });

    Object.entries(snapshot.files).forEach(async ([key, value]) => {
      if (value?.type === 'file') {
        if (key.startsWith(container.workdir)) {
          key = key.replace(container.workdir, '');
        }
        await container.fs.writeFile(key, value.content, { 
          encoding: value.isBinary ? undefined : 'utf8' 
        });
      }
    });
  }, []);

  return {
    ready: !projectId || ready,
    initialMessages,
    updateChatMetadata: async (metadata: ProjectChat['metadata']) => {
      if (!projectId) return;

      try {
        const response = await fetch(`${BACKEND_HOST}/project/${projectId}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: initialMessages,
            metadata
          })
        });

        if (!response.ok) throw new Error('Failed to update metadata');
        
        chatMetadata.set(metadata);
      } catch (error) {
        toast.error('Failed to update chat metadata');
        console.error(error);
      }
    },
    storeMessageHistory: async (messages: Message[]) => {
      if (!projectId || messages.length === 0) return;

      messages = messages.filter((m) => !m.annotations?.includes('no-store'));

      let chatSummary: string | undefined = undefined;
      const lastMessage = messages[messages.length - 1];

      if (lastMessage.role === 'assistant') {
        const annotations = lastMessage.annotations as JSONValue[];
        const filteredAnnotations = annotations?.filter(
          (annotation: JSONValue) =>
            annotation && typeof annotation === 'object' && 
            Object.keys(annotation).includes('type')
        ) as { type: string; value: any }[];

        if (filteredAnnotations.find((annotation) => annotation.type === 'chatSummary')) {
          chatSummary = filteredAnnotations.find(
            (annotation) => annotation.type === 'chatSummary'
          )?.value;
        }
      }

      try {
        await takeSnapshot(
          messages[messages.length - 1].id,
          workbenchStore.files.get(),
          chatSummary
        );

        const response = await fetch(`${BACKEND_HOST}/project/${projectId}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [...archivedMessages, ...messages],
            metadata: chatMetadata.get()
          })
        });

        if (!response.ok) throw new Error('Failed to save messages');
      } catch (error) {
        toast.error('Failed to save chat messages');
        console.error(error);
      }
    }
  };
}
