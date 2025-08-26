import * as React from 'react';

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
};

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onOpenChange(false);
    }
    if (open) {
      document.addEventListener('keydown', onKey);
    }
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onOpenChange]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <DialogOverlay onClick={() => onOpenChange(false)} />
      <DialogContent>{children}</DialogContent>
    </div>
  );
}

export function DialogOverlay(
  props: React.HTMLAttributes<HTMLDivElement>,
) {
  return (
    <div
      {...props}
      className={
        'absolute inset-0 bg-black/50 backdrop-blur-sm ' + (props.className ?? '')
      }
    />
  );
}

export function DialogContent(
  props: React.HTMLAttributes<HTMLDivElement>,
) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      {...props}
      className={
        'relative z-10 w-full max-w-lg rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 p-4 shadow-xl ' +
        (props.className ?? '')
      }
    />
  );
}

export function DialogHeader(
  props: React.HTMLAttributes<HTMLDivElement>,
) {
  return <div {...props} className={'mb-3 ' + (props.className ?? '')} />;
}

export function DialogTitle(
  props: React.HTMLAttributes<HTMLHeadingElement>,
) {
  return (
    <h2 {...props} className={'text-lg font-semibold ' + (props.className ?? '')} />
  );
}

export function DialogFooter(
  props: React.HTMLAttributes<HTMLDivElement>,
) {
  return <div {...props} className={'mt-4 flex justify-end gap-2 ' + (props.className ?? '')} />;
}


