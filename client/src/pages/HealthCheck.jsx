import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import apiClient from '../api';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, XCircle, Server, Database, Cloud, Link as LinkIcon } from 'lucide-react';

const healthClient = axios.create({
    baseURL: 'https://inventory-management-backend-j0w6.onrender.com',
});

const apiEndpointsToMonitor = [
    { name: 'Get Current User (/auth/me)', method: 'get', path: '/auth/me' },
    { name: 'Get Products (/products)', method: 'get', path: '/products' },
    { name: 'Get Inventory Logs (/inventory/logs)', method: 'get', path: '/inventory/logs' },
    { name: 'Get Dashboard Summary (/reports/summary)', method: 'get', path: '/reports/summary' },
    { name: 'Export Products (/reports/products/export)', method: 'get', path: '/reports/products/export' },
];

const HealthCheck = () => {
    const [healthData, setHealthData] = useState(null);
    const [apiStatus, setApiStatus] = useState([]);
    const [loading, setLoading] = useState(true);

    const checkSystemHealth = useCallback(async () => {
        try {
            const response = await healthClient.get('/health');
            setHealthData(response.data);
        } catch (error) {
            setHealthData(error.response?.data || {
                overall: { status: 'error' },
                services: {}
            });
        }
    }, []);

    const checkApiEndpoints = useCallback(async () => {
        const statusPromises = apiEndpointsToMonitor.map(async (endpoint) => {
            const startTime = Date.now();
            try {
                const config = endpoint.path.includes('export') ? { responseType: 'blob' } : {};
                await apiClient[endpoint.method](endpoint.path, config);
                return { name: endpoint.name, status: 'ok', responseTime: Date.now() - startTime };
            } catch (error) {
                return { name: endpoint.name, status: 'error', responseTime: Date.now() - startTime, message: `Status ${error.response?.status || 'N/A'}` };
            }
        });
        const results = await Promise.all(statusPromises);
        setApiStatus(results);
    }, []);

    const runAllChecks = useCallback(async () => {
        setLoading(true);
        await Promise.all([checkSystemHealth(), checkApiEndpoints()]);
        setLoading(false);
    }, [checkSystemHealth, checkApiEndpoints]);


    useEffect(() => {
        runAllChecks();
        const intervalId = setInterval(runAllChecks, 2000);
        return () => clearInterval(intervalId);
    }, [runAllChecks]);

    const StatusBadge = ({ status }) => {
        const styles = {
            ok: 'bg-success/20 text-success',
            error: 'bg-danger/20 text-danger',
            down: 'bg-danger/20 text-danger',
        };
        return <span className={`px-3 py-1 text-sm font-semibold rounded-full ${styles[status] || 'bg-secondary'}`}>{status.toUpperCase()}</span>;
    };

    const ResponseTime = ({ time }) => {
        const color = time > 1000 ? 'text-danger' : time > 500 ? 'text-warning' : 'text-success';
        return <span className={`font-mono font-semibold ${color}`}>{time} ms</span>;
    };

    const ServiceStatus = ({ name, icon: Icon, data }) => (
        <div className="bg-primary p-4 rounded-lg border border-border grid grid-cols-3 items-center gap-4">
            <div className="flex items-center gap-3">
                <Icon className="w-6 h-6 text-text-secondary" />
                <span className="font-semibold text-text-primary">{name}</span>
            </div>
            <div className="text-center">
                {data ? <StatusBadge status={data.status} /> : <StatusBadge status="loading" />}
            </div>
            <div className="text-right">
                {data ? <ResponseTime time={data.responseTime} /> : <Loader2 className="animate-spin h-5 w-5 ml-auto" />}
            </div>
        </div>
    );

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-text-primary">System Health Status</h1>
                {healthData && <StatusBadge status={healthData.overall.status} />}
            </div>

            {loading && !healthData ? (
                <div className="flex justify-center mt-10"><Loader2 className="animate-spin h-8 w-8 text-accent" /></div>
            ) : (
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold text-text-primary mb-3">Core Services</h2>
                        <div className="space-y-2">
                            <ServiceStatus name="Database" icon={Database} data={healthData?.services?.database} />
                            <ServiceStatus name="Cloudinary" icon={Cloud} data={healthData?.services?.cloudinary} />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-text-primary mb-3">API Endpoints</h2>
                        <div className="space-y-2">
                            {apiStatus.map(api => (
                                <ServiceStatus key={api.name} name={api.name} icon={LinkIcon} data={api} />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default HealthCheck;
