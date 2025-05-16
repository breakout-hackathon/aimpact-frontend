import { useWallet } from '@solana/wallet-adapter-react';
import Cookies from 'js-cookie';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { WalletSignMessageError } from '@solana/wallet-adapter-base';
import bs58 from 'bs58';
import { toast } from 'react-toastify';

interface UserInfo {}

type AuthContextType = {
  isAuthorized: boolean;
  jwtToken: string;
  disconnect: () => Promise<void>;
};

type RequestMessageResponseType = {
  nonce: string;
  message: string;
};

type LoginWalletResponseType = {
  accessToken: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { publicKey, connected, signIn, signMessage, disconnect } = useWallet();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [jwtToken, setJwtToken] = useState('');

  useEffect(() => {
    const checkCreds = async () => {
      if (connected && isAuthorized) {
        console.log('exit')
        return;
      }

      if (!connected || !signMessage || !publicKey) {
        console.log('Disconnecting');
        return;
      }

      const authToken = Cookies.get('authToken');
      console.log(`Auth token: ${authToken}`)

      if (!authToken || authToken === 'undefined') {
        let requestMessage;
        try {
          requestMessage = await fetch(`${import.meta.env.PUBLIC_BACKEND_URL}/auth/requestMessage`, {
            method: 'POST',
            headers: {
              accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ walletAddress: publicKey.toBase58() }),
          })
        } catch (error) {
          const msg = "Failed to request sign message";
          toast.error(msg);
          setIsAuthorized(false);
          throw error;
        }

        if (!requestMessage.ok) {
          throw new Error('Failed to request sign message');
        }

        const { message, nonce } = (await requestMessage.json()) as RequestMessageResponseType;

        try {
          const rawSignature = await signMessage(new TextEncoder().encode(message));
          const signature = bs58.encode(rawSignature);
          console.log(message, signature.toString(), publicKey.toBase58());

          // backend /api/login logic
          const response = await fetch(`${import.meta.env.PUBLIC_BACKEND_URL}/auth/loginWithWallet`, {
            headers: {
              accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              nonce,
              signedMessage: signature,
              walletAddress: publicKey.toBase58(),
            }),
            method: 'POST',
          });

          if (!response.ok) {
            setIsAuthorized(false);
            throw new Error('Login response is not ok.');
          }

          const responseData: LoginWalletResponseType = await response.json();

          setJwtToken(responseData.accessToken);
          setIsAuthorized(true);
          Cookies.set('authToken', responseData.accessToken);
        } catch (error) {
          console.error(error);
          toast.error((error as Error)?.message || "Failed to sign message and authorize");

          if (error instanceof WalletSignMessageError) { 
            await handleDisconnect();
          }
        }
      } else {
        setIsAuthorized(true);
        setJwtToken(authToken);
      }
    };

    checkCreds().then(() => {
      // console.log(`Is Auth new: ${isAuthorized} ${jwtToken.slice(0, 15)}`);
      // console.log(`Jwt new: ${jwtToken} ${typeof jwtToken}`);
      // console.log(`Public Key: ${publicKey}`);
    });
  }, [publicKey, connected, signMessage, disconnect]);

  const handleDisconnect = async () => {
    Cookies.remove('authToken');
    setIsAuthorized(false);
    await disconnect();
  };

  return (
    <AuthContext.Provider value={{ isAuthorized, jwtToken, disconnect: handleDisconnect }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
