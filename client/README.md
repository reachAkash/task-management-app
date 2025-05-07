## Task Management Project

### 🚀 Getting Started

To install and run the project locally, follow the steps below:

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Install Dependencies:**

   - Navigate to the client folder and run:

     ```bash
     cd client
     npm install --force
     ```

     > The `--force` flag is used due to dependency issues.

   - Navigate to the server folder and run:

     ```bash
     cd ../server
     npm install
     ```

3. **Environment Variables:**

   - Make sure to add the required credentials in a `.env` file inside the `server` folder.

4. **Run the Project Locally:**

   - From the root directory, you can start both client and server:

     ```bash
     npm run dev
     ```

### 🔐 **Authentication & Authorization:**

- Users must **Register** or **Login** to access the main dashboard. Unauthenticated users are redirected to the **Login Page**.
- After logging in, users can view all the projects they have created.
- There is an option to **Become an Admin** for extended privileges.

### 🔒 **Role-based System:**

- Two main roles:

  - **Admin:** Full access to project and task management.
  - **User:** Limited to their own projects unless invited to others.

### 🗂️ **Admin Features:**

- **Create Projects:** Admins can create new projects.
- **Create Tasks:** Tasks can be added under projects.
- **Invite Teams:** Admins can invite users to collaborate.
- **CRUD Operations:** Full CRUD (Create, Read, Update, Delete) is available for projects and tasks.
- **Update Task Details:** Status, priority, and other details can be modified.
- **Remove Users:** Admins have the authority to remove users from projects.

### 🔄 **Refresh Token Mechanism:**

- The project uses a **refresh token mechanism**. If the session expires, the browser automatically fetches a new access token using the refresh token, ensuring seamless access.

### 🛠️ **Code Structure & API Handling:**

- The code is modular and well-structured for maintainability.
- Proper handling of APIs with error management.
