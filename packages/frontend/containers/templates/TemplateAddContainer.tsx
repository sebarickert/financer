import { handleTemplateAdd } from '$actions/template/handleTemplateAdd';
import { settingsPaths } from '$constants/settings-paths';
import { TemplateForm } from '$features/template/TemplateForm';
import { Layout } from '$layouts/Layout';

export const TemplateAddContainer = () => {
  return (
    <Layout title="Add Template" backLink={settingsPaths.templates}>
      <TemplateForm onSubmit={handleTemplateAdd} submitLabel="Add" />
    </Layout>
  );
};
