# Bus Management System

This is a full-stack bus management application with:
- Spring Boot backend
- React frontend
  
## Tech Stack

### Backend
| Component | Description |
|-----------|-------------|
| **Language** | Java 17 |
| **Framework** | Spring Boot|
| **Security** | Spring Security (authentication & authorization) |
| **Token Management** | JWT (JSON Web Tokens) – stateless authentication |
| **Data Access** | Spring Data JPA |
| **Boilerplate Reducer** | Lombok |
| **Build Tool** | Maven |
| **Development DB** | MongoDb Atlas |

### Frontend
| Component | Description |
|-----------|-------------|
| **Library** | React 18 |
| **Routing** | React Router |
| **HTTP Client** | Axios |
| **Styling** | CSS Modules |
| **Package Manager** | npm |

### Additional Tools
| Tool | Purpose |
|------|---------|
| **Git** | Version control |
| **Postman** | API testing |
| **VS Code + IntelliJ** | Development IDE |


## Running the application
- First, start the backend:
- Navigate to the backEnd directory
- Run "mvn spring-boot:run" to start the Spring Boot application
- The backend will run on port 8080
- Then, start the frontend:

- Navigate to the frontEnd directory
- Run "npm install" to install dependencies
- Run "npm start" to start the React development server
- The frontend will run on port 5173
  
## API Endpoints:

| Endpoint | Method | Purpose | Auth Required | Allowed Role(s) |
| --- | --- | --- | --- | --- |
| `/api/admin/login` | POST | Admin user login | ❌ | None |
| `/api/admin/**` | GET / PUT / DELETE | Admin management operations (CRUD) | ✅ | `ADMIN`, `SUPER_ADMIN` |
| `/api/superadmin/signup` | POST | SuperAdmin user registration | ❌ | None |
| `/api/superadmin/admins` | POST | Create a new admin (for SuperAdmin) | ✅ | `SUPER_ADMIN` |
| `/api/superadmin/admins` | GET | Get all admins in SuperAdmin's city | ✅ | `SUPER_ADMIN` |
| `/api/superadmin/**` | GET / PUT / DELETE | SuperAdmin management operations | ✅ | `SUPER_ADMIN` |
| `/api/buses/search` | GET | Search buses by route (start and end stops) | ❌ | None |
| `/api/buses/by-city` | GET | Get all buses in a specific city | ❌ | None |
| `/api/buses` | POST | Add a new bus (for Admin) | ✅ | `ADMIN`, `SUPER_ADMIN` |
| `/api/buses/{busId}` | PUT | Update a bus (for Admin) | ✅ | `ADMIN`, `SUPER_ADMIN` |
| `/api/buses/{busId}` | DELETE | Delete a bus (for Admin) | ✅ | `ADMIN`, `SUPER_ADMIN` |

SuperAdmins to manage Admins in their city
Admins to manage buses in their city
Users to search for buses by route or city
