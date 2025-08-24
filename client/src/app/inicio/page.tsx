'use client';

import {useState, useEffect, use} from 'react';
import { getCurrentUser } from '@/services/userService';

export default function HomePage() {
    const [userName, setUserName] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser= async () => {
            try {

                const { user } = await getCurrentUser();
                if (user && user.name) {
                    setUserName(user.name);
                }
            } catch(error) {
                console.error("Error fetching user data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchUser();

    }, []);

    return (
        <div className="flex flex-row">
            {isLoading ? (
                <h1>Cargando...</h1>
            ) : (
                <h1>Bienvenido, {userName || 'invitado'}</h1>
            )}
        </div>
    );
}