import type { Meta, StoryObj } from '@storybook/web-components';

interface MonoTextFieldArgs {
  label?: string;
  value?: string;
  placeholder?: string;
  name?: string;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  required?: boolean;
  size?: 'small' | 'medium' | 'large';
  mask?: string;
  showMask?: boolean;
  alwaysShowMask?: boolean;
  unmask?: boolean;
  inputId?: string;
  maxlength?: number;
  type?: string;
  readonly?: boolean;
  autocomplete?: string;
}

const meta: Meta<MonoTextFieldArgs> = {
  title: 'Components/MonoTextField',
  component: 'mono-text-field',
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'The label text for the text field',
    },
    value: {
      control: 'text',
      description: 'The current value of the text field',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when the field is empty',
    },
    name: {
      control: 'text',
      description: 'The name attribute for the input element',
    },
    error: {
      control: 'boolean',
      description: 'Whether the field is in an error state',
    },
    errorMessage: {
      control: 'text',
      description: 'Error message to display below the field',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the field is disabled',
    },
    required: {
      control: 'boolean',
      description: 'Whether the field is required',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size variant of the text field',
    },
    mask: {
      control: 'text',
      description: 'Input mask pattern (9=digit, A=letter, *=alphanumeric)',
    },
    showMask: {
      control: 'boolean',
      description: 'Whether to show the mask pattern as placeholder',
    },
    alwaysShowMask: {
      control: 'boolean',
      description: 'Whether to always show the mask pattern',
    },
    unmask: {
      control: 'boolean',
      description: 'Whether to return unmasked value in events',
    },
    inputId: {
      control: 'text',
      description: 'Custom ID for the input element',
    },
    maxlength: {
      control: 'number',
      description: 'Maximum length for the input',
    },
    type: {
      control: 'text',
      description: 'Input type (text, email, password, etc.)',
    },
    readonly: {
      control: 'boolean',
      description: 'Whether the field is readonly',
    },
    autocomplete: {
      control: 'text',
      description: 'Autocomplete attribute for the input',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A customizable text field component with label, error states, and input masking support. ' + 'Supports patterns like phone numbers, dates, SSN, and custom formats.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<MonoTextFieldArgs>;

const createTextField = (args: MonoTextFieldArgs) => {
  const textField = document.createElement('mono-text-field');

  if (args.label !== undefined) textField.setAttribute('label', args.label);
  if (args.value !== undefined) textField.setAttribute('value', args.value);
  if (args.placeholder !== undefined) textField.setAttribute('placeholder', args.placeholder);
  if (args.name !== undefined) textField.setAttribute('name', args.name);
  if (args.error !== undefined) textField.setAttribute('error', String(args.error));
  if (args.errorMessage !== undefined) textField.setAttribute('error-message', args.errorMessage);
  if (args.disabled !== undefined) textField.setAttribute('disabled', String(args.disabled));
  if (args.required !== undefined) textField.setAttribute('required', String(args.required));
  if (args.size !== undefined) textField.setAttribute('size', args.size);
  if (args.mask !== undefined) textField.setAttribute('mask', args.mask);
  if (args.showMask !== undefined) textField.setAttribute('show-mask', String(args.showMask));
  if (args.alwaysShowMask !== undefined) textField.setAttribute('always-show-mask', String(args.alwaysShowMask));
  if (args.unmask !== undefined) textField.setAttribute('unmask', String(args.unmask));
  if (args.inputId !== undefined) textField.setAttribute('input-id', args.inputId);
  if (args.maxlength !== undefined) textField.setAttribute('maxlength', String(args.maxlength));
  if (args.type !== undefined) textField.setAttribute('type', args.type);
  if (args.readonly !== undefined) textField.setAttribute('readonly', String(args.readonly));
  if (args.autocomplete !== undefined) textField.setAttribute('autocomplete', args.autocomplete);

  return textField;
};

/**
 * Default text field with label and placeholder
 */
export const Default: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter your username',
    name: 'username',
    size: 'medium',
  },
  render: args => createTextField(args),
};

