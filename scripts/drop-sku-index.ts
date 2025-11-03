import connectDB from "../lib/db"
import Product from "../lib/models/product"

async function dropSkuIndex() {
  try {
    await connectDB()
    await Product.collection.dropIndex("sku_1")
    console.log("Dropped sku_1 index successfully")
  } catch (error) {
    console.error("Error dropping index:", error)
  } finally {
    process.exit(0)
  }
}

dropSkuIndex()