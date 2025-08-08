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
| **Data Access** | Spring Data MongoDB |
| **Boilerplate Reducer** | Lombok |
| **Build Tool** | Maven |
| **Database** | MongoDB Atlas |

### Frontend
| Component | Description |
|-----------|-------------|
| **Library** | React 18 |
| **Framework** | Vite |
| **Routing** | React Router |
| **HTTP Client** | Axios |
| **Styling** | CSS (basic) |
| **Package Manager** | npm |

### Additional Tools
| Tool | Purpose |
|------|---------|
| **Git** | Version control |
| **Postman** | API testing |
| **VS Code + IntelliJ** | Development IDE |
| **Docker** | Containerization |

## Running the Application

You can run the application either locally using the development servers or using Docker containers.

### Option 1: Local Development

1.  **Start the Backend:**
    *   Navigate to the `backEnd` directory.
    *   Ensure MongoDB Atlas is accessible and configure `application.properties` or set environment variables (`spring.data.mongodb.uri`, `jwt.secret`).
    *   Run `mvn spring-boot:run` (or `./mvnw spring-boot:run`) to start the Spring Boot application.
    *   The backend will run on port `8080`.

2.  **Start the Frontend:**
    *   Navigate to the `frontEnd` directory.
    *   Run `npm install` to install dependencies.
    *   Run `npm run dev` to start the Vite development server.
    *   The frontend will run on port `5173`.

### Option 2: Using Docker

1.  **Prerequisites:**
    *   Install Docker Desktop (Windows/Mac) or Docker Engine (Linux) and ensure it's running.

2.  **Build Docker Images:**
    *   **Backend:**
        *   Navigate to the `backEnd` directory (where the `Dockerfile` is located).
        *   Run: `docker build -t bus-backend .`
    *   **Frontend:**
        *   Navigate to the `frontEnd` directory (where the `Dockerfile` is located).
        *   Run: `docker build -t bus-frontend .`

3.  **Run Docker Containers:**
    *   You need to provide environment variables for the backend container. Replace the placeholders in the command below:
        ```bash
        # Run Backend Container
        docker run -d \
          --name bus-backend-container \
          -p 8080:8080 \
          -e spring.data.mongodb.uri="YOUR_MONGODB_ATLAS_URI_HERE" \
          -e jwt.secret="YOUR_STRONG_JWT_SECRET_HERE" \
          bus-backend

        # Run Frontend Container
        # Note: The frontend is configured to expect the backend at http://localhost:8080 by default.
        # If running backend locally (not in Docker), use host.docker.internal (on Windows/macOS).
        # If both are in Docker, they need to be on the same network (see Docker Compose).
        docker run -d \
          --name bus-frontend-container \
          -p 3000:80 \
          bus-frontend
        ```
    *   **Explanation:**
        *   `-d`: Runs the container in the background (detached mode).
        *   `--name`: Assigns a specific name to the container for easier management.
        *   `-p host_port:container_port`: Maps a port on your host machine to a port inside the container.
        *   `-e KEY="VALUE"`: Sets environment variables inside the container.

4.  **Access the Application:**
    *   Frontend: Open your browser and go to `http://localhost:3000`.
    *   Backend API: Accessible at `http://localhost:8080/api/...`.

5.  **Stopping Containers:**
    *   Run: `docker stop bus-backend-container bus-frontend-container`
    *   (Optional) Remove stopped containers: `docker rm bus-backend-container bus-frontend-container`

**Note on Frontend-Backend Communication with Docker:**

*   If you run the backend locally (`mvn spring-boot:run`) and the frontend in Docker, the frontend's API calls (configured for `http://localhost:8080/api`) need to reach the host machine. Use `host.docker.internal` instead of `localhost` in the frontend's `api.js` `API_BASE_URL` *before* building the frontend Docker image.
*   If you run both backend and frontend in separate Docker containers, they need to be on the same Docker network to communicate directly by container name. Configuring this manually with `docker network create` and `--network` flags is possible but complex.
*   **Recommended:** Use **Docker Compose** for managing multi-container applications. It simplifies networking and environment variable management. (A `docker-compose.yml` file would be the next step).

## API Endpoints:

| Endpoint | Method | Purpose | Auth Required | Allowed Role(s) |
| --- | --- | --- | --- | --- |
| `/api/admin/login` | POST | Admin / SuperAdmin user login | ❌ | None |
| `/api/admin/**` | GET / PUT / DELETE | Admin management operations (CRUD) | ✅ | `ADMIN`, `SUPER_ADMIN` |
| `/api/superadmin/signup` | POST | SuperAdmin user registration | ❌ | None |
| `/api/superadmin/admins` | POST | Create a new admin (for SuperAdmin) | ✅ | `SUPER_ADMIN` |
| `/api/superadmin/admins` | GET | Get all admins in SuperAdmin's city | ✅ | `SUPER_ADMIN` |
| `/api/superadmin/admins/{adminId}` | PUT / DELETE | Update/Delete an admin (for SuperAdmin) | ✅ | `SUPER_ADMIN` |
| `/api/superadmin/buses` | GET | Get all buses in SuperAdmin's city | ✅ | `SUPER_ADMIN` |
| `/api/buses/search` | GET | Search buses by route (start and end stops) | ❌ | None |
| `/api/buses/by-city` | GET | Get all buses in a specific city | ❌ | None |
| `/api/buses` | GET | Get all buses for the logged-in Admin | ✅ | `ADMIN` |
| `/api/buses` | POST | Add a new bus (for Admin) | ✅ | `ADMIN`, `SUPER_ADMIN` |
| `/api/buses/{busId}` | PUT | Update a bus (for Admin) | ✅ | `ADMIN`, `SUPER_ADMIN` |
| `/api/buses/{busId}` | DELETE | Delete a bus (for Admin) | ✅ | `ADMIN`, `SUPER_ADMIN` |

## Features

*   SuperAdmins can manage Admins in their city.
*   Admins can manage buses in their city.
*   Users can search for buses by route or city.