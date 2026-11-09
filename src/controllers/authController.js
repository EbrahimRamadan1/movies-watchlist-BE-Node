import bcrypt from "bcryptjs";
import { prisma } from "../config/db.js";
import { generateToken } from "../utils/generateToken.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;
  const isUserExists = await prisma.user.findUnique({
    where: { email: email },
  });

  if (isUserExists) {
    return res
      .status(400)
      .json({ error: "User already exists with this email." });
  }

  // Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create User
  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  res.status(201).json({
    status: "Success",
    data: {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Generate JWT Token
  const token = generateToken(user.id, res);

  res.status(200).json({
    status: "Success",
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  });
};

const logout = async (_, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res
    .status(200)
    .json({ status: "Success", message: "Logged out successfully." });
};

export { login, logout, register };
