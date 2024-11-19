# RoleTasker

RoleTasker is a mobile application that uses React Native (with TypeScript) for the frontend and an Express.js backend. The application allows users to manage and track tasks with three distinct roles: Assignor, Worker, and Admin.

## Tech Stack
Frontend: React Native, TypeScript
Backend: Express.js

## Features and Roles

1. Assignor
The Assignor is responsible for creating tasks and assigning them to one or more workers.
After the task is completed by the worker, the Assignor can check the status of the task and track its progress.

2. Worker
The Worker views the tasks assigned to them on their screen.
Once a task is completed, the Worker acknowledges the task completion and provides a note of acknowledgment to the Admin and Assignor as well.

3. Admin
The Admin has access to all the tasks that have been assigned by the Assignor to the Worker.
The Admin can track the progress of tasks, view completion statuses, and manage task assignments.


## Installation & Setup
To run the RoleTasker project locally, you need to set up both the frontend (React Native) and backend (Express.js) parts of the application.

1. Clone the Repository
First, clone the repository to your local machine:


git clone https://github.com/your-username/RoleTasker.git
cd RoleTasker

2. Frontend (React Native) Setup
Navigate to the frontend folder and install the dependencies:

cd frontend
npm install

You may need to follow additional setup instructions for React Native development depending on your operating system. Follow the official guide to set up your environment for React Native.

3. Backend (Express.js) Setup
Navigate to the backend folder and install the dependencies:

cd backend
npm install

Make sure you have Node.js and npm installed on your system. You can check this by running:
node -v
npm -v


## Running the Application
1. Start the Backend (Express.js)
Once you have installed the backend dependencies, you can start the backend server:

cd backend
npm start

This will run the Express server on the default port, usually http://localhost:3000.

2. Start the Frontend (React Native)
To run the React Native application, use the following command in the frontend directory:


cd frontend
npm start

This will launch the Expo development server. You can run the app on your emulator or a physical device using the Expo Go app. Follow the instructions in the terminal to scan the QR code with Expo Go on your device.

