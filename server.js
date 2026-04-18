if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Contact = require('./models/Contact');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static files (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));
  mongoose.connection.on('error', err => {
  console.error('🔥 MongoDB lost connection:', err);
});

// --- API ROUTES (must be before wildcard) ---
app.post('/api/contact', async (req, res) => {
  try {
    const { fname, lname, phone, service, address, message } = req.body;

    if (!fname || !phone || !service) {
      return res.status(400).json({ 
        success: false, 
        message: 'الاسم ورقم الهاتف ونوع الخدمة مطلوبين.' 
      });
    }

    const newContact = new Contact({
      fname, lname, phone, service, address, message
    });

    await newContact.save();

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

// Wildcard MUST be last — serves frontend for all non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});