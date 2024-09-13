import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { useDispatch } from 'react-redux';

import { ToastMessageTypes } from '$blocks/toast/toast';
import {
  addToastMessage,
  removeToastMessage,
} from '$reducer/notifications.reducer';

export type DefaultFormActionHandler = (
  prevState: DefaultFormAction,
  newAccountData: FormData,
) => Promise<DefaultFormAction>;

export type DefaultFormAction = {
  status?: string;
  errors?: string[];
};

export const useFinancerFormState = (
  formName: string,
  submitHandler: DefaultFormActionHandler,
) => {
  const dispatch = useDispatch();
  const [state, action] = useFormState(submitHandler, {});

  useEffect(() => {
    const errors = state.errors;

    if (!errors?.length) return;

    dispatch(
      addToastMessage({
        type: ToastMessageTypes.ERROR,
        message: 'Submission failed',
        additionalInformation: errors,
        id: formName,
      }),
    );

    return () => {
      dispatch(removeToastMessage(formName));
    };
  }, [dispatch, state, formName]);

  return action;
};
