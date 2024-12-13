// const fs = require('fs');

// // Define the options
// const eyesOptions = [
//     "none",
//     "Eyes closed",
//     "Eyes without the sclera (all black)",
//     "Eyes without the iris and pupil (completely white)",
//     "Smaller eyes (more normal than the original image)",
//     "Larger eyes (even larger than the original image)",
//     "Eyes looking to the right",
//     "Eyes looking to the left",
//     "Eyes looking down",
//     "Eyes looking up"
// ];

// const noseOptions = [
//     "none",
//     "Larger nose",
//     "Smaller nose",
//     "Larger nostrils",
//     "Smaller nostrils",
//     "Wider bridge",
//     "Narrower bridge",
//     "Broader/wider",
//     "No visible nostrils",
//     "Nostrils upturned (allowing the users to see into the nostrils a bit)"
// ];

// const mouthOptions = [
//     "none",
//     "Larger mouth - open",
//     "Larger mouth - closed",
//     "Fuller lips - open",
//     "Fuller lips - closed",
//     "Thinner lips - open",
//     "Thinner lips - closed",
//     "Smiling - open",
//     "Smiling - closed",
//     "Mouth open with teeth visible"
// ];

// // Generate all combinations
// function cartesianProduct(arrays) {
//     return arrays.reduce((a, b) => a.flatMap(d => b.map(e => [...d, e])), [[]]);
// }

// const combinations = cartesianProduct([eyesOptions, noseOptions, mouthOptions]);

// // Generate CSV data
// const header = 'Eyes, Nose, Mouth\n';
// const rows = combinations.map(combination => `${combination[0]}, ${combination[1]}, ${combination[2]}`).join('\n');

// // Write to a CSV file
// const csvData = header + rows;
// fs.writeFileSync('combinations.csv', csvData);

// console.log('CSV file created: combinations.csv');



// Required modules
const fs = require('fs');
const csv = require('csv-parser');
const csvWriter = require('csv-writer');

// Input and output file paths
const inputFilePath = '/Users/josh/Downloads/Uncanny - Robot.csv';   // Replace with your input CSV file name
const outputFilePath = 'output_r.csv'; // Output CSV file name


