const config = {
    backend: 'http://localhost:3000', // Change to 'https://message-app-t658.onrender.com' for production
}
export default config;
export const getBackendUrl = () => {    
    return config.backend;
}
