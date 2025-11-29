import { newE2EPage } from '@stencil/core/testing';

describe('mono-text-field e2e', () => {
  describe('basic rendering', () => {
    it('should render', async () => {
      const page = await newE2EPage();
      await page.setContent('<mono-text-field></mono-text-field>');

      const element = await page.find('mono-text-field');
      expect(element).not.toBeNull();
    });

    it('should render with label', async () => {
      const page = await newE2EPage();
      await page.setContent('<mono-text-field label="Username"></mono-text-field>');

      const label = await page.find('mono-text-field >>> label');
      expect(label).not.toBeNull();
      expect(await label.innerText).toContain('Username');
    });

    it('should render with error message', async () => {
      const page = await newE2EPage();
      await page.setContent('<mono-text-field error error-message="Required field"></mono-text-field>');

      const errorDiv = await page.find('mono-text-field >>> .text-field__error');
      expect(errorDiv).not.toBeNull();
      expect(await errorDiv.innerText).toBe('Required field');
    });
  });

  describe('user interactions', () => {
    it('should accept user input', async () => {
      const page = await newE2EPage();
      await page.setContent('<mono-text-field></mono-text-field>');

      const input = await page.find('mono-text-field >>> input');
      await input.type('Hello World');

      expect(await input.getProperty('value')).toBe('Hello World');
    });

    it('should emit monoInput event when user types', async () => {
      const page = await newE2EPage();
      await page.setContent('<mono-text-field></mono-text-field>');

      const element = await page.find('mono-text-field');
      const monoInputSpy = await element.spyOnEvent('monoInput');

      const input = await page.find('mono-text-field >>> input');
      await input.type('test');

      expect(monoInputSpy).toHaveReceivedEvent();
    });

    it('should emit monoFocus event when input gains focus', async () => {
      const page = await newE2EPage();
      await page.setContent('<mono-text-field></mono-text-field>');

      const element = await page.find('mono-text-field');
      const monoFocusSpy = await element.spyOnEvent('monoFocus');

      const input = await page.find('mono-text-field >>> input');
      await input.focus();

      expect(monoFocusSpy).toHaveReceivedEvent();
    });

    it('should emit monoBlur event when input loses focus', async () => {
      const page = await newE2EPage();
      await page.setContent('<mono-text-field></mono-text-field>');

      const element = await page.find('mono-text-field');
      const monoBlurSpy = await element.spyOnEvent('monoBlur');

      const input = await page.find('mono-text-field >>> input');
      await input.focus();
      await page.keyboard.press('Tab');

      expect(monoBlurSpy).toHaveReceivedEvent();
    });

    it('should emit monoChange event when input value changes and loses focus', async () => {
      const page = await newE2EPage();
      await page.setContent('<mono-text-field></mono-text-field>');

      const element = await page.find('mono-text-field');
      const monoChangeSpy = await element.spyOnEvent('monoChange');

      const input = await page.find('mono-text-field >>> input');
      await input.type('test');
      await page.keyboard.press('Tab');

      expect(monoChangeSpy).toHaveReceivedEvent();
    });

    it('should not accept input when disabled', async () => {
      const page = await newE2EPage();
      await page.setContent('<mono-text-field disabled></mono-text-field>');

      const input = await page.find('mono-text-field >>> input');
      const isDisabled = await input.getProperty('disabled');

      expect(isDisabled).toBe(true);
    });

    it('should not emit events when disabled', async () => {
      const page = await newE2EPage();
      await page.setContent('<mono-text-field disabled></mono-text-field>');

      const element = await page.find('mono-text-field');
      const monoInputSpy = await element.spyOnEvent('monoInput');

      const input = await page.find('mono-text-field >>> input');
      await input.click();

      expect(monoInputSpy).not.toHaveReceivedEvent();
    });
  });

  describe('input mask interactions', () => {
    it('should format phone number as user types', async () => {
      const page = await newE2EPage();
      await page.setContent('<mono-text-field mask="(999) 999-9999"></mono-text-field>');

      const input = await page.find('mono-text-field >>> input');

      await input.type('5');
      expect(await input.getProperty('value')).toBe('(5');

      await input.type('55');
      expect(await input.getProperty('value')).toBe('(555) ');

      await input.type('123');
      expect(await input.getProperty('value')).toBe('(555) 123-');

      await input.type('4567');
      expect(await input.getProperty('value')).toBe('(555) 123-4567');
    });

    it('should format date as user types', async () => {
      const page = await newE2EPage();
      await page.setContent('<mono-text-field mask="99/99/9999"></mono-text-field>');

      const input = await page.find('mono-text-field >>> input');

      await input.type('12');
      expect(await input.getProperty('value')).toBe('12/');

      await input.type('25');
      expect(await input.getProperty('value')).toBe('12/25/');

      await input.type('2024');
      expect(await input.getProperty('value')).toBe('12/25/2024');
    });

    it('should format SSN as user types', async () => {
      const page = await newE2EPage();
      await page.setContent('<mono-text-field mask="999-99-9999"></mono-text-field>');

      const input = await page.find('mono-text-field >>> input');

      await input.type('123');
      expect(await input.getProperty('value')).toBe('123-');

      await input.type('45');
      expect(await input.getProperty('value')).toBe('123-45-');

      await input.type('6789');
      expect(await input.getProperty('value')).toBe('123-45-6789');
    });

    it('should reject non-numeric characters in numeric mask', async () => {
      const page = await newE2EPage();
      await page.setContent('<mono-text-field mask="999"></mono-text-field>');

      const input = await page.find('mono-text-field >>> input');
      await input.type('ABC');

      expect(await input.getProperty('value')).toBe('');
    });

    it('should accept only alphabetic characters in alphabetic mask', async () => {
      const page = await newE2EPage();
      await page.setContent('<mono-text-field mask="AAA"></mono-text-field>');

      const input = await page.find('mono-text-field >>> input');
      await input.type('ABC123');

      expect(await input.getProperty('value')).toBe('ABC');
    });

    it('should handle paste with mask', async () => {
      const page = await newE2EPage();
      await page.setContent('<mono-text-field mask="(999) 999-9999"></mono-text-field>');

      const input = await page.find('mono-text-field >>> input');
      await input.focus();

      // Simulate paste by setting clipboard data and triggering paste event
      await page.evaluate(() => {
        const input = document.querySelector('mono-text-field')?.shadowRoot?.querySelector('input');
        if (input) {
          const pasteEvent = new ClipboardEvent('paste', {
            clipboardData: new DataTransfer(),
            bubbles: true,
            cancelable: true,
          });
          Object.defineProperty(pasteEvent, 'clipboardData', {
            value: {
              getData: () => '5551234567',
            },
          });
          input.dispatchEvent(pasteEvent);
        }
      });

      await page.waitForChanges();

      const value = await input.getProperty('value');
      expect(value).toBe('(555) 123-4567');
    });

    it('should emit both masked and unmasked values when unmask is true', async () => {
      const page = await newE2EPage();
      await page.setContent('<mono-text-field mask="(999) 999-9999" unmask></mono-text-field>');

      const element = await page.find('mono-text-field');
      const monoInputSpy = await element.spyOnEvent('monoInput');

      const input = await page.find('mono-text-field >>> input');
      await input.type('5551234567');

      expect(monoInputSpy).toHaveReceivedEvent();

      const lastEvent = monoInputSpy.lastEvent;
      expect(lastEvent.detail.value).toBe('5551234567');
      expect(lastEvent.detail.maskedValue).toBe('(555) 123-4567');
    });
  });

  describe('visual states', () => {
    it('should apply error class when error prop is true', async () => {
      const page = await newE2EPage();
      await page.setContent('<mono-text-field error></mono-text-field>');

      const wrapper = await page.find('mono-text-field >>> .text-field');
      const classes = await wrapper.getProperty('className');

      expect(classes).toContain('text-field--error');
    });

    it('should apply focused class when input has focus', async () => {
      const page = await newE2EPage();
      await page.setContent('<mono-text-field></mono-text-field>');

      const input = await page.find('mono-text-field >>> input');

      await input.focus();
      await page.waitForChanges();

      const wrapper = await page.find('mono-text-field >>> .text-field');
      const classes = await wrapper.getProperty('className');

      expect(classes).toContain('text-field--focused');
    });

    it('should apply disabled class when disabled prop is true', async () => {
      const page = await newE2EPage();
      await page.setContent('<mono-text-field disabled></mono-text-field>');

      const wrapper = await page.find('mono-text-field >>> .text-field');
      const classes = await wrapper.getProperty('className');

      expect(classes).toContain('text-field--disabled');
    });

    it('should apply readonly class when readonly prop is true', async () => {
      const page = await newE2EPage();
      await page.setContent('<mono-text-field readonly></mono-text-field>');

      const wrapper = await page.find('mono-text-field >>> .text-field');
      const classes = await wrapper.getProperty('className');

      expect(classes).toContain('text-field--readonly');
    });

    it('should apply small size class', async () => {
      const page = await newE2EPage();
      await page.setContent('<mono-text-field size="small"></mono-text-field>');
      const wrapper = await page.find('mono-text-field >>> .text-field');
      const classes = await wrapper.getProperty('className');
      expect(classes).toContain('text-field--small');
    });

    it('should apply medium size class', async () => {
      const page = await newE2EPage();
      await page.setContent('<mono-text-field size="medium"></mono-text-field>');
      const wrapper = await page.find('mono-text-field >>> .text-field');
      const classes = await wrapper.getProperty('className');
      expect(classes).toContain('text-field--medium');
    });

    it('should apply large size class', async () => {
      const page = await newE2EPage();
      await page.setContent('<mono-text-field size="large"></mono-text-field>');
      const wrapper = await page.find('mono-text-field >>> .text-field');
      const classes = await wrapper.getProperty('className');
      expect(classes).toContain('text-field--large');
    });
  });

  describe('form integration', () => {
    it('should work with form submission', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <form id="test-form">
          <mono-text-field name="username"></mono-text-field>
        </form>
      `);

      const input = await page.find('mono-text-field >>> input');
      await input.type('testuser');

      const nameAttr = await input.getProperty('name');
      const value = await input.getProperty('value');

      expect(nameAttr).toBe('username');
      expect(value).toBe('testuser');
    });

    it('should include name in event details', async () => {
      const page = await newE2EPage();
      await page.setContent('<mono-text-field name="email"></mono-text-field>');

      const element = await page.find('mono-text-field');
      const monoInputSpy = await element.spyOnEvent('monoInput');

      const input = await page.find('mono-text-field >>> input');
      await input.type('test@example.com');

      expect(monoInputSpy).toHaveReceivedEvent();
      expect(monoInputSpy.lastEvent.detail.name).toBe('email');
    });

    it('should validate required field', async () => {
      const page = await newE2EPage();
      await page.setContent('<mono-text-field required></mono-text-field>');

      const input = await page.find('mono-text-field >>> input');
      const isRequired = await input.getProperty('required');

      expect(isRequired).toBe(true);
    });
  });

  describe('accessibility', () => {
    it('should have correct ARIA attributes', async () => {
      const page = await newE2EPage();
      await page.setContent('<mono-text-field label="Username" required error error-message="Required field"></mono-text-field>');

      const input = await page.find('mono-text-field >>> input');

      const ariaInvalid = await input.getAttribute('aria-invalid');
      const ariaRequired = await input.getAttribute('aria-required');
      const ariaDescribedBy = await input.getAttribute('aria-describedby');

      expect(ariaInvalid).toBe('true');
      expect(ariaRequired).toBe('true');
      expect(ariaDescribedBy).toBeTruthy();
    });

    it('should associate label with input', async () => {
      const page = await newE2EPage();
      await page.setContent('<mono-text-field label="Username"></mono-text-field>');

      const label = await page.find('mono-text-field >>> label');
      const input = await page.find('mono-text-field >>> input');

      const labelFor = await label.getAttribute('for');
      const inputId = await input.getAttribute('id');

      expect(labelFor).toBeTruthy();
      expect(inputId).toBeTruthy();
      expect(labelFor).toBe(inputId);
    });

    it('should support keyboard navigation', async () => {
      const page = await newE2EPage();
      await page.setContent(`
        <div>
          <mono-text-field id="field1"></mono-text-field>
          <mono-text-field id="field2"></mono-text-field>
        </div>
      `);

      const input1 = await page.find('#field1 >>> input');

      await input1.focus();
      await page.keyboard.press('Tab');

      const activeElement = await page.evaluate(() => {
        const field2 = document.querySelector('#field2') as any;
        const activeEl = field2?.shadowRoot?.activeElement;
        return activeEl?.tagName;
      });

      expect(activeElement).toBe('INPUT');
    });
  });

  describe('dynamic property updates', () => {
    it('should update when value prop changes', async () => {
      const page = await newE2EPage();
      await page.setContent('<mono-text-field></mono-text-field>');

      const element = await page.find('mono-text-field');
      const input = await page.find('mono-text-field >>> input');

      element.setProperty('value', 'new value');
      await page.waitForChanges();

      expect(await input.getProperty('value')).toBe('new value');
    });

    it('should update mask when mask prop changes', async () => {
      const page = await newE2EPage();
      await page.setContent('<mono-text-field value="1234567890"></mono-text-field>');

      const element = await page.find('mono-text-field');
      const input = await page.find('mono-text-field >>> input');

      element.setProperty('mask', '(999) 999-9999');
      await page.waitForChanges();

      expect(await input.getProperty('value')).toBe('(123) 456-7890');
    });

    it('should toggle error state', async () => {
      const page = await newE2EPage();
      await page.setContent('<mono-text-field></mono-text-field>');

      const element = await page.find('mono-text-field');

      element.setProperty('error', true);
      await page.waitForChanges();

      let wrapper = await page.find('mono-text-field >>> .text-field');
      let classes = await wrapper.getProperty('className');
      expect(classes).toContain('text-field--error');

      element.setProperty('error', false);
      await page.waitForChanges();

      wrapper = await page.find('mono-text-field >>> .text-field');
      classes = await wrapper.getProperty('className');
      expect(classes).not.toContain('text-field--error');
    });

    it('should toggle disabled state', async () => {
      const page = await newE2EPage();
      await page.setContent('<mono-text-field></mono-text-field>');

      const element = await page.find('mono-text-field');
      const input = await page.find('mono-text-field >>> input');

      element.setProperty('disabled', true);
      await page.waitForChanges();

      expect(await input.getProperty('disabled')).toBe(true);

      element.setProperty('disabled', false);
      await page.waitForChanges();

      expect(await input.getProperty('disabled')).toBe(false);
    });
  });
});
