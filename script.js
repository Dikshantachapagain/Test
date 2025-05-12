const axios = require('axios');
const crypto = require('crypto');

// Function to check if a password is compromised
async function checkPassword(password) {
  // Step 1: Hash the password using SHA-1
  const sha1Hash = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();

  // Step 2: Extract the first 5 characters (prefix) of the hash
  const prefix = sha1Hash.substring(0, 5);
  const suffix = sha1Hash.substring(5);

  try {
    // Step 3: Query the HIBP API with the prefix
    const response = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
    const hashes = response.data.split('\n');

    // Step 4: Check if the suffix exists in the returned hashes
    const found = hashes.some(hash => {
      const [hashSuffix, count] = hash.split(':');
      return hashSuffix === suffix;
    });

    if (found) {
      console.log(`Oh no! This password has been found in data breaches. Avoid using it.`);
    } else {
      console.log(`Good news! This password has not been found in any breaches.`);
    }
  } catch (error) {
    console.error('Error querying the HIBP API:', error.message);
  }
}

// Example Usagesdda
const passwordToCheck = '123456';
checkPassword(passwordToCheck);
