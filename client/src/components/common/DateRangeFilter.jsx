import { useState } from 'react';
import { Calendar } from 'lucide-react';

const DateRangeFilter = ({ onDateChange }) => {
    const [activeFilter, setActiveFilter] = useState('all');

    const handleFilterClick = (filter) => {
        setActiveFilter(filter);
        let startDate, endDate = new Date();

        switch (filter) {
            case '7d':
                startDate = new Date();
                startDate.setDate(endDate.getDate() - 7);
                break;
            case '30d':
                startDate = new Date();
                startDate.setDate(endDate.getDate() - 30);
                break;
            case 'all':
            default:
                startDate = null;
                endDate = null;
                break;
        }
        onDateChange({ startDate, endDate });
    };

    const getButtonClass = (filter) => {
        return `px-3 py-1 text-sm rounded-md transition-colors ${activeFilter === filter
                ? 'bg-accent text-white font-semibold'
                : 'bg-secondary text-text-secondary hover:bg-secondary/80'
            }`;
    };

    return (
        <div className="flex items-center gap-2 bg-primary p-1 rounded-lg border border-border">
            <button onClick={() => handleFilterClick('7d')} className={getButtonClass('7d')}>Last 7 Days</button>
            <button onClick={() => handleFilterClick('30d')} className={getButtonClass('30d')}>Last 30 Days</button>
            <button onClick={() => handleFilterClick('all')} className={getButtonClass('all')}>All Time</button>
        </div>
    );
};

export default DateRangeFilter;
