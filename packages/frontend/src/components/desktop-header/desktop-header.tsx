import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { NavLink } from 'react-router-dom';

import { Heading } from '../heading/heading';
import { Icon } from '../icon/icon';

interface DesktopHeaderProps {
  children?: string;
}

export const DesktopHeader = ({
  children = 'Title not found',
}: DesktopHeaderProps): JSX.Element => {
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
      <div className="mb-6 flex items-center gap-2">
        {backLink && (
          <NavLink
            to={backLink}
            className="h-11 w-11 inline-flex items-center justify-center -ml-4"
          >
            <span className="sr-only">Go back</span>
            <Icon type={'chevron-left'} className="stroke-gray-300" />
          </NavLink>
        )}
        <Heading variant="h1">{title ?? children}</Heading>
      </div>
      <Helmet onChangeClientState={onHelmetChange} />
    </>
  );
};
