'use client';

import {
  apply as applyHtmlInvokerPolyfill,
  isSupported as isHtmlInvokersSupported,
} from 'invokers-polyfill/fn';
import { FC } from 'react';

import { isServerSide } from '@/utils/isServerSide';

if (!isServerSide() && !isHtmlInvokersSupported()) {
  applyHtmlInvokerPolyfill();
}

export const PolyfillProvider: FC = () => {
  return null;
};
