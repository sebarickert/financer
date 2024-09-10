'use client';

import { useDispatch } from 'react-redux';

import { useTransactionTemplatesCreateMutation } from '$api/generated/financerApi';
import { ToastMessageTypes } from '$blocks/toast/toast';
import { settingsPaths } from '$constants/settings-paths';
import { useViewTransitionRouter } from '$hooks/useViewTransitionRouter';
import { addToastMessage } from '$reducer/notifications.reducer';
import { clearTransactionTemplateCache } from '$ssr/api/clear-cache';
import { parseErrorMessagesToArray } from '$utils/apiHelper';
import {
  TemplateAdd,
  CreateTransactionTemplateDtoWithCategory,
} from '$views/settings/templates/template.add';

export const TemplateAddContainer = () => {
  const { push } = useViewTransitionRouter();

  const [addTransactionTemplate] = useTransactionTemplatesCreateMutation();
  const dispatch = useDispatch();

  const handleSubmit = async (
    newTransactionTemplateData: CreateTransactionTemplateDtoWithCategory,
  ) => {
    const data = {
      ...newTransactionTemplateData,
      templateType: [newTransactionTemplateData.templateType],
      categories: newTransactionTemplateData.categories?.map(
        ({ categoryId }) => categoryId,
      ),
    };

    try {
      await addTransactionTemplate({
        createTransactionTemplateDto: data,
      }).unwrap();
      await clearTransactionTemplateCache();

      push(settingsPaths.templates);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.status === 400 || error.status === 404) {
        dispatch(
          addToastMessage({
            type: ToastMessageTypes.ERROR,
            message: 'Submission failed',
            additionalInformation: parseErrorMessagesToArray(
              error?.data?.message,
            ),
          }),
        );
        return;
      }

      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  return <TemplateAdd onSubmit={handleSubmit} />;
};
