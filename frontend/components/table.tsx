import * as React from 'react';

export function Table(props: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        {...props}
        className={
          'w-full caption-bottom text-sm ' + (props.className ?? '')
        }
      />
    </div>
  );
}

export function TableHeader(
  props: React.HTMLAttributes<HTMLTableSectionElement>,
) {
  return (
    <thead
      {...props}
      className={'[&_tr]:border-b ' + (props.className ?? '')}
    />
  );
}

export function TableBody(
  props: React.HTMLAttributes<HTMLTableSectionElement>,
) {
  return (
    <tbody
      {...props}
      className={'[&_tr:last-child]:border-0 ' + (props.className ?? '')}
    />
  );
}

export function TableFooter(
  props: React.HTMLAttributes<HTMLTableSectionElement>,
) {
  return (
    <tfoot
      {...props}
      className={'bg-zinc-50 dark:bg-zinc-900 font-medium ' + (props.className ?? '')}
    />
  );
}

export function TableRow(props: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      {...props}
      className={
        'border-b border-black/5 dark:border-white/10 transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 ' +
        (props.className ?? '')
      }
    />
  );
}

export function TableHead(props: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      {...props}
      className={
        'h-10 px-3 text-left align-middle font-medium text-zinc-600 dark:text-zinc-300 ' +
        (props.className ?? '')
      }
    />
  );
}

export function TableCell(props: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      {...props}
      className={'p-3 align-middle ' + (props.className ?? '')}
    />
  );
}

export function TableCaption(
  props: React.TableHTMLAttributes<HTMLTableCaptionElement>,
) {
  return (
    <caption
      {...props}
      className={'mt-4 text-sm text-zinc-500 ' + (props.className ?? '')}
    />
  );
}


