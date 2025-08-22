import { jsx as _jsx } from "react/jsx-runtime";
import './Checklist.css';
const Checklist = ({ passed }) => {
    return (_jsx("div", { className: "checklist", children: passed.map((status, index) => (_jsx("div", { className: `check-item ${status ? 'passed' : 'failed'}`, children: status ? '✓' : '✗' }, index))) }));
};
export default Checklist;
