const fs = require('fs');

const secretPath = '/run/secrets/jwt_public';
if (fs.existsSync(secretPath)) {
    process.env.JWT_PUBLIC_KEY = fs.readFileSync(secretPath, 'utf8').trim();
    console.log('✅ JWT_PUBLIC_KEY loaded from secrets');
}

require('./server.js');