# SCATCH Shop Application

A simple Node.js & Express-based e-commerce application featuring user authentication, product catalog, shopping cart, and checkout/payment functionality.

---

## Features

- User Registration and Login with password hashing (bcrypt)
- Product catalog with image display
- Add products to a personalized shopping cart
- View and remove items from cart
- Checkout with payment form simulation
- Session management with express-session

---

## Technologies Used

- Node.js
- Express.js
- EJS Templating Engine
- bcrypt for password hashing
- express-session for session management
- Body-parser for form data handling
- CSS and static assets in public folder

---

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/your-repo.git
   cd your-repo
Install dependencies:

bash
Copy
Edit
npm install
Start the server:

bash
Copy
Edit
node app.js
Open your browser at:

arduino
Copy
Edit
http://localhost:3000
Project Structure
bash
Copy
Edit
/public          # Static assets: images, CSS, JS
/views           # EJS templates for UI pages
app.js           # Main application file with routes and logic
package.json     # Project metadata and dependencies
README.md        # Project documentation
Usage
Register a new user or login with existing credentials.

Browse products and add items to your cart.

View your cart, modify quantities or remove items.

Proceed to checkout and enter payment details (mock).

Enjoy a confirmation message on successful payment.
