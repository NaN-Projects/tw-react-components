import { ComponentProps, FC, ForwardedRef } from 'react';
import { Controller, ControllerRenderProps, useFormContext } from 'react-hook-form';
import { Validate } from 'react-hook-form/dist/types/validator';

import {
  DateTimeInput,
  DateTimeInputProps,
  DateTimeInputType,
  SelectInput,
  SelectInputProps,
  SelectInputType,
} from './custom';
import {
  BasicInputProps,
  CheckboxInput,
  CheckboxInputProps,
  InputType,
  NumberInput,
  NumberInputProps,
  TextInput,
  TextInputProps,
  TextareaInput,
  TextareaInputProps,
} from './primitive';

export type WithFormProps<
  Type extends InputType | SelectInputType,
  Props = Type extends DateTimeInputType
    ? DateTimeInputProps
    : Type extends SelectInputType
    ? SelectInputProps
    : Omit<BasicInputProps<Type>, 'type'>
> = {
  name: string;
  pattern?: RegExp;
  validate?: Type extends 'number'
    ? Validate<number>
    : Type extends DateTimeInputType
    ? Validate<Date>
    : Type extends SelectInputType
    ? Validate<any>
    : Validate<string>;
} & Omit<Props, 'pattern' | keyof ControllerRenderProps>;

function withForm<
  Type extends InputType | SelectInputType,
  Props = Type extends DateTimeInputType
    ? DateTimeInputProps
    : Type extends SelectInputType
    ? SelectInputProps
    : BasicInputProps<Type>
>(type: Type, Component: FC<Props>): FC<WithFormProps<Type, Props>> {
  return ({ name, pattern, validate, ...props }) => {
    const { control } = useFormContext();

    return (
      <Controller
        name={name}
        control={control}
        rules={{
          required: (props as ComponentProps<'input'>).required,
          min: (props as ComponentProps<'input'>).min,
          max: (props as ComponentProps<'input'>).max,
          minLength: (props as ComponentProps<'input'>).minLength,
          maxLength: (props as ComponentProps<'input'>).maxLength,
          pattern,
          validate,
        }}
        render={({ field, fieldState }) => (
          <Component
            {...(props as unknown as Props)}
            {...field}
            value={field.value ?? ''}
            hasErrors={fieldState.error}
          />
        )}
      />
    );
  };
}

export const FormInputs = {
  Text: withForm<'text', TextInputProps>('text', TextInput),
  Textarea: withForm<'textarea', TextareaInputProps>('textarea', TextareaInput),
  Number: withForm<'number', NumberInputProps>('number', NumberInput),
  Checkbox: withForm<'checkbox', CheckboxInputProps>('checkbox', CheckboxInput),
  DateTime: withForm<'datetime-local', DateTimeInputProps>('datetime-local', DateTimeInput),
  Select: withForm<'select', SelectInputProps>('select', SelectInput) as <T>(
    props: WithFormProps<'select', SelectInputProps<T>> & { ref?: ForwardedRef<HTMLDivElement> }
  ) => JSX.Element,
};
