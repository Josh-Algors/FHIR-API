require('dotenv').config();
const axios = require('axios');
const Replicate = require('replicate');
const env = process.env;


const replicate = new Replicate({
  auth: env.REPL_KEY,
});

// Function to inpaint an image with a prompt
async function generateImage(images, prompt) {
  try {

    const responseStream = await replicate.run(
      "stability-ai/sdxl:610dddf033f10431b1b55f24510b6009fcba23017ee551a1b9afbc4eec79e29c",
      {
        input: {
          mask: images.mask_url,
          image: images.image_url,
          prompt: prompt,
          refine: "expert_ensemble_refiner",
          scheduler: "KarrasDPM",
          lora_scale: 0.6,
          num_outputs: 1,
          guidance_scale: 7.5,
          apply_watermark: true,
          high_noise_frac: 0.8,
          negative_prompt: "",
          prompt_strength: 0.95,
          num_inference_steps: 50,
        },
      }
    );
    
    // Convert ReadableStream to a string
    const response = responseStream.toString();
    console.log(response);
    const base64Image = await convertImageToBase64(response);

    return base64Image;
    
  } catch (error) {
    console.error('Error:', error);
  }
}

async function convertImageToBase64(url) {
  try {

    const response = await axios({
      method: 'get',
      url: url,
      responseType: 'arraybuffer'
    });

    // Convert the buffer to a Base64 string
    const base64 = Buffer.from(response.data, 'binary').toString('base64');

    return base64;

  } catch (error) {
    console.error('Error converting image to Base64:', error);
    return null;
  }
}



module.exports = {
    generateImage
};