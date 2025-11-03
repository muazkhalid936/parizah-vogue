// Run this script: npx ts-node scripts/seed-admin.ts
import { seedAdminUser } from "../lib/seedDatabase"

async function main() {
  console.log("Seeding admin user...")
  await seedAdminUser()
  console.log("Done!")
  process.exit(0)
}

main()
