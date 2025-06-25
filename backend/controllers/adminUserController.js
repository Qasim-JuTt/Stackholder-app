import AdminUser from '../models/AdminUser.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'  
import { createNotification } from "../utils/notificationUtils.js";
import { logChange } from '../utils/logChange.js';
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

    // Return only selected user fields
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        role: user.role 
      } 
    });
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

    const savedUser = await newUser.save();

    // Log the creation
    await logChange({
      modelName: 'AdminUser',
      documentId: savedUser._id,
      operation: 'create',
      updatedBy: savedUser._id.toString(),
      createdData: savedUser.toObject()
    });

    await createNotification(
      `🆕 User "${savedUser.name}" registered successfully.`,
      savedUser.name
    );

    res.status(201).json({ message: 'User registered. Awaiting approval.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// ✅ DELETE User with logging
export const deleteUser = async (req, res) => {
  try {
    const user = await AdminUser.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    await logChange({
      modelName: 'AdminUser',
      documentId: user._id,
      operation: 'delete',
      updatedBy: req.userId || 'unknown', // userId from auth middleware
      deletedData: user.toObject(),
    });

    await user.deleteOne(); // or AdminUser.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: 'User deleted successfully and logged' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting user' });
  }
};

// ✅ UPDATE User with logging
export const updateUser = async (req, res) => {
  try {
    const { name, email, role, isApproved } = req.body;
    const userId = req.params.id;

    const oldUser = await AdminUser.findById(userId);
    if (!oldUser) return res.status(404).json({ error: 'User not found' });

    const updatedUser = await AdminUser.findByIdAndUpdate(
      userId,
      { name, email, role, isApproved },
      { new: true }
    );

    await logChange({
      modelName: 'AdminUser',
      documentId: userId,
      operation: 'update',
      updatedBy: req.userId || 'unknown',
      before: oldUser.toObject(),
      after: updatedUser.toObject(),
    });

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Error updating user' });
  }
};