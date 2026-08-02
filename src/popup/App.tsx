import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { Footer } from '@/components/layout/Footer';
import { SkeletonLoader } from '@/components/ui/SkeletonLoader';
import { OverviewTab } from '@/components/tabs/OverviewTab';
import { OnPageTab } from '@/components/tabs/OnPageTab';
import { LinksTab } from '@/components/tabs/LinksTab';
import { AiTab } from '@/components/tabs/AiTab';
import { SocialTab } from '@/components/tabs/SocialTab';
import { ScanProvider, useScanContext, type TabKey } from '@/popup/state/ScanContext';

const TAB_COMPONENTS: Record<TabKey, () => JSX.Element | null> = {
  overview: OverviewTab,
  onpage: OnPageTab,
  links: LinksTab,
  ai: AiTab,
  social: SocialTab,
};

function EmptyState({
  tone = 'neutral',
  title,
  description,
  onRetry,
}: {
  tone?: 'neutral' | 'critical';
  title: string;
  description: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <AlertTriangle
        className={`h-8 w-8 ${tone === 'critical' ? 'text-status-critical' : 'text-text-secondary dark:text-text-darkSecondary'}`}
        strokeWidth={1.75}
      />
      <p className="text-sm font-semibold text-text-primary dark:text-text-darkPrimary">{title}</p>
      <p className="text-xs text-text-secondary dark:text-text-darkSecondary">{description}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 flex items-center gap-1.5 rounded-xl bg-brand-primary px-4 py-2 text-xs font-semibold text-white transition-colors duration-200 hover:bg-brand-dark"
        >
          <RefreshCw className="h-3.5 w-3.5" strokeWidth={2.25} />
          Try Again
        </button>
      )}
    </div>
  );
}

function PopupContent() {
  const { status, auditResult, errorMessage, refresh, activeTab } = useScanContext();

  if (status === 'unsupported') {
    return (
      <EmptyState
        title="This page can't be audited"
        description="Browser and Web Store pages aren't accessible to extensions. Open a regular website and try again."
      />
    );
  }

  if (status === 'error') {
    return (
      <EmptyState
        tone="critical"
        title="Scan failed"
        description={errorMessage ?? 'Something went wrong while scanning this page.'}
        onRetry={refresh}
      />
    );
  }

  if (!auditResult) {
    return <SkeletonLoader />;
  }

  const ActiveTabComponent = TAB_COMPONENTS[activeTab];

  return (
    <>
      <main>
        <ActiveTabComponent />
        <Footer />
      </main>
      <BottomNav />
    </>
  );
}

export default function App() {
  return (
    <ScanProvider>
      <div className="w-[420px] bg-white dark:bg-surface-darkBase">
        <Header />
        <PopupContent />
      </div>
    </ScanProvider>
  );
}
