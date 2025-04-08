import multer from "multer";
import fs from "fs";
import { NextFunction, Request, Response } from "express";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

const imagesDirectory = process.env.IMAGES_DIR;

if (!imagesDirectory) {
  throw new Error("IMAGES_DIR is not set in the environment variables");
}

// Configure multer to process the form data before accessing req.body
export const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      try {
        // Create a default directory for temporary storage
        const defaultDir = `${imagesDirectory}/temp`;
        if (!fs.existsSync(defaultDir)) {
          fs.mkdirSync(defaultDir, { recursive: true });
        }

        let cardtype = "temp";

        // Try to parse cardData from the request
        try {
          if (req.body && req.body.cardData) {
            const cardData = JSON.parse(req.body.cardData);
            if (cardData && cardData.item) {
              cardtype = cardData.item;
            }
          }
        } catch (parseError) {
          console.error("Error parsing cardData:", parseError);
        }

        // Use cardtype if available, otherwise use temp
        const dir =
          cardtype !== "temp" ? `${imagesDirectory}/${cardtype}s` : defaultDir;

        console.log("Directory:", dir);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
      } catch (error) {
        console.error("Error in destination function:", error);
        // Use default directory in case of any error
        const defaultDir = `${imagesDirectory}/temp`;
        if (!fs.existsSync(defaultDir)) {
          fs.mkdirSync(defaultDir, { recursive: true });
        }
        cb(null, defaultDir);
      }
    },
    filename: function (req, file, cb) {
      try {
        let newFilename = "";
        let cardNumber = null;

        // Try to get the card number from the request body
        try {
          if (req.body && req.body.cardData) {
            const cardData = JSON.parse(req.body.cardData);
            if (cardData) {
              cardNumber = cardData.number;
            }
          }
        } catch (parseError) {
          console.error("Error parsing cardData for filename:", parseError);
        }

        console.log("file before renaming:", file);

        if (!cardNumber) {
          // If no card number is available, use original filename with timestamp
          const timestamp = Date.now();
          const extension = file.originalname.split(".").pop();
          newFilename = `temp_${timestamp}_${file.originalname}`;
          cb(null, newFilename);
          return;
        }

        // Determine the suffix based on the fieldname
        if (file.fieldname === "frontImage") {
          newFilename = `${cardNumber}A`;
        } else if (file.fieldname === "backImage") {
          newFilename = `${cardNumber}B`;
        } else if (file.fieldname.startsWith("additionalImage-")) {
          const index = parseInt(file.fieldname.split("-")[1]);
          const suffix = String.fromCharCode(67 + index); // 67 is ASCII for 'C'
          newFilename = `${cardNumber}${suffix}`;
        } else {
          newFilename = file.originalname;
        }

        const extension = file.originalname.split(".").pop();
        newFilename = `${newFilename}.${extension}`;

        console.log(`Renaming file: ${file.originalname} -> ${newFilename}`);
        cb(null, newFilename);
      } catch (error) {
        console.error("Error in filename function:", error);
        cb(null, file.originalname);
      }
    },
  }),
});

// middleware to upload images and save locally before saving to database
export const uploadImagesLocally = upload.fields([
  { name: "frontImage", maxCount: 1 },
  { name: "backImage", maxCount: 1 },
  // support upto 10 additional images
  { name: "additionalImage-0", maxCount: 1 },
  { name: "additionalImage-1", maxCount: 1 },
  { name: "additionalImage-2", maxCount: 1 },
  { name: "additionalImage-3", maxCount: 1 },
  { name: "additionalImage-4", maxCount: 1 },
  { name: "additionalImage-5", maxCount: 1 },
  { name: "additionalImage-6", maxCount: 1 },
  { name: "additionalImage-7", maxCount: 1 },
  { name: "additionalImage-8", maxCount: 1 },
  { name: "additionalImage-9", maxCount: 1 },
]);

// Middleware to move files from temp directory if needed
export const relocateFilesIfNeeded = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Skip if no files were uploaded
    if (!req.files) {
      return next();
    }

    // If cardData was not available during upload but is now available
    if (req.body.cardData) {
      const cardData = JSON.parse(req.body.cardData);
      const cardtype = cardData.item;
      const cardNumber = cardData.number;

      // Only process if we have both cardtype and cardNumber
      if (cardtype && cardNumber) {
        const targetDir = `${imagesDirectory}/${cardtype}s`;

        // Ensure target directory exists
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }

        // Get all uploaded files
        const uploadedFiles = req.files as {
          [fieldname: string]: Express.Multer.File[];
        };

        // Process each file
        for (const fieldname in uploadedFiles) {
          for (const file of uploadedFiles[fieldname]) {
            // Check if the file is in the temp directory
            if (file.path.includes(`${imagesDirectory}/temp`)) {
              let newFilename = "";

              // Determine the suffix based on the fieldname
              if (fieldname === "frontImage") {
                newFilename = `${cardNumber}A`;
              } else if (fieldname === "backImage") {
                newFilename = `${cardNumber}B`;
              } else if (fieldname.startsWith("additionalImage-")) {
                const index = parseInt(fieldname.split("-")[1]);
                const suffix = String.fromCharCode(67 + index); // 67 is ASCII for 'C'
                newFilename = `${cardNumber}${suffix}`;
              } else {
                // Skip if fieldname doesn't match expected pattern
                continue;
              }

              // Get the file extension from the original filename
              const extension = file.originalname.split(".").pop();
              newFilename = `${newFilename}.${extension}`;

              // Define the new path
              const newPath = `${targetDir}/${newFilename}`;

              // Move the file
              fs.renameSync(file.path, newPath);

              // Update the file path in the request
              file.path = newPath;
              file.destination = targetDir;
              file.filename = newFilename;
            }
          }
        }
      }
    }

    next();
  } catch (error) {
    console.error("Error in relocateFilesIfNeeded:", error);
    next();
  }
};
