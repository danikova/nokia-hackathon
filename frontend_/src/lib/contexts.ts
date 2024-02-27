import { createContext } from 'react';
import { FieldPath, FieldValues } from 'react-hook-form';
import { HistoryState } from '@lexical/react/LexicalHistoryPlugin';

export type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

export const FormFieldContext = createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

export type FormItemContextValue = {
  id: string;
};

export const FormItemContext = createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

export type EditorHistoryStateContext = {
  historyState?: HistoryState;
};

export const EditorHistoryContext = createContext<EditorHistoryStateContext>(
  {}
);
