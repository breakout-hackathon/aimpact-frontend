import { useStore } from '@nanostores/react';
import { ClientOnly } from 'remix-utils/client-only';
import { chatStore } from '~/lib/stores/chat';
import { classNames } from '~/utils/classNames';
import { HeaderActionButtons } from './HeaderActionButtons.client';
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';
import DepositButton from '../chat/DepositButton';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

export function Header() {
  const chat = useStore(chatStore);
  const { connected } = useWallet();

  return (
    <header
      className={classNames('flex items-center p-5 border-b h-[var(--header-height)] justify-between', {
        'border-transparent': !chat.started,
        'border-bolt-elements-borderColor': chat.started,
      })}
    >
      <div className="flex items-center gap-2 z-logo text-bolt-elements-textPrimary cursor-pointer">
        <div className="i-ph:sidebar-simple-duotone text-xl" />
      </div>
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
      {/* <div className=''>
        <ClientOnly>{() => 
          <WalletConnectButton />
        }
        </ClientOnly>
      </div> */}
      <div className='flex justify-center items-center gap-2'>
        { connected && <DepositButton /> }
        
        <WalletMultiButton style={
          {fontSize: "16px", fontStyle: "normal", height: "42px", borderRadius: "8px", padding: "0 16px", display: "flex", alignItems: "center",
              justifyContent: "center", whiteSpace: "nowrap", fontWeight: 500}
        }  />
      </div>
      {/* <WalletMultiButton style={{fontSize: "12px", height: "42px", borderRadius: "8px", padding: "0 16px"}}  /> */}
    </header>
  );
}
