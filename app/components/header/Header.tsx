import { useStore } from '@nanostores/react';
import { ClientOnly } from 'remix-utils/client-only';
import { chatStore } from '~/lib/stores/chat';
import { classNames } from '~/utils/classNames';
import { HeaderActionButtons } from './HeaderActionButtons.client';
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';
import DepositButton from '../chat/DepositButton';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { ArrowLeft } from '@phosphor-icons/react';
import React, { useEffect, type CSSProperties, type PropsWithChildren, type ReactElement, type MouseEvent } from 'react';
import styles from './ProjectsButton.module.scss';

export type ButtonProps = PropsWithChildren<{
    className?: string;
    disabled?: boolean;
    endIcon?: ReactElement;
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    startIcon?: ReactElement;
    style?: CSSProperties;
    tabIndex?: number;
}>;

export function Header() {
  const chat = useStore(chatStore);
  const { connected } = useWallet();
  console.log(`Connected: ${connected}`)

  return (
    <header
      className={classNames('flex items-center px-2 py-3 border-b h-[var(--header-height)] justify-between', {
        'border-transparent': !chat.started,
        'border-bolt-elements-borderColor': chat.started,
      })}
    >
      <a className="flex items-center gap-2 z-logo cursor-pointer" href="/">
        <button
          className={classNames(
            'text-bolt-elements-textPrimary rounded-md px-4 py-2 border border-bolt-elements-borderColorActive bg-transparent flex items-center gap-2',
            styles.projectsButton
          )}
        >
          <div className={styles.waterSurface}></div>
          <div className={styles.waterDroplets}></div>
          <div className={styles.buttonContent}>
            <ArrowLeft size={16} />
            <span>Projects</span>
          </div>
        </button>
      </a>
      
      {chat.started && ( // Display ChatDescription and HeaderActionButtons only when the chat has started.
        <>
          <span className="flex-1 px-4 truncate text-center text-bolt-elements-textPrimary">
            <ClientOnly>{() => <ChatDescription />}</ClientOnly>
          </span>
          <ClientOnly>
            {() => (
              <div className="mr-1">
                <HeaderActionButtons />
              </div>
            )}
          </ClientOnly>
        </>
      )}
      <div className="flex justify-center items-center gap-2">
      <ClientOnly>
        {() => {
          return connected ?? <DepositButton />
        }}
      </ClientOnly>

        <ClientOnly>
          {() => {
            return (
              <WalletMultiButton
                style={{
                  fontSize: '16px',
                  fontStyle: 'normal',
                  height: '42px',
                  borderRadius: '8px',
                  padding: '0 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  whiteSpace: 'nowrap',
                  fontWeight: 500,
                }}
              />
            );
          }}
        </ClientOnly>
      </div>
    </header>
  );
}
