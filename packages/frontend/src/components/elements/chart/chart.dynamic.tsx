import dynamic from 'next/dynamic';

export const ChartDynamic = dynamic(() => import('./chart'));
