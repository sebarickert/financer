import { handleTemplateAdd } from '$actions/template/handleTemplateAdd';
import { TemplateForm } from '$blocks/TemplateForm';
import { settingsPaths } from '$constants/settings-paths';
import { Layout } from '$layouts/Layout';

export const TemplateAddContainer = () => {
  return (
    <Layout title="Add Template" backLink={settingsPaths.templates}>
      <TemplateForm onSubmit={handleTemplateAdd} submitLabel="Add" />
    </Layout>
  );
};
