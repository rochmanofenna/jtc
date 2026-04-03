import { type NextRequest } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")

    if (!file || !(file instanceof File)) {
      return Response.json(
        { error: "No file provided. Send a file in the 'file' field." },
        { status: 400 }
      )
    }

    // Validate file type (images only)
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ]
    if (!allowedTypes.includes(file.type)) {
      return Response.json(
        {
          error: `Invalid file type: ${file.type}. Allowed: ${allowedTypes.join(", ")}`,
        },
        { status: 400 }
      )
    }

    // Max file size: 5MB
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return Response.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      )
    }

    // Generate a unique filename with timestamp prefix
    const ext = file.name.split(".").pop() ?? "jpg"
    const timestamp = Date.now()
    const safeName = file.name
      .replace(/\.[^.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 50)
    const filename = `${timestamp}-${safeName}.${ext}`

    // Ensure uploads directory exists
    const uploadsDir = join(process.cwd(), "public", "uploads")
    await mkdir(uploadsDir, { recursive: true })

    // Write file to disk
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filePath = join(uploadsDir, filename)
    await writeFile(filePath, buffer)

    const url = `/uploads/${filename}`

    return Response.json({ url }, { status: 201 })
  } catch (err) {
    console.error("POST /api/upload error:", err)
    return Response.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status: 500 }
    )
  }
}
