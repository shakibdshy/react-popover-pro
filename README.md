# React Popover Pro

A modern, accessible, and highly customizable popover and tooltip library for React applications.

## 📚 Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Getting Started](#getting-started)
  - [Basic Popover](#basic-popover)
  - [Basic Tooltip](#basic-tooltip)
- [Popover Component](#popover-component)
  - [Component Structure](#component-structure)
  - [Props](#popover-props)
  - [Placement Options](#placement-options)
  - [Trigger Modes](#trigger-modes)
  - [Animation Effects](#animation-effects)
  - [Styling & Variants](#styling--variants)
- [Tooltip Component](#tooltip-component)
  - [Props](#tooltip-props)
  - [Examples](#tooltip-examples)
- [Advanced Usage](#advanced-usage)
  - [Controlled Mode](#controlled-mode)
  - [Custom Animations](#custom-animations)
  - [Nested Popovers](#nested-popovers)
  - [Virtual Elements](#virtual-elements)
  - [Custom Positioning](#custom-positioning)
- [Accessibility](#accessibility)
- [Browser Support](#browser-support)
- [Contributing](#contributing)
- [License](#license)

## 🚀 Introduction

React Popover Pro provides accessible and customizable popover and tooltip components for React applications. The library is designed with flexibility, performance, and accessibility in mind, making it suitable for a wide range of use cases from simple tooltips to complex dropdown menus.

### Key Features

- 🌟 **Fully accessible** with proper ARIA attributes and keyboard navigation
- 🎯 **Multiple placement options** with automatic positioning
- 🎨 **Customizable appearance** with built-in variants and animation effects
- 🔄 **Smart positioning** that keeps popovers within viewport
- ⌨️ **Keyboard navigation** support for improved accessibility
- 🔍 **Focus management** for better user experience
- 🖼️ **Portal support** for proper stacking in complex layouts
- 📱 **Responsive design** that works on all screen sizes

## 📦 Installation

```bash
# Using npm
npm install @shakibdshy/react-popover-pro

# Using yarn
yarn add @shakibdshy/react-popover-pro

# Using pnpm
pnpm add @shakibdshy/react-popover-pro

# Using bun
bun add @shakibdshy/react-popover-pro
```

### Import Styles

Make sure to import the CSS styles in your application:

```jsx
// Import the styles in your main file (e.g., main.tsx, App.tsx, or layout.tsx)
import "@shakibdshy/react-popover-pro/style.css";
```

## 🏁 Getting Started

### Basic Popover

Here's a simple example of how to use the Popover component:

```jsx
import { Popover, PopoverTrigger, PopoverContent } from '@shakibdshy/react-popover-pro';

function MyComponent() {
  return (
    <Popover>
      <PopoverTrigger>
        <button>Click me</button>
      </PopoverTrigger>
      <PopoverContent>
        <div>This is the popover content</div>
      </PopoverContent>
    </Popover>
  );
}
```

### Basic Tooltip

For simple hover tooltips, you can use the Tooltip component:

```jsx
import { Tooltip } from '@shakibdshy/react-popover-pro';

function MyComponent() {
  return (
    <Tooltip content="This is a tooltip">
      <button>Hover me</button>
    </Tooltip>
  );
}
```

## 🧩 Popover Component

The Popover component is a flexible and powerful component that can be used to create tooltips, dropdowns, menus, and more.

### Component Structure

The Popover component uses a compound component pattern with three main parts:

1. `<Popover>` - The main container component that manages state and context
2. `<PopoverTrigger>` - The element that triggers the popover
3. `<PopoverContent>` - The content that appears when the popover is triggered

### Popover Props

Here are the main props for the `<Popover>` component:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | The trigger and content components |
| `placement` | PopoverPlacement | 'bottom' | Where the popover should appear relative to the trigger |
| `offset` | number | 8 | Distance between the popover and trigger (in pixels) |
| `defaultOpen` | boolean | false | Whether the popover is open by default (uncontrolled mode) |
| `open` | boolean | - | Controlled open state |
| `onOpenChange` | function | - | Callback when open state changes |
| `triggerMode` | 'click' \| 'hover' \| 'context-menu' | 'click' | How the popover is triggered |
| `animate` | boolean | true | Whether to animate the popover |
| `animationDuration` | number | 200 | Duration of animation in milliseconds |
| `animationEffect` | AnimationEffect | 'fade' | Animation effect to use |
| `arrow` | boolean | false | Whether to show an arrow pointing to the trigger |
| `portal` | boolean | true | Whether to render in a portal |
| `autoPlacement` | boolean | true | Whether to automatically adjust placement to fit viewport |
| `variant` | 'primary' \| 'info' \| 'success' \| 'warning' \| 'danger' | - | Visual style variant |

### Placement Options

The `placement` prop accepts the following values:

- Basic placements: `'top'`, `'right'`, `'bottom'`, `'left'`
- Alignment variations: `'top-start'`, `'top-end'`, `'right-start'`, `'right-end'`, `'bottom-start'`, `'bottom-end'`, `'left-start'`, `'left-end'`

```jsx
<Popover placement="top-start">
  {/* ... */}
</Popover>
```

### Trigger Modes

The `triggerMode` prop determines how the popover is activated:

- `'click'` - Opens on click, closes on click outside or on trigger
- `'hover'` - Opens on hover, closes when cursor leaves
- `'context-menu'` - Opens on right-click (context menu)

```jsx
<Popover triggerMode="hover" openDelay={200} closeDelay={150}>
  {/* ... */}
</Popover>
```

### Animation Effects

The `animationEffect` prop accepts various animation types:

- `'fade'` - Simple opacity transition
- `'scale'`, `'scale-subtle'`, `'scale-extreme'` - Grows/shrinks from origin point
- `'shift-away'`, `'shift-away-subtle'`, `'shift-away-extreme'` - Slides away from origin
- `'shift-toward'`, `'shift-toward-subtle'`, `'shift-toward-extreme'` - Slides toward origin
- `'perspective'`, `'perspective-subtle'`, `'perspective-extreme'` - 3D rotation effect

```jsx
<Popover 
  animate={true}
  animationDuration={300}
  animationEffect="scale"
>
  {/* ... */}
</Popover>
```

### Styling & Variants

The popover comes with built-in color variants:

- Default (no variant specified) - Neutral gray
- `'primary'` - Blue, suitable for primary actions
- `'info'` - Cyan, suitable for informational content
- `'success'` - Green, suitable for success messages
- `'warning'` - Amber, suitable for warning messages
- `'danger'` - Red, suitable for error messages

```jsx
<Popover variant="primary" arrow={true}>
  {/* ... */}
</Popover>
```

## 🎯 Tooltip Component

The Tooltip component is a simplified wrapper around the Popover component, optimized for hover tooltips.

### Tooltip Props

The Tooltip component accepts all the same props as the Popover component, plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | ReactNode | - | The content to display in the tooltip |
| `maxWidth` | number \| string | 250 | Maximum width of the tooltip |
| `className` | string | - | Additional CSS class for the tooltip |

### Tooltip Examples

#### Basic Tooltip

```jsx
<Tooltip content="This is a tooltip">
  <button>Hover me</button>
</Tooltip>
```

#### Tooltip with Rich Content

```jsx
<Tooltip 
  content={
    <div>
      <h3>Rich Content</h3>
      <p>Tooltips can contain rich HTML content</p>
    </div>
  }
  maxWidth={300}
>
  <button>Hover for rich content</button>
</Tooltip>
```

#### Tooltip with Custom Placement and Animation

```jsx
<Tooltip 
  content="This tooltip appears on the right with a scale animation"
  placement="right"
  animationEffect="scale"
  animationDuration={300}
>
  <button>Custom Tooltip</button>
</Tooltip>
```

#### Color Variants

```jsx
<Tooltip 
  content="This is a success tooltip"
  variant="success"
  arrow={true}
>
  <button>Success Tooltip</button>
</Tooltip>
```

## 🔧 Advanced Usage

### Controlled Mode

You can control the open state of the popover manually:

```jsx
import { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@shakibdshy/react-popover-pro';

function ControlledPopover() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Open popover from outside
      </button>
      
      <Popover 
        open={isOpen} 
        onOpenChange={setIsOpen}
      >
        <PopoverTrigger>
          <button>Controlled Trigger</button>
        </PopoverTrigger>
        <PopoverContent>
          <div>
            <p>This is a controlled popover</p>
            <button onClick={() => setIsOpen(false)}>Close</button>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
```

### Custom Animations

You can customize the animation timing and effect:

```jsx
<Popover
  animate={true}
  animationDuration={400}
  animationTiming="cubic-bezier(0.34, 1.56, 0.64, 1)"
  animationEffect="perspective-extreme"
>
  {/* ... */}
</Popover>
```

### Nested Popovers

You can nest popovers inside each other:

```jsx
<Popover>
  <PopoverTrigger>
    <button>Open first popover</button>
  </PopoverTrigger>
  <PopoverContent>
    <div>
      <p>First popover content</p>
      <Popover>
        <PopoverTrigger>
          <button>Open nested popover</button>
        </PopoverTrigger>
        <PopoverContent>
          <p>Nested popover content</p>
        </PopoverContent>
      </Popover>
    </div>
  </PopoverContent>
</Popover>
```

### Virtual Elements

You can position a popover relative to a virtual element (like a cursor position):

```jsx
import { useState, useCallback } from 'react';
import { Popover, PopoverContent } from '@shakibdshy/react-popover-pro';

function CursorPopover() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isOpen, setIsOpen] = useState(false);
  
  const handleMouseMove = useCallback((e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  }, []);
  
  const virtualRef = {
    getBoundingClientRect: () => ({
      width: 0,
      height: 0,
      top: position.y,
      right: position.x,
      bottom: position.y,
      left: position.x,
      x: position.x,
      y: position.y,
    }),
  };
  
  return (
    <div 
      onMouseMove={handleMouseMove}
      onContextMenu={(e) => {
        e.preventDefault();
        setIsOpen(true);
      }}
      style={{ height: '300px', border: '1px solid #ccc' }}
    >
      Right-click anywhere in this area
      
      <Popover
        open={isOpen}
        onOpenChange={setIsOpen}
        virtualRef={virtualRef}
        triggerMode="context-menu"
      >
        <PopoverContent>
          <div>Context menu content</div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
```

### Custom Positioning

You can use middleware functions to customize positioning:

```jsx
import { Popover, PopoverTrigger, PopoverContent } from '@shakibdshy/react-popover-pro';
import { shift, offset } from '@shakibdshy/react-popover-pro/middleware';

function CustomPositionedPopover() {
  return (
    <Popover
      middleware={[
        offset(16), // 16px offset from trigger
        shift({ padding: 8 }), // 8px padding from viewport edges
      ]}
    >
      <PopoverTrigger>
        <button>Custom Positioned Popover</button>
      </PopoverTrigger>
      <PopoverContent>
        <div>This popover has custom positioning</div>
      </PopoverContent>
    </Popover>
  );
}
```

## ♿ Accessibility

React Popover Pro is built with accessibility in mind:

- Proper ARIA attributes (`role`, `aria-expanded`, `aria-haspopup`, etc.)
- Keyboard navigation support (Tab, Escape, Arrow keys)
- Focus management (auto-focus, focus trap, return focus)
- Screen reader friendly
- High contrast mode support

## 🌐 Browser Support

React Popover Pro supports all modern browsers:

- Chrome (and Chromium-based browsers like Edge)
- Firefox
- Safari
- Opera

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details. 
