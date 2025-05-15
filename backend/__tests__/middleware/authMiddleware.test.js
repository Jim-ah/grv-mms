const authMiddleware = require('../../src/middleware/authMiddleware');
const jwt = require('jsonwebtoken');

// Mock JWT
jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            headers: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    it('should return 401 if no token provided', () => {
        authMiddleware(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Missing token' });
    });

    it('should call next() if token is valid', () => {
        req.headers['authorization'] = 'Bearer valid-token';
        const mockPayload = { id: '123', role: 'Admin' };
        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(null, mockPayload);
        });

        authMiddleware(req, res, next);
        expect(req.user).toEqual(mockPayload);
        expect(next).toHaveBeenCalled();
    });
});