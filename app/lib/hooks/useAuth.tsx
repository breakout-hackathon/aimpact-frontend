import { useWallet } from '@solana/wallet-adapter-react';
import { getUtf8Encoder } from '@solana/kit';
import Cookies from 'js-cookie';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { WalletSignMessageError } from '@solana/wallet-adapter-base';
import bs58 from 'bs58';

interface UserInfo {}

type AuthContextType = {
  isAuthorized: boolean;
  jwtToken: string;
  userInfo: UserInfo;
  disconnect: () => Promise<void>;
}

type RequestMessageResponseType = {
  nonce: string;
  message: string;
};

type LoginWalletResponseType = {
  accessToken: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const generateMessage = (customData?: string) => {
  const message = `Login to app ${Date.now()}` + customData || '';
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { publicKey, connected, signIn, signMessage, disconnect } = useWallet();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [jwtToken, setJwtToken] = useState('');
  const [userInfo, setUserInfo] = useState<UserInfo>({});
  
  const allowedLocations: string[] = [/*'/chat' */];

  useEffect(() => {
    console.log(`Public Key: ${publicKey}`);
    console.log(`Is Auth: ${isAuthorized}`);

    const checkCreds = async () => {
      if (allowedLocations.includes(window.location.pathname)) return;
      if (connected && isAuthorized) return;

      if (!connected || !signMessage || !publicKey) {
        Cookies.remove("authToken");
        setIsAuthorized(false);
        return;
      }

      const authToken = Cookies.get('authToken');

      if (!authToken || authToken === 'undefined') {
        const requestMessage = await fetch(`${import.meta.env.PUBLIC_BACKEND_URL}/auth/requestMessage`, {
          method: 'POST',

          // body: JSON.stringify({ walletAddress: publicKey.toBase58() }),
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ walletAddress: publicKey.toBase58() }),
        });

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
          Cookies.set("authToken", responseData.accessToken);
        } catch (error) {
          console.error(error);

          if (error instanceof WalletSignMessageError) {
            // alert("User rejected sign request");
            await handleDisconnect();
          } else {
            // alert("Unnexpectd error");
          }
        }
      } else {
        setIsAuthorized(true);
        setJwtToken(authToken);
      }
    };

    checkCreds()
  }, [publicKey, connected, signMessage, disconnect])

  const handleDisconnect = async () => {
    Cookies.remove("authToken");
    setIsAuthorized(false);
    await disconnect();
  }

  return (
    <AuthContext.Provider value={{ isAuthorized, jwtToken, userInfo, disconnect: handleDisconnect }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
