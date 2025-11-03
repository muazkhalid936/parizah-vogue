// Cloudinary integration for image uploads
// This utility can be used in the admin dashboard for uploading product images

export async function uploadToCloudinary(file: File) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  
  if (!cloudName) {
    throw new Error("Cloudinary cloud name is not configured")
  }

  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", "parizah") // Custom preset - needs to be created in Cloudinary dashboard

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Cloudinary upload failed:", errorData)
      throw new Error(`Upload failed: ${errorData.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()
    console.log("Upload successful:", data.secure_url)
    return data.secure_url
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error)
    throw error
  }
}
