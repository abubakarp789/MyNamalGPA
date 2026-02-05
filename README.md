# MyNamalGPA - Namal University GPA Calculator

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.19-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Security: Production Ready](https://img.shields.io/badge/Security-Production%20Ready-brightgreen)](./SECURITY.md)

MyNamalGPA is a modern, secure, and responsive web application designed specifically for **Namal University** students. It provides an intuitive interface to calculate GPAs accurately, strictly adhering to the **Pakistani Higher Education Commission (HEC)** grading standards.

Built with performance, security, and aesthetics in mind, this tool allows students to easily track their academic progress on any device with enterprise-grade security protections.

🌐 **Live Demo**: [https://mynamalgpa.vercel.app](https://mynamalgpa.vercel.app)

---

## ✨ Key Features

### 🎓 Academic Features
- **Accurate GPA Calculations**: Adheres strictly to Namal University and HEC grading scales (A=4.0 to F=0.0)
- **CGPA Tracking**: Calculate cumulative GPA across multiple semesters
- **Grade Visualization**: Interactive charts showing GPA trends over time
- **PDF Export**: Download your GPA results as a professionally formatted PDF
- **Share Links**: Generate shareable links to send your GPA calculations to others

### 🎨 UI/UX Features
- **Modern Interface**: Sleek, premium design built with **Tailwind CSS** and **shadcn/ui**
- **Dark Mode Support**: Built-in light and dark themes for comfortable viewing
- **Responsive Design**: Fully optimized for desktop, tablets, and mobile devices
- **Smooth Animations**: Framer Motion powered transitions and interactions
- **Real-time Updates**: Instant feedback and validation

### 🔒 Security Features (Enterprise-Grade)
- **XSS Protection**: All user inputs sanitized using DOMPurify
- **Content Security Policy (CSP)**: Comprehensive CSP headers prevent XSS and injection attacks
- **Prototype Pollution Protection**: Safe JSON parsing prevents prototype pollution attacks
- **PDF Injection Prevention**: Sanitized PDF output prevents malicious PDF injection
- **Secure ID Generation**: Cryptographically secure UUID generation using Web Crypto API
- **Security Headers**: X-Frame-Options, X-XSS-Protection, X-Content-Type-Options, and Referrer-Policy
- **Input Validation**: Strict validation on all user inputs with length and type checking
- **LocalStorage Security**: Safe data storage with validation and sanitization

---

## 🛠️ Technology Stack

This project is built using a modern, secure frontend ecosystem:

### Core Technologies
- **Framework**: [React](https://react.dev/) 18.3.1 + [Vite](https://vitejs.dev/) 5.4.19 for lightning-fast development and build
- **Language**: [TypeScript](https://www.typescriptlang.org/) 5.8.3 for type-safe code
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) 3.4.17 for utility-first styling
- **Components**: [shadcn/ui](https://ui.shadcn.com/) for accessible, reusable components (50+ components)
- **UI Library**: [Radix UI](https://www.radix-ui.com/) primitives for accessibility

### State Management & Data
- **Routing**: [React Router](https://reactrouter.com/en/main) 6.30.3 for client-side navigation
- **State Management**: [TanStack Query](https://tanstack.com/query/latest) 5.83.0 for server state management
- **Forms**: [React Hook Form](https://react-hook-form.com/) 7.61.1 + [Zod](https://zod.dev/) 3.25.76 for type-safe form validation

### Visualization & Export
- **Charts**: [Recharts](https://recharts.org/) 2.15.4 for visualizing GPA trends
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF) 4.1.0 + [html2canvas](https://html2canvas.hertzen.com/) 1.4.1 for transcript export
- **Animations**: [Framer Motion](https://www.framer.com/motion/) 12.31.1 for smooth transitions

### Security Libraries
- **XSS Protection**: [DOMPurify](https://github.com/cure53/DOMPurify) 3.3.1 for input sanitization
- **Icons**: [Lucide React](https://lucide.dev/) 0.462.0 for consistent iconography

---

## 💻 Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

- **Node.js**: v18.0.0 or higher (recommended: v20+)
- **npm**: v9.0.0 or higher (comes with Node.js)
- **Git**: For cloning the repository

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/abubakarp789/MyNamalGPA.git
   cd MyNamalGPA
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:8080`

4. **Build for production**
   ```bash
   npm run build
   ```
   The production build will be created in the `dist/` directory.

5. **Preview production build locally**
   ```bash
   npm run preview
   ```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

#### Option 1: Using Vercel CLI
```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod
```

#### Option 2: Git Integration (Auto-deploy)
1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Vite settings
6. Click "Deploy"

**Vercel Configuration** (already included in `vercel.json`):
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Security Headers**: Pre-configured with security headers

### Deploy to Netlify

#### Option 1: Using Netlify CLI
```bash
# Install Netlify CLI globally
npm i -g netlify-cli

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

#### Option 2: Drag & Drop
1. Run `npm run build` to create production build
2. Go to [Netlify](https://www.netlify.com/)
3. Drag and drop the `dist/` folder

#### Option 3: Git Integration
1. Push your code to GitHub
2. Connect your repository to Netlify
3. Build settings will be auto-configured
4. Deploy!

---

## 🔒 Security Audit Results

This project has undergone comprehensive security auditing and hardening. All critical and high-severity vulnerabilities have been resolved.

### Security Features Implemented

| Feature | Status | Description |
|---------|--------|-------------|
| **XSS Protection** | ✅ Implemented | All user inputs sanitized using DOMPurify |
| **Content Security Policy** | ✅ Implemented | CSP headers prevent XSS and data injection |
| **Prototype Pollution Prevention** | ✅ Implemented | Safe JSON parsing blocks `__proto__` and `constructor` |
| **PDF Injection Prevention** | ✅ Implemented | Course names sanitized before PDF generation |
| **Secure ID Generation** | ✅ Implemented | Uses `crypto.randomUUID()` instead of `Math.random()` |
| **Security Headers** | ✅ Implemented | X-Frame-Options, X-XSS-Protection, etc. |
| **Input Validation** | ✅ Implemented | Strict type and length validation on all inputs |
| **Clipboard API Security** | ✅ Implemented | Secure context validation before clipboard access |

### Vulnerability Summary

| Severity | Count | Status |
|----------|-------|--------|
| 🔴 Critical | 0 | All resolved |
| 🟠 High | 0 | All resolved |
| 🟡 Medium | 0 | All resolved |
| 🟢 Low | 0 | All resolved |

**✅ Production Ready - Safe to Deploy**

---

## 📊 HEC Pakistan Grading Scale

The application uses the official Pakistani Higher Education Commission (HEC) grading scale:

| Grade | Grade Points | Percentage Range |
|-------|--------------|------------------|
| A | 4.00 | 85-100% |
| A- | 3.67 | 80-84% |
| B+ | 3.33 | 75-79% |
| B | 3.00 | 70-74% |
| B- | 2.67 | 65-69% |
| C+ | 2.33 | 61-64% |
| C | 2.00 | 57-60% |
| C- | 1.67 | 53-56% |
| D+ | 1.33 | 50-52% |
| D | 1.00 | 45-49% |
| F | 0.00 | Below 45% |

---

## 📁 Project Structure

```
MyNamalGPA/
├── public/                   # Static assets
│   ├── logo.png             # Namal University logo
│   ├── placeholder.svg      # Placeholder image
│   └── robots.txt           # SEO robots configuration
├── src/
│   ├── assets/              # Project assets (images, fonts)
│   ├── components/          # React components
│   │   ├── ui/              # shadcn/ui components (50+ components)
│   │   └── landing/         # Landing page sections
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   │   ├── utils.ts         # General utilities
│   │   └── security.ts      # Security utilities (DOMPurify, sanitization)
│   ├── pages/               # Page components
│   ├── test/                # Test files
│   ├── App.tsx              # Main App component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── dist/                    # Production build output
├── index.html               # HTML entry point with security headers
├── package.json             # Dependencies and scripts
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── vercel.json              # Vercel deployment configuration
```

---

## 🧪 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (localhost:8080) |
| `npm run build` | Create production build |
| `npm run build:dev` | Create development build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |
| `npm run test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Run tests and linting**
   ```bash
   npm run lint
   npm run test
   ```
5. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request**

### Contribution Guidelines
- Follow the existing code style
- Ensure all tests pass
- Update documentation if needed
- Follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages

---

## 🐛 Bug Reports & Feature Requests

If you find a bug or have a feature request, please [open an issue](https://github.com/abubakarp789/MyNamalGPA/issues) on GitHub.

When reporting bugs, please include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser and OS information
- Screenshots (if applicable)

---

## 👨‍💻 Author

**Abu Bakar** - Developer 

- 🔗 LinkedIn: [linkedin.com/in/abubakar56](https://www.linkedin.com/in/abubakar56/)
- 🐙 GitHub: [github.com/abubakarp789](https://github.com/abubakarp789)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 Abu Bakar

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

## 🙏 Acknowledgments

- **Namal University** - For inspiring this project
- **Pakistan Higher Education Commission (HEC)** - For the official grading standards
- **shadcn/ui** - For the beautiful component library
- **Radix UI** - For accessible UI primitives
- **Vercel** - For providing excellent hosting services

---

## 📞 Support

If you need help or have questions:

- 📧 Email: [abubakarp789@gmail.com](mailto:abubakarp789@gmail.com)
- 💬 Open an issue on GitHub
- 🔗 Connect on LinkedIn
  [https://www.linkedin.com/in/abubakar56/](https://www.linkedin.com/in/abubakar56/)

---

<div align="center">

**Made with ❤️ for Namal University Students**

⭐ Star this repo if you find it helpful!

</div>
