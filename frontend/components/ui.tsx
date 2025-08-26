import * as React from 'react';

export function Card(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={
        'rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 p-4 shadow-sm ' +
        (props.className ?? '')
      }
    />
  );
}

export function Button(
  { className, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>,
) {
  return (
    <button
      {...rest}
      className={
        'inline-flex items-center justify-center rounded-md border border-black/10 dark:border-white/10 bg-foreground text-background hover:opacity-90 px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 ' +
        (className ?? '')
      }
    />
  );
}

export function Input(
  { className, ...rest }: React.InputHTMLAttributes<HTMLInputElement>,
) {
  return (
    <input
      {...rest}
      className={
        'w-full rounded-md border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 px-3 py-2 text-sm outline-none ring-2 ring-transparent focus:ring-black/10 dark:focus:ring-white/10 ' +
        (className ?? '')
      }
    />
  );
}

export function Label(
  { className, ...rest }: React.LabelHTMLAttributes<HTMLLabelElement>,
) {
  return (
    <label {...rest} className={'text-sm font-medium ' + (className ?? '')} />
  );
}


