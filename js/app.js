/**
 * Main Application Logic for Dashboard
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    const currentUser = Auth.checkAuth();
    if (!currentUser) return;

    // Display user info
    document.getElementById('user-name').textContent = currentUser.name;
    document.getElementById('user-email').textContent = currentUser.email;

    // Initialize app
    App.init();
});

const App = window.App = {
    currentView: 'properties',

    init() {
        this.setupNavigation();
        this.setupLogout();
        this.setupPropertyModal();
        this.setupRequestModal();
        this.renderProperties();
        this.renderRequests();
    },

    // Navigation between views
    setupNavigation() {
        const navLinks = document.querySelectorAll('.sidebar-nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const view = link.dataset.view;

                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Show the selected view
                document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
                document.getElementById(`${view}-view`).classList.add('active');

                this.currentView = view;
            });
        });
    },

    // Logout handler
    setupLogout() {
        document.getElementById('logout-btn').addEventListener('click', () => {
            Auth.logout();
        });
    },

    // ========== PROPERTY MANAGEMENT ==========
    setupPropertyModal() {
        const modal = document.getElementById('property-modal');
        const form = document.getElementById('property-form');
        const addBtn = document.getElementById('add-property-btn');
        const cancelBtn = document.getElementById('cancel-property-btn');

        // Open modal for adding
        addBtn.addEventListener('click', () => {
            document.getElementById('property-modal-title').textContent = 'Add Property';
            form.reset();
            document.getElementById('property-id').value = '';
            modal.classList.add('active');
        });

        // Close modal
        cancelBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });

        // Form submit
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('property-id').value;
            const currentUser = Storage.getCurrentUser();

            const propertyData = {
                id: id || Utils.generateId(),
                ownerId: currentUser.id,
                name: document.getElementById('property-name').value,
                type: document.getElementById('property-type').value,
                location: document.getElementById('property-location').value,
                size: document.getElementById('property-size').value || 'N/A'
            };

            if (id) {
                // Update existing
                Storage.updateProperty(propertyData);
            } else {
                // Add new
                Storage.addProperty(propertyData);
            }

            modal.classList.remove('active');
            this.renderProperties();
        });
    },

    renderProperties() {
        const container = document.getElementById('properties-list');
        const currentUser = Storage.getCurrentUser();
        const allProperties = Storage.getProperties();
        const userProperties = allProperties.filter(p => p.ownerId === currentUser.id);

        if (userProperties.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <h3>No properties yet</h3>
                    <p>Click "Add Property" to get started</p>
                </div>
            `;
            return;
        }

        container.innerHTML = userProperties.map(prop => `
            <div class="property-card">
                <h3>${prop.name}</h3>
                <div class="property-meta">
                    <strong>${prop.type}</strong> • ${prop.location}<br>
                    Size: ${prop.size}
                </div>
                <div class="property-actions">
                    <button class="btn btn-secondary" onclick="App.editProperty('${prop.id}')">Edit</button>
                    <button class="btn btn-danger" onclick="App.deleteProperty('${prop.id}')">Delete</button>
                </div>
            </div>
        `).join('');
    },

    editProperty(id) {
        const properties = Storage.getProperties();
        const prop = properties.find(p => p.id === id);
        if (!prop) return;

        document.getElementById('property-modal-title').textContent = 'Edit Property';
        document.getElementById('property-id').value = prop.id;
        document.getElementById('property-name').value = prop.name;
        document.getElementById('property-type').value = prop.type;
        document.getElementById('property-location').value = prop.location;
        document.getElementById('property-size').value = prop.size === 'N/A' ? '' : prop.size;

        document.getElementById('property-modal').classList.add('active');
    },

    deleteProperty(id) {
        if (confirm('Are you sure you want to delete this property?')) {
            Storage.deleteProperty(id);
            this.renderProperties();
        }
    },

    // ========== REQUEST MANAGEMENT ==========
    setupRequestModal() {
        const modal = document.getElementById('request-modal');
        const form = document.getElementById('request-form');
        const addBtn = document.getElementById('add-request-btn');
        const cancelBtn = document.getElementById('cancel-request-btn');

        // Open modal
        addBtn.addEventListener('click', () => {
            form.reset();
            this.populatePropertyDropdown();
            modal.classList.add('active');
        });

        // Close modal
        cancelBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('active');
        });

        // Form submit
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const currentUser = Storage.getCurrentUser();

            const requestData = {
                id: Utils.generateId(),
                propertyId: document.getElementById('request-property').value,
                ownerId: currentUser.id,
                fromLocation: document.getElementById('request-from').value,
                toLocation: document.getElementById('request-to').value,
                date: document.getElementById('request-date').value,
                items: document.getElementById('request-items').value || 'Not specified',
                status: 'Pending'
            };

            Storage.addRequest(requestData);
            modal.classList.remove('active');
            this.renderRequests();
        });
    },

    populatePropertyDropdown() {
        const select = document.getElementById('request-property');
        const currentUser = Storage.getCurrentUser();
        const userProperties = Storage.getProperties().filter(p => p.ownerId === currentUser.id);

        select.innerHTML = '<option value="">Choose a property...</option>';
        userProperties.forEach(prop => {
            select.innerHTML += `<option value="${prop.id}">${prop.name} (${prop.type})</option>`;
        });
    },

    renderRequests() {
        const container = document.getElementById('requests-list');
        const currentUser = Storage.getCurrentUser();
        const allRequests = Storage.getRequests();
        const userRequests = allRequests.filter(r => r.ownerId === currentUser.id);
        const allProperties = Storage.getProperties();

        if (userRequests.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>No moving requests yet</h3>
                    <p>Click "New Request" to schedule a move</p>
                </div>
            `;
            return;
        }

        container.innerHTML = userRequests.map(req => {
            const property = allProperties.find(p => p.id === req.propertyId);
            const propertyName = property ? property.name : 'Unknown Property';
            const badgeClass = this.getStatusBadgeClass(req.status);

            return `
                <div class="request-item">
                    <div class="request-info">
                        <h4>${propertyName}</h4>
                        <p>
                            <strong>From:</strong> ${req.fromLocation}<br>
                            <strong>To:</strong> ${req.toLocation}<br>
                            <strong>Date:</strong> ${Utils.formatDate(req.date)}<br>
                            <strong>Items:</strong> ${req.items}
                        </p>
                    </div>
                    <span class="badge ${badgeClass}">${req.status}</span>
                </div>
            `;
        }).join('');
    },

    getStatusBadgeClass(status) {
        switch (status) {
            case 'Pending': return 'badge-pending';
            case 'Approved':
            case 'Accepted': return 'badge-approved';
            case 'Completed': return 'badge-completed';
            default: return '';
        }
    }
};
