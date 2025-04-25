'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getTerminalDetails } from '@/app/actions/terminals';
import { useSession } from 'next-auth/react';

type Terminal = {
  id: string;
  name: string;
  address?: string;
  location?: string;
  companyId: string;
};

type TerminalContextType = {
  currentTerminalId?: string;
  currentTerminal?: Terminal;
  isLoading: boolean;
  switchTerminal: (terminalId: string) => void;
};

const TerminalContext = createContext<TerminalContextType | undefined>(undefined);

export function TerminalProvider({ children }: { children: ReactNode }) {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  
  const [currentTerminalId, setCurrentTerminalId] = useState<string | undefined>(
    typeof params.terminalId === 'string' ? params.terminalId : undefined
  );
  const [currentTerminal, setCurrentTerminal] = useState<Terminal | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (currentTerminalId) {
      setIsLoading(true);
      getTerminalDetails(currentTerminalId)
        .then(data => setCurrentTerminal(data))
        .finally(() => setIsLoading(false));
    } else {
      // If user has a terminal assigned and no terminal is selected, use that one
      if (session?.user?.terminalId) {
        setCurrentTerminalId(session.user.terminalId);
      }
    }
  }, [currentTerminalId, session?.user?.terminalId]);
  
  const switchTerminal = (terminalId: string) => {
    setCurrentTerminalId(terminalId);
    
    // Update URL if we're in a terminal-specific page
    const path = window.location.pathname;
    if (path.includes('/terminals/')) {
      const newPath = path.replace(/\/terminals\/[^\/]+/, `/terminals/${terminalId}`);
      router.push(newPath);
    }
  };
  
  return (
    <TerminalContext.Provider value={{ 
      currentTerminalId, 
      currentTerminal, 
      isLoading,
      switchTerminal
    }}>
      {children}
    </TerminalContext.Provider>
  );
}

export const useTerminal = () => {
  const context = useContext(TerminalContext);
  if (context === undefined) {
    throw new Error('useTerminal must be used within a TerminalProvider');
  }
  return context;
};
