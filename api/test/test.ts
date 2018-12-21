
process.env.SESSION_HEADER = 'x';
process.env.PORT = '3001';
require('source-map-support').install();
import './app/routes/users.test';