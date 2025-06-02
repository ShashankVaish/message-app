import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const dbURI = process.env.MONGODB_URI ;
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error; // Rethrow the error to be handled by the caller
    }
}
export { connectDB };
export default connectDB;