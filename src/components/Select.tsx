import { memo, SelectHTMLAttributes } from 'react';
import '../styles/input.css';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: string[];
}

const Select = memo<SelectProps>(({ label, options, className = '', ...props }) => {
  return (
    <div>
      {label && <label className="input-label">{label}</label>}
      <select className={`custom-select ${className}`} {...props}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
