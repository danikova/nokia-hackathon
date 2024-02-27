import { pb } from '@/@data/client';
import { rootRouter } from '../router';
import { MutableRefObject, useContext, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  EditorHistoryContext,
  EditorHistoryStateContext,
  FormFieldContext,
  FormItemContext,
} from './contexts';

export function useOutsideClickObserver(
  ref: MutableRefObject<any>,
  onNotClick: (event: MouseEvent) => void,
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target)) {
        onNotClick(event);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, onNotClick]);
}

export function useLogout() {
  return () => {
    pb.authStore.clear();
    rootRouter.invalidate();
  };
}

export const useFormField = () => {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

export function useEditorHistoryState(): EditorHistoryStateContext {
  return useContext(EditorHistoryContext);
}
