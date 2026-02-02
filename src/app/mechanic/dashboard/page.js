
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const DashboardPage = () => {
    const [mechanic, setMechanic] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const info = localStorage.getItem('mechanicInfo');
        if (!info) {
            router.push('/mechanic');
            return;
        }
        setMechanic(JSON.parse(info));
    }, [router]);

    if (!mechanic) return null;

    return (
        <div className="space-y-6 relative min-h-[calc(100vh-100px)]">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 -z-10 w-64 h-64 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -z-10 w-96 h-96 bg-purple-500/5 rounded-full blur-[140px] pointer-events-none"></div>

            <div className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-sm p-8 border border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl font-bold">
                        {mechanic.name.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                            Welcome, {mechanic.name}!
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400">
                            {mechanic.username} • {mechanic.role}
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Requests', value: '12', icon: '📋', color: 'blue' },
                    { label: 'Active Jobs', value: '3', icon: '🔧', color: 'orange' },
                    { label: 'Rating', value: '4.8/5', icon: '⭐', color: 'yellow' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-white/10 flex items-center gap-4 group hover:scale-[1.02] transition-transform">
                        <div className={`text-3xl p-3 rounded-xl bg-${stat.color}-500/10`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-200 dark:border-white/10 overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-white/10 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Service Requests</h2>
                    <button className="text-sm text-blue-600 hover:text-blue-500 font-medium">View All</button>
                </div>
                <div className="p-8 text-center space-y-2">
                    <div className="text-4xl">📭</div>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">No active requests yet</p>
                    <p className="text-sm text-slate-500">New requests will appear here once customers reach out to you.</p>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;
