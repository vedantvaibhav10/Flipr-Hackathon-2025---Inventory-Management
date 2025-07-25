const FormField = ({ label, id, type = 'text', value, onChange, required = false, ...props }) => {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-1">
                {label}
            </label>
            <input
                id={id}
                name={id}
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                className="block w-full px-3 py-2 bg-secondary border border-border rounded-md shadow-sm placeholder-text-secondary focus:outline-none focus:ring-accent focus:border-accent"
                {...props}
            />
        </div>
    );
};

export default FormField;
