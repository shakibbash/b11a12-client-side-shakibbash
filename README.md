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
- **Frontend:** React.js, Tailwind CSS, React Hook Form, React Query (Tanstack Query), React-Select, React-Share  
- **Backend:** Node.js, Express.js, MongoDB, JWT for authentication  
- **Deployment:** Firebase Hosting (client), Vercel (server)  
- **Other:** Axios, dotenv for environment variables  

---

## Installation & Setup

### Frontend
```bash
git clone https://github.com/YourUsername/forum-x-client.git
cd forum-x-client
npm install
npm run dev
