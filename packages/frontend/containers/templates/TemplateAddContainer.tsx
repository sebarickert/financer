import { handleTemplateAdd } from '$actions/template/handleTemplateAdd';
import { settingsPaths } from '$constants/settings-paths';
import { Layout } from '$layouts/Layout';
import { TemplateForm } from '$modules/template/TemplateForm';

export const TemplateAddContainer = () => {
  return (
    <Layout title="Add Template" backLink={settingsPaths.templates}>
      <TemplateForm onSubmit={handleTemplateAdd} submitLabel="Add" />
    </Layout>
  );
};
