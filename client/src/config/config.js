const config = {
    backend: 'https://message-app-t658.onrender.com' || 'http://localhost:3000',
}
export default config;
export const getBackendUrl = () => {    
    return config.backend;
}
