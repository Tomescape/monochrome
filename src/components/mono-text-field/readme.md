# mono-text-field

<!-- Auto Generated Below -->

## Overview

A customizable text field component with label, error states, and input masking support.
Supports patterns like phone numbers, dates, SSN, and custom formats.

## Properties

| Property         | Attribute          | Description                                                                                                                                                                                                                           | Type                             | Default     |
| ---------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ----------- |
| `alwaysShowMask` | `always-show-mask` | Whether to always show the mask pattern (even when typing)                                                                                                                                                                            | `boolean`                        | `false`     |
| `autocomplete`   | `autocomplete`     | Autocomplete attribute for the input                                                                                                                                                                                                  | `string`                         | `undefined` |
| `disabled`       | `disabled`         | Whether the field is disabled                                                                                                                                                                                                         | `boolean`                        | `false`     |
| `error`          | `error`            | Whether the field is in an error state                                                                                                                                                                                                | `boolean`                        | `false`     |
| `errorMessage`   | `error-message`    | Error message to display below the field                                                                                                                                                                                              | `string`                         | `undefined` |
| `inputId`        | `input-id`         | Custom ID for the input element (auto-generated if not provided)                                                                                                                                                                      | `string`                         | `undefined` |
| `label`          | `label`            | The label text for the text field                                                                                                                                                                                                     | `string`                         | `undefined` |
| `mask`           | `mask`             | Input mask pattern. Supported characters: - 9: Numeric digit (0-9) - A: Alphabetic character (a-z, A-Z) - \*: Alphanumeric (a-z, A-Z, 0-9) - Any other character: Literal (auto-inserted) Example: "(999) 999-9999" for phone numbers | `string`                         | `undefined` |
| `maxlength`      | `maxlength`        | Maximum length for the input                                                                                                                                                                                                          | `number`                         | `undefined` |
| `name`           | `name`             | The name attribute for the input element (useful for forms)                                                                                                                                                                           | `string`                         | `undefined` |
| `placeholder`    | `placeholder`      | Placeholder text when the field is empty                                                                                                                                                                                              | `string`                         | `undefined` |
| `readonly`       | `readonly`         | Whether the field is readonly                                                                                                                                                                                                         | `boolean`                        | `false`     |
| `required`       | `required`         | Whether the field is required                                                                                                                                                                                                         | `boolean`                        | `false`     |
| `showMask`       | `show-mask`        | Whether to show the mask pattern as placeholder                                                                                                                                                                                       | `boolean`                        | `false`     |
| `size`           | `size`             | Size variant of the text field                                                                                                                                                                                                        | `"large" \| "medium" \| "small"` | `'medium'`  |
| `type`           | `type`             | Input type (text, email, password, etc.)                                                                                                                                                                                              | `string`                         | `'text'`    |
| `unmask`         | `unmask`           | Whether to return unmasked value (without formatting characters)                                                                                                                                                                      | `boolean`                        | `false`     |
| `value`          | `value`            | The current value of the text field                                                                                                                                                                                                   | `string`                         | `''`        |

## Events

| Event        | Description                                          | Type                                    |
| ------------ | ---------------------------------------------------- | --------------------------------------- |
| `monoBlur`   | Emitted when the input loses focus                   | `CustomEvent<MonoTextFieldEventDetail>` |
| `monoChange` | Emitted when the input value changes and loses focus | `CustomEvent<MonoTextFieldEventDetail>` |
| `monoFocus`  | Emitted when the input gains focus                   | `CustomEvent<MonoTextFieldEventDetail>` |
| `monoInput`  | Emitted when the input value changes                 | `CustomEvent<MonoTextFieldEventDetail>` |

## Slots

| Slot | Description                                                |
| ---- | ---------------------------------------------------------- |
|      | The default slot is not used (input is managed internally) |

---

_Built with [StencilJS](https://stenciljs.com/)_
