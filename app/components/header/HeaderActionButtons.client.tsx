import { useStore } from '@nanostores/react';
import useViewport from '~/lib/hooks';
import { chatStore } from '~/lib/stores/chat';
import { workbenchStore } from '~/lib/stores/workbench';
import { classNames } from '~/utils/classNames';
import { useEffect, useRef, useState } from 'react';
import { streamingState } from '~/lib/stores/streaming';
import { useVercelDeploy } from '~/components/deploy/VercelDeploy.client';
import { useNetlifyDeploy } from '~/components/deploy/NetlifyDeploy.client';
import { ArrowSquareOutIcon, RocketIcon } from '@phosphor-icons/react';
import { useFetch } from '~/lib/hooks/useFetch';
import { chatId, lastChatIdx, lastChatSummary, useChatHistory } from '~/lib/persistence';
import { toast, type Id as ToastId } from 'react-toastify';
import { DeployStatusEnum, type DeployResponse } from '~/types/deploy';
import { useGetDeploy, usePostDeploy } from '~/lib/hooks/useDeploy';

interface HeaderActionButtonsProps {}

export function HeaderActionButtons({}: HeaderActionButtonsProps) {
  const showWorkbench = useStore(workbenchStore.showWorkbench);
  const { showChat } = useStore(chatStore);
  const [activePreviewIndex] = useState(0);
  const previews = useStore(workbenchStore.previews);
  const activePreview = previews[activePreviewIndex];
  const [isDeploying, setIsDeploying] = useState(false);
  const isSmallViewport = useViewport(1024);
  const canHideChat = showWorkbench || !showChat;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isStreaming = useStore(streamingState);

  const { mutateAsync: getDeployRequest, error: getDeployError } = useGetDeploy();
  const { data: postDeployData, error: postDeployError, mutateAsync: createDeployRequest } = usePostDeploy();
  const [deployStatus, setDeployStatus] = useState<DeployStatusEnum | null>(null);
  const [isRequestFirst, setIsRequestFirst] = useState(true);
  const [deployStatusInterval, setDeployStatusInterval] = useState<NodeJS.Timeout | null>(null);
  const [finalDeployLink, setFinalDeployLink] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [deployToastId, setDeployToastId] = useState<ToastId | null>(null)
  const { takeSnapshot } = useChatHistory();
  const chatIdx = useStore(lastChatIdx);
  const chatSummary = useStore(lastChatSummary);

  const successDeployStatuses = [DeployStatusEnum.ready, DeployStatusEnum.success];
  const loadingDeployStatuses = [DeployStatusEnum.building, DeployStatusEnum.initializing, DeployStatusEnum.queued];
  const finalDeployStatueses = [DeployStatusEnum.canceled, DeployStatusEnum.error, DeployStatusEnum.success, DeployStatusEnum.ready];
  const failedDeployStatueses = [DeployStatusEnum.canceled, DeployStatusEnum.error];

  const clearDeployStatusInterval = () => {
    deployStatusInterval ? clearTimeout(deployStatusInterval) : undefined;
    setDeployStatusInterval(null);
  };

  function getEnumKeyByValue<T extends { [key: string]: string }>(myEnum: T, enumValue: string): keyof T | undefined {
    const keys = Object.keys(myEnum).filter((key) => myEnum[key] === enumValue);
    return keys.length > 0 ? keys[0] : undefined;
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    console.log(!deployStatus, finalDeployStatueses.includes(deployStatus!));

    if (!deployStatus || failedDeployStatueses.includes(deployStatus)) {
      toast.error(`Failed to deploy app. Try again later.`);
      console.log(deployStatusInterval);
      clearDeployStatusInterval();
      deployToastId && toast.dismiss(deployToastId);
    } else if (deployStatus && finalDeployStatueses.includes(deployStatus)) {
      deployToastId && toast.dismiss(deployToastId);
    }
  }, [deployStatus]);

  const fetchDeployStatus = async ({
    projectId,
    enableMessages = true,
  }: {
    projectId: string;
    enableMessages?: boolean;
  }) => {
    const failMessage = `Failed to deploy app. Try again later.`;

    try {
      const data = await getDeployRequest(projectId);
      setFinalDeployLink(data.finalUrl);
      setDeployStatus(() => data.status);
      console.log(data.status, deployStatus);

      if (!enableMessages && data.status && successDeployStatuses.includes(data.status)) {
        toast.success(
          `Project is deployed. You can clink to the button left from "Deploy" and go to deployed app.\n
          URL: <a>${data.finalUrl}</a>`,
          { autoClose: false },
        );
      } else {
      }
    } catch (error) {
      if (!isRequestFirst) {
        toast.error(failMessage);
      }

      console.error(error);
      setDeployStatus(DeployStatusEnum.unknown);
      clearDeployStatusInterval();
    } finally {
      setIsRequestFirst(false);
    }
  };

  useEffect(() => {
    const currentChatId = chatId.get();
    console.log(`Current chat id: ${currentChatId}`);

    if (!currentChatId) {
      return;
    }

    fetchDeployStatus({ projectId: currentChatId, enableMessages: false });

    return clearDeployStatusInterval;
  }, [chatId]);

  const onDeploy = async () => {
    setIsDeploying(true);

    const toastId = toast.info('Deploying...', { autoClose: false });
    setDeployToastId(toastId);

    try {
      const currentChatId = chatId.get();

      if (!currentChatId) {
        toast.error('Failed to get chatId.');
        return;
      }

      const data = await createDeployRequest({
        projectId: currentChatId,
      });
      console.log(postDeployError, data);

      if (!postDeployError && data) {
        setDeployStatusInterval(setInterval(async () => await fetchDeployStatus({ projectId: currentChatId }), 5000));
      }

      console.log('ON DEPLOY STATUS: ', data.status);
      setDeployStatus(data.status);
    } catch (error) {
      toast.error(`Failed to deploy app. Try again later.`);
      console.error(error);
    }
  };

  const handleClickFinalLink = () => {
    if (finalDeployLink) {
      window.open(finalDeployLink, '_blank');
    }
  };

  const handleSaveSnapshot = async () => {
    if (!chatIdx) {
      toast.error('Failed to get chatIdx.');
      return;
    }
    if (!chatSummary) {
      toast.error('Failed to get chatSummary.');
      return;
    }

    setIsSaving(true);

    try {
      await takeSnapshot(chatIdx, workbenchStore.files.get(), undefined, chatSummary);
      toast.success('Snapshot saved.');
    } catch (error) {
      toast.error('Failed to save snapshot.');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex mr-1">
      {activePreview && (
        <Button
          active
          onClick={handleSaveSnapshot}
          disabled={isSaving || !activePreview || isStreaming}
          className="px-4 mr-2 hover:bg-bolt-elements-item-backgroundActive flex items-center gap-2 bg-bolt-elements-item-backgroundAccent border border-bolt-elements-borderColor rounded-md"
        >
          {isSaving ? (
            <>
              <div className="i-ph-spinner animate-spin h-4 w-4" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <div className="i-ph-download-simple h-4 w-4" />
              <span>Save</span>
            </>
          )}
        </Button>
      )}

      <div className="relative" ref={dropdownRef}>
        <div className="flex gap-2 overflow-hidden mr-2 text-sm">
          <Button
            active
            disabled={!finalDeployLink}
            onClick={handleClickFinalLink}
            className="px-2 hover:bg-bolt-elements-item-backgroundActive flex items-center gap-2
              border border-bolt-elements-borderColor rounded-md"
          >
            <ArrowSquareOutIcon size={24} />
          </Button>

          <Button
            active
            disabled={isDeploying || !activePreview || isStreaming || loadingDeployStatuses.includes(deployStatus) || !!deployStatusInterval}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="px-4 hover:bg-bolt-elements-item-backgroundActive flex items-center gap-2
              border border-bolt-elements-borderColor rounded-md"
          >
            {isDeploying ? `Deploying...` : 'Deploy'}
            <div
              className={classNames('i-ph:caret-down w-4 h-4 transition-transform', isDropdownOpen ? 'rotate-180' : '')}
            />
          </Button>
        </div>

        {isDropdownOpen && (
          <div className="absolute right-2 flex flex-col gap-1 z-50 p-1 mt-1 min-w-[13.5rem] bg-bolt-elements-background-depth-2 rounded-md shadow-lg bg-bolt-elements-backgroundDefault border border-bolt-elements-borderColor">
            <Button
              active={false}
              disabled={isDeploying || !!deployStatusInterval}
              onClick={onDeploy}
              className="flex items-center w-full rounded-md px-4 py-2 text-sm text-bolt-elements-textTertiary gap-2"
            >
              <RocketIcon alt="deploy icon" size={28} />
              <span className="mx-auto">Deploy project</span>
            </Button>
          </div>
        )}
      </div>
      <div className="flex border border-bolt-elements-borderColor rounded-md overflow-hidden">
        <Button
          active={showChat}
          disabled={!canHideChat || isSmallViewport} // expand button is disabled on mobile as it's not needed
          onClick={() => {
            if (canHideChat) {
              chatStore.setKey('showChat', !showChat);
            }
          }}
        >
          <div className="i-bolt:chat text-sm" />
        </Button>
        <div className="w-[1px] bg-bolt-elements-borderColor" />
        <Button
          active={showWorkbench}
          onClick={() => {
            if (showWorkbench && !showChat) {
              chatStore.setKey('showChat', true);
            }

            workbenchStore.showWorkbench.set(!showWorkbench);
          }}
        >
          <div className="i-ph:code-bold" />
        </Button>
      </div>
    </div>
  );
}

interface ButtonProps {
  active?: boolean;
  disabled?: boolean;
  children?: any;
  onClick?: VoidFunction;
  className?: string;
}

function Button({ active = false, disabled = false, children, onClick, className }: ButtonProps) {
  return (
    <button
      className={classNames(
        'flex items-center p-1.5',
        {
          'bg-bolt-elements-item-backgroundDefault hover:bg-bolt-elements-item-backgroundActive text-bolt-elements-textTertiary hover:text-bolt-elements-textPrimary':
            !active,
          'bg-bolt-elements-item-backgroundAccent text-bolt-elements-item-contentAccent': active && !disabled,
          'bg-bolt-elements-item-backgroundDefault text-alpha-gray-20 dark:text-alpha-white-20 cursor-not-allowed':
            disabled,
        },
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
