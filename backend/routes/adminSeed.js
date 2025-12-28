const express = require("express");
const router = express.Router();
const adminDetails = require("../models/details/admin-details.model");

router.get("/seed-admin", async (req, res) => {
  try {
    const existingAdmin = await adminDetails.findOne({
      email: "admin@gmail.com"
    });

    if (existingAdmin) {
      return res.status(200).json({
        message: "Admin already exists"
      });
    }

    const admin = await adminDetails.create({
      employeeId: 123456,
      firstName: "Admin",
      lastName: "Admin",
      email: "admin@gmail.com",
      phone: "1234567890",
      password: "admin123", // will hash if pre-save exists
      isSuperAdmin: true,
      status: "active",
      gender: "male",
      country: "India"
    });

    res.json({
      message: "Admin created successfully",
      admin: admin.email
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Seeding failed" });
  }
});

module.exports = router;
