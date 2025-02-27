require('dotenv').config();


// Function to inpaint an image with a prompt
async function getTreatment(images, prompt) {
  try {

   
    
    // Convert ReadableStream to a string
    const response = responseStream.toString();
    console.log(response);
    const base64Image = await convertImageToBase64(response);

    return base64Image;
    
  } catch (error) {
    console.error('Error:', error);
  }
}


module.exports = {
  getTreatment
};