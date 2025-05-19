import React, { ReactNode, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext, useProtectedRoute } from "@/context/authContext";
import authStorage from '@/storage/authStorage'
import { User, UserReturn } from "@/types/user-types";


const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const signIn = () => {
        // Implement signIn logic
    };



    const restoreToken = async () => {
        const token = await authStorage.getToken()
        if (!token) return
        setUser(jwtDecode(token))
    }

    useEffect(() => {
        restoreToken()
    }, [])


    // useEffect(() => {
    //     const checkAuth = async () => {
    //         const token = await authStorage.getToken();
    //         if (!token) {
    //             signOut();
    //         }
    //     };

    //     // Check auth status every minute
    //     const interval = setInterval(checkAuth, 60000);
    //     return () => clearInterval(interval);
    // }, []);





    const signOut = () => {
        setUser(null);
        authStorage.removeToken()
    };
    useProtectedRoute(user);
    return (
        <AuthContext.Provider value={{ signIn, signOut, setUser, user }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
