const config = {
    backend: import.meta.env.VITE_BACKEND_URL,
}
export default config;
export const getBackendUrl = () => {    
    return config.backend;
}
