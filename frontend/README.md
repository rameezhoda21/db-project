# Frontend - Library Management System

React application for library management with role-based dashboards.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## 📦 Installation

```bash
npm install
```

## 🚀 Running

```bash
npm start      # Development server
npm build      # Production build
npm test       # Run tests
```

Development server runs on `http://localhost:3000`

## 📂 Structure

```
frontend/
├── public/          # Static assets
├── src/
│   ├── components/  # Reusable components (navbar, footer, etc.)
│   ├── context/     # React Context (auth)
│   ├── pages/       # Page components
│   │   ├── student/
│   │   ├── librarian/
│   │   └── admin/
│   ├── services/    # API service layer
│   ├── App.js       # Main app component
│   └── index.js     # Entry point
└── package.json
```

## 🎨 Styling

- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Component library for Tailwind
- Custom color scheme with IBA branding

## 🔐 Authentication

Uses React Context API for state management:
- Login/Logout functionality
- localStorage persistence
- Role-based routing (student/librarian/admin)

## 📱 Features by Role

### Student Dashboard
- Browse and search books
- Borrow/Reserve books
- View borrowed books
- Pay fines

### Librarian Dashboard
- Manage book inventory
- Add/Remove books
- View borrowed/overdue books
- Issue fines

### Admin Dashboard
- Manage librarians and students
- View system-wide inventory
- Add/Remove users

## 🔌 API Integration

Backend API: `http://localhost:5000/api`

Configured in `src/services/api.js` using Axios.

## 🚀 Deployment

For production:
1. Update API baseURL in `src/services/api.js`
2. Run `npm run build`
3. Deploy `build/` folder to hosting service (Vercel, Netlify, etc.)

---

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
