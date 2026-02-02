'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { useRouter } from 'next/navigation';

const containerStyle = {
    width: '100%',
    height: '300px'
};

const center = {
    lat: 18.5204, // Default to Pune
    lng: 73.8567
};

export default function MechanicAuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        password: '',
        phone: '',
        address: '',
        state_id: '',
        city_id: '',
        latitude: center.lat,
        longitude: center.lng
    });

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_MAP_API_KEY || ''
    });

    useEffect(() => {
        // Get user's current location on mount
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setFormData(prev => ({
                        ...prev,
                        latitude,
                        longitude
                    }));
                },
                (error) => {
                    console.error("Geolocation error:", error);
                }
            );
        }
    }, []);

    useEffect(() => {
        const fetchStates = async () => {
            try {
                const res = await fetch('/api/v1/mechanic/locations');
                const data = await res.json();
                if (data.statusCode === "200") {
                    setStates(data.data);
                }
            } catch (err) {
                console.error("Error fetching states:", err);
            }
        };
        fetchStates();
    }, []);

    useEffect(() => {
        if (formData.state_id) {
            const fetchCities = async () => {
                try {
                    const res = await fetch(`/api/v1/mechanic/locations?stateId=${formData.state_id}`);
                    const data = await res.json();
                    if (data.statusCode === "200") {
                        setCities(data.data);
                    }
                } catch (err) {
                    console.error("Error fetching cities:", err);
                }
            };
            fetchCities();
        } else {
            setCities([]);
        }
        // Always reset city_id when state_id changes to prevent mismatched data
        setFormData(prev => ({ ...prev, city_id: '' }));
    }, [formData.state_id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMapClick = useCallback((e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setFormData(prev => ({
            ...prev,
            latitude: lat,
            longitude: lng
        }));
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        const endpoint = isLogin ? '/api/v1/mechanic/login' : '/api/v1/mechanic/register';
        const payload = isLogin
            ? { username: formData.username, password: formData.password }
            : {
                ...formData,
                latitude: parseFloat(formData.latitude),
                longitude: parseFloat(formData.longitude)
            };

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess(data.message);
                if (isLogin) {
                    localStorage.setItem('mechanicToken', data.data.token);
                    localStorage.setItem('mechanicInfo', JSON.stringify(data.data.mechanic));
                    router.push('/mechanic/dashboard'); // Assuming there's a dashboard
                } else {
                    setIsLogin(true);
                    setFormData({
                        name: '',
                        username: '',
                        password: '',
                        phone: '',
                        address: '',
                        state_id: '',
                        city_id: '',
                        latitude: center.lat,
                        longitude: center.lng
                    });
                }
            } else {
                setError(data.message || 'Something went wrong');
            }
        } catch (err) {
            setError('Failed to connect to server');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#0f172a] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] px-4 py-8">
            <div className={`w-full ${isLogin ? 'max-w-md' : 'max-w-4xl'} transition-all duration-500`}>
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden border border-white/20">
                    {/* Tab Selection */}
                    <div className="flex border-b dark:border-slate-700">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-4 text-center font-semibold transition-colors ${isLogin
                                ? 'bg-blue-600 text-white'
                                : 'bg-transparent text-slate-500 hover:text-blue-600 dark:text-slate-400'
                                }`}
                        >
                            Log In
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-4 text-center font-semibold transition-colors ${!isLogin
                                ? 'bg-blue-600 text-white'
                                : 'bg-transparent text-slate-500 hover:text-blue-600 dark:text-slate-400'
                                }`}
                        >
                            Register
                        </button>
                    </div>

                    <div className="p-8 space-y-6">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                                {isLogin ? 'Welcome Back' : 'Create Account'}
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-2">
                                {isLogin ? 'Enter your credentials to access your dashboard.' : 'Join our network of mechanics.'}
                            </p>
                        </div>

                        {/* Error and Success messages ... */}
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}
                        {success && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                                <span className="block sm:inline">{success}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className={`grid ${isLogin ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-6`}>
                            {/* Form fields ... same as before but inside this structure */}
                            <div className="space-y-4">
                                {!isLogin && (
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                                        <input
                                            name="name"
                                            required
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                )}

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Username</label>
                                    <input
                                        name="username"
                                        required
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="mechanic_01"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="••••••••"
                                    />
                                </div>

                                {!isLogin && (
                                    <>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone</label>
                                            <input
                                                name="phone"
                                                required
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                                placeholder="1234567890"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Address</label>
                                            <textarea
                                                name="address"
                                                required
                                                value={formData.address}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none h-24"
                                                placeholder="Shop address..."
                                            />
                                        </div>
                                    </>
                                )}
                            </div>

                            {!isLogin && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">State</label>
                                            <select
                                                name="state_id"
                                                required
                                                value={formData.state_id}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                            >
                                                <option value="">Select State</option>
                                                {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">City</label>
                                            <select
                                                name="city_id"
                                                required
                                                value={formData.city_id}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                            >
                                                <option value="">Select City</option>
                                                {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Shop Location on Map</label>
                                        <div className="rounded-lg overflow-hidden border dark:border-slate-600">
                                            {isLoaded ? (
                                                <GoogleMap
                                                    mapContainerStyle={containerStyle}
                                                    center={{ lat: formData.latitude, lng: formData.longitude }}
                                                    zoom={13}
                                                    onClick={handleMapClick}
                                                >
                                                    <Marker position={{ lat: formData.latitude, lng: formData.longitude }} />
                                                </GoogleMap>
                                            ) : (
                                                <div className="h-[300px] flex items-center justify-center bg-slate-100 dark:bg-slate-700">
                                                    Loading Map...
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex justify-between text-[10px] text-slate-500 mt-2 px-1">
                                            <span>Lat: {formData.latitude.toFixed(6)}</span>
                                            <span>Lng: {formData.longitude.toFixed(6)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className={isLogin ? 'w-full' : 'md:col-span-2'}>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transition duration-200 transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                                >
                                    {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Mechanic Account')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                {/* Footer */}
                <p className="mt-8 text-center text-xs text-slate-500">
                    © 2026 YMechanics Portal. Precision in every login.
                </p>
            </div>
        </div>
    );
}
