const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

// Connect to the in-memory database
module.exports.connect = async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    // Remove the deprecated options
    await mongoose.connect(uri);
};

// Clear all data between tests
module.exports.clearDatabase = async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
};

// Close database connection
module.exports.closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (mongoServer) {
        await mongoServer.stop();
    }
};