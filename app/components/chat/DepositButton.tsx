import { useState } from 'react';
import { useNavigation } from '@remix-run/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { toast } from 'react-toastify';
import { Button } from '../ui';
import { useSolanaProxy } from '~/lib/api-hooks/useSolanaProxy';

export default function DepositButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const { publicKey, signTransaction } = useWallet();
  const { getRecentBlockhash, sendTransaction } = useSolanaProxy();

  const isSubmitting = navigation.state === 'submitting';

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handlePurchase = async () => {
    if (!publicKey || !signTransaction) {
      setError('Please connect your wallet first');
      return;
    }

    // 1. Fetch recent blockhash and lastValidBlockHeight from backend
    let blockhash, lastValidBlockHeight;

    try {
      const data = await getRecentBlockhash();
      blockhash = data.blockhash;
      lastValidBlockHeight = data.lastValidBlockHeight;
    } catch (err) {
      setError('Failed to get recent blockhash');
      return;
    }

    // 2. Build transaction using new TransactionBlockhashCtor
    let transaction = new Transaction({
      blockhash,
      lastValidBlockHeight,
      feePayer: publicKey,
    }).add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new PublicKey(import.meta.env.VITE_DEPOSIT_ADDRESS),
        lamports: 0.001 * LAMPORTS_PER_SOL,
      }),
    );

    // 3. Sign transaction with wallet
    try {
      transaction = await signTransaction(transaction);
    } catch (err) {
      setError('Transaction signing failed');
      return;
    }

    // 4. Serialize and send to backend
    try {
      const serializedTx = transaction.serialize({ requireAllSignatures: false }).toString('base64');
      console.log(`Serialized TX: ${serializedTx}`);
      await sendTransaction(serializedTx);

      setIsOpen(false);
      toast.success('Purchase completed!');
    } catch (err) {
      const message = 'Transaction failed. Please try again.';
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Button onClick={handleToggle} variant="secondary" className="flex py-2.5 items-center gap-2 bg-transparent border border-bolt-elements-borderColor font-medium">
        Purchase Messages
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex relative items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-900 bg-opacity-75" onClick={handleToggle}></div>
            <div className="inline-block overflow-hidden text-left align-bottom transition-all transform border-2 border-bolt-elements-borderColor rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <button
                onClick={handleToggle}
                className="flex absolute right-0 items-center justify-center w-8 h-8 rounded-full bg-transparent hover:bg-gray-500/10 dark:hover:bg-gray-500/20 group transition-all duration-200"
              >
                <div className="i-ph:x w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-500 transition-colors" />
              </button>

              <div className="px-4 py-5 sm:p-6 bg-bolt-elements-background bg-bolt-elements-background-depth-3">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4">Purchase Messages</h3>
                  <p className="text-xl mb-6">
                    Get <span className="font-semibold">10 messages</span> for{' '}
                    <span className="font-semibold">0.001 SOL</span>
                  </p>

                  {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

                  <button
                    onClick={handlePurchase}
                    disabled={isSubmitting || !publicKey}
                    className="inline-flex justify-center w-full px-6 py-3 text-lg font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Processing...' : 'Purchase Now'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
