import db from './db.js'
import bcrypt from 'bcrypt';

const createUser = async (name, email, passwordHash) => {
    const default_role = 'user';
    const query = `
        INSERT INTO users (name, email, password_hash, role_id) 
        VALUES ($1, $2, $3, (SELECT role_id FROM roles WHERE role_name = $4)) 
        RETURNING user_id
    `;
    const queryParams = [name, email, passwordHash, default_role];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create user');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new user with ID:', result.rows[0].user_id);
    }

    return result.rows[0].user_id;
};

// Internal function: Find user by email
const findUserByEmail = async (email) => {
    const query = `
        SELECT user_id, name, email, password_hash, role_id 
        FROM users 
        WHERE email = $1
    `;
    const queryParams = [email];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        return null; // User not found
    }

    return result.rows[0];
};

// Internal function: Verify password hash
const verifyPassword = async (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
};

// Main authentication function to be used by the controller
const authenticateUser = async (email, password) => {
    // 1. Find the user by email
    const user = await findUserByEmail(email);
    if (!user) {
        return null; // User does not exist
    }

    // 2. Check if the password matches
    const isMatch = await verifyPassword(password, user.password_hash);
    if (!isMatch) {
        return null; // Password mismatch
    }

    // 3. Remove the sensitive password_hash before returning the user object
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
};

// Export functions
export { createUser, authenticateUser };