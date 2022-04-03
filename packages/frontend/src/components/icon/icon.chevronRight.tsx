import { IconSvgBase } from './icon.svgBase';

interface IconElementProps {
  className?: string;
}

export const IconChevronRight = ({
  className = '',
}: IconElementProps): JSX.Element => {
  return (
    <IconSvgBase className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </IconSvgBase>
  );
};