/**
 * Size variants: small, medium, and large
 */
export const SizeVariants: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '1rem';

    const small = createTextField({ label: 'Small', placeholder: 'Small text field', size: 'small' });
    const medium = createTextField({ label: 'Medium', placeholder: 'Medium text field', size: 'medium' });
    const large = createTextField({ label: 'Large', placeholder: 'Large text field', size: 'large' });

    container.appendChild(small);
    container.appendChild(medium);
    container.appendChild(large);

    return container;
  },
};

/**
 * Error state with error message
 */
export const ErrorState: Story = {
  args: {
    label: 'Email',
    value: 'invalid-email',
    error: true,
    errorMessage: 'Please enter a valid email address',
    name: 'email',
  },
  render: args => createTextField(args),
};

/**
 * Required field with asterisk indicator
 */
export const Required: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    type: 'password',
    required: true,
    name: 'password',
  },
  render: args => createTextField(args),
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    label: 'Disabled Field',
    value: 'Cannot edit this',
    disabled: true,
  },
  render: args => createTextField(args),
};

/**
 * Readonly state
 */
export const Readonly: Story = {
  args: {
    label: 'Readonly Field',
    value: 'Read-only value',
    readonly: true,
  },
  render: args => createTextField(args),
};

/**
 * Phone number mask with auto-formatting
 */
export const PhoneNumberMask: Story = {
  args: {
    label: 'Phone Number',
    mask: '(999) 999-9999',
    showMask: true,
    placeholder: 'Enter your phone number',
    name: 'phone',
  },
  render: args => createTextField(args),
};

/**
 * Date mask (MM/DD/YYYY)
 */
export const DateMask: Story = {
  args: {
    label: 'Date of Birth',
    mask: '99/99/9999',
    showMask: true,
    placeholder: 'MM/DD/YYYY',
    name: 'dob',
  },
  render: args => createTextField(args),
};

/**
 * Social Security Number mask
 */
export const SSNMask: Story = {
  args: {
    label: 'Social Security Number',
    mask: '999-99-9999',
    showMask: true,
    placeholder: 'Enter SSN',
    name: 'ssn',
  },
  render: args => createTextField(args),
};

/**
 * Credit card mask
 */
export const CreditCardMask: Story = {
  args: {
    label: 'Credit Card Number',
    mask: '9999 9999 9999 9999',
    showMask: true,
    placeholder: 'Enter card number',
    name: 'cardNumber',
  },
  render: args => createTextField(args),
};

/**
 * License plate mask with mixed characters
 */
export const LicensePlateMask: Story = {
  args: {
    label: 'License Plate',
    mask: 'AAA-9999',
    placeholder: 'Enter license plate',
    name: 'licensePlate',
  },
  render: args => createTextField(args),
};

/**
 * Custom alphanumeric mask
 */
export const AlphanumericMask: Story = {
  args: {
    label: 'Product Code',
    mask: '***-***-***',
    placeholder: 'Enter product code',
    name: 'productCode',
  },
  render: args => createTextField(args),
};

/**
 * Mask with unmasked value in events
 */
export const UnmaskedValue: Story = {
  args: {
    label: 'Phone (Unmasked)',
    mask: '(999) 999-9999',
    unmask: true,
    showMask: true,
    placeholder: 'Values will be unmasked',
    name: 'phoneUnmasked',
  },
  render: args => {
    const container = document.createElement('div');
    const textField = createTextField(args);
    const output = document.createElement('div');
    output.style.marginTop = '1rem';
    output.style.padding = '0.5rem';
    output.style.backgroundColor = '#f5f5f5';
    output.style.borderRadius = '4px';
    output.style.fontFamily = 'monospace';
    output.innerHTML = '<strong>Event value:</strong> (type to see unmasked value)';

    textField.addEventListener('monoInput', (e: any) => {
      output.innerHTML = `
        <strong>Event value:</strong> ${e.detail.value}<br>
        <strong>Masked value:</strong> ${e.detail.maskedValue}
      `;
    });

    container.appendChild(textField);
    container.appendChild(output);

    return container;
  },
};

