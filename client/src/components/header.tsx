'use client'; 

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import Sidebar from "./sidebar";
import { profile } from "console";

const profileDropdownItems = [
    {label: "Perfil", link: "/perfil"},
    {label: "Ajustes", link: "/ajustes"}
];


export default function Header() {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const clearInput = () => {
        if (inputRef.current) {
        inputRef.current.value = "";
        inputRef.current.focus(); // opcional: vuelve a enfocar el input
        }
    };

    const toggleDropdown = () => {
      setIsDropdownOpen(!isDropdownOpen);  
    };


    return(
        <div className="flex flex-col">
            <div className="flex flex-row border-b border-gray-300">
                <div className="flex w-full justify-between m-3">
                    <div className="flex ml-2">
                        <Link href="/dashboard">
                            <Image
                            className="dark:invert border"
                            src="/logo.svg"
                            alt="Gantt Logo"
                            width={150}
                            height={30}
                            priority
                            />
                        </Link>
                    </div>

                    <div className="w-128 flex-initial border border-gray-300 rounded-lg">
                        <form action="/search" method="get" role="search" className="relative h-full">
                                <button type="submit" className="absolute inset-y-0 start-0 bottom-1 items-center ps-3 cursor-pointer">
                                    <span>
                                        <i>
                                            <Image src="/magnifierIcon.svg" alt="Magnigier Icon" width={18} height={18} />
                                        </i>
                                    </span>
                                </button>
                
                                <input
                                    className="block w-full h-full ps-10 rounded-lg"
                                    type="search"
                                    id="site-search"
                                    name="q"
                                    placeholder="Buscar..."
                                    aria-label="Ingresa tu búsqueda"
                                    ref={inputRef}
                                    autoComplete="off"
                                />

                                <button type="button" onClick={clearInput} className="absolute end-3.5 bottom-3 cursor-pointer" aria-label="Limpiar búsqueda">
                                    <i>
                                        <Image src="/cancelIcon.svg" alt="Magnigier Icon" width={18} height={18} />
                                    </i>
                                </button>
                        </form>
                    </div>

                    <div className="flex gap-5">
                        <Image
                            className="dark:invert"
                            src="/bell.svg"
                            alt="Bell Icon"
                            width={40}
                            height={40}
                            priority
                        />    
                        <button id="dropdownDefaultButton" onClick={toggleDropdown} className="relative cursor-pointer" type="button">
                            <Image
                            className="dark:invert"
                            src="/defaultUserPicture.svg"
                            alt="Default User Picture Icon"
                            width={40}
                            height={40}
                            priority
                            />

                            {/* Dropdown menu*/}
                            {isDropdownOpen && (
                                <div className="bg-white absolute mt-2 z-10 right-0 rounded-lg shadow-sm w-32 dark:bg-gray-700">
                                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                                        {profileDropdownItems.map(({ label, link }, index) => (
                                            <li key={label}>
                                                <Link href={link} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                                    {label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </button>
                    </div>

                    
                </div> 
            </div>
        </div>
    )
}