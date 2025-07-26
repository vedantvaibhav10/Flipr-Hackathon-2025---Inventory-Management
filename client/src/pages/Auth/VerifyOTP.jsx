import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import apiClient from '../../api';
import { motion } from 'framer-motion';
import { KeyRound, Loader2 } from 'lucide-react';

const VerifyOTP = () => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;

    if (!email) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
                <h1 className="text-2xl text-danger mb-4">An error occurred.</h1>
                <p className="text-text-secondary">No email address was provided. Please start the registration process again.</p>
                <Link to="/register" className="mt-4 px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/90">
                    Go to Register
                </Link>
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);
        try {
            await apiClient.post('/auth/verify-otp', { email, otp });
            setMessage('Verification successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Verification failed. Please check the code and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md p-8 space-y-6 bg-primary rounded-xl border border-border shadow-2xl"
            >
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-accent">Verify Your Email</h1>
                    <p className="text-text-secondary mt-2">
                        An OTP has been sent to <span className="font-bold text-text-primary">{email}</span>.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="otp" className="text-sm font-medium text-text-secondary">Enter OTP</label>
                        <input
                            id="otp" type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required
                            className="mt-1 block w-full px-4 py-2 bg-secondary border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent text-center tracking-[0.5em]"
                        />
                    </div>

                    {error && <p className="text-sm text-danger text-center">{error}</p>}
                    {message && <p className="text-sm text-success text-center">{message}</p>}

                    <div>
                        <motion.button
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading || message}
                            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <><KeyRound className="w-5 h-5 mr-2" /><span>Verify Account</span></>}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default VerifyOTP;
