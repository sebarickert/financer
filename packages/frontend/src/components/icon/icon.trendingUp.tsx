import { IconSvgBase } from './icon.svgBase';

interface IconElementProps {
  className?: string;
}

export const IconTrendingUp = ({
  className = '',
}: IconElementProps): JSX.Element => {
  return (
    <IconSvgBase className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
      />
    </IconSvgBase>
  );
};
