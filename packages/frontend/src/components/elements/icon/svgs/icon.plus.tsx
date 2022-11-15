import { IconSvgBase } from '../icon.svgBase';

interface IconElementProps {
  className?: string;
}

export const IconPlus = ({ className = '' }: IconElementProps): JSX.Element => {
  return (
    <IconSvgBase className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 4v16m8-8H4"
      />
    </IconSvgBase>
  );
};
