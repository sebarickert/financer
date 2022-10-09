import { useEffect } from 'react';

export const useOnClickOutside = (
  /* eslint-disable @typescript-eslint/no-explicit-any */
  ref: any,
  handler: any,
  secondaryRef: any = undefined
  /* eslint-enable @typescript-eslint/no-explicit-any */
) => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const listener = (event: any) => {
      if (!ref?.current || ref?.current?.contains(event.target)) {
        return;
      }

      if (
        typeof secondaryRef !== 'undefined' &&
        (!secondaryRef?.current ||
          secondaryRef?.current?.contains(event.target))
      ) {
        return;
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, secondaryRef, handler]);
};
