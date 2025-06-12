declare namespace React {
  interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
    commandfor?: string;
    command?:
      | ''
      | 'show-modal'
      | 'close'
      | 'hide-popover'
      | 'toggle-popover'
      | 'show-popover'
      | `--${string}`;
  }
}
