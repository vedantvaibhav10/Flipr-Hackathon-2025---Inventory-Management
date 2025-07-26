import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import apiClient from '../../api';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Server, Database, Cloud, ChevronUp, ChevronDown, WifiOff, Loader2 } from 'lucide-react';

const healthClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://inventory-management-backend-gmik.onrender.com',
});

const apiEndpointsToMonitor = [
    { name: 'User Details', path: '/auth/me' },
    { name: 'Product List', path: '/products' },
    { name: 'Dashboard Summary', path: '/reports/summary' },
];

const HealthStatusBar = () => {
    const [healthData, setHealthData] = useState(null);
    const [apiStatus, setApiStatus] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [loading, setLoading] = useState(true);

    const runAllChecks = useCallback(async () => {
        try {
            const [healthResponse, ...apiResponses] = await Promise.all([
                healthClient.get('/health'),
                ...apiEndpointsToMonitor.map(ep => {
                    const startTime = Date.now();
                    return apiClient.get(ep.path)
                        .then(() => ({ name: ep.name, status: 'ok', responseTime: Date.now() - startTime }))
                        .catch(err => ({ name: ep.name, status: 'error', responseTime: Date.now() - startTime, message: `Status ${err.response?.status}` }));
                })
            ]);
            setHealthData(healthResponse.data);
            setApiStatus(apiResponses);
        } catch (error) {
            setHealthData({ overall: { status: 'error', message: 'Backend Unreachable' }, services: {} });
            setApiStatus(apiEndpointsToMonitor.map(ep => ({ name: ep.name, status: 'error', message: 'N/A' })));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        runAllChecks();
        const intervalId = setInterval(runAllChecks, 2000);
        return () => clearInterval(intervalId);
    }, [runAllChecks]);

    const OverallStatusIcon = () => {
        if (loading) return <Loader2 className="animate-spin h-5 w-5 text-yellow-400" />;
        if (healthData?.overall?.status === 'ok') return <CheckCircle2 className="h-5 w-5 text-green-400" />;
        return <XCircle className="h-5 w-5 text-red-400" />;
    };

    const StatusIndicator = ({ status }) => {
        if (status === 'ok') return <div className="w-2.5 h-2.5 bg-green-500 rounded-full" title="Operational"></div>;
        return <div className="w-2.5 h-2.5 bg-red-500 rounded-full" title="Error"></div>;
    };

    const ResponseTime = ({ time }) => {
        const color = time > 1000 ? 'text-red-400' : time > 500 ? 'text-yellow-400' : 'text-green-400';
        return <span className={`font-mono text-xs ${color}`}>{time}ms</span>;
    };

    return (
        <motion.div
            layout
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`fixed bottom-4 left-4 z-50 bg-secondary/80 backdrop-blur-sm border border-border rounded-lg text-text-primary shadow-2xl overflow-hidden`}
        >
            <div
                className={`flex items-center gap-3 p-3 cursor-pointer ${isExpanded ? 'hidden' : ''}`}
                onClick={() => setIsExpanded(true)}
            >
                <OverallStatusIcon />
                <span className="text-sm font-medium">
                    {loading ? 'Checking System Status...' : `System Status: ${healthData?.overall?.status === 'ok' ? 'Operational' : 'Disrupted'}`}
                </span>
                <ChevronUp className="h-5 w-5 text-text-secondary" />
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="w-80"
                    >
                        <div className="p-3 border-b border-border flex justify-between items-center">
                            <div className="flex items-center gap-3 font-semibold">
                                <OverallStatusIcon />
                                System Health Details
                            </div>
                            <button onClick={() => setIsExpanded(false)} className="text-text-secondary hover:text-text-primary">
                                <ChevronDown className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="p-3 space-y-2 text-sm">
                            {loading && !healthData && <p>Loading...</p>}
                            {healthData?.services?.database && (
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2"><Database size={14} /><span>Database</span></div>
                                    <div className="flex items-center gap-2"><ResponseTime time={healthData.services.database.responseTime} /><StatusIndicator status={healthData.services.database.status} /></div>
                                </div>
                            )}
                            {healthData?.services?.cloudinary && (
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2"><Cloud size={14} /><span>Cloudinary</span></div>
                                    <div className="flex items-center gap-2"><ResponseTime time={healthData.services.cloudinary.responseTime} /><StatusIndicator status={healthData.services.cloudinary.status} /></div>
                                </div>
                            )}
                            {apiStatus.map(api => (
                                <div key={api.name} className="flex justify-between items-center">
                                    <div className="flex items-center gap-2"><Server size={14} /><span>{api.name}</span></div>
                                    <div className="flex items-center gap-2">{api.responseTime != null && <ResponseTime time={api.responseTime} />}<StatusIndicator status={api.status} /></div>
                                </div>
                            ))}
                            {healthData?.overall?.message && (
                                <div className="pt-2 mt-2 border-t border-border flex items-center gap-2 text-red-400">
                                    <WifiOff size={14} /> <span>{healthData.overall.message}</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default HealthStatusBar;