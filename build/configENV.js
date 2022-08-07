import * as dotenv from 'dotenv'; // import path from 'path';

dotenv.config();
export const Server_Port = process.env.SERVER_PORT || 80;