/**
 * Always show mask pattern
 */
export const AlwaysShowMask: Story = {
  args: {
    label: 'Phone (Always Show Mask)',
    mask: '(999) 999-9999',
    alwaysShowMask: true,
    placeholder: 'Mask is always visible',
    name: 'phoneAlwaysShow',
  },
  render: args => createTextField(args),
};

/**
 * Form integration example
 */
export const FormIntegration: Story = {
  render: () => {
    const container = document.createElement('div');
    container.innerHTML = `
      <form id="demo-form" style="display: flex; flex-direction: column; gap: 1rem; max-width: 400px;">
        <h3 style="margin: 0 0 0.5rem 0;">Registration Form</h3>
      </form>
      <div id="form-output" style="margin-top: 1rem; padding: 1rem; background: #f5f5f5; border-radius: 4px; font-family: monospace; display: none;">
        <strong>Form Data:</strong>
        <pre id="output-content" style="margin: 0.5rem 0 0 0;"></pre>
      </div>
    `;

    const form = container.querySelector('#demo-form') as HTMLFormElement;
    const output = container.querySelector('#form-output') as HTMLElement;
    const outputContent = container.querySelector('#output-content') as HTMLElement;

    const firstName = createTextField({ label: 'First Name', placeholder: 'Enter first name', name: 'firstName', required: true });
    const lastName = createTextField({ label: 'Last Name', placeholder: 'Enter last name', name: 'lastName', required: true });
    const email = createTextField({ label: 'Email', type: 'email', placeholder: 'Enter email', name: 'email', required: true, autocomplete: 'email' });
    const phone = createTextField({ label: 'Phone Number', mask: '(999) 999-9999', showMask: true, name: 'phone', required: true });

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.textContent = 'Submit';
    submitBtn.style.padding = '0.75rem 1.5rem';
    submitBtn.style.backgroundColor = '#0066cc';
    submitBtn.style.color = 'white';
    submitBtn.style.border = 'none';
    submitBtn.style.borderRadius = '4px';
    submitBtn.style.cursor = 'pointer';
    submitBtn.style.fontSize = '1rem';

    form.appendChild(firstName);
    form.appendChild(lastName);
    form.appendChild(email);
    form.appendChild(phone);
    form.appendChild(submitBtn);

    form.addEventListener('submit', e => {
      e.preventDefault();
      const formData: any = {};

      [firstName, lastName, email, phone].forEach(field => {
        const name = field.getAttribute('name');
        const value = field.getAttribute('value') || '';
        if (name) formData[name] = value;
      });

      output.style.display = 'block';
      outputContent.textContent = JSON.stringify(formData, null, 2);
    });

    return container;
  },
};

/**
 * Event logger to demonstrate all events
 */
export const EventLogger: Story = {
  render: () => {
    const container = document.createElement('div');
    const textField = createTextField({ label: 'Type to see events', placeholder: 'Start typing...', name: 'eventDemo' });

    const eventLog = document.createElement('div');
    eventLog.style.marginTop = '1rem';
    eventLog.style.padding = '1rem';
    eventLog.style.backgroundColor = '#f5f5f5';
    eventLog.style.borderRadius = '4px';
    eventLog.style.maxHeight = '300px';
    eventLog.style.overflowY = 'auto';
    eventLog.innerHTML = '<strong>Event Log:</strong>';

    const logList = document.createElement('ul');
    logList.style.listStyle = 'none';
    logList.style.padding = '0';
    logList.style.margin = '0.5rem 0 0 0';
    logList.style.fontFamily = 'monospace';
    logList.style.fontSize = '0.875rem';

    eventLog.appendChild(logList);

    const logEvent = (eventName: string, detail: any) => {
      const logItem = document.createElement('li');
      logItem.style.padding = '0.25rem 0';
      logItem.style.borderBottom = '1px solid #ddd';
      const timestamp = new Date().toLocaleTimeString();
      logItem.innerHTML = `<strong>${timestamp}</strong> - ${eventName}: ${JSON.stringify(detail)}`;
      logList.insertBefore(logItem, logList.firstChild);

      if (logList.children.length > 10) {
        logList.removeChild(logList.lastChild as Node);
      }
    };

    textField.addEventListener('monoInput', (e: any) => logEvent('monoInput', e.detail));
    textField.addEventListener('monoChange', (e: any) => logEvent('monoChange', e.detail));
    textField.addEventListener('monoFocus', (e: any) => logEvent('monoFocus', e.detail));
    textField.addEventListener('monoBlur', (e: any) => logEvent('monoBlur', e.detail));

    container.appendChild(textField);
    container.appendChild(eventLog);

    return container;
  },
};

