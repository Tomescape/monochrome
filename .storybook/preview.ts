import type { Preview } from '@storybook/web-components';
import { defineCustomElements } from '../loader';

// Initialize Stencil components
defineCustomElements();

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
