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
      <div
        className={`bg-blue-financer text-center fixed top-0 left-0 right-0 z-50 grid items-center ${
          backLink ? 'grid-cols-[44px,1fr,44px]' : 'grid-cols-1'
        }`}
      >
        {backLink && (
          <NavLink
            to={backLink}
            className="h-11 w-11 inline-flex items-center justify-center"
          >
            <span className="sr-only">Go back</span>
            <Icon type={'chevron-left'} className="stroke-white" />
          </NavLink>
        )}
        <Heading
          variant="h1"
          className={`!text-base !tracking-tight !text-white !font-semibold !block py-3 truncate`}
        >
          {title ?? children}
        </Heading>
      </div>
      <Helmet onChangeClientState={onHelmetChange} />
    </>
  );
};
