const jsonwebtoken = require('jsonwebtoken');

/**
 * Middleware to ensure that the user has an 'admin' role based on the JWT token.
 * - Verifies the token, decodes it, and checks if the user has an 'admin' role.
 * - If the user has an 'admin' role, the request proceeds; otherwise, access is denied.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function to call if the role is valid.
 */
function requireAdminRole(req, res, next) {
    // Check if the authorization token is present in the request headers
    const authorization = req.headers.authorization?.split(' ')[1];
    if (!authorization) {
        // If the token is missing, return a 403 Forbidden response
        return res.status(403).json({ success: false, error: 'Authorization token required.' });
    }

    try {
        const decoded = jsonwebtoken.verify(authorization, process.env.SECRET_JWT_CODE); // Verify and decode the token using the secret key
        // Check if the decoded token's role is 'admin'
        if (decoded.role === 'admin') {
            // If the role is 'admin', proceed to the next middleware/route handler
            next();
        } else {
            // If the role is not 'admin', return a 403 Forbidden response
            res.status(403).json({ success: false, error: 'Admin privileges required.' });
        } 
    } catch (err) {
        // If the token verification fails (e.g., invalid or expired token), return a 403 Forbidden response
        res.status(403).json({ success: false, error: 'Invalid or expired token.' });
    }
}

module.exports = requireAdminRole;