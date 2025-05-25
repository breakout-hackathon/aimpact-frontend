import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useRef, useState } from 'react';
import { classNames } from '~/utils/classNames';
import waterStyles from '../ui/WaterButton.module.scss';

export default function CustomWalletButton() {
  const { connected } = useWallet();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && buttonRef.current && !connected) {
      // Find the span with the text and update it
      const spans = buttonRef.current.getElementsByTagName('span');
      for (let i = 0; i < spans.length; i++) {
        if (spans[i].textContent === 'Select Wallet') {
          spans[i].textContent = 'Connect Wallet';
        }
      }
    }
  }, [mounted, connected]);

  return (
    <div ref={buttonRef} className={classNames(
      'custom-wallet-button-wrapper',
      waterStyles.waterButton,
      waterStyles.green,
      'relative overflow-hidden',
      'text-white font-medium',
      'rounded-md',
      'transition-all duration-300',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'inline-flex items-center justify-center',
      'h-10 px-4 py-2',
      'text-sm',
      'border border-[#5c5c5c40]'
    )}>
      <div className={waterStyles.waterSurface}></div>
      <div className={waterStyles.waterDroplets}></div>
      <div className={classNames('z-10')}>
        <WalletMultiButton
          style={{
            background: 'transparent',
            border: 'none',
            color: 'inherit',
            font: 'inherit',
            padding: 0,
            margin: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {!connected && 'Connect Wallet'}
        </WalletMultiButton>
      </div>
    </div>
  );
}
