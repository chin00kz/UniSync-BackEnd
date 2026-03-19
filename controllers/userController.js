// @desc    Get all users
// @route   GET /api/users
// @access  Public
exports.getUsers = (req, res, next) => {
    res.status(200).json({ success: true, message: 'Displaying all users' });
};

// @desc    Create new user
// @route   POST /api/users
// @access  Public
exports.createUser = (req, res, next) => {
    res.status(201).json({ success: true, message: 'User created' });
};
