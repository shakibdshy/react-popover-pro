# Popover and Tooltip Components

This package provides accessible and customizable Popover and Tooltip components for React applications.

## Popover Component

The Popover component is a flexible and accessible component that can be used to create tooltips, dropdowns, menus, and more.

### Features

- Fully accessible with proper ARIA attributes
- Multiple placement options (top, bottom, left, right, and their variants)
- Customizable appearance and behavior
- Support for animations
- Keyboard navigation support
- Focus management
- Portal support for proper stacking

### Usage

```jsx
import { Popover, PopoverTrigger, PopoverContent } from './popover';

function MyComponent() {
  return (
    <Popover>
      <PopoverTrigger>
        <button>Open Popover</button>
      </PopoverTrigger>
      <PopoverContent>
        <div>Popover Content</div>
      </PopoverContent>
    </Popover>
  );
}
```

## Tooltip Component

The Tooltip component is a simple wrapper around the Popover component that provides a simpler API for common tooltip use cases.

### Features

- Simple API for common use cases
- Customizable appearance with arrow indicator
- Multiple placement options
- Delay control for showing/hiding
- Fully accessible

### Usage

#### Basic Tooltip

```jsx
import { Tooltip } from './popover';

function MyComponent() {
  return (
    <Tooltip content="This is a tooltip">
      <button>Hover me</button>
    </Tooltip>
  );
}
```

#### Customized Tooltip

```jsx
import { Tooltip } from './popover';

function MyComponent() {
  return (
    <Tooltip 
      content="This is a customized tooltip"
      placement="bottom"
      openDelay={300}
      closeDelay={200}
      offset={12}
      arrow={true}
      maxWidth={300}
      className="custom-tooltip"
    >
      <button>Hover me</button>
    </Tooltip>
  );
}
```

#### Custom Background Color

```jsx
import { Tooltip } from './popover';

function MyComponent() {
  return (
    <Tooltip 
      content="This tooltip has a custom background color"
      placement="top"
      arrow={true}
      backgroundColor="#10b981" // Green color
    >
      <button>Hover me</button>
    </Tooltip>
  );
}
```

#### Rich Content

```jsx
import { Tooltip } from './popover';

function MyComponent() {
  return (
    <Tooltip 
      content={
        <div>
          <h3>Rich Content</h3>
          <p>Tooltips can contain rich content</p>
        </div>
      }
      placement="right"
    >
      <button>Hover me</button>
    </Tooltip>
  );
}
```

### Props

#### TooltipProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| content | ReactNode | - | The content to display in the tooltip |
| children | ReactElement | - | The element that triggers the tooltip |
| placement | PopoverPlacement | 'top' | The placement of the tooltip |
| openDelay | number | 0 | The delay before showing the tooltip (in ms) |
| closeDelay | number | 0 | The delay before hiding the tooltip (in ms) |
| offset | number | 8 | The offset from the trigger element (in px) |
| arrow | boolean | true | Whether to show an arrow pointing to the trigger |
| maxWidth | string \| number | 'none' | The maximum width of the tooltip |
| className | string | - | Additional class name for the tooltip |
| asChild | boolean | false | Whether to use the child as the trigger |
| backgroundColor | string | - | Custom background color for the tooltip |

### Default Styling

The tooltip comes with minimal default styling that can be customized using the `className` prop or the `backgroundColor` prop. The default styling includes:

- A dark background
- White text
- Rounded corners
- Small padding
- An arrow pointing to the trigger element

### Arrow Positioning

The tooltip arrow is automatically positioned based on the `placement` prop:

- For `top` placements, the arrow appears at the bottom of the tooltip
- For `bottom` placements, the arrow appears at the top of the tooltip
- For `left` placements, the arrow appears at the right of the tooltip
- For `right` placements, the arrow appears at the left of the tooltip

For start/end variants (e.g., `top-start`, `bottom-end`), the arrow is positioned accordingly to point at the trigger element.

### Accessibility

The tooltip component follows accessibility best practices:

- Uses appropriate ARIA attributes
- Supports keyboard navigation
- Manages focus correctly
- Provides proper contrast for readability 