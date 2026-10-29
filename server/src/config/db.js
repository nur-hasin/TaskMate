import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (
    !uri ||
    uri.includes('<db_username>') ||
    uri.includes('<cluster-host>')
  ) {
    throw new Error('Please configure MONGODB_URI in server/.env.');
  }

  await mongoose.connect(uri);

  console.log('MongoDB connected successfully.');
}
