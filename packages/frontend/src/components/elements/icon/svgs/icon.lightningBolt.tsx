import { IconSvgBase } from '../icon.svgBase';

interface IconElementProps {
  className?: string;
}

export const IconLightningBolt = ({
  className = '',
}: IconElementProps): JSX.Element => {
  return (
    <IconSvgBase className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </IconSvgBase>
  );
};
