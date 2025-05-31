import { createContext, useContext, useEffect, useState } from "react";

interface RefCodeContextType {
  refCode: string | undefined;
}

const RefCodeContext = createContext<RefCodeContextType | undefined>(undefined);

export function RefCodeProvider({ children }: { children: React.ReactNode }) {
  const [refCode, setRefCode] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Check URL for refCode parameter
    const urlParams = new URLSearchParams(window.location.search);
    const refCodeFromUrl = urlParams.get('refCode');

    if (refCodeFromUrl) {
      // Save to localStorage
      localStorage.setItem('refCode', refCodeFromUrl);
      setRefCode(refCodeFromUrl);

      // Remove refCode from URL without refreshing the page
      urlParams.delete('refCode');
      const newUrl = window.location.pathname + (urlParams.toString() ? `?${urlParams.toString()}` : '');
      window.history.replaceState({}, '', newUrl);
    } else {
      // If no refCode in URL, check localStorage
      const storedRefCode = localStorage.getItem('refCode');
      if (storedRefCode) {
        setRefCode(storedRefCode);
      }
    }
  }, []);
  
  return (
    <RefCodeContext.Provider value={{ refCode }}>
      {children}
    </RefCodeContext.Provider>
  );
}

export function useRefCode() {
  const context = useContext(RefCodeContext);

  if (context === undefined) {
    throw new Error('useRefCode must be used within an RefCodeProvider');
  }

  return context;
}