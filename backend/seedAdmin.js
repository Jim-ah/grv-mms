
// seedAdmin.js
require('dotenv').config();
const mongoose    = require('mongoose');
const userService = require('./src/services/userService');

async function seed() {
    try {
        // 1) Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser:    true,
            useUnifiedTopology: true,
        });
        console.log('🗄️  Connected to MongoDB');

        // 2) Check if the admin already exists
        const existing = await userService.findByEmail('admin@admin.com');
        if (existing) {
            console.log('⚠️  Admin user already exists, aborting.');
            process.exit(0);
        }

        // 3) Create the Admin user
        await userService.create({
            name:     'Admin',
            email:    'admin@admin.com',
            password: 'admin',
            role:     'Admin',
        });
        console.log('✅  Admin user created: admin@admin.com / admin');

        process.exit(0);
    } catch (err) {
        console.error('❌  Error seeding admin user:', err);
        process.exit(1);
    }
}

seed();
