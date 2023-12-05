import jwt from 'jsonwebtoken';

const admin = (req, res, next) => {
    const token = req.cookies.access_token; // Assuming the token is stored in a cookie

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token not provided' });
    }

    jwt.verify(token, 'jwtkey', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        req.user = decoded; // Store the decoded user information in the request object
        next(); // Call the next middleware or route handler
    });
};

export {admin};
