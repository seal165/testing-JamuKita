import crypto from 'crypto';
import fs from 'fs';

/**
 * Generates a random JWT secret key.
 * @param {number} [length=64] - The length of the secret key in bytes.
 * @return {string} - A random JWT secret key in hexadecimal format.
 */

function generateJWTSecret(length = 64) {
    return crypto.randomBytes(length).toString('hex');
}

// This run from node generator/generateJWT.js (length is 64 bytes by default)
let length = 64; // Default length in bytes
if (process.argv.length > 2) {
    length = parseInt(process.argv[2], 10); // Get the length from command line argument
    if (isNaN(length) || length <= 0) {
        console.error('Please provide a valid positive integer for the secret length.');
        process.exit(1);
    }
}
console.log('Generating JWT Secret with length:', length);

const secret = generateJWTSecret(length);
// Find .env file in your project root directory
let envFilePath = './.env';
if (fs.existsSync(envFilePath)) {
    console.log(`Saving JWT Secret to ${envFilePath}`);
    let envFileContent = fs.readFileSync(envFilePath, 'utf8');
    // Check if JWT_SECRET already exists in the .env file
    if (envFileContent.includes('JWT_SECRET=')) {
        console.log('JWT_SECRET already exists in .env file. Updating it.');
        envFileContent = envFileContent.replace(/JWT_SECRET=.*/, `JWT_SECRET="${secret}"`);
        fs.writeFileSync(envFilePath, envFileContent, 'utf8');
    } else {
        console.log('Adding JWT_SECRET to .env file.');
        fs.appendFileSync(envFilePath, `\nJWT_SECRET="${secret}"\n`, 'utf8');
    }
} else {
    console.log(`No .env file found. Please create one and add the JWT_SECRET variable.`);
    process.exit(1);
}

console.log('Your random JWT Secret:', secret);
