# Project: Cyanide v4

## Overview
Cyanide v4 is a web-based platform designed with a desktop-like interface. Its primary purpose, as stated in the README, is to be an "unblockable" site, likely serving as a portal for web-based games or applications. The project uses a modern web stack centered around Svelte 5 and Vite.

## Architecture & Tech Stack
- **Framework:** [Svelte 5](https://svelte.dev/) - utilizing the latest features like Runes (`$state`, `$props`, `$derived`, etc.).
- **Build Tool:** [Vite](https://vite.dev/) - for fast development and optimized production builds.
- **Styling:** Vanilla CSS, scoped within Svelte components.
- **UI Paradigm:** Desktop environment simulation where "apps" are opened in draggable and resizable windows.

### Key Files & Directories
- `src/App.svelte`: The main container for the desktop environment. It manages the state of open windows and the taskbar/app launcher.
- `src/lib/components/Window.svelte`: A core UI component that provides windowing functionality, including dragging, resizing, maximizing, and closing.
- `src/lib/apps/`: Contains individual application components that run inside the `Window` component.
- `src/main.js`: The application entry point that mounts the Svelte `App` to the DOM.

## Building and Running

### Development
To start the development server with Hot Module Replacement (HMR):
```bash
npm run dev
```

### Production
To build the project for production:
```bash
npm run build
```
The output will be in the `dist/` directory.

To preview the production build locally:
```bash
npm run preview
```

## Development Conventions
- **Svelte 5 Runes:** Always use Svelte 5 Runes (`$state`, `$props`, etc.) for reactivity and component communication.
- **Component Styling:** Prefer scoped `<style>` blocks within `.svelte` files. Use CSS variables for shared themes if necessary.
- **Windowed Apps:** New features or tools should be implemented as components within `src/lib/apps/` and integrated into the `windows` state in `App.svelte`.
- **Event Handling:** Use modern Svelte 5 event attributes (e.g., `onclick`, `onpointerdown`) rather than the older `on:click` syntax.

## TODO / Future Work
- Implement actual application logic within `src/lib/apps/Cyanide.svelte`.
- Add more "apps" like `Sulfur` and `Fluoride` mentioned in `App.svelte`.
- Refine the window management system (z-index handling, focus, etc.).
- Implement the game JSON structure and backend types (link, html, proxy) as planned in `Cyanide.svelte`.
