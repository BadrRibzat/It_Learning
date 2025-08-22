import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useTranslation } from 'react-i18next';
import './Features.css';
const Features = () => {
    const { t } = useTranslation();
    const features = [
        {
            icon: "🃏",
            title: "Interactive Flashcards",
            description: "Flip cards to learn commands with real-world explanations and use cases. Each card includes context, examples, and best practices.",
            highlights: ["Real-world scenarios", "Command variations", "Best practices"]
        },
        {
            icon: "🎯",
            title: "Smart Answer Validation",
            description: "Accepts command variations and aliases with intelligent regex matching. Learn the way you think, not just one rigid format.",
            highlights: ["Flexible input", "Alias recognition", "Typo tolerance"]
        },
        {
            icon: "📊",
            title: "Progress Tracking",
            description: "Visual progress rings and mastery tracking show your journey from beginner to expert across all tech stacks.",
            highlights: ["Visual progress", "Mastery levels", "Achievement system"]
        },
        {
            icon: "🌍",
            title: "Multi-Language Support",
            description: "Learn in your preferred language with full internationalization support for Arabic, English, French, Spanish, and German.",
            highlights: ["5 languages", "RTL support", "Cultural adaptation"]
        },
        {
            icon: "📱",
            title: "Mobile-First Design",
            description: "Responsive design that works perfectly on all devices. Learn on your phone, tablet, or desktop with the same great experience.",
            highlights: ["Touch-friendly", "Offline capable", "Cross-platform"]
        },
        {
            icon: "⚡",
            title: "Spaced Repetition",
            description: "Intelligent algorithm shows you cards when you're about to forget them, maximizing retention and minimizing study time.",
            highlights: ["Memory optimization", "Adaptive timing", "Efficient learning"]
        },
        {
            icon: "🔧",
            title: "Real-World Commands",
            description: "Every command is used in production environments. No toy examples - only the CLI skills that matter in your career.",
            highlights: ["Production-ready", "Industry standard", "Career-focused"]
        },
        {
            icon: "🎨",
            title: "Modern UI/UX",
            description: "Beautiful glassmorphism design with smooth animations and intuitive interactions that make learning enjoyable.",
            highlights: ["Glassmorphism", "Smooth animations", "Intuitive design"]
        },
        {
            icon: "🔐",
            title: "Secure & Private",
            description: "Your learning data is protected with JWT authentication, email verification, and secure data handling practices.",
            highlights: ["JWT security", "Email verification", "Data protection"]
        }
    ];
    const techStacks = [
        { name: "Bash", icon: "🐚", commands: 45 },
        { name: "Docker", icon: "🐳", commands: 52 },
        { name: "Git", icon: "📚", commands: 38 },
        { name: "Kubernetes", icon: "☸️", commands: 67 },
        { name: "Linux", icon: "🐧", commands: 73 },
        { name: "MongoDB", icon: "🍃", commands: 41 },
        { name: "PostgreSQL", icon: "🐘", commands: 49 },
        { name: "Python", icon: "🐍", commands: 35 },
        { name: "Redis", icon: "🔴", commands: 28 },
        { name: "Cloud", icon: "☁️", commands: 56 },
        { name: "NPM", icon: "📦", commands: 33 }
    ];
    return (_jsxs("div", { className: "features-container", children: [_jsx("section", { className: "features-hero", children: _jsx("div", { className: "container", children: _jsxs("div", { className: "hero-content", children: [_jsxs("h1", { className: "hero-title", children: ["Why ", _jsx("span", { className: "gradient-text", children: "IT-Learning" }), " Works"] }), _jsx("p", { className: "hero-subtitle", children: "Discover the features that make command line mastery achievable, enjoyable, and effective for developers at every level." })] }) }) }), _jsx("section", { className: "features-grid-section", children: _jsx("div", { className: "container", children: _jsx("div", { className: "features-grid", children: features.map((feature, index) => (_jsxs("div", { className: "feature-card", children: [_jsx("div", { className: "feature-icon", children: feature.icon }), _jsx("h3", { className: "feature-title", children: feature.title }), _jsx("p", { className: "feature-description", children: feature.description }), _jsx("div", { className: "feature-highlights", children: feature.highlights.map((highlight, idx) => (_jsx("span", { className: "highlight-tag", children: highlight }, idx))) })] }, index))) }) }) }), _jsx("section", { className: "tech-overview-section", children: _jsxs("div", { className: "container", children: [_jsxs("div", { className: "section-header", children: [_jsx("h2", { className: "section-title", children: "Comprehensive Tech Coverage" }), _jsx("p", { className: "section-subtitle", children: "Master the essential technologies that power modern development and operations" })] }), _jsx("div", { className: "tech-stats-grid", children: techStacks.map((tech, index) => (_jsxs("div", { className: "tech-stat-card", children: [_jsx("div", { className: "tech-stat-icon", children: tech.icon }), _jsxs("div", { className: "tech-stat-info", children: [_jsx("h4", { className: "tech-stat-name", children: tech.name }), _jsxs("span", { className: "tech-stat-count", children: [tech.commands, " commands"] })] })] }, index))) }), _jsxs("div", { className: "total-commands", children: [_jsx("div", { className: "total-number", children: "500+" }), _jsx("div", { className: "total-label", children: "Total Commands Across All Stacks" })] })] }) }), _jsx("section", { className: "methodology-section", children: _jsx("div", { className: "container", children: _jsxs("div", { className: "methodology-content", children: [_jsxs("div", { className: "methodology-text", children: [_jsx("h2", { className: "section-title", children: "Proven Learning Methodology" }), _jsx("p", { className: "section-subtitle", children: "Our approach combines cognitive science with practical application" }), _jsxs("div", { className: "methodology-steps", children: [_jsxs("div", { className: "step", children: [_jsx("div", { className: "step-number", children: "1" }), _jsxs("div", { className: "step-content", children: [_jsx("h4", { children: "Active Recall" }), _jsx("p", { children: "Type commands from memory instead of passive reading" })] })] }), _jsxs("div", { className: "step", children: [_jsx("div", { className: "step-number", children: "2" }), _jsxs("div", { className: "step-content", children: [_jsx("h4", { children: "Spaced Repetition" }), _jsx("p", { children: "Review commands at optimal intervals for long-term retention" })] })] }), _jsxs("div", { className: "step", children: [_jsx("div", { className: "step-number", children: "3" }), _jsxs("div", { className: "step-content", children: [_jsx("h4", { children: "Contextual Learning" }), _jsx("p", { children: "Understand when and why to use each command in real scenarios" })] })] }), _jsxs("div", { className: "step", children: [_jsx("div", { className: "step-number", children: "4" }), _jsxs("div", { className: "step-content", children: [_jsx("h4", { children: "Progressive Mastery" }), _jsx("p", { children: "Build from basic commands to advanced system administration" })] })] })] })] }), _jsx("div", { className: "methodology-visual", children: _jsxs("div", { className: "learning-cycle", children: [_jsxs("div", { className: "cycle-step active", children: [_jsx("span", { className: "cycle-icon", children: "\uD83C\uDFAF" }), _jsx("span", { className: "cycle-label", children: "Practice" })] }), _jsxs("div", { className: "cycle-step", children: [_jsx("span", { className: "cycle-icon", children: "\uD83E\uDDE0" }), _jsx("span", { className: "cycle-label", children: "Remember" })] }), _jsxs("div", { className: "cycle-step", children: [_jsx("span", { className: "cycle-icon", children: "\uD83D\uDCC8" }), _jsx("span", { className: "cycle-label", children: "Progress" })] }), _jsxs("div", { className: "cycle-step", children: [_jsx("span", { className: "cycle-icon", children: "\uD83D\uDE80" }), _jsx("span", { className: "cycle-label", children: "Master" })] })] }) })] }) }) }), _jsx("section", { className: "features-cta-section", children: _jsx("div", { className: "container", children: _jsxs("div", { className: "cta-content", children: [_jsx("h2", { children: "Ready to Transform Your CLI Skills?" }), _jsx("p", { children: "Join thousands of developers who've accelerated their careers through command line mastery." }), _jsxs("div", { className: "cta-actions", children: [_jsxs("a", { href: "/register", className: "cta-button primary", children: ["Start Learning Free", _jsx("span", { className: "button-arrow", children: "\u2192" })] }), _jsx("a", { href: "/about", className: "cta-button secondary", children: "Learn More" })] })] }) }) })] }));
};
export default Features;
