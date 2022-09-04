const express = require('express');
const router = express.Router();//express ke andar router hota hai
const Notes = require('../models/Notes');
const fetch_user = require('../middleware/fetchUser');
const { body, validationResult } = require('express-validator');

// Route 1 : Get all the notes using : GET "/api/notes/fetchAllNotes". No login required
router.get('/fetchAllNotes', fetch_user, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})
// Route 2 : Add a new note using : POST "/api/notes/addNotes". No login required
router.post('/addNotes', fetch_user, [
    body('title', 'Enter a valid title').isLength({ min: 2 }),
    body('description', 'Description must be atleast 5 character').isLength({ min: 5 }),
], async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { title, description, tag } = req.body;//destructuring
        const note = new Notes({ title, description, tag, user: req.user.id })//new is a method in JS to make an instance of an object or you can say it is a constructor
        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router;