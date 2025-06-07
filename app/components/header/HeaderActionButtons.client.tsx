import { useStore } from '@nanostores/react';
import useViewport from '~/lib/hooks';
import { chatStore } from '~/lib/stores/chat';
import { workbenchStore } from '~/lib/stores/workbench';
import { classNames } from '~/utils/classNames';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { streamingState } from '~/lib/stores/streaming';
import { ArrowSquareOutIcon, RocketIcon } from '@phosphor-icons/react';
import { chatId, lastChatIdx, lastChatSummary, useChatHistory } from '~/lib/persistence';
import { toast, type Id as ToastId } from 'react-toastify';
import { DeployStatusEnum, type DeployResponse } from '~/types/deploy';
import { useGetDeploy, usePostDeploy } from '~/lib/hooks/tanstack/useDeploy';
import { DeployService } from '~/lib/services/deployService';
import { webcontainer } from '~/lib/webcontainer';
import { TerminalStore } from '~/lib/stores/terminal';

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

  const publishButtonRef = useRef<HTMLButtonElement>(null);

  const { mutateAsync: getDeployRequest } = useGetDeploy();
  const { mutateAsync: createDeployRequest } = usePostDeploy();
  const [finalDeployLink, setFinalDeployLink] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  const { takeSnapshot } = useChatHistory();
  const chatIdx = useStore(lastChatIdx);
  const chatSummary = useStore(lastChatSummary);

  const terminalStore = new TerminalStore(webcontainer);
  const deployService = new DeployService(
    webcontainer,
    () => terminalStore.boltTerminal,
  );

  const formattedLinkToast = (url: string) => {
    toast.success(
      <div>
        Project is published. You can clink to the button left from "Publish" and go to app.
        <br /> <br />
        <a href={url} target="_blank" rel="noopener noreferrer" className='underline'>
          Link
        </a>
      </div>,
      { autoClose: false },
    );
  };

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
    const currentChatId = chatId.get();
    if (!currentChatId) return;

    fetchDeployRequest({ 
      projectId: currentChatId,
      showError: false,
    });
  }, [chatId])

  const fetchDeployRequest = async ({
    projectId,
    enableMessages = true,
    showError = true,
  }: {
    projectId: string;
    enableMessages?: boolean;
    showError?: boolean;
  }) => {
    try {
      const data = await getDeployRequest(projectId);
      setFinalDeployLink(data.url);
      console.log(data);

      if (enableMessages && data.url) {
        formattedLinkToast(data.url);
      }
    } catch (error) {
      const failMessage = `Failed to publish app. Try again later.`;
      if (showError) {
        toast.error(failMessage);
        console.error(error);
      }
    }
  };

  const onDeploy = async () => {
    setIsDeploying(true);

    const toastId = toast.info('Deploying...', { autoClose: false });

    try {
      const currentChatId = chatId.get();

      if (!currentChatId) {
        toast.error('Failed to get chatId.');
        return;
      }

      const deployResult = await deployService.runDeployScript();

      if (deployResult.exitCode !== 0 && deployResult.exitCode !== 143) {
        toast.error(`Failed to build. Status code: ${deployResult.exitCode}.`, { autoClose: false })
      }

      const files = workbenchStore.files.get();
      const filteredFiles = Object.fromEntries(Object.entries(files).filter(
        ([key, value]) => {
          return key.startsWith("/home/project/dist/");
        }
      ));

      const data = await createDeployRequest({
        projectId: currentChatId,
        snapshot: filteredFiles,
      });

      setFinalDeployLink(data.url);
      formattedLinkToast(data.url);
    } catch (error) {
      toast.error(`Failed to publish app. Try again later.`);
    } finally {
      setIsDeploying(false);
      console.log(toastId)
      if (toastId) {
        toast.dismiss(toastId);
      }
    }
  }

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

    setIsSaving(true);

    try {
      await takeSnapshot(chatIdx, workbenchStore.files.get(), undefined, chatSummary);
      toast.success('Project saved.');
    } catch (error) {
      toast.error('Failed to save project.');
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
          className="px-4 mr-4 hover:bg-bolt-elements-item-backgroundActive flex items-center gap-2 bg-bolt-elements-item-backgroundAccent border border-bolt-elements-borderColor rounded-md"
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
        <div className="flex gap-2 mr-4 text-sm h-full">
            <Button
              active
              disabled={isDeploying || !activePreview || isStreaming}
              ref={publishButtonRef}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="px-4 hover:bg-bolt-elements-item-backgroundActive flex items-center gap-2
                border border-bolt-elements-borderColor rounded-md m-0"
            >
              {isDeploying ? `Publishing...` : 'Publish'}
              <div
                className={classNames('i-ph:caret-down w-4 h-4 transition-transform', isDropdownOpen ? 'rotate-180' : '')}
              />
            </Button>
        </div>

        {isDropdownOpen && (
          <div className="absolute right-2 flex flex-col gap-1 z-50 p-1 mt-1 min-w-[13.5rem] bg-bolt-elements-background-depth-2 rounded-md shadow-lg bg-bolt-elements-backgroundDefault border border-bolt-elements-borderColor">
            <Button
              active={false}
              disabled={publishButtonRef?.current ? publishButtonRef.current.disabled : false}
              onClick={onDeploy}
              className="flex items-center w-full rounded-md px-4 py-2 text-sm text-bolt-elements-textTertiary gap-2"
            >
              <RocketIcon alt="deploy icon" size={28} />
              <span className="mx-auto">Publish project</span>
            </Button>

            <Button
              active={false}
              disabled={!finalDeployLink}
              onClick={handleClickFinalLink}
              className="flex items-center w-full px-4 py-2 text-sm text-bolt-elements-textTertiaryx gap-2 rounded-md"
            >
              <ArrowSquareOutIcon size={24} />
              <span className="mx-auto">Project link</span>
            </Button>
          </div>
        )}
      </div>
      <div className="flex border border-bolt-elements-borderColor rounded-md overflow-hidden mr-3">
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

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ active = false, disabled = false, children, onClick, className }, ref) => {
    return (
      <button
        ref={ref}
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
        disabled={disabled}
        onClick={onClick}
      >
        {children}
      </button>
    )
  }
)
