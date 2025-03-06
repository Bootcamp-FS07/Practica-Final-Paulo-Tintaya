# Practica Final – Paulo Tintaya
![Project Screenshot](demo.gif)

This project simulates a social media feed where users can register, log in, view posts, create new posts, edit or delete their posts, and comment on posts. It demonstrates advanced Angular concepts such as:
- Standalone components
- Observables & RxJS
- Custom Pipes (e.g., time-ago pipe)
- HTTP Interceptors for auth token management
- Modular folder structure (Core, Modules/Features, Shared)
- Angular Material theming and custom CSS

## Features

- **Authentication:**  
  - Login with validation (username and password)  
  - Registration form with email and password validations  
- **Feed:**  
  - Display posts (ordered by date) with frontend pagination  
  - Create, edit, and delete posts (with confirmation messages)  
- **Comments:**  
  - Add, edit, and delete comments on posts  
- **UI Enhancements:**  
  - Responsive design with custom CSS and Angular Material  
  - Custom pipes (e.g., TimeAgoPipe for relative time display)  
  - HTTP interceptor for centralized token handling  
- **Navigation:**  
  - A shared header with a welcome message and logout functionality  
  - Layout inspired by modern sites (Stack Overflow-like with a minimal, clean header)

## Technologies Used

- **Angular 19**
- **Angular Material**
- **RxJS**
- **TypeScript**
- **HTML & CSS (Custom CSS with CSS Variables)**
- **Firebase Hosting (for demo deployment)**

## Folder Structure

```
src/
├── app/
│   ├── core/              // Singleton services, interceptors, core components (header, sidebar)
│   │   └── services/
│   │       ├── auth/
│   │       ├── post/
│   │       ├── comment/
│   │       └── user/
│   ├── modules/           // Feature modules (auth, feed)
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   └── signup/
│   │   └── feed/
│   ├── shared/            // Reusable models, pipes, components, and styles
│   │   ├── models/
│   │   ├── pipes/
│   │   └── styles/
│   ├── app.component.*    // Root component files
│   ├── app.config.ts
│   └── app.routes.ts
├── environments/
│   ├── environment.prod.ts
│   └── environment.ts
├── custom-theme.scss      // Angular Material theming file
├── index.html
├── main.ts
└── styles.css             // Global styles
```

*Models are stored in the shared folder because they are used across multiple modules and components.*

## Setup & Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Bootcamp-FS07/Practica-Final-Paulo-Tintaya
   cd Practica-Final-[YourName]
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**  
   The default configuration points to a local backend running on `http://localhost:3000`. Adjust `src/environments/environment.ts` as needed.

4. **Prettier:**  
   Make sure you have Prettier configured (with 2-space indentation) for consistent code formatting.

## Running the Project

Start the development server:

```bash
ng serve
```

Navigate to `http://localhost:4200/` in your browser.

