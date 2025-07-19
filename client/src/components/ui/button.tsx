'use client';

export default function Button({ 
    text, 
    type = "button", 
    className,
}: { 
    text: string, 
    type?: "button"| "submit" | "reset", 
    className?: string
}) {
    return (
        <button
            type={type}
            className={`${className}`}
        >   
            {text}
        </button>
    );
}