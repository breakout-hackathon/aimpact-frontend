import { useFetch } from '../hooks/useFetch';

const host = import.meta.env.PUBLIC_BACKEND_URL;

interface RecentBlockhashResponse {
  blockhash: string;
  lastValidBlockHeight: number;
}

interface SendTransactionResponse {
  txHash: string;
}

export const useSolanaProxy = () => {
  const { fetchDataAuthorized } = useFetch();

  const getRecentBlockhash = async () => {
    return fetchDataAuthorized(`${host}/proxy/recent-blockhash`) as Promise<RecentBlockhashResponse>;
  };

  const sendTransaction = async (serializedTx: string) => {
    return fetchDataAuthorized(`${host}/proxy/send-tx`, {
      method: 'POST',
      body: JSON.stringify({ serializedTx }),
      headers: {
        'Content-Type': 'application/json',
      },
    }) as Promise<SendTransactionResponse>;
  };

  return {
    getRecentBlockhash,
    sendTransaction,
  };
};
