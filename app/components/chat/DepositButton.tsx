import { useState } from 'react';
import { Form, useNavigation } from '@remix-run/react';
import { Info } from '@phosphor-icons/react';
import WithTooltip from './Tooltip';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from '~/components/ui/Button';

export default function DepositButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigation();
  const { signMessage, publicKey } = useWallet();
  const isSubmitting = navigation.state === 'submitting';

  const solanaTxHashRegex = /^[1-9A-HJ-NP-Za-km-z]{88}$/;

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const validateTxHash = () => {};

  const handleChangeTxHash = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setTxHash(e.target.value);

    if (solanaTxHashRegex.test(txHash)) {
      setError('Solana Transaction Hash is invalid.');
      return;
    }

    setTxHash(txHash);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (!signMessage || !publicKey) {
      return;
    }

    if (!txHash) {
      setError('Transaction Hash is required.');
      return;
    }

    const message = `You are confirming this txId: ${txHash}\n${Date.now()}`;
    const encodedMessage = new TextEncoder().encode(message);
    const signature = await signMessage(encodedMessage);
    const payload = {
      signature,
      message,
      txHash,
      address: publicKey.toBase58(),
    };

    const response = await fetch('/api/deposit', { body: JSON.stringify(payload) });

    if (!response.ok) {
      setError('Failed to process deposit request.');
      return;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Button
        onClick={handleToggle}
        variant="secondary"
        className="flex items-center gap-2"
      >
        Deposit
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
                <div className="flex gap-2 items-center">
                  <h3 className="text-lg font-medium leading-6">Deposit Funds</h3>
                  <WithTooltip tooltip="test" position="right">
                    <Info size={20} className="text-gray-500 flex" />
                  </WithTooltip>
                </div>
                <div className="mt-4">
                  <Form method="post" action="/api/deposit">
                    <div className="mb-4">
                      <label htmlFor="txHash" className="block text-sm font-medium">
                        Solana Transaction Hash
                      </label>
                      <input
                        type="text"
                        id="txHash"
                        name="txHash"
                        value={txHash}
                        onChange={handleChangeTxHash}
                        className="block w-full px-3 py-2 mt-1 shadow-sm rounded-lg bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-500/30 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 border border-gray-200 dark:border-gray-700"
                        placeholder="Enter Solana tx hash"
                      />
                    </div>

                    <div className={`mt-2 text-sm ${error ? 'text-red-600' : 'text-green-600'}`}>{error}</div>

                    <div className="mt-5 sm:mt-6">
                      <Button
                        type="submit"
                        variant="default"
                        disabled={isSubmitting}
                        onClick={handleSubmit}
                        className="w-full justify-center"
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                      </Button>
                    </div>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
