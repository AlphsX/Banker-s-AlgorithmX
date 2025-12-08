<!-- markdownlint-disable MD033 MD041 MD013 -->
<div align="center">

# Banker's Algorithm Simulator ✨

**The interactive, production-ready implementation of Dijkstra's deadlock avoidance algorithm.**

Built with modern web technologies for educational and research purposes

[![Next.js](https://img.shields.io/badge/Next.js-16+-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-19.1-61DAFB?logo=react&logoColor=white)](https://reactjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Jest](https://img.shields.io/badge/Jest-30+-C21325?logo=jest&logoColor=white)](https://jestjs.io)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12+-FF0055?logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>

---

> **Note**
>
> **Production-Ready Banker's Algorithm Implementation**
>
> This is a comprehensive, interactive implementation of Dijkstra's Banker's Algorithm for deadlock avoidance in operating systems. Built with modern web technologies, it provides real-time visualization, step-by-step algorithm execution, and comprehensive testing capabilities.
>
> **Perfect for:** Computer Science education, operating systems courses, research demonstrations, and understanding resource allocation in concurrent systems.

---

**The Banker's Algorithm Simulator provides the fastest path from theory to practical understanding**, offering interactive visualization, real-time safety checking, and comprehensive algorithm analysis.

The [Banker's Algorithm](https://en.wikipedia.org/wiki/Banker%27s_algorithm) is a resource allocation and deadlock avoidance algorithm developed by Edsger Dijkstra. This simulator makes understanding and experimenting with the algorithm straightforward, with real-time visualization, step-by-step execution, and comprehensive validation.

```typescript
// Core algorithm implementation
const calculator = new BankersAlgorithmCalculator();
const safetyResult = calculator.checkSafety(available, allocation, need);

if (safetyResult.isSafe) {
  console.log(`Safe sequence: ${safetyResult.safeSequence.join(" → ")}`);
} else {
  console.log("System is in unsafe state - potential deadlock!");
}
```

## 📋 Table of Contents

- [What is the Banker's Algorithm?](#what-is-the-bankers-algorithm)
- [Why This Implementation?](#why-this-implementation)
- [Features](#features)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Usage](#usage)
- [Core Components](#core-components)
- [Algorithm Implementation](#algorithm-implementation)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Testing](#testing)
- [Architecture](#architecture)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Developer Information](#developer-information)

## What is the Banker's Algorithm?

The Banker's Algorithm is a deadlock avoidance algorithm used in operating systems to ensure that resource allocation never leads to a deadlock state. Developed by **Edsger Dijkstra** in 1965, it works by:

- **Resource Allocation**: Managing finite resources among multiple processes
- **Safety Checking**: Ensuring the system can always find a safe execution sequence
- **Request Processing**: Evaluating resource requests before granting them
- **Deadlock Prevention**: Avoiding states that could lead to circular waiting

The algorithm simulates a banker who lends money (resources) to customers (processes) while ensuring they can always collect all loans back.

### Key Concepts

- **Safe State**: A state where there exists at least one sequence of process execution that allows all processes to complete
- **Unsafe State**: A state that may lead to deadlock (but does not guarantee it)
- **Need Matrix**: `Need[i][j] = Max[i][j] - Allocation[i][j]` - remaining resource requirements
- **Safe Sequence**: An ordering of processes that can all complete without deadlock

## Why This Implementation?

This simulator handles all the complex algorithmic details while providing an intuitive interface for learning and experimentation.

🚀 **Interactive**: Real-time visualization with step-by-step algorithm execution  
🎓 **Educational**: Perfect for computer science courses and self-learning  
🔍 **Comprehensive**: Complete implementation with validation and error handling  
🧪 **Tested**: 31+ test cases covering edge cases and classical examples  
💻 **Modern**: Built with Next.js 16, TypeScript 5, and React 19  
📱 **Responsive**: Works seamlessly on desktop, tablet, and mobile devices  
🎨 **Beautiful UI**: Dark/light mode with smooth animations using Framer Motion  
⌨️ **Keyboard Shortcuts**: Efficient navigation and control for power users

## Features

### Core Algorithm Implementation

- **Safety Algorithm**: Complete implementation of Dijkstra's safety checking algorithm
- **Resource Request Processing**: Handles resource allocation requests with full validation
- **Step-by-Step Visualization**: Shows each algorithm step with detailed explanations
- **Multiple System States**: Support for 1-10 processes and 1-10 resource types
- **Process Completion**: Simulate processes finishing and releasing resources
- **System Validation**: Comprehensive validation of all system constraints

### Interactive Interface

- 🎯 **Real-time Matrix Editing**: Modify allocation, maximum, and available resources
- 🔄 **Dynamic System Sizing**: Adjust number of processes and resources on the fly
- 📊 **Request Simulation**: Submit resource requests and see immediate results
- 🎨 **Visual Feedback**: Color-coded results and animated state transitions
- 📱 **Touch-Friendly**: Optimized for mobile with swipe gestures
- 🌓 **Dark/Light Mode**: Automatic theme switching with system preference detection

### Educational Tools

- 📖 **Algorithm Steps**: Detailed breakdown of each algorithm iteration
- 🔢 **Step Numbering**: Clear step numbers (1-4) matching textbook algorithms
- ✅ **Safety Sequence Display**: Clear visualization of safe execution order
- ❌ **Error Explanations**: Comprehensive error messages for invalid states
- 📚 **Classical Examples**: Pre-loaded textbook examples for learning
- 🎓 **Detailed Documentation**: Complete algorithm explanation in this README

### Advanced Features

- ⌨️ **Keyboard Shortcuts**: Efficient navigation (Cmd/Ctrl+[, Cmd/Ctrl+D, Shift+Enter)
- 🔔 **Toast Notifications**: Beautiful animated notifications for all actions
- 💾 **State Persistence**: Maintains system state during navigation
- 🎭 **Animated UI**: Smooth transitions using Framer Motion
- 🧪 **Comprehensive Testing**: 31+ test cases with 100% coverage of core logic
- 📊 **System Statistics**: Track resource utilization and process completion

## Quick Start

### Prerequisites

- Bun 1.0+ (Node.js compatible)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone the repository
git clone https://github.com/AlphsX/Banker-s-AlgorithmX.git
cd bankers-algorithm-simulator/frontend

# Install dependencies
bun install

# Start development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### First Steps

1. **Explore Default Example**: The app loads with a safe system state
2. **Check Safety**: Click "Check Safety" or press `Shift+Enter`
3. **Modify Values**: Click any cell in the matrices to edit
4. **Submit Request**: Use the request panel to test resource allocation
5. **View Steps**: Scroll down to see detailed algorithm execution

## Usage

### Basic Configuration

The system starts with a default safe state:

```typescript
// Default configuration (2 processes, 3 resources)
Processes: 2 (P0, P1)
Resources: 3 (A, B, C)

Allocation Matrix:
P0: [1, 0, 0]  // P0 currently has: A=1, B=0, C=0
P1: [0, 1, 0]  // P1 currently has: A=0, B=1, C=0

Max Matrix:
P0: [2, 1, 1]  // P0 maximum needs: A=2, B=1, C=1
P1: [1, 2, 1]  // P1 maximum needs: A=1, B=2, C=1

Available: [2, 2, 3]  // Available resources: A=2, B=2, C=3

Need Matrix (calculated automatically):
P0: [1, 1, 1]  // [2,1,1] - [1,0,0] = [1,1,1]
P1: [1, 1, 1]  // [1,2,1] - [0,1,0] = [1,1,1]
```

### Checking System Safety

Click "Check Safety" or press `Shift+Enter` to run the safety algorithm:

```text
Step 1: Initialize Work = [2, 2, 3], Finish = [false, false]
Step 2: Check P0: Need[P0] = [1,1,1] ≤ Work = [2,2,3] [PASS]
Step 3: P0 finishes: Work = [2,2,3] + [1,0,0] = [3,2,3]
Step 2: Check P1: Need[P1] = [1,1,1] ≤ Work = [3,2,3] [PASS]
Step 3: P1 finishes: Work = [3,2,3] + [0,1,0] = [3,3,3]
Step 4: All processes finished [PASS] Safe Sequence: P0 → P1
```

### Submitting Resource Requests

1. Select a process from the dropdown
2. Enter requested resources for each type
3. Click "Submit Request"
4. View the detailed validation and safety check

Example request:

```typescript
Process: P0
Request: [1, 0, 0]  // P0 requests 1 unit of resource A

Validation:
[PASS] Step 1: Request ≤ Need ([1,0,0] ≤ [1,1,1])
[PASS] Step 2: Request ≤ Available ([1,0,0] ≤ [2,2,3])
[PASS] Step 3: Simulate allocation
[PASS] Step 4: System remains safe → REQUEST GRANTED
```

### Adjusting System Size

Use the controls in the sidebar to:

- **Process Count**: 1-10 processes
- **Resource Count**: 1-10 resource types
- **Available Resources**: Set available units for each resource type

### Resetting the System

- **Reset Button**: Clears all values while preserving counts
- **Logo Click**: Reloads the default safe example
- **Keyboard**: Press `Cmd/Ctrl+N` to reset

## Core Components

### The `BankersAlgorithmCalculator`

The central class implementing Dijkstra's algorithm with comprehensive validation and step tracking.

```typescript
import { BankersAlgorithmCalculator } from "@/lib/bankers-algorithm-calculator";

const calculator = new BankersAlgorithmCalculator();

// Check system safety
const safetyResult = calculator.checkSafety(available, allocation, need);
// Returns: { isSafe, safeSequence, steps, finalFinishState }

// Process resource request
const requestResult = calculator.processRequest(request, currentState);
// Returns: { canGrant, newState?, errorMessage?, simulationSteps? }

// Validate system state
const errors = calculator.validateSystemState(state);
// Returns: ValidationError[]

// Complete a process (release resources)
const newState = calculator.completeProcess(state, processId);

// Get system snapshot with statistics
const snapshot = calculator.getSystemSnapshot(state);
```

### Type Definitions

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
  lastUpdated?: Date;
}

interface AlgorithmStep {
  stepNumber: number | string;
  description: string;
  workVector: number[];
  processChecked?: string;
  canFinish?: boolean;
  isHighlighted?: boolean;
}

interface ResourceRequest {
  processId: number;
  requestVector: number[];
}
```

### Matrix Utilities

Comprehensive utility functions for matrix operations:

```typescript
import {
  calculateNeedMatrix,
  isVectorLessOrEqual,
  addVectors,
  cloneMatrix,
  validateMatrixValues,
  validateAllocationConstraints,
} from "@/utils/matrix-utils";

// Calculate Need = Max - Allocation
const need = calculateNeedMatrix(max, allocation);

// Check if vector a ≤ vector b (component-wise)
const canAllocate = isVectorLessOrEqual(request, available);

// Add two vectors
const newWork = addVectors(work, allocation[i]);

// Validate matrix constraints
const errors = validateAllocationConstraints(allocation, max);
```

## Algorithm Implementation

### Safety Algorithm

Based on Dijkstra's original algorithm with optimized implementation:

```typescript
/**
 * Safety Algorithm Steps:
 * 1. Initialize Work = Available and Finish[i] = false for all processes
 * 2. Find process Pi where Finish[i] = false and Need[i] ≤ Work
 * 3. If found: Work = Work + Allocation[i], Finish[i] = true, repeat step 2
 * 4. If all Finish[i] = true, system is safe; otherwise unsafe
 */
checkSafety(available: number[], allocation: number[][], need: number[][]): SafetyResult
```

**Implementation Details:**

- Uses work vector to simulate available resources
- Iterates through processes to find those that can complete
- Simulates resource release when process completes
- Tracks detailed steps for educational visualization
- Returns safe sequence if system is safe

### Resource Request Algorithm

Comprehensive request processing with safety verification:

```typescript
/**
 * Resource Request Steps:
 * 1. Check if Request[i] ≤ Need[i] (does not exceed declared maximum)
 * 2. Check if Request[i] ≤ Available (resources are available)
 * 3. Temporarily allocate resources and check if resulting state is safe
 * 4. If safe, grant request; otherwise, deny and rollback
 */
processRequest(request: ResourceRequest, currentState: BankersAlgorithmState): RequestResult
```

**Implementation Details:**

- Validates request against declared maximum needs
- Checks resource availability
- Simulates allocation without committing changes
- Runs safety algorithm on simulated state
- Commits changes only if safe, otherwise rolls back

### Validation System

Comprehensive validation of all system constraints:

```typescript
// Validates entire system state
validateSystemState(state: BankersAlgorithmState): ValidationError[]

// Validates system data integrity
validateSystemData(state: BankersAlgorithmState): ValidationError[]

// Validates matrix values (non-negative integers)
validateMatrixValues(matrix: number[][]): ValidationError[]

// Validates allocation constraints (Allocation ≤ Max)
validateAllocationConstraints(allocation: number[][], max: number[][]): ValidationError[]
```

## Keyboard Shortcuts

Power user features for efficient navigation and control:

| Shortcut        | Action         | Description                        |
| --------------- | -------------- | ---------------------------------- |
| `Cmd/Ctrl + [`  | Toggle Sidebar | Show/hide the control sidebar      |
| `Cmd/Ctrl + D`  | Toggle Theme   | Switch between dark and light mode |
| `Shift + Enter` | Check Safety   | Run the safety algorithm           |

**Platform-specific:**

- Mac: Use `Cmd` key
- Windows/Linux: Use `Ctrl` key

## Testing

The project includes comprehensive test coverage with 31+ test cases:

```bash
# Run all tests
bun run test

# Run tests with coverage
bun run test:coverage

# Run tests in watch mode
bun run test:watch

# Run specific test file
bun run test -- --testPathPattern=bankers-algorithm
```

### Test Categories

#### Safety Algorithm Tests (6 tests)

- Classical textbook examples
- Safe state identification
- Unsafe state detection
- Detailed step tracking

#### Resource Request Tests (9 tests)

- Request validation
- Availability checking
- Safety verification
- Grant/deny logic

#### Process Completion Tests (3 tests)

- Resource release simulation
- State updates
- Completion validation

#### System Validation Tests (4 tests)

- Matrix dimension validation
- Value range checking
- Constraint validation
- Error reporting

#### Additional Tests (9 tests)

- System snapshots and statistics
- Algorithm step numbering
- Safe sequence finding
- Matrix resizing

### Test Coverage

```bash
bun run test:coverage
```

Expected coverage:

- Statements: >95%
- Branches: >90%
- Functions: >95%
- Lines: >95%

## Architecture

### Project Structure

```text
bankers-algorithm-simulator/
├── frontend/
│   ├── src/
│   │   ├── app/                          # Next.js app router
│   │   │   ├── layout.tsx               # Root layout with theme provider
│   │   │   ├── page.tsx                 # Main algorithm interface
│   │   │   └── globals.css              # Global styles and CSS variables
│   │   ├── components/
│   │   │   ├── bankers-algorithm/       # Algorithm-specific components
│   │   │   │   ├── AlgorithmTable.tsx   # Matrix display and editing
│   │   │   │   ├── SystemControls.tsx   # Process/resource controls
│   │   │   │   ├── StepByStepResults.tsx # Algorithm step visualization
│   │   │   │   ├── RequestPanel.tsx     # Resource request interface
│   │   │   │   ├── ProcessControl.tsx   # Process count control
│   │   │   │   ├── ResourceControl.tsx  # Resource count control
│   │   │   │   ├── AvailableResourcesInput.tsx
│   │   │   │   └── AnimatedFinishBadge.tsx
│   │   │   ├── ui/                      # Reusable UI components
│   │   │   │   ├── toast.tsx            # Toast notification system
│   │   │   │   ├── loading-screen.tsx   # Loading state
│   │   │   │   └── browser-compatibility-warning.tsx
│   │   │   └── magicui/                 # Enhanced UI components
│   │   │       └── AnimatedThemeToggler.tsx
│   │   ├── lib/                         # Core algorithm implementation
│   │   │   ├── bankers-algorithm-calculator.ts  # Main algorithm
│   │   │   └── __tests__/               # Test files
│   │   │       └── bankers-algorithm-enhanced.test.ts
│   │   ├── types/                       # TypeScript type definitions
│   │   │   └── bankers-algorithm.ts     # Core types and interfaces
│   │   ├── utils/                       # Utility functions
│   │   │   └── matrix-utils.ts          # Matrix operations
│   │   ├── hooks/                       # Custom React hooks
│   │   │   ├── useDarkMode.ts           # Theme management
│   │   │   ├── useKeyboardShortcuts.ts  # Keyboard shortcuts
│   │   │   ├── useSwipeGesture.ts       # Touch gestures
│   │   │   ├── useDynamicFavicon.ts     # Favicon theming
│   │   │   ├── useAppLoading.ts         # Loading state
│   │   │   ├── useMediaQuery.ts         # Responsive utilities
│   │   │   └── useIdleDetection.ts      # Idle detection
│   │   └── styles/                      # Additional stylesheets
│   │       └── animations.css           # Custom animations
│   ├── public/                          # Static assets
│   ├── jest.config.js                   # Jest configuration
│   ├── jest.setup.js                    # Jest setup
│   ├── tailwind.config.ts               # Tailwind configuration
│   ├── tsconfig.json                    # TypeScript configuration
│   └── package.json                     # Dependencies
└── README.md                            # This file
```

### Key Technologies

| Technology                | Version | Purpose                         |
| ------------------------- | ------- | ------------------------------- |
| **Next.js**               | 16.0+   | React framework with app router |
| **React**                 | 19.1    | UI library                      |
| **TypeScript**            | 5+      | Type-safe development           |
| **Tailwind CSS**          | 3.4+    | Utility-first styling           |
| **Framer Motion**         | 12+     | Smooth animations               |
| **Jest**                  | 30+     | Testing framework               |
| **React Testing Library** | 16+     | Component testing               |
| **Zustand**               | 5+      | State management                |
| **Lucide React**          | Latest  | Icon library                    |

### Design Patterns

- **Component Composition**: Modular, reusable components
- **Custom Hooks**: Encapsulated logic for reusability
- **Type Safety**: Comprehensive TypeScript types
- **Separation of Concerns**: Clear separation between UI and logic
- **Test-Driven Development**: Tests written alongside features

## Deployment

### Development

```bash
cd frontend
bun install
bun run dev
```

Starts the development server at `http://localhost:3000` with:

- Hot module replacement
- Fast refresh
- TypeScript checking
- ESLint validation

### Production Build

```bash
# Build optimized production bundle
bun run build

# Start production server
bun run start
```

The build process:

- Optimizes and minifies code
- Generates static assets
- Creates production-ready bundle
- Enables performance optimizations

### Static Export

For static hosting (GitHub Pages, Netlify, Vercel):

```bash
bun run build
# Output in .next/ directory
```

### Docker Deployment

```dockerfile
FROM oven/bun:1 AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["bun", "server.js"]
```

Build and run:

```bash
docker build -t bankers-algorithm .
docker run -p 3000:3000 bankers-algorithm
```

### Environment Variables

Create `.env.local` for local development:

```bash
# Optional: Analytics
NEXT_PUBLIC_GA_ID=your-ga-id

# Optional: Error tracking
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

## Contributing

Contributions are welcome! This project follows standard open-source practices.

### Development Workflow

1. **Fork the Repository**

   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/yourusername/bankers-algorithm-simulator.git
   cd bankers-algorithm-simulator/frontend
   ```

2. **Create a Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Install Dependencies**

   ```bash
   bun install
   ```

4. **Make Changes**

   - Write clean, documented code
   - Follow existing code style
   - Add tests for new features
   - Update documentation as needed

5. **Test Your Changes**

   ```bash
   # Run tests
   bun run test

   # Check linting
   bun run lint

   # Build to verify
   bun run build
   ```

6. **Commit and Push**

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   git push origin feature/your-feature-name
   ```

7. **Create Pull Request**
   - Open a PR on GitHub
   - Describe your changes in detail
   - Link any related issues
   - Wait for review

### Code Standards

#### TypeScript

- Use strict type checking
- Avoid `any` types
- Document complex types
- Use interfaces for objects

#### React Components

- Use functional components
- Implement proper prop types
- Use hooks appropriately
- Keep components focused

#### Testing Standards

- Write tests for new features
- Maintain >90% coverage
- Test edge cases
- Use descriptive test names

#### Documentation

- Update README for new features
- Add JSDoc comments
- Include usage examples
- Document breaking changes

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```text
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting changes
refactor: code refactoring
test: add or update tests
chore: maintenance tasks
```

### Areas for Contribution

- 🐛 **Bug Fixes**: Report and fix bugs
- ✨ **Features**: Add new algorithm features
- 📚 **Documentation**: Improve docs and examples
- 🧪 **Tests**: Increase test coverage
- 🎨 **UI/UX**: Enhance user interface
- ♿ **Accessibility**: Improve accessibility
- 🌐 **i18n**: Add internationalization
- ⚡ **Performance**: Optimize performance

## Algorithm Background

### Historical Context

The Banker's Algorithm was developed by **Edsger Dijkstra** in 1965 as part of his work on the THE multiprogramming system. It is named after the way bankers manage loans to ensure they can always meet withdrawal demands.

### Theoretical Foundation

**Safe State Definition**: A state is safe if there exists a sequence of processes ⟨P₁, P₂, ..., Pₙ⟩ such that for each Pᵢ, the resources that Pᵢ can still request can be satisfied by the currently available resources plus the resources held by all Pⱼ where j < i.

**Key Theorem**: If a system is in a safe state, no deadlock can occur. If a system is in an unsafe state, deadlock may occur (but is not guaranteed).

### Real-World Applications

- **Operating Systems**: Process scheduling and resource management
- **Database Systems**: Transaction management and lock allocation
- **Cloud Computing**: Virtual machine resource allocation
- **Network Systems**: Bandwidth and connection management
- **Manufacturing**: Production line resource scheduling

### Complexity Analysis

- **Time Complexity**: O(m × n²) where m = resources, n = processes
- **Space Complexity**: O(m × n) for storing matrices
- **Worst Case**: Must check all processes in each iteration

### Limitations

- Requires advance knowledge of maximum resource needs
- Number of processes must be fixed
- Resources must be fixed and known
- Processes must eventually release resources
- Not practical for systems with dynamic resource requirements

## Related Algorithms

- **Deadlock Detection**: Detects existing deadlocks
- **Wait-Die/Wound-Wait**: Timestamp-based deadlock prevention
- **Resource Allocation Graph**: Visual deadlock detection
- **Two-Phase Locking**: Database transaction management

## References

- Dijkstra, E. W. (1965). "Cooperating sequential processes"
- Silberschatz, A., Galvin, P. B., & Gagne, G. (2018). "Operating System Concepts"
- Tanenbaum, A. S. (2014). "Modern Operating Systems"
- [GeeksforGeeks: Banker's Algorithm](https://www.geeksforgeeks.org/bankers-algorithm-in-operating-system-2/)

## Developer Information

### Project Maintainer

**Senior Full-Stack Developer** specializing in Operating Systems, Algorithms, and Educational Technology

#### Technical Expertise

**Core Competencies:**

- 🎓 Operating Systems & Concurrent Programming
- 🧮 Algorithm Design & Analysis
- 💻 Modern Web Technologies (React, Next.js, TypeScript)
- 📚 Educational Software Development
- ⚡ Performance Optimization & Testing
- 🏗️ System Architecture & Design Patterns

**Technology Stack:**

- **Frontend**: React 19, Next.js 16, TypeScript 5, Tailwind CSS
- **State Management**: Zustand, React Hooks
- **Animation**: Framer Motion, CSS Animations
- **Testing**: Jest 30, React Testing Library
- **Build Tools**: Webpack, Turbopack, SWC
- **Development**: ESLint, Prettier, Git

**Specializations:**

- Deadlock avoidance algorithms and resource allocation
- Interactive algorithm visualization
- Real-time system simulation
- Educational tool development
- Responsive and accessible UI design
- Comprehensive testing strategies

#### Project Philosophy

This project represents the intersection of theoretical computer science and practical software engineering. The goal is to make complex operating system concepts accessible through:

- **Interactive Learning**: Hands-on experimentation with real algorithms
- **Visual Understanding**: Step-by-step visualization of algorithm execution
- **Production Quality**: Professional-grade code and architecture
- **Open Source**: Free and accessible to students worldwide
- **Best Practices**: Modern development standards and patterns

#### Development Approach

- **Test-Driven Development**: 31+ comprehensive test cases
- **Type Safety**: Full TypeScript coverage with strict mode
- **Documentation**: Extensive inline comments and external docs
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Optimized rendering and state management
- **Maintainability**: Clean code principles and SOLID design

#### Open Source Commitment

Committed to creating high-quality educational tools that bridge the gap between academic theory and practical implementation. This project serves as:

- 📖 A learning resource for computer science students
- 🔬 A research tool for algorithm analysis
- 🎓 A teaching aid for operating systems courses
- 💡 A reference implementation of Dijkstra's algorithm
- 🌍 A contribution to the open-source education community

### Contact & Links

- **GitHub**: [@AlphsX](https://github.com/AlphsX)
- **YouTube**: [@AccioLabsX](https://www.youtube.com/channel/UCNn7PEFI65qIkR2bbK3yveQ)

### Acknowledgments

Special thanks to:

- **Edsger Dijkstra** for the original algorithm
- **Operating Systems community** for educational resources
- **Open source contributors** for inspiration and tools
- **Computer Science educators** for feedback and suggestions

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```text
MIT License

Copyright (c) 2025 [AlphsX]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❣️ for the computer science education community

© 2025 AlphsX, Inc.

</div>
