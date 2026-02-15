# Welcome to Our Stockvel project

# Introduction

Kwaluseni Stockvel is a full-stack web application designed to digitize and simplify the management of a community-based savings group (stockvel). The system enables members to save collectively, request loans, track contributions, and monitor financial activity in a secure, transparent, and user-friendly environment.

This platform was built to promote financial accountability, improve administrative efficiency, and strengthen trust within the stockvel community.

# Project Overview

# Kwaluseni Stockvel provides:
- Secure authentication using Supabase
- Role-based access control (Admin & Member)
- Monthly contribution tracking
- Loan request system with automatic staggered interest calculation
- Admin loan approval and rejection workflow
- Risk monitoring system (Admin-only)
- Annual savings and payout calculations
- Member profile management
- Search and filtering functionality

# The system ensures that:
- Members can manage their savings and loans transparently
- Admins can oversee financial activity and manage members efficiently
- All financial calculations are automated and accurate

# Tech Stack
- Frontend: React
- Backend: Supabase (Auth + PostgreSQL)
- Database: PostgreSQL with triggers and role-based policies
- Authentication: Supabase Auth
- Security: Row-Level Security (RLS)

# This project is built with:
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS


## How to edit and run this code?

There are several ways of editing your application.


**1) Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. 

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**2) Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**3) Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

So basically Kwaluseni Stockvel is more than just a management tool, it is a digital financial coordination system built to support community driven savings and responsible lending in the Eswatini.

