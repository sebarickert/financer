import { IconSvgBase } from '../icon.svgBase';

interface IconElementProps {
  className?: string;
}

export const IconDotsHorizontal = ({
  className = '',
}: IconElementProps): JSX.Element => {
  return (
    <IconSvgBase className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
      />
    </IconSvgBase>
  );
};
