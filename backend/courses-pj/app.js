import app from './src/app.js';
import { environment } from './src/config/server.config.js';

import path from 'path';

import express from 'express';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});

const port = environment.SERVER_PORT;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
