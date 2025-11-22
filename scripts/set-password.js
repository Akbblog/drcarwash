#!/usr/bin/env node
/*
  Usage:
    node scripts/set-password.js user@example.com NewP@ssw0rd

  This script connects to MongoDB using MONGODB_URI env var and updates the user's
  `password` field with a bcrypt-hashed value. It lowercases the email before lookup.
*/

const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function main() {
  const [,, emailArg, newPassword] = process.argv;
  if (!emailArg || !newPassword) {
    console.error('Usage: node scripts/set-password.js email@example.com NewPassword');
    process.exit(1);
  }

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error('Missing MONGODB_URI environment variable');
    process.exit(1);
  }

  const email = String(emailArg).toLowerCase().trim();

  const client = new MongoClient(MONGODB_URI, {});
  try {
    await client.connect();
    const db = client.db();
    const users = db.collection('users');

    const hashed = await bcrypt.hash(newPassword, 12);

    const res = await users.findOneAndUpdate(
      { email },
      { $set: { password: hashed } },
      { returnDocument: 'after' }
    );

    if (!res.value) {
      console.error('No user found with email:', email);
      process.exitCode = 2;
    } else {
      console.log('Password updated for user:', email);
    }
  } catch (err) {
    console.error('Error:', err);
    process.exitCode = 3;
  } finally {
    await client.close();
  }
}

main();
