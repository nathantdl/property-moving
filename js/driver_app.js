/**
 * main Application Logic for Driver Dashboard
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check authentication and role
    const currentUser = Auth.checkAuth();
    if (!currentUser) return;

    if (currentUser.role !== 'driver') {
        window.location.href = 'dashboard.html';
        return;
    }

    // Display user info
    document.getElementById('user-name').textContent = currentUser.name;
    document.getElementById('user-email').textContent = currentUser.email;

    // Initialize app
    DriverApp.init();
});

const DriverApp = window.DriverApp = {
    currentView: 'available',

    init() {
        this.setupNavigation();
        this.setupLogout();
        this.renderAvailableRequests();
        this.renderActiveJobs();
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

                // Refresh data when switching views
                if (view === 'available') this.renderAvailableRequests();
                if (view === 'active-jobs') this.renderActiveJobs();
            });
        });
    },

    // Logout handler
    setupLogout() {
        document.getElementById('logout-btn').addEventListener('click', () => {
            Auth.logout();
        });
    },

    // ========== RENDER LOGIC ==========

    renderAvailableRequests() {
        const container = document.getElementById('available-list');
        const allRequests = Storage.getRequests();
        const availableRequests = allRequests.filter(r => r.status === 'Pending');

        if (availableRequests.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>No pending requests</h3>
                    <p>Check back later for new moving requests.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = availableRequests.map(req => this.createRequestCard(req, 'available')).join('');
    },

    renderActiveJobs() {
        const container = document.getElementById('active-list');
        const currentUser = Storage.getCurrentUser();
        const allRequests = Storage.getRequests();
        // Active jobs are those accepted by this driver and NOT completed
        const activeJobs = allRequests.filter(r =>
            r.driverId === currentUser.id && r.status === 'Accepted'
        );

        if (activeJobs.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>No active jobs</h3>
                    <p>Go to "Available Requests" to accept a job.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = activeJobs.map(req => this.createRequestCard(req, 'active')).join('');
    },

    createRequestCard(req, type) {
        // Need to fetch property details? Yes, for property name/address logic if it was stored separately.
        // In this simple app, propertyId is stored.
        // We need to look up property? Yes.
        const properties = Storage.getProperties();
        const property = properties.find(p => p.id === req.propertyId);
        const propertyName = property ? property.name : 'Unknown Property';

        let actionButton = '';
        if (type === 'available') {
            actionButton = `<button class="btn" onclick="DriverApp.acceptJob('${req.id}')">Accept Job</button>`;
        } else if (type === 'active') {
            actionButton = `<button class="btn btn-secondary" onclick="DriverApp.completeJob('${req.id}')">Finished</button>`;
        }

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
                <div class="request-actions">
                    ${actionButton}
                </div>
            </div>
        `;
    },

    // ========== ACTIONS ==========

    acceptJob(requestId) {
        if (!confirm('Are you sure you want to accept this job?')) return;

        const currentUser = Storage.getCurrentUser();
        const requests = Storage.getRequests();
        const request = requests.find(r => r.id === requestId);

        if (request) {
            request.status = 'Accepted';
            request.driverId = currentUser.id;
            Storage.updateRequest(request);


            // Switch to Active Jobs view
            const activeJobsLink = document.querySelector('[data-view="active-jobs"]');
            if (activeJobsLink) {
                alert('Job accepted! Redirecting to Active Jobs...');
                activeJobsLink.click();
            }
        }
    },

    completeJob(requestId) {
        if (!confirm('Have you finished this moving job?')) return;

        const requests = Storage.getRequests();
        const request = requests.find(r => r.id === requestId);

        if (request) {
            request.status = 'Completed';
            Storage.updateRequest(request);

            // Refresh views
            this.renderActiveJobs();
            alert('Job marked as completed!');
        }
    }
};
