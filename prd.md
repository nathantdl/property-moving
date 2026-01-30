# Product Requirements Document (PRD)

## 1. Project Overview

### Project Name

Property Management & Moving Service System

### Context

This is a **university project** aimed at building a simple but functional **web-based property management system**. The system helps users manage properties and request **safe moving/relocation services** for their properties (household items, furniture, or assets) using a digital platform.

### Technology Stack

* **Frontend:** HTML, CSS, JavaScript (Vanilla JS)
* **Backend:** *Optional / Mocked (for uni scope)*
* **Database:** *Optional (can be simulated using JSON / LocalStorage)*

The project focuses on **core functionality, UI clarity, and logical workflows**, rather than production-scale complexity.

---

## 2. Goals & Objectives

### Primary Goals

* Allow users to **register and manage properties**
* Enable users to **request moving services** for their properties
* Provide a simple way to **track service requests**
* Demonstrate frontend development skills using HTML, CSS, and JavaScript

### Success Criteria

* Users can add, edit, and view properties
* Users can submit a moving request successfully
* Requests are displayed clearly with status (Pending, Approved, Completed)
* Clean and responsive UI

---

## 3. Target Users

### User Types

1. **Property Owner / User**

   * Registers properties
   * Requests moving services
   * Tracks service status

2. **Admin (Optional / Simplified)**

   * Views all requests
   * Updates request status

---

## 4. Key Features & Requirements

### 4.1 User Authentication (Basic)

**Description:**
Simple authentication to identify users.

**Requirements:**

* User signup (name, email, password)
* User login/logout
* Session handled using JavaScript (LocalStorage)

---

### 4.2 Property Management

**Description:**
Users can manage their properties within the system.

**Functional Requirements:**

* Add a new property

  * Property name
  * Property type (House, Apartment, Office, etc.)
  * Location (address or city)
  * Property size (optional)
* View list of added properties
* Edit or delete properties

---

### 4.3 Moving Service Request

**Description:**
Users can request a service to move their property safely.

**Functional Requirements:**

* Select a property to move
* Enter moving details:

  * Current location
  * Destination location
  * Preferred moving date
  * Item description (furniture, electronics, etc.)
* Submit request
* Auto-generate request ID

**Status Flow:**

* Pending
* Approved
* Completed

---

### 4.4 Request Tracking

**Description:**
Users can track the progress of their moving requests.

**Requirements:**

* View all submitted requests
* See request details and current status
* Visual status indicator (color or badge)

---

### 4.5 Admin Panel (Optional for Extra Credit)

**Description:**
A simple admin dashboard for managing requests.

**Requirements:**

* View all moving requests
* Update request status
* Delete invalid requests

---

## 5. User Flow

1. User opens the website
2. User signs up / logs in
3. User adds property details
4. User requests a moving service
5. User tracks request status
6. Admin (optional) updates request status

---

## 6. UI / UX Requirements

### Design Principles

* Simple and clean layout
* Easy navigation
* Mobile-responsive (basic)

### Pages

* Home Page
* Login / Signup Page
* Dashboard
* Property Management Page
* Moving Request Page
* Request Tracking Page
* Admin Page (optional)

---

## 7. Data Handling

### Data Storage (Frontend Only)

* Use **LocalStorage** or **SessionStorage** to store:

  * User data
  * Properties
  * Moving requests

### Example Data Objects

```js
Property {
  id,
  name,
  type,
  location,
  size
}

Request {
  id,
  propertyId,
  fromLocation,
  toLocation,
  date,
  items,
  status
}
```

---

## 8. Non-Functional Requirements

* Fast page loading
* No external libraries required
* Works on modern browsers
* Clear error messages and form validation

---

## 9. Assumptions & Constraints

### Assumptions

* This is a **frontend-focused academic project**
* No real payments or logistics integration
* Data persistence is simulated

### Constraints

* HTML, CSS, and JavaScript only
* Limited development time
* Small team or solo project

---

## 10. Future Enhancements (Out of Scope)

* Real backend and database
* Payment integration
* GPS tracking
* Real-time notifications
* Role-based authentication

---

## 11. Evaluation Criteria (Academic)

* Correct functionality
* Code readability
* UI/UX quality
* Clear documentation
* Proper use of JavaScript logic

---

## 12. Conclusion

simulate the database a mock database