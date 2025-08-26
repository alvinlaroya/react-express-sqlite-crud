import 'dotenv/config';
import path from 'path';
import { createApp } from './src/app';
import { createDatabase } from './src/db';

const port: number = Number(process.env.PORT || 3001);
const dbPath: string = process.env.DB_PATH || path.join(__dirname, 'data.db');

const db = createDatabase(process.env.DB_PATH || dbPath);

const app = createApp(db);

app.listen(port, () => {
	console.log(`API listening on port ${port}`);
});

process.on('SIGINT', () => {
	console.log('Shutting down...');
	db.close(() => process.exit(0));
});


