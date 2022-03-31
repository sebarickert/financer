import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { NavLink } from 'react-router-dom';

import { Heading } from '../heading/heading';
import { Icon } from '../icon/icon';

interface MobileHeaderProps {
  children?: string;
}

export const MobileHeader = ({
  children = 'Title not found',
}: MobileHeaderProps): JSX.Element => {
  const [title, setTitle] = useState('');
  const [backLink, setBackLink] = useState('');

  const onHelmetChange = ({
    title: helmetTitle,
    metaTags,
  }: {
    title: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metaTags: any;
  }) => {
    const backLinkString = metaTags.filter(
      ({ name }: { name: string }) => name === 'back-link'
    )[0]?.content;

    setBackLink(backLinkString ?? '');
    setTitle(helmetTitle[0]);
  };

  return (
    <>
      <div className="bg-blue-financer text-center py-4 px-6 fixed top-0 left-0 right-0 z-50">
        {backLink && (
          <NavLink
            to={backLink}
            className="absolute left-6 top-1/2 -translate-y-1/2 -translate-x-1/2 h-11 w-11 items-center justify-center inline-flex"
          >
            <span className="sr-only">Go back</span>
            <Icon type={'chevron-left'} className="stroke-white" />
          </NavLink>
        )}
        <Heading
          variant="h1"
          className="!text-lg !tracking-tight !text-white !font-semibold !block"
        >
          {title ?? children}
        </Heading>
      </div>
      <Helmet onChangeClientState={onHelmetChange} />
    </>
  );
};
