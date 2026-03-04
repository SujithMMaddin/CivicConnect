# Civic Backend Project Structure

## High-Level Overview

This project is a Spring Boot-based backend application for a crowdsourced civic issue reporting and resolution system. It provides RESTful APIs for citizens to report civic issues (e.g., water leaks, garbage problems) and for administrators to manage these issues. The application uses a layered architecture with controllers handling HTTP requests, services managing business logic, and models representing data entities. It employs in-memory storage for simplicity, with built-in duplicate detection and priority assignment based on issue categories.

### Architecture and Patterns Used

- **Layered Architecture**: Separates concerns into controller (presentation), service (business logic), and model (data) layers.
- **MVC Pattern**: Model-View-Controller, adapted for REST APIs where controllers handle requests and responses.
- **Service Layer Pattern**: Encapsulates business logic in service classes for reusability and testability.
- **Configuration as Code**: Uses Spring Boot's annotation-based configuration for CORS and application setup.

### Frameworks and Libraries

- **Spring Boot**: Provides auto-configuration, embedded server, and dependency injection.
- **Spring Web**: Enables RESTful web services with annotations like `@RestController` and `@RequestMapping`.
- **Spring Test**: Supports unit and integration testing.
- **Maven**: Manages project dependencies and build lifecycle.

### Critical Files for Application Startup and Core Functionality

- `src/main/java/com/civic/backend/CivicBackendApplication.java`: Entry point for the Spring Boot application.
- `src/main/java/com/civic/backend/controller/IssueController.java`: Defines API endpoints for issue management.
- `src/main/java/com/civic/backend/service/IssueService.java`: Contains core business logic for issue creation, updates, and duplicate detection.
- `src/main/java/com/civic/backend/model/Issue.java`: Data model representing civic issues.
- `pom.xml`: Maven configuration file defining dependencies and build settings.

### Modification Guidelines

- **Safe to Modify**: Business logic files like `IssueService.java`, model classes like `Issue.java`, and controller methods in `IssueController.java` can be modified for feature enhancements.
- **Modify with Caution**: Configuration files like `CorsConfig.java`, `application.properties`, and `pom.xml` should be changed carefully as they affect application behavior, security, and dependencies. The main application class `CivicBackendApplication.java` should only be altered for startup-related changes.

## Directory Structure and File Details

### Root Directory

- **.gitattributes**

  - **Path**: .gitattributes
  - **Type**: Configuration
  - **Purpose**: Defines line ending behaviors for files in the Git repository, ensuring consistent handling across different operating systems (e.g., LF for Unix-like files, CRLF for Windows batch files).
  - **Why it exists**: Prevents line ending conflicts in a cross-platform development environment.
  - **Interactions**: Used by Git during commits and checkouts; no direct code interactions.

- **.gitignore**

  - **Path**: .gitignore
  - **Type**: Configuration
  - **Purpose**: Specifies files and directories that Git should ignore, such as build outputs, IDE files, and temporary artifacts.
  - **Why it exists**: Keeps the repository clean by excluding non-essential files from version control.
  - **Interactions**: Instructs Git on what to exclude; no direct code interactions.

- **API_Contract.md**

  - **Path**: API_Contract.md
  - **Type**: Documentation
  - **Purpose**: Comprehensive specification of the REST API, including endpoints, request/response formats, business rules, and error handling.
  - **Why it exists**: Serves as the authoritative contract for API behavior, ensuring consistency between backend, mobile, and web frontend teams.
  - **Interactions**: Referenced by developers integrating with the API; informs the implementation in `IssueController.java` and `IssueService.java`.

- **mvnw**

  - **Path**: mvnw
  - **Type**: Build script
  - **Purpose**: Maven wrapper script for Unix-like systems (Linux, macOS) to run Maven commands without requiring a system-wide Maven installation.
  - **Why it exists**: Ensures consistent Maven version and behavior across different development environments.
  - **Interactions**: Executes Maven commands like build, test, and run; used to manage the project's build lifecycle.

- **mvnw.cmd**

  - **Path**: mvnw.cmd
  - **Type**: Build script
  - **Purpose**: Maven wrapper script for Windows systems to run Maven commands.
  - **Why it exists**: Provides Windows-specific wrapper for Maven, complementing `mvnw` for cross-platform compatibility.
  - **Interactions**: Same as `mvnw`, but for Windows command prompt; manages build lifecycle on Windows.

- **pom.xml**
  - **Path**: pom.xml
  - **Type**: Build configuration
  - **Purpose**: Maven Project Object Model file defining project metadata, dependencies, and build plugins.
  - **Why it exists**: Configures the project's build process, dependencies (e.g., Spring Boot starters), and plugins (e.g., Spring Boot Maven plugin).
  - **Interactions**: Read by Maven during builds; defines classpath for all Java files; essential for compiling and running the application.

