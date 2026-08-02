import { Bot, FileSearch, Home, Link2, Share2, type LucideIcon } from 'lucide-react';
import { useScanContext, type TabKey } from '@/popup/state/ScanContext';

const TABS: { key: TabKey; label: string; icon: LucideIcon }[] = [
  { key: 'overview', label: 'Overview', icon: Home },
  { key: 'onpage', label: 'On-Page', icon: FileSearch },
  { key: 'links', label: 'Links', icon: Link2 },
  { key: 'ai', label: 'AI', icon: Bot },
  { key: 'social', label: 'Social', icon: Share2 },
];

export function BottomNav() {
  const { activeTab, setActiveTab } = useScanContext();

  return (
    <nav className="sticky bottom-0 z-10 grid grid-cols-5 border-t border-surface-border bg-white/95 backdrop-blur dark:border-surface-darkBorder dark:bg-surface-darkCard/95">
      {TABS.map(({ key, label, icon: Icon }) => {
        const isActive = activeTab === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className="flex flex-col items-center gap-1 py-2.5 transition-colors duration-200"
          >
            <Icon
              className={`h-5 w-5 transition-colors duration-200 ${
                isActive ? 'text-brand-primary' : 'text-text-secondary dark:text-text-darkSecondary'
              }`}
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span
              className={`text-[10px] font-medium transition-colors duration-200 ${
                isActive ? 'text-brand-primary' : 'text-text-secondary dark:text-text-darkSecondary'
              }`}
            >
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
