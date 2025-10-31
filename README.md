# Banker's Algorithm: Complete Deadlock Avoidance System

A comprehensive implementation of the Banker's Algorithm for deadlock avoidance, featuring a robust TypeScript backend API and an interactive Next.js frontend visualization. This project demonstrates the classical algorithm developed by Edsger Dijkstra with modern software engineering practices.

## 🚀 Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js with TypeScript
- **Validation**: Joi schema validation
- **Security**: Helmet, CORS, Rate limiting
- **Testing**: Jest with comprehensive test coverage
- **Documentation**: OpenAPI/Swagger compatible

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS with custom themes
- **Testing**: Jest with React Testing Library
- **UI Components**: Custom components with Magic UI integration
- **State Management**: React Hooks with optimized performance
- **Build Tools**: SWC (Speedy Web Compiler)

## 🌟 Features

### Core Algorithm Implementation
- **Safety Algorithm**: Determines if system state is safe and finds safe execution sequence
- **Resource Request Processing**: Validates and processes resource allocation requests
- **Deadlock Prevention**: Ensures system never enters unsafe state that could lead to deadlock
- **Real-time Validation**: Comprehensive input validation and constraint checking

### Backend API Features
- **RESTful API**: Clean, well-documented REST endpoints
- **Request Validation**: Joi-based schema validation for all inputs
- **Security Hardening**: Rate limiting, CORS, helmet security headers
- **Error Handling**: Comprehensive error handling with detailed error messages
- **Performance Monitoring**: Request timing and performance metrics
- **Scalable Architecture**: Modular service-based architecture

### Frontend Visualization
- **Interactive Algorithm Visualization**: Real-time step-by-step algorithm execution
- **Dynamic Process Management**: Add, remove, and modify processes dynamically
- **Resource Request Simulation**: Interactive resource request testing
- **Safety Analysis**: Visual representation of safe/unsafe states
- **Modern UI/UX**: Dark/light themes, responsive design, animations

### Advanced Features
- **Comprehensive Testing**: Unit tests, integration tests, and E2E testing
- **Performance Optimization**: Optimized algorithms and caching strategies
- **Browser Compatibility**: Cross-browser support with fallbacks
- **Accessibility**: WCAG compliant interface design
- **Documentation**: Extensive code documentation and API docs

## 🛠 Project Structure

```
├── backend/                    # Node.js/Express API Server
│   ├── src/
│   │   ├── controllers/       # REST API controllers
│   │   ├── services/          # Core algorithm implementation
│   │   ├── middleware/        # Security and validation middleware
│   │   ├── routes/           # API route definitions
│   │   ├── types/            # TypeScript type definitions
│   │   ├── utils/            # Utility functions and helpers
│   │   └── __tests__/        # Comprehensive test suite
│   ├── package.json          # Backend dependencies
│   └── tsconfig.json         # TypeScript configuration
│
├── frontend/                   # Next.js Frontend Application
│   ├── src/
│   │   ├── app/              # Next.js app router
│   │   ├── components/
│   │   │   ├── bankers-algorithm/  # Algorithm-specific components
│   │   │   ├── magicui/           # Enhanced UI components
│   │   │   └── ui/                # Base UI components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Frontend utilities and algorithm
│   │   ├── types/            # TypeScript definitions
│   │   └── utils/            # Helper functions
│   ├── package.json          # Frontend dependencies
│   └── next.config.ts        # Next.js configuration
│
└── README.md                  # Project documentation
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18.0.0 or higher
- npm or yarn package manager
- Git

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment configuration**
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Run tests**
   ```bash
   npm test
   npm run test:coverage  # With coverage report
   ```

6. **Build for production**
   ```bash
   npm run build
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Run tests**
   ```bash
   npm test
   npm run test:coverage  # With coverage report
   ```

5. **Build for production**
   ```bash
   npm run build
   npm start
   ```

### Full Stack Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/AlphsX/Banker-s-AlgorithmX.git
   cd Banker-s-AlgorithmX
   ```

2. **Start both servers** (in separate terminals)
   ```bash
   # Terminal 1 - Backend
   cd backend && npm install && npm run dev
   
   # Terminal 2 - Frontend  
   cd frontend && npm install && npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Health Check: http://localhost:3001/api/health

## 🧪 Testing

