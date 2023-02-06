type NodeEnv = 'development' | 'production';

interface ServerConfiguration {
    API_URL: string;
    NODE_ENV: NodeEnv;
    REACT_BACKEND_SERVER: string;
}

let API_URL = process.env.API_URL;

const defaultFrontendCongig = "no env var";

const serverConf:ServerConfiguration = {
    API_URL: API_URL || 'http://localhost:5173',
    NODE_ENV: (process.env.NODE_ENV as NodeEnv) || 'production',
    REACT_BACKEND_SERVER: process.env.REACT_BACKEND_SERVER || defaultFrontendCongig,
} 

export type {ServerConfiguration};
export default serverConf;