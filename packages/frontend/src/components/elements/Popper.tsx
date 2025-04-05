'use client';

import { useClickAway } from '@uidotdev/usehooks';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { FC, ReactNode, useEffect, useId, useState } from 'react';

import { Button, ButtonAccentColor } from '@/elements/Button/Button';

interface PopperProps {
  className?: string;
  children: ReactNode;
  popperButton: {
    isPill?: boolean;
    content: ReactNode;
    accentColor?: ButtonAccentColor;
    size?: 'default' | 'small' | 'icon';
  };
}

export const Popper: FC<PopperProps> = ({ children, popperButton }) => {
  const popperId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const buttonId = useId();
  const pathname = usePathname();

  const ref = useClickAway<HTMLDivElement>(({ target }) => {
    if ((target as HTMLElement | null)?.getAttribute('id') === buttonId) return;
    setIsOpen(false);
  });

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block">
      <Button
        accentColor={popperButton.accentColor}
        size={popperButton.size}
        aria-expanded={isOpen}
        aria-controls={popperId}
        aria-haspopup="true"
        testId="popper-button"
        isPill={popperButton.isPill}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        id={buttonId}
      >
        {popperButton.content}
      </Button>
      <div
        aria-hidden={!isOpen}
        id={popperId}
        ref={ref}
        data-testid="popper-container"
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsOpen(false);
          }
        }}
        className={clsx(
          'transition-discrete transition-all',
          'starting:opacity-0 starting:-translate-y-4',
          'aria-hidden:hidden aria-hidden:opacity-0',
          'min-w-[8rem] overflow-hidden rounded-md p-1 shadow-md w-56',
          'border bg-layer',
          'absolute z-10 top-[calc(100%+var(--spacing))] right-0',
        )}
      >
        {children}
      </div>
    </div>
  );
};