/**
 * Multiple text fields showing different configurations
 */
export const Showcase: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '1.5rem';
    container.style.maxWidth = '600px';

    const configs = [
      { label: 'Username', placeholder: 'Enter username', name: 'username', required: true },
      { label: 'Email', type: 'email', placeholder: 'Enter email', name: 'email', required: true },
      { label: 'Phone', mask: '(999) 999-9999', showMask: true, name: 'phone' },
      { label: 'Date of Birth', mask: '99/99/9999', showMask: true, name: 'dob' },
      { label: 'SSN', mask: '999-99-9999', showMask: true, name: 'ssn' },
      { label: 'Disabled Field', value: 'Cannot edit', disabled: true },
      { label: 'Error Example', value: 'bad@email', error: true, errorMessage: 'Invalid email format' },
    ];

    configs.forEach(config => {
      container.appendChild(createTextField(config as MonoTextFieldArgs));
    });

    return container;
  },
};

/**
 * Theming example with CSS custom properties
 */
export const Theming: Story = {
  render: () => {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '2rem';

    const defaultTheme = document.createElement('div');
    defaultTheme.innerHTML = '<h4 style="margin: 0 0 1rem 0;">Default Theme</h4>';
    defaultTheme.appendChild(createTextField({ label: 'Default Theme', placeholder: 'Default colors', value: 'Sample text' }));

    const customTheme = document.createElement('div');
    customTheme.innerHTML = '<h4 style="margin: 0 0 1rem 0;">Custom Theme</h4>';
    customTheme.style.setProperty('--mono-text-field-focus-border', '#9333ea');
    customTheme.style.setProperty('--mono-text-field-focus-shadow', 'rgba(147, 51, 234, 0.2)');
    customTheme.style.setProperty('--mono-text-field-label-color', '#7c3aed');
    const customField = createTextField({ label: 'Custom Theme', placeholder: 'Purple colors', value: 'Sample text' });
    customTheme.appendChild(customField);

    const darkTheme = document.createElement('div');
    darkTheme.innerHTML = '<h4 style="margin: 0 0 1rem 0; color: #e0e0e0;">Dark Theme</h4>';
    darkTheme.style.padding = '1rem';
    darkTheme.style.backgroundColor = '#1a1a1a';
    darkTheme.style.borderRadius = '8px';
    darkTheme.style.setProperty('--mono-text-field-label-color', '#e0e0e0');
    darkTheme.style.setProperty('--mono-text-field-input-bg', '#2a2a2a');
    darkTheme.style.setProperty('--mono-text-field-input-border', '#4a4a4a');
    darkTheme.style.setProperty('--mono-text-field-input-text', '#e0e0e0');
    darkTheme.style.setProperty('--mono-text-field-focus-border', '#4d9fff');
    darkTheme.style.setProperty('--mono-text-field-focus-shadow', 'rgba(77, 159, 255, 0.3)');
    const darkField = createTextField({ label: 'Dark Theme', placeholder: 'Dark colors', value: 'Sample text' });
    darkTheme.appendChild(darkField);

    container.appendChild(defaultTheme);
    container.appendChild(customTheme);
    container.appendChild(darkTheme);

    return container;
  },
};
