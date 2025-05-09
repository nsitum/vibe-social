
# Vibe Social Network

Vibe Social is a small social network built with **plain JavaScript** using the **Vite** bundler. The app showcases MVC (Model-View-Controller) architecture and offers core social media functionalities such as user authentication, post management, commenting, and profile customization.


## 🚀 Features

- 🔐 **Authentication**
  - User login & registration

- 📝 **Post Management**
  - Create, edit, and delete posts
  - Like/unlike posts
  - Add comments to posts

- 👤 **User Profile**
  - View and edit profile details
  - Upload/change profile picture
  
This approach ensures better code organization and scalability.
## 🧠 Architecture

The project is structured following the **MVC pattern** for clear separation of concerns:

- **Model** – Handles data and application logic
- **View** – Manages the UI rendering
- **Controller** – Acts as the link between Model and View
## 🛠️ Tech Stack

- **JavaScript (ES6)**
- **Vite** – Lightning-fast development build tool
- **HTML5 & CSS3** – Semantic markup and styling
- **MockAPI.io** – Temporary backend substitute for data persistence
## 🧪 Running the Project Locally

1. Clone the repository:

```bash
git clone https://github.com/nsitum/vibe-social
cd vibe-social
```
Install dependencies:
```bash
npm install
```
Run the app in development mode:
```bash
npm run dev
```
Open your browser and go to: http://localhost:5173
## 📌 Notes
- This project does not include a backend – data is stored temporarily using MockAPI.io
- All logic is implemented in vanilla JS to solidify JavaScript fundamentals before moving on to frameworks like React.
