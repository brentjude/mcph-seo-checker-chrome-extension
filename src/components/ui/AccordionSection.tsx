import { useState, type ReactNode } from 'react';
import { ChevronDown, type LucideIcon } from 'lucide-react';
import { SectionCard } from './SectionCard';

interface AccordionSectionProps {
  icon?: LucideIcon;
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

/** SectionCard + collapse state, for the sections the spec marks as expand/collapse. */
export function AccordionSection({ icon, title, defaultOpen = true, children }: AccordionSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <SectionCard
      icon={icon}
      title={title}
      action={
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? `Collapse ${title}` : `Expand ${title}`}
          className="rounded-full p-1 text-text-secondary transition-colors duration-200 hover:bg-surface-light dark:text-text-darkSecondary dark:hover:bg-surface-darkBase"
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        </button>
      }
    >
      <div
        className={`grid transition-all duration-200 ease-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="divide-y divide-surface-border overflow-hidden dark:divide-surface-darkBorder">
          {children}
        </div>
      </div>
    </SectionCard>
  );
}
