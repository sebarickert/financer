import { IconSvgBase } from './icon.svgBase';

interface IconElementProps {
  className?: string;
}

export const IconLibrary = ({
  className = '',
}: IconElementProps): JSX.Element => {
  return (
    <IconSvgBase className={className}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
      />
    </IconSvgBase>
  );
};
