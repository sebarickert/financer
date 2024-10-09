import * as HeroIconsOutline from '@heroicons/react/24/outline';
import * as HeroIconsSolid from '@heroicons/react/24/solid';
import clsx from 'clsx';
import { FC } from 'react';

export type IconName =
  | keyof typeof HeroIconsSolid
  | keyof typeof HeroIconsOutline;

type IconProps = {
  name: IconName;
  className?: string;
  isSolid?: boolean;
};

export const Icon: FC<IconProps> = ({ name, className = '', isSolid }) => {
  const iconClasses = clsx('h-6 w-6', className);

  const IconComponent = isSolid ? HeroIconsSolid[name] : HeroIconsOutline[name];

  return <IconComponent className={iconClasses} />;
};
