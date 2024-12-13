const fs = require('fs-extra');
const path = require('path');

async function convertImagesToBase64(folderPath) {
  try {
    // Read all files in the folder
    const files = await fs.readdir(folderPath);
    
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const fileStats = await fs.stat(filePath);
      
      // Check if the current file is an image and not a directory
      if (fileStats.isFile() && /\.(jpg|jpeg|png|gif)$/i.test(filePath)) {
        // Read the image file
        const imageData = await fs.readFile(filePath);
        // Convert image data to Base64
        const base64Image = Buffer.from(imageData).toString('base64');
        // Log the Base64 string
        console.log(`Base64 of ${file}:`, base64Image);
      }
    }
  } catch (error) {
    console.error('Error processing files:', error);
  }
}

// Specify the folder path here
const imagesFolderPath = '/Users/josh/Downloads/batch_images';
convertImagesToBase64(imagesFolderPath);
