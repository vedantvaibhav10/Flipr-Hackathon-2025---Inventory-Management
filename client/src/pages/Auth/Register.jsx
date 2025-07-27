import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api';
import { motion } from 'framer-motion';
import { UserPlus, Loader2 } from 'lucide-react';
import { FaGoogle, FaGithub } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://inventory-management-backend-gmik.onrender.com';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await apiClient.post('/auth/register', { name, email, password });
            navigate('/verify-otp', { state: { email } });
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
                    <h1 className="text-3xl font-bold text-accent">Create an Account</h1>
                    <p className="text-text-secondary mt-2">Join InvTrack to manage your inventory.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <a href={`${API_URL}/api/v1/auth/google`} className="flex-1 flex items-center justify-center gap-3 px-4 py-2 bg-secondary border border-border rounded-md hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-colors duration-300">
                        <FaGoogle />
                        <span className="font-medium">Sign up with Google</span>
                    </a>
                    <a href={`${API_URL}/api/v1/auth/github`} className="flex-1 flex items-center justify-center gap-3 px-4 py-2 bg-secondary border border-border rounded-md hover:bg-gray-500/10 hover:border-gray-500/30 hover:text-gray-300 transition-colors duration-300">
                        <FaGithub />
                        <span className="font-medium">Sign up with GitHub</span>
                    </a>
                </div>

                <div className="flex items-center text-center">
                    <hr className="flex-grow border-border" />
                    <span className="px-4 text-text-secondary text-sm">OR</span>
                    <hr className="flex-grow border-border" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="text-sm font-medium text-text-secondary">Full Name</label>
                        <input
                            id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required
                            className="mt-1 block w-full px-4 py-2 bg-secondary border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="text-sm font-medium text-text-secondary">Email</label>
                        <input
                            id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                            className="mt-1 block w-full px-4 py-2 bg-secondary border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="text-sm font-medium text-text-secondary">Password</label>
                        <input
                            id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                            className="mt-1 block w-full px-4 py-2 bg-secondary border border-border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>

                    {error && <p className="text-sm text-danger text-center">{error}</p>}

                    <div>
                        <motion.button
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
                            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <><UserPlus className="w-5 h-5 mr-2" /><span>Register</span></>}
                        </motion.button>
                    </div>
                </form>
                <p className="text-sm text-center text-text-secondary">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-accent hover:underline">
                        Log in here
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
