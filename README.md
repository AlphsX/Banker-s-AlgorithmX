# Banker's Algorithm Visualization

A sophisticated implementation of Deadlock Avoidance simulation using the Banker's Algorithm, built with Next.js 14, TypeScript, and modern React patterns.

## 🚀 Technology Stack

- **Frontend Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Testing**: Jest with React Testing Library
- **UI Components**: Custom components with Magic UI integration
- **State Management**: React Hooks
- **Build Tools**: SWC (Speedy Web Compiler)

## 🌟 Features

- **Interactive Algorithm Visualization**
  - Real-time resource allocation simulation
  - Step-by-step execution tracking
  - Dynamic process management
  - Resource request validation

- **Modern UI/UX**
  - Dark/Light theme support
  - Responsive design
  - Animated transitions
  - Touch gesture support
  - Keyboard shortcuts
  - Performance-optimized animations

- **Advanced Features**
  - Browser compatibility detection
  - Dynamic favicon generation
  - Idle state detection
  - Performance monitoring
  - Markdown support with custom theming

## 🛠 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js app router
│   ├── components/
│   │   ├── bankers-algorithm/  # Core algorithm components
│   │   ├── magicui/           # Enhanced UI components
│   │   └── ui/                # Base UI components
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Core utilities and algorithm
│   ├── types/                  # TypeScript definitions
│   └── utils/                  # Helper functions
```

## 🚦 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/AlphsX/Banker-s-AlgorithmX.git
   cd Banker-s-AlgorithmX
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Run tests**
   ```bash
   npm test
   ```

## 🧪 Testing

The project includes comprehensive test coverage for critical components:
- Algorithm calculations
- UI component rendering
- User interactions
- Browser compatibility

## 🔧 Configuration

The project uses various configuration files:
- `next.config.ts` - Next.js configuration
- `tailwind.config.ts` - TailwindCSS settings
- `tsconfig.json` - TypeScript configuration
- `jest.config.js` - Testing setup

## 🎯 Core Components

### Banker's Algorithm Implementation
- `AlgorithmTable.tsx` - Resource allocation visualization
- `ProcessControl.tsx` - Process management interface
- `ResourceControl.tsx` - Resource management interface
- `StepByStepResults.tsx` - Algorithm execution visualization

### UI Enhancement
- `magicui/` - Advanced UI components with animations
- `ui/` - Base component library with accessibility support

### Utility Hooks
- `useAppLoading` - Application loading state management
- `useDarkMode` - Theme management
- `usePerformanceMonitoring` - Performance tracking
- `useKeyboardShortcuts` - Keyboard interaction handling

## 🌐 Browser Support

The application includes built-in browser compatibility detection and provides appropriate warnings for unsupported features.

## 📱 Mobile Support

- Touch gesture support
- Responsive design
- Mobile-optimized interactions
- Device-specific optimizations

## 🔒 Performance Considerations

- SWC compilation for faster builds
- Optimized animations
- Lazy loading components
- Performance monitoring
- Idle state management

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

AlphsX - [GitHub Profile](https://github.com/AlphsX)

---

*Built with ❤️ using Next.js and TypeScript*