const config = {
    backend: 'http://localhost:3000'||'https://message-app-t658.onrender.com'  ,
}
export default config;
export const getBackendUrl = () => {    
    return config.backend;
}
