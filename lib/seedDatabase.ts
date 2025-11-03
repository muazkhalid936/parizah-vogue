// Script to seed initial admin user
import connectDB from "./db"
import User from "./models/user"

export async function seedAdminUser() {
  try {
    await connectDB()

    const existingAdmin = await User.findOne({ email: "admin@parizah.com" })
    if (existingAdmin) {
      console.log("Admin user already exists")
      return
    }

    const admin = await User.create({
      name: "Parizah Admin",
      email: "admin@parizah.com",
      phone: "+1234567890",
      password: "admin123",
      role: "admin",
    })

    console.log("Admin user created:", admin.email)
  } catch (error) {
    console.error("Error seeding database:", error)
  }
}