### src/main/java/com/civic/backend/

- **CivicBackendApplication.java**
  - **Path**: src/main/java/com/civic/backend/CivicBackendApplication.java
  - **Type**: Application entry point
  - **Purpose**: Main class annotated with `@SpringBootApplication` that bootstraps the Spring Boot application.
  - **Why it exists**: Serves as the entry point for the JVM to start the application, enabling auto-configuration and component scanning.
  - **Interactions**: Scans for and initializes all Spring components (controllers, services, configurations); runs the embedded web server.

### src/main/java/com/civic/backend/config/

- **CorsConfig.java**
  - **Path**: src/main/java/com/civic/backend/config/CorsConfig.java
  - **Type**: Configuration
  - **Purpose**: Configures Cross-Origin Resource Sharing (CORS) policies to allow web browsers to make requests to the API from different origins.
  - **Why it exists**: Enables frontend applications (e.g., web dashboards) to interact with the backend API securely.
  - **Interactions**: Applied globally to all `/api/**` endpoints; affects request handling in `IssueController.java`.

### src/main/java/com/civic/backend/controller/

- **IssueController.java**
  - **Path**: src/main/java/com/civic/backend/controller/IssueController.java
  - **Type**: Controller
  - **Purpose**: REST controller defining HTTP endpoints for issue management (create, read, update issues).
  - **Why it exists**: Handles incoming HTTP requests, maps them to service methods, and returns appropriate responses.
  - **Interactions**: Depends on `IssueService` for business logic; uses `Issue` model for request/response bodies; configured by `CorsConfig.java`.

### src/main/java/com/civic/backend/model/

- **Issue.java**
  - **Path**: src/main/java/com/civic/backend/model/Issue.java
  - **Type**: Model
  - **Purpose**: Plain Old Java Object (POJO) representing a civic issue with fields like category, description, location, status, and priority.
  - **Why it exists**: Defines the data structure for issues, used for serialization/deserialization in API requests and responses.
  - **Interactions**: Used by `IssueController` for request/response mapping and by `IssueService` for business logic operations.

### src/main/java/com/civic/backend/service/

- **IssueService.java**
  - **Path**: src/main/java/com/civic/backend/service/IssueService.java
  - **Type**: Service
  - **Purpose**: Contains business logic for issue management, including creation, duplicate detection, priority assignment, and status updates.
  - **Why it exists**: Encapsulates complex logic (e.g., haversine distance calculation for duplicates) separate from controllers.
  - **Interactions**: Called by `IssueController` for all issue operations; manipulates `Issue` objects; implements rules from `API_Contract.md`.

### src/main/resources/

- **application.properties**
  - **Path**: src/main/resources/application.properties
  - **Type**: Configuration
  - **Purpose**: Contains application-level configuration properties, such as the application name.
  - **Why it exists**: Allows externalized configuration for Spring Boot applications, enabling easy customization without code changes.
  - **Interactions**: Loaded by Spring Boot at startup; affects application behavior (e.g., logging, server port if extended).

### src/test/java/com/civic/backend/

- **CivicBackendApplicationTests.java**
  - **Path**: src/test/java/com/civic/backend/CivicBackendApplicationTests.java
  - **Type**: Test
  - **Purpose**: Basic integration test to verify that the Spring Boot application context loads successfully.
  - **Why it exists**: Ensures the application can start up correctly and that all configurations are valid.
  - **Interactions**: Tests the overall application setup; runs during Maven test phase.

### target/

- **(Build output directory)**
  - **Path**: target/
  - **Type**: Build artifact
  - **Purpose**: Contains compiled classes, JAR files, and other build outputs generated by Maven.
  - **Why it exists**: Standard Maven output directory for storing build results.
  - **Interactions**: Generated during build process; not part of source code; ignored by Git via `.gitignore`.

## Summary: How Components Work Together

The application follows a request-response flow: HTTP requests hit `IssueController`, which delegates to `IssueService` for logic execution. `IssueService` uses the `Issue` model for data manipulation and applies business rules (e.g., duplicate detection using haversine distance). Configuration in `CorsConfig.java` and `application.properties` ensures proper request handling and application setup. The `API_Contract.md` guides the API design, while build tools like Maven (via `pom.xml` and wrappers) manage dependencies and compilation. Tests in `CivicBackendApplicationTests.java` validate the integration. This layered approach ensures maintainability, with each component having a clear responsibility in delivering a robust civic issue reporting system.
