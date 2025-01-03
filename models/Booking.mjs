import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    date: { type: String, required: true },
    time: { type: String, required: true },
    guests: { type: Number, required: true },
    name: { type: String, required: true },
    contact: { type: String, required: true },
});

// Prevent duplicate bookings for the same date and time
bookingSchema.index({ date: 1, time: 1 }, { unique: true });

export default mongoose.model("Booking", bookingSchema);
