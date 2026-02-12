// 'use client';

// import { useRouter, usePathname } from 'next/navigation';
// import Link from 'next/link';

// const MechanicLayout = ({ children }) => {
//     const router = useRouter();
//     const pathname = usePathname();

//     const handleLogout = () => {
//         localStorage.removeItem('mechanicToken');
//         localStorage.removeItem('mechanicInfo');
//         router.push('/mechanic');
//     };

//     const isAuthPage = pathname === '/mechanic';

//     return (
//         <div className="min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-100">
//             {!isAuthPage && (
//                 <nav className="bg-white/80 dark:bg-[#030712]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
//                     <div className="flex items-center gap-2">
//                         <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
//                             <span className="text-white font-bold text-xl">Y</span>
//                         </div>
//                         <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
//                             YMechanics Portal
//                         </span>
//                     </div>

//                     <div className="flex items-center gap-6">
//                         <Link
//                             href="/mechanic/dashboard"
//                             className={`text-sm font-medium transition-colors ${pathname === '/mechanic/dashboard' ? 'text-blue-600' : 'text-slate-600 dark:text-slate-400 hover:text-blue-500'}`}
//                         >
//                             Dashboard
//                         </Link>
//                         <button
//                             onClick={handleLogout}
//                             className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold transition-all dark:bg-red-900/20 dark:hover:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800"
//                         >
//                             Logout
//                         </button>
//                     </div>
//                 </nav>
//             )}
//             <main className={isAuthPage ? "" : "p-6"}>
//                 {children}
//             </main>
//         </div>
//     );
// }

// export default MechanicLayout;

import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
