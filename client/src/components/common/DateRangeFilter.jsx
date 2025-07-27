import { useState } from 'react';

const DateRangeFilter = ({ onDateChange }) => {
    const [activeFilter, setActiveFilter] = useState('all');

    const setFilter = (filter) => {
        setActiveFilter(filter);
        const now = new Date();
        let startDate = new Date();
        let endDate = new Date(now.setDate(now.getDate() + 1));

        if (filter === '7d') {
            startDate.setDate(startDate.getDate() - 7);
        } else if (filter === '30d') {
            startDate.setDate(startDate.getDate() - 30);
        } else {
            startDate = null;
            endDate = null;
        }
        onDateChange({ startDate, endDate });
    };

    const getButtonClass = (filter) => {
        return `px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${activeFilter === filter
                ? 'bg-accent text-white'
                : 'bg-secondary text-text-secondary hover:bg-secondary/80'
            }`;
    };

    return (
        <div className="flex items-center gap-2 bg-primary p-1 rounded-lg border border-border">
            <button onClick={() => setFilter('all')} className={getButtonClass('all')}>
                All Time
            </button>
            <button onClick={() => setFilter('7d')} className={getButtonClass('7d')}>
                Last 7 Days
            </button>
            <button onClick={() => setFilter('30d')} className={getButtonClass('30d')}>
                Last 30 Days
            </button>
        </div>
    );
};

export default DateRangeFilter;