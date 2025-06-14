import React, { ReactNode, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext, useProtectedRoute } from "@/context/authContext";
import authStorage from '@/storage/authStorage'
import { User, Profile, UserDetails, ImageUrl } from "@/types/user-types";



const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserDetails | null>(null)
    const [images, setImages] = useState<ImageUrl | null>(null)



    const restoreToken = async () => {

        try {

            const token = await authStorage.getToken()
            if (!token) return

            // Set user from token
            setUser(jwtDecode(token))

            // First try to get profile from storage for instant display
            const storedProfile = await authStorage.getProfile()
            if (storedProfile) {
                setProfile(storedProfile)
            }

        } catch (error) {
            console.error('Error restoring session:', error)
        }
    }

    useEffect(() => {
        restoreToken()
    }, [])

    useEffect(() => {
        const loadImages = async () => {
            const storedImages = await authStorage.getImageUrl();
            if (storedImages) setImages(storedImages);
        };
        loadImages();
    }, []);

    useEffect(() => {
        const loadUserData = async () => {
            const storedProfile = await authStorage.getProfile()
            if (storedProfile) {
                setProfile(storedProfile)
            }
        }
        loadUserData()
    }, [])


    useEffect(() => {
        const checkAuth = async () => {
            const token = await authStorage.getToken();
            if (!token) {
                signOut();
            }
        };

        // Check auth status every minute
        const interval = setInterval(checkAuth, 60000);
        return () => clearInterval(interval);
    }, []);





    const signOut = async () => {
        try {

            setUser(null);
            setProfile(null);
            await Promise.all([
                authStorage.removeToken(),
                authStorage.removeProfile(),
                authStorage.removeImage()

            ])
        } catch (error) {
            console.error('Error signing out:', error)
        }
    };
    useProtectedRoute(user);
    return (
        <AuthContext.Provider value={{ signOut, setUser, user, images, setImages, setProfile, profile }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