### Backend Testing
The backend includes comprehensive test coverage:
- **Unit Tests**: Core algorithm logic and utility functions
- **Integration Tests**: API endpoints and middleware
- **Validation Tests**: Input validation and error handling
- **Performance Tests**: Algorithm execution timing

```bash
cd backend
npm test                    # Run all tests
npm run test:watch         # Watch mode for development
npm run test:coverage      # Generate coverage report
```

### Frontend Testing
The frontend testing covers:
- **Component Tests**: React component rendering and behavior
- **Hook Tests**: Custom React hooks functionality
- **Integration Tests**: User interactions and workflows
- **Accessibility Tests**: WCAG compliance validation

```bash
cd frontend
npm test                    # Run all tests
npm run test:watch         # Watch mode for development
npm run test:coverage      # Generate coverage report
```

## 🔧 Configuration

### Backend Configuration
- `tsconfig.json` - TypeScript configuration with strict settings
- `jest.config.js` - Testing framework setup
- `.env.example` - Environment variables template
- `package.json` - Dependencies and scripts

### Frontend Configuration
- `next.config.ts` - Next.js configuration with optimizations
- `tailwind.config.ts` - TailwindCSS custom theme settings
- `tsconfig.json` - TypeScript configuration
- `jest.config.js` - Testing setup with React Testing Library

## 🎯 Core Components

### Backend Architecture

#### Services Layer
- `BankersAlgorithmService` - Core algorithm implementation with safety checking and request processing
- Matrix operations utilities for vector/matrix calculations
- Comprehensive validation and error handling

#### API Layer
- `BankersAlgorithmController` - REST API endpoints for all algorithm operations
- Request validation middleware with Joi schemas
- Security middleware with rate limiting and CORS

#### Algorithm Implementation
- **Safety Algorithm**: Implements the classical Banker's Algorithm safety check
- **Resource Request Algorithm**: Processes resource allocation requests safely
- **System State Management**: Handles system state validation and manipulation

### Frontend Architecture

#### Algorithm Visualization
- `AlgorithmTable.tsx` - Interactive resource allocation matrix display
- `ProcessControl.tsx` - Dynamic process management interface
- `ResourceControl.tsx` - Resource type management interface
- `StepByStepResults.tsx` - Real-time algorithm execution visualization

#### UI Enhancement
- `magicui/` - Advanced UI components with smooth animations
- `ui/` - Accessible base component library with theme support
- Custom hooks for state management and performance optimization

#### Utility Hooks
- `useAppLoading` - Application loading state management
- `useDarkMode` - Theme switching and persistence
- `usePerformanceMonitoring` - Real-time performance tracking
- `useKeyboardShortcuts` - Keyboard navigation and shortcuts

## 📚 API Documentation

### Core Endpoints

#### System Management
- `GET /api/system/default` - Get default system with example values
- `GET /api/system/fresh` - Create fresh system with zero values
- `POST /api/system/validate` - Validate system state
- `POST /api/system/resize` - Resize system matrices

#### Algorithm Operations
- `POST /api/safety/check` - Perform safety algorithm analysis
- `POST /api/request/process` - Process resource allocation request

#### Process & Resource Management
- `POST /api/process/:id` - Get process information
- `POST /api/process/:id/complete` - Complete process and release resources
- `POST /api/resource/:id` - Get resource type information

#### Monitoring
- `GET /api/health` - API health check and status
- `POST /api/system/statistics` - Get comprehensive system statistics

### Request/Response Format
All API responses follow a consistent format:
```json
{
  "success": boolean,
  "data": object | null,
  "error": string | null,
  "errorDetails": ValidationError[] | null,
  "timestamp": string,
  "processingTime": number
}
```

## 🌐 Browser Support & Compatibility

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Features
- Built-in browser compatibility detection
- Progressive enhancement for older browsers
- Graceful degradation for unsupported features
- Responsive design for all screen sizes

## 📱 Mobile & Accessibility

### Mobile Support
- Touch gesture support for interactive elements
- Responsive design with mobile-first approach
- Optimized touch targets and interactions
- Device-specific performance optimizations

### Accessibility Features
- WCAG 2.1 AA compliance
- Screen reader support
- Keyboard navigation
- High contrast mode support
- Focus management and indicators

## 🔒 Security & Performance

