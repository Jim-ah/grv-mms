const userService = require('../../src/services/userService');
const User = require('../../src/models/users');
const mongoose = require('mongoose');

// Mock User model
jest.mock('../../src/models/users');

describe('User Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('findAll', () => {
        it('should return all users', async () => {
            const mockUsers = [{ name: 'Test User' }];
            User.find.mockReturnValue({
                lean: jest.fn().mockResolvedValue(mockUsers),
            });

            const result = await userService.findAll();
            expect(result).toEqual(mockUsers);
            expect(User.find).toHaveBeenCalled();
        });
    });

    describe('create', () => {
        it('should create a new user', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123',
                role: 'Client'
            };

            const mockUser = {
                ...userData,
                _id: new mongoose.Types.ObjectId(),
                save: jest.fn().mockResolvedValue(userData)
            };

            User.mockImplementation(() => mockUser);

            const result = await userService.create(userData);
            expect(result).toBeDefined();
            expect(mockUser.save).toHaveBeenCalled();
        });
    });
});