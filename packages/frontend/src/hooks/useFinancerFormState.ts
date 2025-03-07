import { useActionState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { ToastMessageTypes } from '@/blocks/Toast/Toast';
import {
  addToastMessage,
  removeToastMessage,
} from '@/reducer/notifications.reducer';

export type DefaultFormActionHandler<T = undefined> = T extends undefined
  ? (
      prevState: DefaultFormAction,
      formData: FormData,
    ) => Promise<DefaultFormAction>
  : (
      bindData: T,
      prevState: DefaultFormAction,
      formData: FormData,
    ) => Promise<DefaultFormAction>;

export type DefaultFormAction =
  | {
      status: 'ERROR';
      errors: string[];
    }
  | {
      status: 'OK';
      errors?: never;
    }
  | {
      status?: never;
      errors?: never;
    };

export const useFinancerFormState = (
  formName: string,
  submitHandler: DefaultFormActionHandler,
  okHandler?: () => void,
) => {
  const dispatch = useDispatch();
  const [state, action] = useActionState(submitHandler, {});

  useEffect(() => {
    const { errors } = state;

    if (state.status === 'OK' && okHandler) {
      okHandler();
    }

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
  }, [dispatch, state, formName, okHandler]);

  return action;
};
