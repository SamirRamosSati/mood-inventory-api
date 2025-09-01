# Mood Home Interiors Inventory System

This is the backend repository for the Mood Home Interiors inventory system. Developed to optimize stock management and logistics, this system offers a robust, secure, and scalable solution for controlling products, vendors, locations, and stock movements.

## System Overview
The system is a RESTful API built with Node.js, Express, TypeScript, and Prisma ORM with a PostgreSQL database. The architecture was designed with a focus on modularity and security, using:

JWT-Based Authentication: Ensures all API interactions are secure and traceable.

Role-Based Access Control (RBAC): Defines detailed permissions for different user profiles, such as ADMIN and STAFF, ensuring that each person has access only to the necessary functionalities.

Modular Structure: The code is organized into controllers, services, middlewares, and routes layers to facilitate maintenance and the addition of new features.

## Key Features
Product Management: Create, view, update, and delete products with details like SKU, description, and stock.

Stock Control: Record incoming and outgoing movements, updating the inventory in real-time.

Vendor and Location Registration: Maintain a complete record of vendors and storage locations for efficient logistics.

User and Permission Administration: Manage user profiles and assign specific permissions to ensure data security.

## Technologies Used
Backend:

Node.js

Express

TypeScript

Prisma ORM

PostgreSQL

JWT (JSON Web Tokens)

Nodemon (for development)

Contact
For more information about the project, please contact the development team.
