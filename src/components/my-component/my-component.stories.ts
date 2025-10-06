import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Components/MyComponent',
  component: 'my-component',
  tags: ['autodocs'],
  argTypes: {
    first: { control: 'text' },
    middle: { control: 'text' },
    last: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    first: 'Stencil',
    middle: "'Don't call me a framework'",
    last: 'JS',
  },
  render: (args) => {
    const component = document.createElement('my-component');
    component.setAttribute('first', args.first);
    component.setAttribute('middle', args.middle);
    component.setAttribute('last', args.last);
    return component;
  },
};

export const Simple: Story = {
  args: {
    first: 'John',
    middle: 'D.',
    last: 'Doe',
  },
  render: (args) => {
    const component = document.createElement('my-component');
    component.setAttribute('first', args.first);
    component.setAttribute('middle', args.middle);
    component.setAttribute('last', args.last);
    return component;
  },
};

export const OnlyFirstAndLast: Story = {
  args: {
    first: 'Jane',
    middle: '',
    last: 'Smith',
  },
  render: (args) => {
    const component = document.createElement('my-component');
    component.setAttribute('first', args.first);
    component.setAttribute('middle', args.middle);
    component.setAttribute('last', args.last);
    return component;
  },
};
