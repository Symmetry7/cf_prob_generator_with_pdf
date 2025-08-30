# Codeforces Problem Selector - React Version

A modern React.js application for selecting Codeforces problems based on various filters. This is a complete rewrite of the original vanilla JavaScript application with improved architecture, bug fixes, and enhanced user experience.

## 🚀 Features

- **Problem Filtering**: Filter problems by type (A-G), contest type, rating range, and tags
- **User Handle Integration**: Check your solved problems by entering your Codeforces handle
- **Difficulty Visualization**: Interactive difficulty meter with color-coded ratings
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Real-time Updates**: Live problem generation and filtering
- **Modern UI**: Glassmorphism design with smooth animations

## 🐛 Bug Fixes from Original Version

1. **Fixed tag filtering logic**: Now properly handles OR logic for multiple selected tags
2. **Improved error handling**: Better API error handling and user feedback
3. **Fixed difficulty meter**: Corrected pointer positioning and color transitions
4. **Enhanced responsive design**: Better mobile layout and touch interactions
5. **Fixed input validation**: Proper handling of empty inputs and edge cases
6. **Improved state management**: React hooks for better component communication

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd codeforces-problem-selector
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🏗️ Project Structure

```
src/
├── components/
│   ├── Header.js          # Logo and title component
│   ├── Controls.js         # Filter controls and inputs
│   ├── ProblemDisplay.js   # Problem card and difficulty meter
│   ├── Stats.js           # Statistics display
│   └── Footer.js          # Footer with social links
├── App.js                 # Main application component
├── App.css               # Main styles
├── index.js              # React entry point
└── index.css             # Global styles
```

## 🎨 Key Improvements

### React Architecture
- **Component-based structure**: Modular, reusable components
- **Hooks-based state management**: useState, useEffect, useCallback for optimal performance
- **Proper prop drilling**: Clean data flow between components
- **Event handling**: React-style event handlers and state updates

### Enhanced Features
- **Better UX**: Loading states, error messages, and success feedback
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Performance**: Optimized re-renders and API calls
- **Code quality**: Clean, maintainable code with proper separation of concerns

### Visual Enhancements
- **Smooth animations**: CSS transitions and React animations
- **Glassmorphism effects**: Modern glass-like UI elements
- **Color-coded difficulty**: Visual difficulty representation
- **Responsive grid**: Adaptive layout for all screen sizes

## 🔧 Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## 🌐 API Integration

The app integrates with the Codeforces API:
- **Problems API**: Fetches problem data and statistics
- **Contest API**: Gets contest names and information
- **User API**: Retrieves user submission history

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Codeforces**: For providing the excellent API
- **Font Awesome**: For the beautiful icons
- **Google Fonts**: For the typography
- **Animate.css**: For the smooth animations

---

Made with ❤️ by Symmetry | symmDiv2+ © 2025
