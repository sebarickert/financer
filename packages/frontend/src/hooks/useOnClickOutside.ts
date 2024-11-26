import { RefObject, useEffect, useMemo } from 'react';

type EventType = TouchEvent | MouseEvent;

export const useOnClickOutside = (
  ref: RefObject<HTMLElement | null> | RefObject<HTMLElement | null>[],
  handler: (event: EventType) => void,
) => {
  const refArray = useMemo(() => (Array.isArray(ref) ? ref : [ref]), [ref]);

  useEffect(() => {
    const listener = (event: EventType) => {
      if (
        refArray.some(
          (currentRef) =>
            !currentRef.current ||
            currentRef.current?.contains(event.target as Node),
        )
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
  }, [handler, refArray]);
};
