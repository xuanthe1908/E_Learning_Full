# 📊 Use Case Diagrams - Shop Platform

## Description

This document contains Use Case Diagrams for the Shop Platform system. The diagrams are organized into an overview diagram and detailed diagrams for each role.

## Files

### 1. Overview Diagram
- **`usecase-overview.puml`** - High-level overview of all system use cases
  - Shows main functional areas
  - 3 actors: Customer, Seller, Admin
  - 7 main packages with core use cases
  - Includes role descriptions

### 2. Role-Based Detail Diagrams

#### **`usecase-customer.puml`** - Customer Use Cases
- **Role**: End users who browse and purchase products
- **Responsibilities**: Browse products, shop, view products, interact with community, use AI chat
- **Packages**:
  - Authentication: Register, Login, Logout, Change Password
  - Product Browsing: Browse, Search, View Details, Filter
  - Shopping: Add to Cart, View Cart, Checkout, Pay VNPay, View History
  - Product Viewing: View Items, View Media
  - Community: Discussion, Review
  - AI Chat: Create Chat, Send Message, View History
  - Profile: View/Update Profile, Dashboard

#### **`usecase-seller.puml`** - Seller Use Cases
- **Role**: Product creators and sellers
- **Responsibilities**: Create and manage products, view analytics, interact with customers
- **Packages**:
  - Authentication: Register, Login, Request Approval
  - Product Management: Create, Edit, Delete, View Products
  - Item Management: Add, Edit, Delete, View Items
  - Analytics: View Customers, Statistics, Revenue
  - Community: Reply Discussion, Manage Channels
  - AI Chat: Create Chat, Send Message, View History
  - Profile: View/Update Profile, Dashboard

#### **`usecase-admin.puml`** - Admin Use Cases
- **Role**: System administrators
- **Responsibilities**: Manage users, categories, payments, view statistics, handle support
- **Packages**:
  - Authentication: Login, Logout, Change Password
  - User Management: Manage Sellers/Customers, Approve/Reject, Block/Unblock
  - Category Management: Add, Edit, Delete, View Categories
  - Payment Management: View Payments, Process Refund
  - Analytics: View Statistics, Reports, Dashboard
  - Support: View Contact Messages, Reply Messages

## How to Use

### View Online
1. Visit: https://www.plantuml.com/plantuml/uml/
2. Copy the content of `.puml` file
3. Paste into the editor
4. View the diagram

### View in VS Code
1. Install extension: "PlantUML"
2. Open `.puml` file
3. Press `Alt + D` to preview

### Export to Image
```bash
# Install PlantUML
npm install -g node-plantuml

# Export PNG
puml generate docs/usecase-overview.puml -o docs/usecase-overview.png
puml generate docs/usecase-customer.puml -o docs/usecase-customer.png
puml generate docs/usecase-seller.puml -o docs/usecase-seller.png
puml generate docs/usecase-admin.puml -o docs/usecase-admin.png
```

## Reading Order

1. **Start with**: `usecase-overview.puml` - Get the big picture
2. **Then view**: Role-specific detail diagrams:
   - `usecase-customer.puml` - For customer features
   - `usecase-seller.puml` - For seller features
   - `usecase-admin.puml` - For admin features

## Actors & Roles

### 1. Customer
- **Role**: End users who browse and purchase products
- **Key Responsibilities**:
  - Browse and search for products
  - Add products to cart and checkout
  - View purchased products
  - Interact with community (discussions, reviews)
  - Use AI chat for assistance

### 2. Seller
- **Role**: Product creators and sellers
- **Key Responsibilities**:
  - Create and manage products
  - Add and manage product items
  - View customer analytics and revenue
  - Interact with customers through discussions
  - Use AI chat for support

### 3. Admin
- **Role**: System administrators
- **Key Responsibilities**:
  - Manage all users (sellers and customers)
  - Approve or reject seller registration requests
  - Manage product categories
  - View system statistics and reports
  - Handle payment management and refunds
  - Respond to customer support messages

## Main Packages

1. **Authentication**: User registration and login
2. **Shop**: Product browsing and management
3. **Shopping**: Cart and payment processing
4. **Product Viewing**: Viewing product details and media
5. **Community**: Discussions and reviews
6. **AI Chat**: AI assistant chat functionality
7. **Administration**: System administration

## Relationships

### Extend (<<extend>>)
- Use case extends another use case
- Example: Checkout extends Add to Cart
- Example: Pay VNPay extends Checkout

### Include (<<include>>)
- Use case must include another use case
- Example: Login includes Refresh Token

## Color Coding

- **Light Blue**: Authentication
- **Light Green**: Shop/Product Management
- **Light Yellow**: Item Management
- **Light Coral**: Shopping & Payment
- **Light Pink**: Product Viewing
- **Light Gray**: Community
- **Light Cyan**: AI Chat
- **Lavender**: Analytics
- **Light Steel Blue**: Profile Management
- **Misty Rose**: Admin Management

## Notes

- All diagrams use English for better readability
- Diagrams are simplified and easy to read
- Each diagram includes role descriptions and responsibilities
- Use cases can be extended in the future
- Diagrams are organized by role for clarity
