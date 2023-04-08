import { useTransactionTemplatesFindAllByUserQuery } from '$api/generated/financerApi';
import { DataHandler } from '$blocks/data-handler/data-handler';
import { TemplateListing } from '$pages/profile/templates/template-listing';

export const TemplateListingContainer = () => {
  const data = useTransactionTemplatesFindAllByUserQuery();
  const { data: templates } = data;

  return (
    <>
      <DataHandler {...data} />
      {templates && <TemplateListing templates={templates} />}
    </>
  );
};
