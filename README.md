Here’s your **updated client-side README** with the dependencies added under **Technologies Used / Packages**:

````markdown
# Forum-X: MERN Forum Platform

**Live Site:** [Forum-X Client](https://forum-x-auth.web.app)  
**Server API:** [Server](https://forum-x-server.vercel.app)

---

## Project Overview
Forum-X is an interactive online forum built with the **MERN stack (MongoDB, Express, React, Node.js)**. Users can post, comment, upvote/downvote, and engage with a dynamic community. The platform supports **membership tiers, badges, notifications, admin dashboard, announcements**, and a fully responsive UI for desktop, tablet, and mobile.

This project demonstrates **full-stack development, role-based access control, user authentication**, and modern web technologies.

---

## Key Features

### User Features
- Register/Login (Email + Social login)  
- Profile with badges (Bronze/Gold)  
- Create posts with tags (up to 5 posts for normal users)  
- Search posts by tags & sort by popularity  
- Comment on posts (multiple comments per user)  
- Share posts via social media (react-share)  
- Membership system to unlock unlimited posts  
- Notifications & announcements  
- Fully responsive design (mobile, tablet, desktop)  

### Dashboard Features

#### User Dashboard
- Profile view (recent posts, badges)  
- Add post form (limited by membership)  
- View/manage posts  
- Comment management with feedback/reporting  

#### Admin Dashboard
- Manage users (Make Admin, Subscription status)  
- Handle reported comments/activities (**ReportedActivities component**):  
  - View all reported comments with details (author, reporter, reason, date, status)  
  - **Search & Filter** reports by user, comment, reason, or status  
  - **Pagination** for large datasets  
  - **Take actions on reports:**  
    - Mark as Reviewed  
    - Delete Comment  
    - Warn User  
    - Dismiss Report  
  - Visual **status badges** for quick reference  
- Make announcements  
- View site statistics (posts, comments, users)  
- Add tags for posts  

---

## Technologies Used

### Frontend
- **React.js** (v19.1.1)  
- **React Router Dom** (v7.9.2)  
- **Tailwind CSS** + **DaisyUI**  
- **React Hook Form** (v7.63.0)  
- **React Query / Tanstack Query** (v5.89.0)  
- **Axios** (v1.12.2)  
- **React Select** (v5.10.2)  
- **React Share** (v5.2.2)  
- **React Hot Toast** (v2.6.0)  
- **React Toastify** (v11.0.5)  
- **Framer Motion** (v12.23.16)  
- **AOS** (v2.3.4)  
- **Canvas Confetti** (v1.9.3)  
- **Lottie / Lottie Player** (v2.4.1 / v3.6.0)  
- **React Fast Marquee** (v1.6.5)  
- **React CountUp** (v6.5.3)  
- **Firebase** (v12.3.0)  
- **SweetAlert2** (v11.23.0)  
- **Inquirer** (v12.9.2)  

### Backend
- Node.js  
- Express.js  
- MongoDB / Mongoose  
- JWT for authentication  
- dotenv for environment variables  

### Deployment
- **Frontend:** Firebase Hosting  
- **Backend:** Vercel  

---

## Installation & Setup

### Frontend
```bash
git clone https://github.com/YourUsername/forum-x-client.git
cd forum-x-client
npm install
npm run dev
````

Frontend runs at `http://localhost:5173`.

### Backend

```bash
git clone https://github.com/YourUsername/forum-x-server.git
cd forum-x-server
npm install
npm run start
```

Backend runs at `http://localhost:3000`.

---

## Environment Variables

### Frontend (.env)

```env
VITE_FIREBASE_API_KEY=yourFirebaseApiKey
VITE_FIREBASE_AUTH_DOMAIN=yourFirebaseAuthDomain
VITE_FIREBASE_PROJECT_ID=yourFirebaseProjectId
VITE_FIREBASE_STORAGE_BUCKET=yourFirebaseStorageBucket
VITE_FIREBASE_MESSAGING_SENDER_ID=yourFirebaseSenderId
VITE_FIREBASE_APP_ID=yourFirebaseAppId
VITE_API_BASE_URL=http://localhost:3000
```

