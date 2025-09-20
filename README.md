
# React + Vite + Tailwind CSS + React Router Boilerplate

> **⚠️ WARNING:**
> Do **NOT** use `npm i react-twd-router-bp` to install this package. This is a CLI tool and should be run with `npx react-twd-router-bp`.
> Using `npm i` will not scaffold your project and is not the intended usage.

This boilerplate provides a ready-to-use setup for building React applications with Vite, Tailwind CSS, and React Router. It includes basic routing, ESLint configuration, and a clean project structure to help you start quickly and customize to your style.

## Features
- ⚡ Fast development with Vite
- 🎨 Tailwind CSS for utility-first styling
- 🚦 React Router for client-side routing
- 🧹 ESLint for code quality
- 📁 Organized folder structure (`src/pages`, `src/routes`, etc.)

## Getting Started





## Usage

To scaffold a new React + Vite + Tailwind CSS + React Router project, run:

```
npx react-twd-boiler
```

### Setup Steps

1. **Project Name:**  
	The CLI will prompt:  
	`What will your project name be?`

2. **Latest Packages Only:**  
	The CLI will always install the latest versions of React, Tailwind CSS, and React Router. There is no option to select specific versions.

3. **Project Creation:**  
	The CLI will copy the boilerplate files, update dependencies, and install everything automatically.

### Start Development Server


```
cd <your-project-name>
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view your app.

## Project Structure

```
├── public/
├── src/
│   ├── assets/
│   ├── pages/
│   │   ├── Home.jsx
│   │   └── Error.jsx
│   ├── routes/
│   │   └── Routes.jsx
│   ├── index.css
│   └── main.jsx
├── package.json
├── README.md
├── vite.config.js
└── ...
```

## Customization

- Add new pages in `src/pages` and update `src/routes/Routes.jsx` for routing.
- Customize styles in `src/index.css` and Tailwind config.
- Update ESLint rules in `eslint.config.js` as needed.

## Tailwind CSS Setup

Tailwind is already configured. Use its utility classes in your components. For custom configuration, edit `tailwind.config.js`.

## Build for Production

```
npm run build
```

## Linting

```
npm run lint
```

## License

MIT
