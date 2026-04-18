require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // 1. Required to serve HTML files
const Contact = require('./models/Contact');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- FRONTEND SETUP ---
// This tells the server to look for static files (like images, css, js, html) in the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// This catches any GET request that isn't the API and serves index.html (Important for React/Vanilla JS routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// -----------------------

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- ROUTES ---

// POST Route to handle Contact Form Submission
app.post('/api/contact', async (req, res) => {
  try {
    const { fname, lname, phone, service, address, message } = req.body;

    // Simple Backend Validation
    if (!fname || !phone || !service) {
      return res.status(400).json({ 
        success: false, 
        message: 'الاسم ورقم الهاتف ونوع الخدمة مطلوبين.' 
      });
    }

    // Create new contact entry
    const newContact = new Contact({
      fname,
      lname,
      phone,
      service,
      address,
      message
    });

    // Save to Database
    await newContact.save();

    // Send Success Response
    res.status(201).json({ 
      success: true, 
      message: 'تم استلام طلبك بنجاح!' 
    });

  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ 
      success: false, 
      message: 'حدث خطأ في الخادم، يرجى المحاولة لاحقاً.' 
    });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API Endpoint: http://localhost:${PORT}/api/contact`);
});