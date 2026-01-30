/**
 * Authentication Controller
 */

const Auth = window.Auth = {
    /**
     * Sign up a new user
     * @param {string} name
     * @param {string} email
     * @param {string} password
     * @returns {{success: boolean, message: string}}
     */
    signup: (name, email, password, role = 'user') => {
        // Basic validation
        if (!name || !email || !password) {
            return { success: false, message: 'All fields are required' };
        }

        if (password.length < 6) {
            return { success: false, message: 'Password must be at least 6 characters' };
        }

        try {
            const user = {
                id: Utils.generateId(),
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password: password, // In production, this would be hashed
                role: role
            };
            Storage.addUser(user);
            return { success: true, message: 'Account created successfully' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    },

    /**
     * Log in an existing user
     * @param {string} email
     * @param {string} password
     * @returns {{success: boolean, message: string, user?: object}}
     */
    login: (email, password) => {
        if (!email || !password) {
            return { success: false, message: 'All fields are required' };
        }

        const users = Storage.getUsers();
        const user = users.find(u => u.email === email.toLowerCase() && u.password === password);

        if (!user) {
            return { success: false, message: 'Invalid email or password' };
        }

        // Set current session user (without password)
        const sessionUser = { id: user.id, name: user.name, email: user.email, role: user.role || 'user' };
        Storage.setCurrentUser(sessionUser);

        return { success: true, message: 'Login successful', user: sessionUser };
    },

    /**
     * Log out the current user
     */
    logout: () => {
        Storage.setCurrentUser(null);
        window.location.href = 'index.html';
    },

    /**
     * Check if user is authenticated, redirect if not
     * @param {boolean} redirectToLogin - If true, redirect to login page
     * @returns {object|null} Current user or null
     */
    checkAuth: (redirectToLogin = true) => {
        const user = Storage.getCurrentUser();
        if (!user && redirectToLogin) {
            window.location.href = 'login.html';
            return null;
        }
        return user;
    }
};
