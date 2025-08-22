import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/ErrorBoundary/ErrorBoundary.tsx
import { Component } from 'react'; // ✅ type-only import
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    componentDidCatch(error, info) {
        console.error('Error caught by boundary:', error, info);
    }
    render() {
        if (this.state.hasError) {
            return (_jsxs("div", { style: { padding: '2rem', color: 'red', textAlign: 'center' }, children: [_jsx("h2", { children: "Something went wrong." }), _jsx("p", { children: "Please refresh the page or try again later." })] }));
        }
        return this.props.children;
    }
}
export default ErrorBoundary;
