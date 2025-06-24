import AdminUser from '../models/AdminUser.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'  
export const fetchUnapprovedUsers = async (req, res) => {
  try {
    const users = await AdminUser.find({ isApproved: false });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};
export const fetchAllUsers = async (req, res) => {
  try {
    const users = await AdminUser.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch all users' });
  }
};


export const approveUser = async (req, res) => {
  try {
    await AdminUser.findByIdAndUpdate(req.params.id, { isApproved: true });
    res.json({ message: 'User approved' });
  } catch (err) {
    res.status(500).json({ error: 'Approval failed' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await AdminUser.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    if (user.role !== 'admin' && !user.isApproved) {
      return res.status(401).json({ error: 'Account not yet approved' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, pin, parentUserId } = req.body;

    const existing = await AdminUser.findOne({ email });
    if (existing) return res.status(400).json({ error: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = new AdminUser({
      name,
      email,
      password: hashed,
      role,
      pin: role === 'sub' ? pin : undefined,
      parentUserId: role === 'sub' ? parentUserId : undefined,
      isApproved: role === 'admin' ? true : false
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered. Awaiting approval.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await AdminUser.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting user' });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { name, email, role, isApproved } = req.body;
    const updatedUser = await AdminUser.findByIdAndUpdate(
      req.params.id,
      { name, email, role, isApproved },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Error updating user' });
  }
};