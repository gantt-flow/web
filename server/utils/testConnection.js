//Probar Conexión con el microservicio Flask
import fetch from 'node-fetch';

const FLASK_SERVER_URL = '127.0.0.1:5001';

async function testConnection() {
    try {
        console.log('Probando conexión con el servidor Flask...');
        const response = await fetch(`${FLASK_SERVER_URL}/api/health`, {
            timeout: 5000,
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('Conexión exitosa:', data);
            return true;
        } else {
            console.log('Error en la respuesta:', response.status, response.statusText);
            return false;
        }
    } catch (error) {
        console.error('Error de conexión:', error.message);
        return false;
    }
}

testConnection().then(success => {
    process.exit(success ? 0 : 1);
});