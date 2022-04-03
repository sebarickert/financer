import { IconSvgBase } from './icon.svgBase';

interface IconElementProps {
  className?: string;
}

export const IconChevronLeft = ({
  className = '',
}: IconElementProps): JSX.Element => {
  return (
    <IconSvgBase className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </IconSvgBase>
  );
};