### Security Features
- **Rate Limiting**: Prevents API abuse with configurable limits
- **CORS Protection**: Configurable cross-origin resource sharing
- **Input Validation**: Comprehensive request validation with Joi
- **Security Headers**: Helmet.js for security header management
- **Request Timeout**: Prevents long-running requests

### Performance Optimizations
- **Algorithm Efficiency**: Optimized O(n²) safety algorithm implementation
- **Caching**: Intelligent caching of computation results
- **Lazy Loading**: Component-level code splitting
- **SWC Compilation**: Fast build times with Speedy Web Compiler
- **Performance Monitoring**: Real-time performance metrics

## 🧠 Algorithm Details

### Banker's Algorithm Overview
The Banker's Algorithm is a deadlock avoidance algorithm developed by Edsger Dijkstra. It works by simulating the allocation of predetermined maximum possible amounts of all resources, and then makes an "s-state" check to test for possible activities, before deciding whether allocation should be allowed to continue.

### Safety Algorithm Steps
1. **Initialize**: Work = Available, Finish[i] = false for all processes
2. **Find Process**: Look for process Pi where Finish[i] = false and Need[i] ≤ Work
3. **Simulate Completion**: If found, set Work = Work + Allocation[i] and Finish[i] = true
4. **Repeat**: Continue until no such process exists
5. **Check Safety**: If all Finish[i] = true, system is safe

### Resource Request Algorithm Steps
1. **Validate Request**: Check if Request[i] ≤ Need[i] and Request[i] ≤ Available
2. **Temporary Allocation**: Simulate resource allocation
3. **Safety Check**: Run safety algorithm on new state
4. **Decision**: Grant if safe, deny if unsafe

### Implementation Highlights
- **Correctness**: Faithful implementation of Dijkstra's original algorithm
- **Efficiency**: Optimized O(n²) time complexity for safety checking
- **Robustness**: Comprehensive error handling and edge case management
- **Scalability**: Supports up to 10 processes and 10 resource types

## 🔍 Code Quality & Standards

### Backend Standards
- **TypeScript Strict Mode**: Full type safety with strict compiler options
- **ESLint Configuration**: Comprehensive linting rules for code quality
- **Prettier Integration**: Consistent code formatting
- **Test Coverage**: >90% test coverage requirement
- **Documentation**: JSDoc comments for all public APIs

### Frontend Standards
- **React Best Practices**: Hooks, functional components, performance optimization
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Core Web Vitals optimization
- **Type Safety**: Strict TypeScript configuration
- **Component Testing**: React Testing Library best practices

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow
1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Follow coding standards** (ESLint, Prettier, TypeScript strict mode)
4. **Write comprehensive tests** (maintain >90% coverage)
5. **Update documentation** (README, JSDoc comments)
6. **Commit with conventional commits** (`feat:`, `fix:`, `docs:`, etc.)
7. **Push to branch** (`git push origin feature/amazing-feature`)
8. **Open Pull Request** with detailed description

### Code Review Process
- All PRs require review from maintainers
- Automated tests must pass
- Code coverage must not decrease
- Documentation must be updated for new features

### Issue Reporting
- Use issue templates for bug reports and feature requests
- Provide minimal reproduction cases
- Include environment details (Node.js version, browser, OS)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Third-Party Licenses
- Express.js - MIT License
- Next.js - MIT License
- React - MIT License
- TypeScript - Apache License 2.0

## 👨‍💻 Authors & Acknowledgments

### Primary Author
**AlphsX** - [GitHub Profile](https://github.com/AlphsX)
- Algorithm implementation and optimization
- Backend architecture and API design
- Frontend visualization and user experience

### Acknowledgments
- **Edsger Dijkstra** - Original Banker's Algorithm creator
- **Operating Systems Community** - Algorithm refinements and optimizations
- **Open Source Contributors** - Dependencies and tools that made this project possible

### Academic References
- Dijkstra, E. W. (1965). "Solution of a problem in concurrent programming control"
- Silberschatz, A., Galvin, P. B., & Gagne, G. "Operating System Concepts"
- Tanenbaum, A. S. "Modern Operating Systems"

---

*Built with ༝༚༝༚ using modern web technologies and classical computer science algorithms*

**🌟 If this project helped you understand the Banker's Algorithm, please consider giving it a star!**