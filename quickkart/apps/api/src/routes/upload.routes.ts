import { Router, Response } from "express";
import { requireAdmin, AuthenticatedRequest } from "../middleware/auth.middleware";
import { upload, uploadImageBuffer } from "../services/cloudinary.service";
import asyncHandler from "../middleware/async.middleware";

const router = Router();

/**
 * POST /upload/image
 * Protected — requires Admin role.
 * Uploads an image to Cloudinary and returns the secure URL.
 */
router.post(
  "/image",
  requireAdmin as any,
  upload.single("image"),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.file) {
      res.status(400).json({ success: false, error: "No image file provided" });
      return;
    }

    try {
      const imageUrl = await uploadImageBuffer(req.file.buffer);
      res.status(200).json({
        success: true,
        data: {
          url: imageUrl,
        },
      });
    } catch (error) {
      console.error("Image upload error:", error);
      res.status(500).json({ success: false, error: "Failed to upload image" });
    }
  })
);

export default router;
