import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function CustomWalletButton() {
  const { connected } = useWallet();

  return (
    <WalletMultiButton
      style={{
        background: 'transparent',
        border: '1px solid #5c5c5c40',
        color: 'inherit',
        font: 'inherit',
        margin: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px 8px',
      }}
    >
      {!connected && 'Connect Wallet'}
    </WalletMultiButton>
  );
}
