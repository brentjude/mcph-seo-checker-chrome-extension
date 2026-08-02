import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { useScan, type ScanState } from './useScan';

export type TabKey = 'overview' | 'onpage' | 'links' | 'ai' | 'social';

interface ScanContextValue extends ScanState {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
}

const ScanContext = createContext<ScanContextValue | null>(null);

export function ScanProvider({ children }: { children: ReactNode }) {
  const scan = useScan();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const value = useMemo<ScanContextValue>(
    () => ({ ...scan, activeTab, setActiveTab }),
    [scan, activeTab],
  );

  return <ScanContext.Provider value={value}>{children}</ScanContext.Provider>;
}

export function useScanContext(): ScanContextValue {
  const ctx = useContext(ScanContext);
  if (!ctx) {
    throw new Error('useScanContext must be used within a ScanProvider');
  }
  return ctx;
}
