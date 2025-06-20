import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'  // ✅ bcryptjs instead of bcrypt
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    if (!role) return res.status(400).json({ message: 'Role is required' })

    const existingUser = await User.findOne({ email })
    if (existingUser) return res.status(400).json({ message: 'Email already in use' })

    const newUser = new User({ name, email, password, role })
    await newUser.save()

    res.status(201).json({ message: 'User registered successfully', role }) // send back role for redirect
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

