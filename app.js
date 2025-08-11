const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
}));

// In-memory user and cart storage (for demo)
const users = [];  // stores { fullname, email, password (hashed) }
const carts = {};

// Designs array
const designs = [
  '1bag.png',
  '2bag.png',
  '3bag.png',
  '4bag.png',
  '5bag.png',
  '6bag.png',
  '7bag.png',
  'image80.png'  // if you want to use this too
];


// Middleware to require login
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/');
  }
  next();
}

// ROUTES

// Home (login/register page)
app.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/shop');
  }
  res.render('index', { error: null, success: null });
});

// Register POST
app.post('/users/register', async (req, res) => {
  const { fullname, email, password } = req.body;
  if (users.find(u => u.email === email)) {
    return res.render('index', { error: 'Email already registered', success: null });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ fullname, email, password: hashedPassword });
  res.render('index', { error: null, success: 'Registration successful! Please login.' });
});

// Login POST
app.post('/users/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.render('index', { error: 'Invalid email or password', success: null });
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.render('index', { error: 'Invalid email or password', success: null });
  }
  req.session.user = { fullname: user.fullname, email: user.email };
  if (!carts[email]) carts[email] = [];
  res.redirect('/shop');
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// Shop page (requires login)
app.get('/shop', requireLogin, (req, res) => {
  res.render('shop', {
    user: req.session.user.fullname,
    designs,
    message: req.session.message || null
  });
  req.session.message = null;  // clear flash message
});

// Add to cart POST
app.post('/cart/add', requireLogin, (req, res) => {
  const { image, name, price } = req.body;
  const userEmail = req.session.user.email;
  if (!carts[userEmail]) carts[userEmail] = [];

  const existing = carts[userEmail].find(item => item.name === name);
  if (existing) {
    existing.quantity++;
  } else {
    carts[userEmail].push({ image, name, price: parseInt(price), quantity: 1 });
  }

  req.session.message = `${name} is added to cart!`;
  res.redirect('/shop');
});

// View Cart
app.get('/cart', requireLogin, (req, res) => {
  const userCart = carts[req.session.user.email] || [];

  const totalMRP = userCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = 0;
  const platformFee = 0;
  const shippingFee = 0;
  const totalAmount = totalMRP - discount + platformFee + shippingFee;

  res.render('cart', {
    user: req.session.user.fullname,
    cartItems: userCart,
    totalMRP,
    discount,
    platformFee,
    shippingFee,
    totalAmount
  });
});

// Remove item from cart
app.post('/cart/remove', requireLogin, (req, res) => {
  const { name } = req.body;
  const userEmail = req.session.user.email;
  if (!carts[userEmail]) return res.redirect('/cart');

  carts[userEmail] = carts[userEmail].filter(item => item.name !== name);
  res.redirect('/cart');
});

// Checkout GET
app.get('/checkout', requireLogin, (req, res) => {
  const userCart = carts[req.session.user.email] || [];
  if (userCart.length === 0) return res.redirect('/cart');

  const totalMRP = userCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalAmount = totalMRP;

  res.render('checkout', {
    user: req.session.user.fullname,
    cartItems: userCart,
    totalAmount
  });
});

// Checkout POST (process payment)
app.post('/checkout/process', requireLogin, (req, res) => {
  const { cardName, cardNumber, expiryDate, cvv } = req.body;

  if (!cardName || !cardNumber || !expiryDate || !cvv) {
    return res.status(400).send('All payment fields are required.');
  }

  // Simulate payment success: clear cart
  carts[req.session.user.email] = [];

  res.send(`
    <h1>Payment Successful!</h1>
    <p>Thank you, ${req.session.user.fullname}. Your order has been placed successfully.</p>
    <a href="/shop">Go to Shop</a>
  `);
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
