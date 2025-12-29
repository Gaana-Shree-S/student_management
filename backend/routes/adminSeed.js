const express = require("express");
const router = express.Router();
const adminDetails = require("../models/details/admin-details.model");

/**
 * DEV ONLY
 * POST /api/seed-admin
 */
router.post("/seed-admin", async (req, res) => {
  try {
    // 🔒 Block seeding in production
    if (process.env.NODE_ENV === "production" && req.query.key !== "INIT_ADMIN") {
      return res.status(403).json({
        message: "Seeding is disabled in production",
      });
    }

    // 🔒 Prevent duplicate super admin
    const existingAdmin = await adminDetails.findOne({
      isSuperAdmin: true,
    });

    if (existingAdmin) {
      return res.status(200).json({
        message: "Admin already exists",
      });
    }

    const admin = await adminDetails.create({
      employeeId: 123456,
      firstName: "Admin",
      lastName: "Admin",
      email: "admin@gmail.com",
      phone: "1234567890",
      password: "admin123", // pre-save hook will hash
      isSuperAdmin: true,
      status: "active",
      gender: "male",
      country: "India",
    });

    res.status(201).json({
      message: "✅ Admin created successfully",
      admin: {
        email: admin.email,
        employeeId: admin.employeeId,
      },
    });

  } catch (err) {
    console.error("Seed admin error:", err);
    res.status(500).json({
      message: "❌ Seeding failed",
      error: err.message,
    });
  }
});

module.exports = router;
