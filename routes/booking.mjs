import express from "express";
import Booking from "../models/Booking.mjs";

const router = express.Router();

// Create Booking
router.post("/create-booking", async (req, res) => {
    try {
        const { date, time, guests, name, contact } = req.body;

        if (!date || !time || !guests || !name || !contact) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const newBooking = new Booking({ date, time, guests, name, contact });
        await newBooking.save();

        res.status(201).json({ 
            message: "Booking created successfully.",
            data: [
                {"date": date},
                {"time": time},
                {"guests": guests},
                {"name": name},
                {"contact": contact},
            ]
        });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: "Time slot already booked." });
        } else {
            res.status(500).json({ message: "Internal server error." });
        }
    }
});

// Get Bookings
router.get("/get-booking", async (req, res) => {
    try {
        const { date } = req.query;

        const bookings = date
            ? await Booking.find({ date })
            : await Booking.find();

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
});

// Delete Booking
router.delete("/delete-booking/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const booking = await Booking.findByIdAndDelete(id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found." });
        }

        res.status(200).json({ message: "Booking deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "Internal server error." });
    }
});

// Get available time slots for a given date
router.get('/get-available-slots', async (req, res) => {
    try {
        const { date } = req.query;  // The date provided by the user

        // Get all bookings for the selected date
        const bookings = await Booking.find({ date });

        // Define the possible time slots for the restaurant (example times)
        const allTimeSlots = [
            "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM",
            "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM",
            "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM"
        ];

        // Find out which slots are already taken based on existing bookings
        const takenSlots = bookings.map(booking => booking.time);

        // Filter out taken slots
        const availableSlots = allTimeSlots.filter(slot => !takenSlots.includes(slot));

        // Return the available time slots for the selected date
        res.status(200).json({ availableSlots });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching available slots', error });
    }
});

export default router;

