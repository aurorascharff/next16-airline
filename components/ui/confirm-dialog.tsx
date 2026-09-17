'use client';

import * as Ariakit from '@ariakit/react';
import { startTransition, useState } from 'react';
import { Boundary } from '@/components/internal/boundary';
import { buttonClasses } from '@/components/ui/button-classes';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

type Variant = 'danger' | 'primary';

type Props = {
  store: Ariakit.DialogStore;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: Variant;
  confirmAction: () => Promise<boolean>;
};

const variantStyles: Record<Variant, string> = {
  danger: 'bg-danger text-white hover:bg-danger/90',
  primary: '',
};

export function ConfirmDialog({
  store,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  confirmAction,
}: Props) {
  const [isPending, setIsPending] = useState(false);

  async function handleConfirm() {
    setIsPending(true);
    try {
      const ok = await confirmAction();
      if (ok) startTransition(() => store.hide());
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Boundary label="ConfirmDialog" asChild>
      <Ariakit.Dialog
        store={store}
        backdrop={
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" style={{ viewTransitionName: 'none' }} />
        }
        className="border-divider dark:border-divider-dark fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-white p-6 shadow-2xl outline-none dark:bg-black"
        hideOnEscape={!isPending}
        hideOnInteractOutside={!isPending}
        style={{ viewTransitionName: 'none' }}
        unmountOnHide
      >
        <Ariakit.DialogHeading className="text-lg font-bold text-black dark:text-white">{title}</Ariakit.DialogHeading>
        <Ariakit.DialogDescription className="text-muted mt-2 text-sm">{description}</Ariakit.DialogDescription>
        <div className="mt-6 flex justify-end gap-3">
          <Ariakit.DialogDismiss className={buttonClasses({ variant: 'secondary' })} disabled={isPending}>
            {cancelLabel}
          </Ariakit.DialogDismiss>
          <button
            className={cn(buttonClasses({ className: 'min-w-24' }), variantStyles[variant])}
            disabled={isPending}
            onClick={handleConfirm}
            type="button"
          >
            {isPending ? <Spinner /> : confirmLabel}
          </button>
        </div>
      </Ariakit.Dialog>
    </Boundary>
  );
}
