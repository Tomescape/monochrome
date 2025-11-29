import { Component, Host, h, Prop, Event, EventEmitter, State, Watch } from '@stencil/core';

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
      const masked = this.applyMask(this.value);
      this.value = masked;
    }
  }

  /**
   * Apply mask to a raw value
   */
  private applyMask(rawValue: string): string {
    if (!this.mask) return rawValue;

    let maskedValue = '';
    let rawIndex = 0;
    let maskIndex = 0;

    // Remove any existing formatting from the raw value
    const cleanValue = this.unmaskValue(rawValue);

    while (maskIndex < this.mask.length && rawIndex < cleanValue.length) {
      const maskChar = this.mask[maskIndex];
      const rawChar = cleanValue[rawIndex];

      if (this.isLiteral(maskChar)) {
        // Auto-insert literal character
        maskedValue += maskChar;
        maskIndex++;
        // Don't consume raw character if it matches the literal
        if (rawChar === maskChar) {
          rawIndex++;
        }
      } else if (this.isValidForMask(rawChar, maskChar)) {
        // Valid character for this mask position
        maskedValue += rawChar;
        maskIndex++;
        rawIndex++;
      } else {
        // Invalid character, skip it
        rawIndex++;
      }
    }

    // Add trailing literals after last input character (for better UX)
    // Only add trailing literals if there's at least some data
    while (maskIndex < this.mask.length && rawIndex >= cleanValue.length && cleanValue.length > 0) {
      const maskChar = this.mask[maskIndex];
      if (this.isLiteral(maskChar)) {
        maskedValue += maskChar;
        maskIndex++;
      } else {
        break; // Stop at first non-literal
      }
    }

    // Handle alwaysShowMask
    if (this.alwaysShowMask && maskedValue.length < this.mask.length) {
      const remaining = this.mask.substring(maskedValue.length);
      maskedValue += remaining.replace(/[9A*]/g, '_');
    }

    return maskedValue;
  }

  /**
   * Remove mask formatting from a value
   */
  private unmaskValue(maskedValue: string): string {
    if (!this.mask) return maskedValue;

    let unmasked = '';

    for (let i = 0; i < maskedValue.length; i++) {
      const char = maskedValue[i];

      // Check if this character exists in the mask as a literal
      let isFormattingChar = false;
      for (let j = 0; j < this.mask.length; j++) {
        const maskChar = this.mask[j];
        if (this.isLiteral(maskChar) && char === maskChar) {
          isFormattingChar = true;
          break;
        }
      }

      // If it's not a formatting character and not a placeholder, include it
      if (!isFormattingChar && char !== '_') {
        unmasked += char;
      }
    }
    return unmasked;
  }

  /**
   * Check if a mask character is a literal (fixed character)
   */
  private isLiteral(maskChar: string): boolean {
    return maskChar !== '9' && maskChar !== 'A' && maskChar !== '*';
  }

  /**
   * Check if a character is valid for a mask position
   */
  private isValidForMask(char: string, maskChar: string): boolean {
    switch (maskChar) {
      case '9':
        return /[0-9]/.test(char);
      case 'A':
        return /[a-zA-Z]/.test(char);
      case '*':
        return /[a-zA-Z0-9]/.test(char);
      default:
        return char === maskChar;
    }
  }

  /**
   * Get cursor position after applying mask
   */
  private getNewCursorPosition(oldValue: string, newValue: string, oldCursor: number, inputLength: number): number {
    if (!this.mask) return oldCursor;

    // Count non-literal characters before cursor in old value
    let nonLiteralsBeforeCursor = 0;
    for (let i = 0; i < oldCursor && i < oldValue.length; i++) {
      const maskChar = this.mask[i];
      if (maskChar && !this.isLiteral(maskChar)) {
        nonLiteralsBeforeCursor++;
      }
    }

    // If user is typing, add 1 for the new character
    if (inputLength > oldValue.length) {
      nonLiteralsBeforeCursor++;
    }

    // Find position in new value with same number of non-literals
    let count = 0;
    let position = 0;
    while (position < newValue.length && count < nonLiteralsBeforeCursor) {
      const maskChar = this.mask[position];
      if (maskChar && !this.isLiteral(maskChar)) {
        count++;
      }
      position++;
    }

    // Skip trailing literals to position cursor after them
    while (position < newValue.length && position < this.mask.length) {
      const maskChar = this.mask[position];
      if (!this.isLiteral(maskChar)) {
        break;
      }
      position++;
    }

    return position;
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
      const maskedValue = this.applyMask(rawValue);
      const unmaskedValue = this.unmaskValue(maskedValue);

      this.value = maskedValue;

      // Update input value
      input.value = maskedValue;

      // Restore cursor position (only if setSelectionRange is available - not in mock DOM)
      if (typeof input.setSelectionRange === 'function') {
        const newCursor = this.getNewCursorPosition(oldValue, maskedValue, oldCursor, rawValue.length);
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
    const unmaskedValue = this.mask ? this.unmaskValue(maskedValue) : maskedValue;

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
    const unmaskedValue = this.mask ? this.unmaskValue(maskedValue) : maskedValue;

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
    const unmaskedValue = this.mask ? this.unmaskValue(maskedValue) : maskedValue;

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
    const maskedValue = this.applyMask(rawValue);
    this.value = maskedValue;
    input.value = maskedValue;

    // Position cursor after pasted content (only if setSelectionRange is available - not in mock DOM)
    if (typeof input.setSelectionRange === 'function') {
      const newCursor = this.getNewCursorPosition(currentValue, maskedValue, start, start + pastedText.length);
      input.setSelectionRange(newCursor, newCursor);
    }

    // Emit input event
    const unmaskedValue = this.unmaskValue(maskedValue);
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

      // If there's a selection, let the default behavior delete it
      if (cursorPos !== selectionEnd) {
        return;
      }

      // If cursor is at position 0, nothing to delete
      if (cursorPos === 0) {
        return;
      }

      event.preventDefault();

      const currentValue = this.value;
      let deletePosition = cursorPos - 1;

      // Find the position of the character to delete (skip literals)
      while (deletePosition >= 0 && this.mask && deletePosition < this.mask.length) {
        const maskChar = this.mask[deletePosition];
        if (!this.isLiteral(maskChar)) {
          // Found a non-literal position, delete it
          break;
        }
        // Skip over literals
        deletePosition--;
      }

      // If we found a valid position to delete
      if (deletePosition >= 0) {
        // Get the unmasked value
        const unmaskedValue = this.unmaskValue(currentValue);

        // Count how many data characters are up to and including the delete position
        let dataCharsUpToDelete = 0;
        for (let i = 0; i <= deletePosition && i < this.mask.length; i++) {
          const maskChar = this.mask[i];
          if (!this.isLiteral(maskChar)) {
            dataCharsUpToDelete++;
          }
        }

        // Remove the character at position (dataCharsUpToDelete - 1) from the unmasked value
        const deleteIndex = dataCharsUpToDelete - 1;
        const newUnmasked = unmaskedValue.substring(0, deleteIndex) + unmaskedValue.substring(deleteIndex + 1);

        // Reapply the mask
        const newMasked = this.applyMask(newUnmasked);
        this.value = newMasked;
        input.value = newMasked;

        // Calculate new cursor position (position after deleteIndex data characters)
        let newCursorPos = 0;
        let dataCharCount = 0;
        const targetDataChars = deleteIndex;

        for (let i = 0; i < newMasked.length && i < this.mask.length; i++) {
          const maskChar = this.mask[i];
          if (!this.isLiteral(maskChar)) {
            if (dataCharCount >= targetDataChars) {
              break;
            }
            dataCharCount++;
          }
          newCursorPos = i + 1;
        }

        // Position cursor (only if setSelectionRange is available - not in mock DOM)
        if (typeof input.setSelectionRange === 'function') {
          input.setSelectionRange(newCursorPos, newCursorPos);
        }

        // Emit input event
        const unmaskedResult = this.unmaskValue(newMasked);
        this.monoInput.emit({
          value: this.unmask ? unmaskedResult : newMasked,
          maskedValue: newMasked,
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
      return this.mask.replace(/[9A*]/g, '_');
    }
    return this.placeholder;
  }

  componentWillLoad() {
    // Initialize masked value if mask is provided
    if (this.mask && this.value) {
      const masked = this.applyMask(this.value);
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
