# API Contract / Interface Specification Document

## Crowdsourced Civic Issue Reporting & Resolution System

**Version:** 1.0  
**Date:** [Current Date]  
**Authors:** [Your Name/Team]  
**Base URL (Development):** http://localhost:8080

---

## 1. Introduction

### Purpose of the API Contract

This API Contract Document serves as the authoritative specification for the RESTful APIs provided by the Crowdsourced Civic Issue Reporting & Resolution System backend. It defines the interfaces through which mobile applications (citizens) and web dashboards (administrators) interact with the backend services.

### Importance of Avoiding Integration Discrepancies

In a team-based development environment involving backend, web, and mobile developers, discrepancies in API understanding can lead to integration failures, wasted development time, and inconsistent user experiences. This document eliminates such risks by providing a single source of truth for API behavior, data formats, and business rules.

### Role in Team-Based Development

This document is essential for:

- Backend developers: To implement and maintain the APIs
- Mobile app developers: To integrate issue reporting features
- Web dashboard developers: To build administrative interfaces
- Testers: To validate API behavior
- Project reviewers: To assess system design and compliance

---

## 2. Communication Standards

### Protocol

All communication occurs over HTTP/HTTPS using RESTful principles.

### Data Format

All request and response bodies use JSON (JavaScript Object Notation) format.

### Content-Type Header

- Requests: `Content-Type: application/json`
- Responses: `Content-Type: application/json`

### Stateless Communication

All API calls are stateless. Each request contains all necessary information for processing, with no reliance on server-side session state.

---

## 3. API Overview

| API Name             | HTTP Method | Endpoint         | Description                                               |
| -------------------- | ----------- | ---------------- | --------------------------------------------------------- |
| Create Civic Issue   | POST        | /api/issues      | Allows citizens to report new civic issues                |
| Retrieve All Issues  | GET         | /api/issues      | Allows administrators to view all reported issues         |
| Retrieve Issue by ID | GET         | /api/issues/{id} | Retrieves details of a specific issue                     |
| Update Issue Status  | PUT         | /api/issues/{id} | Allows administrators to update issue status and priority |

---

## 4. Detailed API Specifications

### API 1: Create Civic Issue

**Endpoint:** POST /api/issues  
**Purpose:** Enables citizens to submit new civic issues via mobile applications.

#### Request Headers

```
Content-Type: application/json
```

#### Request Body (JSON Schema)

```json
{
  "category": "string",
  "description": "string",
  "latitude": "number (double)",
  "longitude": "number (double)"
}
```

**Field Descriptions:**

- `category`: The type of civic issue (e.g., "Water", "Garbage", "Road")
- `description`: Detailed description of the issue
- `latitude`: Geographic latitude coordinate (decimal degrees)
- `longitude`: Geographic longitude coordinate (decimal degrees)

#### Example Request

```json
{
  "category": "Water",
  "description": "Water leakage from main pipe on Main Street",
  "latitude": 12.9716,
  "longitude": 77.5946
}
```

#### Example Response (Success - New Issue Created)

```json
{
  "issueId": "550e8400-e29b-41d4-a716-446655440000",
  "category": "Water",
  "description": "Water leakage from main pipe on Main Street",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "status": "Pending",
  "priority": "High",
  "createdAt": "2024-01-13T10:30:00"
}
```

#### Example Response (Success - Duplicate Detected)

Returns the existing issue with escalated priority:

```json
{
  "issueId": "550e8400-e29b-41d4-a716-446655440001",
  "category": "Water",
  "description": "Existing water issue description",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "status": "Pending",
  "priority": "High",
  "createdAt": "2024-01-13T09:00:00"
}
```

### API 2: Retrieve All Issues (Admin)

**Endpoint:** GET /api/issues  
**Purpose:** Allows administrators to retrieve a list of all reported issues for monitoring and management.

#### Response Structure

Returns an array of Issue objects.

#### Example Response

```json
[
  {
    "issueId": "550e8400-e29b-41d4-a716-446655440000",
    "category": "Water",
    "description": "Water leakage from main pipe",
    "latitude": 12.9716,
    "longitude": 77.5946,
    "status": "Pending",
    "priority": "High",
    "createdAt": "2024-01-13T10:30:00"
  },
  {
    "issueId": "550e8400-e29b-41d4-a716-446655440001",
    "category": "Garbage",
    "description": "Overflowing garbage bin",
    "latitude": 12.972,
    "longitude": 77.595,
    "status": "In Progress",
    "priority": "Medium",
    "createdAt": "2024-01-13T11:00:00"
  }
]
```

### API 3: Retrieve Issue by ID

**Endpoint:** GET /api/issues/{id}  
**Purpose:** Retrieves detailed information about a specific issue.

#### Path Parameters

- `id`: String - The unique identifier of the issue

#### Example Response (Success)

