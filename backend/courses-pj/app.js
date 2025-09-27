import app from './src/app.js';
import { environment } from './src/config/server.config.js';

// Start local server only when running outside Vercel (e.g., npm run start)
const path = require('path');

app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
});

const port = environment.SERVER_PORT;
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
