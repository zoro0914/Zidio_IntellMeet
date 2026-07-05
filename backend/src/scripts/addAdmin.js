require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("../models/Admin");
const connectDB = require("../config/db");


const run = async () => {
  const email = process.argv[2];
  const name = process.argv[3] || "Administrator";
  const password = process.argv[4] || "admin123";

  if (!email) {
    console.log("\n📖 IntellMeet Admin Seeder Script");
    console.log("Usage to promote existing admin:  node src/scripts/addAdmin.js <email>");
    console.log("Usage to create new admin user:   node src/scripts/addAdmin.js <email> <name> <password>\n");
    process.exit(1);
  }

  try {
    console.log("Connecting to database...");
    await connectDB();

    let adminUser = await Admin.findOne({ email: email.toLowerCase().trim() });

    if (adminUser) {
      console.log(`Admin found: ${adminUser.name} (${adminUser.email}) with current status: ${adminUser.status}`);
      adminUser.role = "admin";
      await adminUser.save();
      console.log(`✅ Admin updated successfully!`);
    } else {
      console.log(`Creating new admin account with email: ${email}...`);
      adminUser = await Admin.create({
        name,
        email: email.toLowerCase().trim(),
        password,
        role: "admin",
      });
      console.log(`✅ New Admin user registered successfully!`);
      console.log(`   Name:     ${adminUser.name}`);
      console.log(`   Email:    ${adminUser.email}`);
      console.log(`   Password: ${password} (Please change this in settings)`);
    }
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding operation failed:", error.message);
    process.exit(1);
  }
};

run();
