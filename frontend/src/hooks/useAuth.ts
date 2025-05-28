// // hooks/useAuth.ts
// import { useState, useEffect, createContext, useContext } from 'react';
// import { useRouter } from 'next/router';
// import axiosInstance from '@/lib/axiosInstance';

// interface User {
//     id: string;
//     name: string;
//     alamat: string;
//     no_hp: string;
//     role: string;
// }

// interface AuthContextType {
//     user: User | null;
//     loading: boolean;
//     login: (email: string, password: string) => Promise<void>;
//     logout: () => void;
//     checkRole: (role: string) => boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//     const [user, setUser] = useState<User | null>(null);
//     const [loading, setLoading] = useState(true);
//     const router = useRouter();

//     useEffect(() => {
//         checkAuth();
//     }, []);

//     const checkAuth = async () => {
//         try {
//             const response = await axiosInstance.get('/api/auth/me');
//             setUser(response.data.user);
//         } catch (error) {
//             setUser(null);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const login = async (email: string, password: string) => {
//         try {
//             const response = await axiosInstance.post('/api/login', { email, password });
//             const { user, token } = response.data;
            
//             // Save token to localStorage
//             localStorage.setItem('token', token);
//             setUser(user);
            
//             // Redirect based on role
//             switch (user.role) {
//                 case 'admin':
//                     router.push('/admin');
//                     break;
//                 case 'manager':
//                     router.push('/manager');
//                     break;
//                 case 'customer':
//                     router.push('/customer');
//                     break;
//                 default:
//                     router.push('/');
//             }
//         } catch (error) {
//             throw error;
//         }
//     };

//     const logout = async () => {
//         try {
//             await axiosInstance.post('/api/logout');
//         } catch (error) {
//             console.error('Logout error:', error);
//         } finally {
//             localStorage.removeItem('token');
//             setUser(null);
//             router.push('/login');
//         }
//     };

//     const checkRole = (role: string): boolean => {
//         return user?.role === role;
//     };

//     return (
//         <AuthContext.Provider value={{ user, loading, login, logout, checkRole }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (!context) {
//         throw new Error('useAuth must be used within AuthProvider');
//     }
//     return context;
// };