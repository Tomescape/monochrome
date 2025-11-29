import { Component, Host, h, Prop, Event, EventEmitter, State, Watch } from '@stencil/core';
import * as MaskUtils from './mask-utils';

/**
 * Event detail emitted by mono-text-field events
 */
export interface MonoTextFieldEventDetail {
  value: string;
  maskedValue: string;
  name?: string;
}

/**
 * Size variants for the text field
 */
export type MonoTextFieldSize = 'small' | 'medium' | 'large';

/**
 * A customizable text field component with label, error states, and input masking support.
 * Supports patterns like phone numbers, dates, SSN, and custom formats.
 *
 * @slot - The default slot is not used (input is managed internally)
 */
@Component({
  tag: 'mono-text-field',
  styleUrl: 'mono-text-field.css',
  shadow: true,
})
export class MonoTextField {
  private uniqueId: string;

  constructor() {
    this.uniqueId = `mono-text-field-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * The label text for the text field
   */
  @Prop() label?: string;

  /**
   * The current value of the text field
   */
  @Prop({ mutable: true }) value: string = '';

  /**
   * Placeholder text when the field is empty
   */
  @Prop() placeholder?: string;

  /**
   * The name attribute for the input element (useful for forms)
   */
  @Prop() name?: string;

  /**
   * Whether the field is in an error state
   */
  @Prop() error: boolean = false;

  /**
   * Error message to display below the field
   */
  @Prop() errorMessage?: string;

  /**
   * Whether the field is disabled
   */
  @Prop() disabled: boolean = false;

  /**
   * Whether the field is required
   */
  @Prop() required: boolean = false;

  /**
   * Size variant of the text field
   */
  @Prop() size: MonoTextFieldSize = 'medium';

  /**
   * Input mask pattern. Supported characters:
   * - 9: Numeric digit (0-9)
   * - A: Alphabetic character (a-z, A-Z)
   * - *: Alphanumeric (a-z, A-Z, 0-9)
   * - Any other character: Literal (auto-inserted)
   * Example: "(999) 999-9999" for phone numbers
   */
  @Prop() mask?: string;

  /**
   * Whether to show the mask pattern as placeholder
   */
  @Prop() showMask: boolean = false;

  /**
   * Whether to always show the mask pattern (even when typing)
   */
  @Prop() alwaysShowMask: boolean = false;

  /**
   * Whether to return unmasked value (without formatting characters)
   */
  @Prop() unmask: boolean = false;

  /**
   * Custom ID for the input element (auto-generated if not provided)
   */
  @Prop() inputId?: string;

  /**
   * Maximum length for the input
   */
  @Prop() maxlength?: number;

  /**
   * Input type (text, email, password, etc.)
   */
  @Prop() type: string = 'text';

  /**
   * Whether the field is readonly
   */
  @Prop() readonly: boolean = false;

  /**
   * Autocomplete attribute for the input
   */
  @Prop() autocomplete?: string;

  /**
   * Internal state for focus styling
   */
  @State() hasFocus: boolean = false;

  /**
   * Emitted when the input value changes
   */
  @Event() monoInput!: EventEmitter<MonoTextFieldEventDetail>;

  /**
   * Emitted when the input value changes and loses focus
   */
  @Event() monoChange!: EventEmitter<MonoTextFieldEventDetail>;

  /**
   * Emitted when the input gains focus
   */
  @Event() monoFocus!: EventEmitter<MonoTextFieldEventDetail>;

  /**
   * Emitted when the input loses focus
   */
  @Event() monoBlur!: EventEmitter<MonoTextFieldEventDetail>;

  /**
   * Watch for mask changes and re-apply
   */
  @Watch('mask')
  handleMaskChange() {
    if (this.mask && this.value) {
      const masked = MaskUtils.applyMask(this.value, this.mask, this.alwaysShowMask);
      this.value = masked;
    }
  }

  /**
   * Handle input events
   */
  private handleInput = (event: Event) => {
    if (this.disabled || this.readonly) return;

    const input = event.target as HTMLInputElement;
    const oldValue = this.value;
    const oldCursor = input.selectionStart || 0;
    const rawValue = input.value;

    if (this.mask) {
      const maskedValue = MaskUtils.applyMask(rawValue, this.mask, this.alwaysShowMask);
      const unmaskedValue = MaskUtils.unmaskValue(maskedValue, this.mask);

      this.value = maskedValue;

      // Update input value
      input.value = maskedValue;

      // Restore cursor position (only if setSelectionRange is available - not in mock DOM)
      if (typeof input.setSelectionRange === 'function') {
        const newCursor = MaskUtils.getNewCursorPosition(oldValue, maskedValue, oldCursor, rawValue.length, this.mask);
        input.setSelectionRange(newCursor, newCursor);
      }

      this.monoInput.emit({
        value: this.unmask ? unmaskedValue : maskedValue,
        maskedValue,
        name: this.name,
      });
    } else {
      this.value = rawValue;
      this.monoInput.emit({
        value: rawValue,
        maskedValue: rawValue,
        name: this.name,
      });
    }
  };

  /**
   * Handle change events
   */
  private handleChange = (event: Event) => {
    if (this.disabled || this.readonly) return;

    const input = event.target as HTMLInputElement;
    const maskedValue = input.value;
    const unmaskedValue = this.mask ? MaskUtils.unmaskValue(maskedValue, this.mask) : maskedValue;

    this.monoChange.emit({
      value: this.unmask ? unmaskedValue : maskedValue,
      maskedValue,
      name: this.name,
    });
  };

  /**
   * Handle focus events
   */
  private handleFocus = (event: FocusEvent) => {
    if (this.disabled || this.readonly) return;

    this.hasFocus = true;
    const input = event.target as HTMLInputElement;
    const maskedValue = input.value;
    const unmaskedValue = this.mask ? MaskUtils.unmaskValue(maskedValue, this.mask) : maskedValue;

    this.monoFocus.emit({
      value: this.unmask ? unmaskedValue : maskedValue,
      maskedValue,
      name: this.name,
    });
  };

  /**
   * Handle blur events
   */
  private handleBlur = (event: FocusEvent) => {
    if (this.disabled || this.readonly) return;

    this.hasFocus = false;
    const input = event.target as HTMLInputElement;
    const maskedValue = input.value;
    const unmaskedValue = this.mask ? MaskUtils.unmaskValue(maskedValue, this.mask) : maskedValue;

    this.monoBlur.emit({
      value: this.unmask ? unmaskedValue : maskedValue,
      maskedValue,
      name: this.name,
    });
  };

  /**
   * Handle paste events
   */
  private handlePaste = (event: ClipboardEvent) => {
    if (this.disabled || this.readonly || !this.mask) return;

    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text') || '';
    const input = event.target as HTMLInputElement;
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;

    // Get current value and insert pasted text
    const currentValue = this.value;
    const beforeCursor = currentValue.substring(0, start);
    const afterCursor = currentValue.substring(end);
    const rawValue = beforeCursor + pastedText + afterCursor;

    // Apply mask to the combined value
    const maskedValue = MaskUtils.applyMask(rawValue, this.mask, this.alwaysShowMask);
    this.value = maskedValue;
    input.value = maskedValue;

    // Position cursor after pasted content (only if setSelectionRange is available - not in mock DOM)
    if (typeof input.setSelectionRange === 'function') {
      const newCursor = MaskUtils.getNewCursorPosition(currentValue, maskedValue, start, start + pastedText.length, this.mask);
      input.setSelectionRange(newCursor, newCursor);
    }

    // Emit input event
    const unmaskedValue = MaskUtils.unmaskValue(maskedValue, this.mask);
    this.monoInput.emit({
      value: this.unmask ? unmaskedValue : maskedValue,
      maskedValue,
      name: this.name,
    });
  };

  /**
   * Handle keydown events (for backspace with masks)
   */
  private handleKeyDown = (event: KeyboardEvent) => {
    if (this.disabled || this.readonly || !this.mask) return;

    // Handle backspace key
    if (event.key === 'Backspace') {
      const input = event.target as HTMLInputElement;
      const cursorPos = input.selectionStart || 0;
      const selectionEnd = input.selectionEnd || 0;

      const result = MaskUtils.handleBackspaceWithMask(this.value, cursorPos, selectionEnd, this.mask);

      if (result) {
        event.preventDefault();

        this.value = result.newValue;
        input.value = result.newValue;

        // Position cursor (only if setSelectionRange is available - not in mock DOM)
        if (typeof input.setSelectionRange === 'function') {
          input.setSelectionRange(result.newCursor, result.newCursor);
        }

        // Emit input event
        const unmaskedResult = MaskUtils.unmaskValue(result.newValue, this.mask);
        this.monoInput.emit({
          value: this.unmask ? unmaskedResult : result.newValue,
          maskedValue: result.newValue,
          name: this.name,
        });
      }
    }
  };

  /**
   * Get the effective placeholder
   */
  private getPlaceholder(): string | undefined {
    if (this.showMask && this.mask && !this.alwaysShowMask) {
      return MaskUtils.maskToPlaceholder(this.mask);
    }
    return this.placeholder;
  }

  componentWillLoad() {
    // Initialize masked value if mask is provided
    if (this.mask && this.value) {
      const masked = MaskUtils.applyMask(this.value, this.mask, this.alwaysShowMask);
      this.value = masked;
    }
  }

  render() {
    const inputId = this.inputId || this.uniqueId;
    const hasError = this.error && this.errorMessage;

    return (
      <Host>
        <div
          class={{
            'text-field': true,
            'text-field--small': this.size === 'small',
            'text-field--medium': this.size === 'medium',
            'text-field--large': this.size === 'large',
            'text-field--error': this.error,
            'text-field--disabled': this.disabled,
            'text-field--focused': this.hasFocus,
            'text-field--readonly': this.readonly,
          }}
        >
          {this.label && (
            <label htmlFor={inputId} class="text-field__label">
              {this.label}
              {this.required && <span class="text-field__required">*</span>}
            </label>
          )}
          <div class="text-field__input-wrapper">
            <input
              id={inputId}
              class="text-field__input"
              type={this.type}
              name={this.name}
              value={this.value}
              placeholder={this.getPlaceholder()}
              disabled={this.disabled}
              readonly={this.readonly}
              required={this.required}
              maxlength={this.maxlength}
              autocomplete={this.autocomplete}
              onInput={this.handleInput}
              onChange={this.handleChange}
              onFocus={this.handleFocus}
              onBlur={this.handleBlur}
              onPaste={this.handlePaste}
              onKeyDown={this.handleKeyDown}
              aria-invalid={this.error ? 'true' : 'false'}
              aria-describedby={hasError ? `${inputId}-error` : undefined}
              aria-required={this.required ? 'true' : 'false'}
            />
          </div>
          {hasError && (
            <div id={`${inputId}-error`} class="text-field__error" role="alert">
              {this.errorMessage}
            </div>
          )}
        </div>
      </Host>
    );
  }
}
