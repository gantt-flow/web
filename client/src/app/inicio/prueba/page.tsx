'use client';

import React, {useState, useEffect} from "react";
import axios from "axios";

export default function PruebaPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:8080/users/6857c0bc670dcaa2f86d573a")
                setData(response.data);
            } catch (err) {
                setError("Error al obtener los datos");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading){
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Prueba de Datos desde el Backend</h1>
            <p>{data.name}</p>
        </div>
    )

}