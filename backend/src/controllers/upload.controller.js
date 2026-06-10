import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { ResponseError } from "../models/error.models.js";
import crypto from "crypto";

// Initialize S3 Client
const s3Client = new S3Client({
  region: process.env.REGION || "ap-southeast-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
  endpoint: process.env.S3_ENDPOINT || undefined,
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

class UploadController {
  /**
   * Upload image to S3 (Admin only)
   * Expects base64 encoded image in request body
   */
  static async uploadImage(req, res, next) {
    try {
      const { image, folder = "images" } = req.body;

      if (!image) {
        throw new ResponseError(400, "Image data is required");
      }

      // Validate AWS credentials
      if (!process.env.ACCESS_KEY_ID || !process.env.SECRET_ACCESS_KEY || !BUCKET_NAME) {
        throw new ResponseError(500, "S3 configuration is missing");
      }

      // Parse base64 image
      let base64Data;
      let mimeType;

      if (image.startsWith("data:")) {
        // Extract mime type and base64 data
        const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
          throw new ResponseError(400, "Invalid image format");
        }
        mimeType = matches[1];
        base64Data = matches[2];
      } else {
        // Assume it's just base64 without prefix
        base64Data = image;
        mimeType = "image/jpeg"; // Default
      }

      // Validate mime type
      if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
        throw new ResponseError(400, "Invalid image type. Only JPEG, PNG, and WebP are allowed");
      }

      // Convert base64 to buffer
      const buffer = Buffer.from(base64Data, "base64");

      // Validate file size
      if (buffer.length > MAX_FILE_SIZE) {
        throw new ResponseError(400, `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`);
      }

      // Generate unique filename
      const fileExtension = mimeType.split("/")[1];
      const fileName = `${folder}/${crypto.randomUUID()}.${fileExtension}`;

      // Upload to S3
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: mimeType,
        ACL: "public-read", // Make file publicly accessible
      });

      await s3Client.send(command);

      // Generate public URL
      const imageUrl = process.env.S3_ENDPOINT
        ? `${process.env.S3_ENDPOINT.replace(/\/$/, "")}/${BUCKET_NAME}/${fileName}`
        : `https://${BUCKET_NAME}.s3.${process.env.REGION || "ap-southeast-1"}.amazonaws.com/${fileName}`;

      res.status(200).json({
        success: true,
        message: "Image uploaded successfully",
        data: {
          url: imageUrl,
          fileName: fileName,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Upload multiple images (Admin only)
   */
  static async uploadMultipleImages(req, res, next) {
    try {
      const { images, folder = "images" } = req.body;

      if (!images || !Array.isArray(images) || images.length === 0) {
        throw new ResponseError(400, "Images array is required");
      }

      if (images.length > 10) {
        throw new ResponseError(400, "Maximum 10 images allowed per request");
      }

      // Validate AWS credentials
      if (!process.env.ACCESS_KEY_ID || !process.env.SECRET_ACCESS_KEY || !BUCKET_NAME) {
        throw new ResponseError(500, "S3 configuration is missing");
      }

      const uploadedImages = [];

      for (const image of images) {
        try {
          // Parse base64 image
          let base64Data;
          let mimeType;

          if (image.startsWith("data:")) {
            const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if (!matches || matches.length !== 3) {
              continue; // Skip invalid image
            }
            mimeType = matches[1];
            base64Data = matches[2];
          } else {
            base64Data = image;
            mimeType = "image/jpeg";
          }

          // Validate mime type
          if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
            continue; // Skip invalid type
          }

          // Convert base64 to buffer
          const buffer = Buffer.from(base64Data, "base64");

          // Validate file size
          if (buffer.length > MAX_FILE_SIZE) {
            continue; // Skip too large files
          }

          // Generate unique filename
          const fileExtension = mimeType.split("/")[1];
          const fileName = `${folder}/${crypto.randomUUID()}.${fileExtension}`;

          // Upload to S3
          const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: fileName,
            Body: buffer,
            ContentType: mimeType,
            ACL: "public-read",
          });

          await s3Client.send(command);

          // Generate public URL
          const imageUrl = process.env.S3_ENDPOINT
            ? `${process.env.S3_ENDPOINT.replace(/\/$/, "")}/${BUCKET_NAME}/${fileName}`
            : `https://${BUCKET_NAME}.s3.${process.env.REGION || "ap-southeast-1"}.amazonaws.com/${fileName}`;

          uploadedImages.push({
            url: imageUrl,
            fileName: fileName,
          });
        } catch (err) {
          console.error("Error uploading image:", err);
          // Continue with next image
        }
      }

      if (uploadedImages.length === 0) {
        throw new ResponseError(400, "No images were uploaded successfully");
      }

      res.status(200).json({
        success: true,
        message: `${uploadedImages.length} images uploaded successfully`,
        data: uploadedImages,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default UploadController;
