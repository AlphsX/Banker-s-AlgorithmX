<div align="center">

# Banker's Algorithm Simulator ✨

**The interactive, production-ready implementation of Dijkstra's deadlock avoidance algorithm.**

*Built with modern web technologies for educational and research purposes*

[![Next.js](https://img.shields.io/badge/Next.js-15+-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-19+-61DAFB?logo=react&logoColor=white)](https://reactjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3+-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Jest](https://img.shields.io/badge/Jest-Testing-C21325?logo=jest&logoColor=white)](https://jestjs.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

> **Note**
> 
> #### Production-Ready Banker's Algorithm Implementation
> 
> This is a comprehensive, interactive implementation of Dijkstra's Banker's Algorithm for deadlock avoidance in operating systems. Built with modern web technologies, it provides real-time visualization, step-by-step algorithm execution, and comprehensive testing capabilities.
> 
> **Perfect for:** Computer Science education, operating systems courses, research demonstrations, and understanding resource allocation in concurrent systems.

---

**The Banker's Algorithm Simulator provides the fastest path from theory to practical understanding**, offering interactive visualization, real-time safety checking, and comprehensive algorithm analysis.

The [Banker's Algorithm](https://en.wikipedia.org/wiki/Banker%27s_algorithm) is a resource allocation and deadlock avoidance algorithm developed by Edsger Dijkstra. This simulator makes understanding and experimenting with the algorithm simple, with real-time visualization, step-by-step execution, and comprehensive validation.

```typescript
// Core algorithm implementation
const calculator = new BankersAlgorithmCalculator();
const safetyResult = calculator.checkSafety(available, allocation, need);

if (safetyResult.isSafe) {
  console.log(`Safe sequence: ${safetyResult.safeSequence.join(' → ')}`);
} else {
  console.log('System is in unsafe state - potential deadlock!');
}
```

## What is the Banker's Algorithm?

The Banker's Algorithm is a deadlock avoidance algorithm used in operating systems to ensure that resource allocation never leads to a deadlock state. It works by:

- **Resource Allocation**: Managing finite resources among multiple processes
- **Safety Checking**: Ensuring the system can always find a safe execution sequence
- **Request Processing**: Evaluating resource requests before granting them
- **Deadlock Prevention**: Avoiding states that could lead to circular waiting

The algorithm simulates a banker who lends money (resources) to customers (processes) while ensuring they can always collect all loans back.

## Why This Implementation?

This simulator handles all the complex algorithmic details while providing an intuitive interface for learning and experimentation.

🚀 **Interactive**: Real-time visualization with step-by-step algorithm execution  
🎓 **Educational**: Perfect for computer science courses and self-learning  
🔍 **Comprehensive**: Complete implementation with validation and error handling  
🧪 **Tested**: Extensive test suite covering edge cases and classical examples  
💻 **Modern**: Built with Next.js, TypeScript, and modern web standards  
📱 **Responsive**: Works seamlessly on desktop, tablet, and mobile devices

## Features

### Core Algorithm Implementation
- **Safety Algorithm**: Complete implementation of Dijkstra's safety checking algorithm
- **Resource Request Processing**: Handles resource allocation requests with validation
- **Step-by-Step Visualization**: Shows each algorithm step with detailed explanations
- **Multiple System States**: Support for various process and resource configurations

### Interactive Interface
- **Real-time Matrix Editing**: Modify allocation, maximum, and available resources
- **Dynamic System Sizing**: Adjust number of processes and resources on the fly
- **Request Simulation**: Submit resource requests and see immediate results
- **Visual Feedback**: Color-coded results and animated state transitions

### Educational Tools
- **Algorithm Steps**: Detailed breakdown of each algorithm iteration
- **Safety Sequence Display**: Clear visualization of safe execution order
- **Error Explanations**: Comprehensive error messages for invalid states
- **Classical Examples**: Pre-loaded textbook examples for learning

### Advanced Features
- **Dark/Light Mode**: Automatic theme switching with system preference detection
- **Keyboard Shortcuts**: Efficient navigation and control
- **Mobile Optimization**: Touch-friendly interface with swipe gestures
- **Export Capabilities**: Save and share system configurations

## Installation

We recommend using [Node.js](https://nodejs.org/) 18+ and [npm](https://www.npmjs.com/):

```bash
# Clone the repository
git clone https://github.com/yourusername/bankers-algorithm-simulator.git
cd bankers-algorithm-simulator

# Install dependencies
npm install

# Start development server
npm run dev
```

For production deployment:

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Quick Start

### Basic Usage

1. **Set System Parameters**: Configure the number of processes and resource types
2. **Input Resource Data**: Fill in the allocation, maximum, and available matrices
3. **Check Safety**: Run the safety algorithm to verify system state
4. **Submit Requests**: Test resource allocation requests
5. **Analyze Results**: Review step-by-step algorithm execution

### Example Configuration

```typescript
// Safe system state example
const systemState = {
  processCount: 3,
  resourceCount: 3,
  allocation: [
    [0, 1, 0], // P0: currently allocated
    [2, 0, 0], // P1: currently allocated  
    [3, 0, 2], // P2: currently allocated
  ],
  max: [
    [7, 5, 3], // P0: maximum needs
    [3, 2, 2], // P1: maximum needs
    [9, 0, 2], // P2: maximum needs
  ],
  available: [3, 3, 2], // Available resources
};
```

## Core Components

### The `BankersAlgorithmCalculator`

The central class implementing Dijkstra's algorithm with comprehensive validation and step tracking.

```typescript
import { BankersAlgorithmCalculator } from '@/lib/bankers-algorithm-calculator';

const calculator = new BankersAlgorithmCalculator();

// Check system safety
const safetyResult = calculator.checkSafety(available, allocation, need);

// Process resource request
const requestResult = calculator.processRequest(request, currentState);

// Validate system state
const errors = calculator.validateSystemState(state);
```

### Algorithm Visualization

Real-time visualization of algorithm execution with detailed step tracking:

```typescript
// Each algorithm step includes:
interface AlgorithmStep {
  stepNumber: number;
  description: string;
  workVector: number[];
  processChecked?: string;
  canFinish?: boolean;
  isHighlighted?: boolean;
}
```

### Resource Request Processing

Comprehensive request validation following the classical algorithm:

```typescript
// Resource request with full validation
interface ResourceRequest {
  processId: number;
  requestVector: number[];
}

// Request processing includes:
// 1. Check if Request ≤ Need
// 2. Check if Request ≤ Available  
// 3. Simulate allocation
// 4. Run safety algorithm on new state
```

### System State Management

Complete system state tracking with validation:

```typescript
interface BankersAlgorithmState {
  processCount: number;
  resourceCount: number;
  allocation: number[][];
  max: number[][];
  available: number[];
  need: number[][];
  finish: boolean[];
  safeSequence: string[];
  algorithmSteps: AlgorithmStep[];
  isCalculating: boolean;
  isSafe?: boolean;
}
```

## Algorithm Implementation

### Safety Algorithm

Based on Dijkstra's original algorithm with optimized implementation:

1. **Initialize**: Set Work = Available and Finish[i] = false for all processes
2. **Find Process**: Locate process Pi where Finish[i] = false and Need[i] ≤ Work
3. **Simulate Completion**: Set Work = Work + Allocation[i] and Finish[i] = true
4. **Repeat**: Continue until all processes finish or no process can proceed
5. **Determine Safety**: System is safe if all Finish[i] = true

### Resource Request Algorithm

Comprehensive request processing with safety verification:

1. **Validate Request**: Ensure Request[i] ≤ Need[i] (doesn't exceed declared maximum)
2. **Check Availability**: Verify Request[i] ≤ Available (resources are available)
3. **Simulate Allocation**: Temporarily allocate resources
4. **Safety Check**: Run safety algorithm on resulting state
5. **Grant or Deny**: Approve if safe, otherwise deny and rollback

## Testing

The project includes comprehensive test coverage for all algorithm components:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- --testPathPattern=bankers-algorithm

# Run tests in watch mode
npm run test:watch
```

### Test Categories

- **Classical Examples**: Textbook examples with known safe/unsafe states
- **Edge Cases**: Boundary conditions and error scenarios  
- **Request Processing**: Resource allocation request validation
- **Matrix Operations**: Mathematical utility function testing
- **State Validation**: System state consistency checking

## Architecture

### Frontend Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── layout.tsx         # Root layout with theme provider
│   │   ├── page.tsx           # Main algorithm interface
│   │   └── globals.css        # Global styles and CSS variables
│   ├── components/
│   │   ├── bankers-algorithm/ # Algorithm-specific components
│   │   │   ├── AlgorithmTable.tsx
│   │   │   ├── SystemControls.tsx
│   │   │   ├── StepByStepResults.tsx
│   │   │   └── RequestPanel.tsx
│   │   ├── ui/               # Reusable UI components
│   │   └── magicui/          # Enhanced UI components
│   ├── lib/                  # Core algorithm implementation
│   │   ├── bankers-algorithm-calculator.ts
│   │   └── __tests__/        # Test files
│   ├── types/                # TypeScript type definitions
│   ├── utils/                # Utility functions
│   ├── hooks/                # Custom React hooks
│   └── styles/               # Additional stylesheets
```

### Key Technologies

- **Next.js 15+**: React framework with app router
- **TypeScript 5+**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **Jest**: Testing framework
- **React Testing Library**: Component testing

## Deployment

### Development

```bash
npm run dev
```

Starts the development server at `http://localhost:3000` with hot reloading.

### Production

```bash
# Build optimized production bundle
npm run build

# Start production server
npm start
```

### Static Export

```bash
# Generate static files for deployment
npm run build
npm run export
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Contributing

Contributions are welcome! This project follows standard open-source practices.

### Development Setup

1. **Fork and Clone**: Fork the repository and clone your fork
2. **Install Dependencies**: Run `npm install` to install all dependencies
3. **Start Development**: Use `npm run dev` to start the development server
4. **Make Changes**: Implement your feature or bug fix
5. **Test**: Ensure all tests pass with `npm test`
6. **Submit PR**: Create a pull request with a clear description

### Code Standards

- **TypeScript**: All code must be properly typed
- **Testing**: New features require corresponding tests
- **Documentation**: Update documentation for API changes
- **Linting**: Code must pass ESLint checks
- **Formatting**: Use Prettier for consistent formatting

### Test Requirements

```bash
# All tests must pass
npm test

# Code coverage should be maintained
npm run test:coverage

# Linting must pass
npm run lint

# Type checking must pass
npm run type-check
```

## Algorithm Background

The Banker's Algorithm was developed by Edsger Dijkstra in 1965 as part of his work on the THE multiprogramming system. It's named after the way bankers manage loans to ensure they can always meet withdrawal demands.

### Key Concepts

- **Safe State**: A state where there exists at least one sequence of process execution that allows all processes to complete
- **Unsafe State**: A state that may lead to deadlock (but doesn't guarantee it)
- **Deadlock**: A situation where processes are permanently blocked waiting for resources held by other blocked processes
- **Resource Allocation Graph**: Visual representation of resource allocation and requests

### Real-World Applications

- **Operating Systems**: Process scheduling and resource management
- **Database Systems**: Transaction management and lock allocation
- **Cloud Computing**: Virtual machine resource allocation
- **Network Systems**: Bandwidth and connection management

---

## Developer Information

**Project Maintainer**: Senior Full-Stack Developer  
**Specialization**: Operating Systems, Algorithms, and Educational Technology  
**Experience**: 10+ years in system programming and web development  

**Technical Expertise**:
- Operating Systems and Concurrent Programming
- Algorithm Design and Analysis  
- Modern Web Technologies (React, Next.js, TypeScript)
- Educational Software Development
- Performance Optimization and Testing

**Contact**: 
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn Profile](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

**Open Source Philosophy**: Committed to creating high-quality educational tools that make complex computer science concepts accessible to students and professionals worldwide. This project represents the intersection of theoretical computer science and practical software engineering.

---

*Made with ❣️ for the computer science education community*