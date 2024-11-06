import clsx from 'clsx';
import { FC } from 'react';

import { settingsPaths } from '$constants/settings-paths';
import { Icon } from '$elements/Icon';
import { Link } from '$elements/Link';
import { TemplateList } from '$features/template/TemplateList';
import { Layout } from '$layouts/Layout';
import { TransactionTemplateService } from '$ssr/api/transaction-template.service';

export const TemplateListingContainer: FC = async () => {
  const templates = await TransactionTemplateService.getAll();

  return (
    <Layout
      title="Templates"
      backLink={settingsPaths.default}
      headerAction={
        <Link
          href={`${settingsPaths.templates}/add`}
          className={clsx(
            'theme-layer-color-with-hover theme-focus rounded-md',
            'inline-flex items-center justify-center h-11 w-11',
          )}
          testId="add-template"
        >
          <span className="sr-only">Add template</span>
          <Icon name="PlusIcon" />
        </Link>
      }
    >
      <TemplateList templates={templates} />
    </Layout>
  );
};
