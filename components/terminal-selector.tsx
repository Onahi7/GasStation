'use client';

import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getTerminals } from '@/app/actions/terminals';
import { useTerminal } from '@/contexts/terminal-context';
import { useSession } from 'next-auth/react';

export function TerminalSelector() {
  const [terminals, setTerminals] = useState<any[]>([]);
  const { currentTerminalId, switchTerminal } = useTerminal();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (session?.user?.companyId) {
      setIsLoading(true);
      getTerminals(session.user.companyId)
        .then(setTerminals)
        .finally(() => setIsLoading(false));
    }
  }, [session?.user?.companyId]);
  
  if (!session?.user?.companyId || terminals.length === 0) {
    return null;
  }
  
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-muted-foreground">Terminal:</span>
      <Select
        value={currentTerminalId}
        onValueChange={switchTerminal}
        disabled={isLoading}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Terminal" />
        </SelectTrigger>
        <SelectContent>
          {terminals.map((terminal) => (
            <SelectItem key={terminal.id} value={terminal.id}>
              {terminal.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
