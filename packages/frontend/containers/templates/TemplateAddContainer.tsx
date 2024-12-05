import { handleTemplateAdd } from '$actions/template/handleTemplateAdd';
import { settingsPaths } from '$constants/settings-paths';
import { SettingsLayout } from '$features/settings/SettingsLayout';
import { TemplateForm } from '$features/template/TemplateForm';

export const TemplateAddContainer = () => {
  return (
    <SettingsLayout title="Add Template" backLink={settingsPaths.templates}>
      <TemplateForm onSubmit={handleTemplateAdd} submitLabel="Add" />
    </SettingsLayout>
  );
};
