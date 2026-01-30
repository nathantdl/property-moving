/**
 * Storage Controller for handling LocalStorage operations (Mock Database)
 */

class Storage {
    static KEYS = {
        USERS: 'pms_users',
        PROPERTIES: 'pms_properties',
        REQUESTS: 'pms_requests',
        CURRENT_USER: 'pms_current_user'
    };

    // Generic Get
    static get(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }

    // Generic Set
    static set(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // User Methods
    static getUsers() {
        return this.get(this.KEYS.USERS);
    }

    static addUser(user) {
        const users = this.getUsers();
        // Check if email exists
        if (users.find(u => u.email === user.email)) {
            throw new Error('User already exists');
        }
        users.push(user);
        this.set(this.KEYS.USERS, users);
    }

    static getCurrentUser() {
        const data = localStorage.getItem(this.KEYS.CURRENT_USER);
        return data ? JSON.parse(data) : null;
    }

    static setCurrentUser(user) {
        if (user) {
            localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(user));
        } else {
            localStorage.removeItem(this.KEYS.CURRENT_USER);
        }
    }

    // Property Methods
    static getProperties() {
        return this.get(this.KEYS.PROPERTIES);
    }

    static addProperty(property) {
        const properties = this.getProperties();
        properties.push(property);
        this.set(this.KEYS.PROPERTIES, properties);
    }

    static updateProperty(updatedProperty) {
        let properties = this.getProperties();
        properties = properties.map(p => p.id === updatedProperty.id ? updatedProperty : p);
        this.set(this.KEYS.PROPERTIES, properties);
    }

    static deleteProperty(id) {
        let properties = this.getProperties();
        properties = properties.filter(p => p.id !== id);
        this.set(this.KEYS.PROPERTIES, properties);
    }

    // Request Methods
    static getRequests() {
        return this.get(this.KEYS.REQUESTS);
    }

    static addRequest(request) {
        const requests = this.getRequests();
        requests.push(request);
        this.set(this.KEYS.REQUESTS, requests);
    }

    static updateRequestStatus(id, newStatus) {
        let requests = this.getRequests();
        requests = requests.map(r => r.id === id ? { ...r, status: newStatus } : r);
        this.set(this.KEYS.REQUESTS, requests);
    }

    static updateRequest(updatedRequest) {
        let requests = this.getRequests();
        requests = requests.map(r => r.id === updatedRequest.id ? updatedRequest : r);
        this.set(this.KEYS.REQUESTS, requests);
    }

    // Initialize with Seed Data (Optional for testing)
    static init() {
        if (!localStorage.getItem(this.KEYS.USERS)) {
            // Add a default user? Maybe not for now.
            this.set(this.KEYS.USERS, []);
        }
    }
}
