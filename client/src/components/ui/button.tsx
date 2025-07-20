'use client';

import { useRouter } from 'next/navigation';

export default function Button({ 
    text, 
    type = "button", 
    className,
    redirectTo,
    onClick
}: { 
    text: string, 
    type?: "button"| "submit" | "reset", 
    className?: string,
    redirectTo?: string,
    onClick?: () => void;
}) {

    const router = useRouter();

    const handleClick = async () => {
        if (onClick) {
            onClick();
        } else if (redirectTo) {
            router.push(redirectTo);
        }
    };

    return (
        <button
            type={type}
            className={`${className}`}
            onClick={handleClick}
        >   
            {text}
        </button>
    );
}