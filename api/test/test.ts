
process.env.SYSTEM_PASSWORD = "pass!"
require('source-map-support').install();
import './app/config/route.config.test';
import './app/routes/users.test';
import './app/services/users-service.test';