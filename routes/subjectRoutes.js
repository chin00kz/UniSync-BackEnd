const express = require('express');
const router = express.Router();
const {
    getSubjects,
    createSubject
} = require('../controllers/subjectController');

router.route('/')
    .get(getSubjects)
    .post(createSubject);

module.exports = router;