```json
{
  "issueId": "550e8400-e29b-41d4-a716-446655440000",
  "category": "Water",
  "description": "Water leakage from main pipe",
  "latitude": 12.9716,
  "longitude": 77.5946,
  "status": "Pending",
  "priority": "High",
  "createdAt": "2024-01-13T10:30:00"
}
```

### API 4: Update Issue Status

**Endpoint:** PUT /api/issues/{id}  
**Purpose:** Allows administrators to update the status and/or priority of an issue.

#### Path Parameters

- `id`: String - The unique identifier of the issue

#### Request Headers

```
Content-Type: application/json
```

#### Request Body

```json
{
  "status": "string",
  "priority": "string"
}
```

**Notes:**

- Both fields are optional; only provided fields will be updated
- Status must follow valid transition rules (see Business Rules section)

#### Example Request

```json
{
  "status": "In Progress"
}
```

#### Example Response (Success)

HTTP Status: 200 OK  
Body: Empty (or minimal confirmation)

---

## 5. Data Model Definition

The primary data entity is the **Issue** object, representing a civic issue report.

| Field Name  | Data Type | Description                                                                  |
| ----------- | --------- | ---------------------------------------------------------------------------- |
| issueId     | String    | Unique identifier for the issue (UUID format)                                |
| category    | String    | Type of civic issue (e.g., "Water", "Garbage", "Road")                       |
| description | String    | Detailed description of the issue                                            |
| latitude    | Double    | Geographic latitude coordinate in decimal degrees                            |
| longitude   | Double    | Geographic longitude coordinate in decimal degrees                           |
| status      | String    | Current status of the issue ("Pending", "In Progress", "Resolved")           |
| priority    | String    | Priority level ("Low", "Medium", "High")                                     |
| createdAt   | String    | ISO 8601 formatted timestamp of issue creation (e.g., "2024-01-13T10:30:00") |

---

## 6. Business Rules

### Rule-Based Priority Assignment

- If `category` equals "Water" (case-insensitive): `priority` = "High"
- For all other categories: `priority` = "Medium"

### Category-Aware Duplicate Detection

An issue is considered a duplicate only if:

- The distance between the new issue location and existing issue location ≤ 100 meters
- AND the `category` matches exactly (case-insensitive comparison)

**Behavior:**

- **Duplicate detected:** Existing issue priority is escalated (Low → Medium → High)
- **No duplicate:** New issue is created with assigned priority

**Note:** Different categories at the same location are treated as separate issues.

### Valid Status Transitions

Status can only transition in the following order:

- "Pending" → "In Progress" → "Resolved"
- No backward transitions allowed
- "Resolved" status cannot be changed

---

## 7. Error Handling

### Common Error Scenarios

- Invalid request data (malformed JSON, missing required fields)
- Issue not found (invalid ID)
- Invalid status transition
- Server errors

### Standard Error Response Format

All errors return appropriate HTTP status codes with a JSON body:

```json
{
  "error": "string",
  "message": "string",
  "timestamp": "string"
}
```

#### Example Error Response (404 Not Found)

```json
{
  "error": "Not Found",
  "message": "Issue with ID 'invalid-id' not found",
  "timestamp": "2024-01-13T12:00:00"
}
```

#### Example Error Response (400 Bad Request - Invalid Transition)

```json
{
  "error": "Bad Request",
  "message": "Invalid status transition from 'Resolved' to 'Pending'",
  "timestamp": "2024-01-13T12:00:00"
}
```

---

## 8. Integration Guidelines

### Guidelines for Mobile App Developers

- Implement location services to capture accurate latitude/longitude coordinates
- Validate user input before sending requests
- Handle duplicate detection responses by informing users that their report has been merged with an existing issue
- Implement offline queuing for areas with poor network connectivity

### Guidelines for Web Admin Dashboard Developers

- Display issues in sortable tables with filtering by status, priority, and category
- Implement real-time updates or periodic refresh of issue lists
- Provide clear status update interfaces with validation
- Use appropriate HTTP status codes for user feedback

### General Integration Requirements

- Strictly adhere to field names and data types as specified
- Handle all documented error scenarios gracefully
- Test against all example requests and responses
- Validate JSON parsing and serialization
- Ensure proper Content-Type headers are set

---

## 9. Conclusion

### Benefits of Having an API Contract

This API Contract Document provides numerous benefits:

- **Consistency:** Ensures all team members implement interfaces identically
- **Efficiency:** Reduces integration bugs and debugging time
- **Scalability:** Facilitates future API extensions and versioning
- **Quality:** Enables thorough testing and validation
- **Documentation:** Serves as living documentation for maintenance and onboarding

### Ensuring Smooth Backend–Frontend Integration

By defining precise request/response formats, business rules, and error handling, this document eliminates ambiguity and ensures that mobile applications and web dashboards integrate seamlessly with the backend. Strict adherence to this contract guarantees a cohesive user experience across all platforms and prevents costly rework during development and deployment phases.

This document should be reviewed and approved by all development team members before implementation begins and should be updated with any API changes during the project lifecycle.
