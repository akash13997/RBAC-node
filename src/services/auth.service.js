
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const env = require("../config/env");

const signup = async (userData) => {
  const { name, email, password, role } = userData;
//   const email = userData.email.trim().toLowerCase();
  if (!name || !email || !password) {
    throw new Error("All fields are required");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("Email already exists");
  }
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role
  });
  const userResponse = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    createdAt: user.createdAt,
  };
  return userResponse;
};

const login = async (loginData) => {

    const { email, password } = loginData;

    if (!email || !password) {

        throw new Error("Email and Password are required");

    }

    const user = await User.findOne({ email });

    if (!user) {

        throw new Error("Invalid email or password");

    }

    const isPasswordValid = await bcrypt.compare(

        password,

        user.password

    );

    if (!isPasswordValid) {

        throw new Error("Invalid email or password");

    }

    const token = jwt.sign(

        {

            id: user._id,

            email: user.email,

            role: user.role

        },

        env.JWT_SECRET,

        {

            expiresIn: env.JWT_EXPIRES_IN

        }

    );
    return {

        token,

        user: {

            id: user._id,

            name: user.name,

            email: user.email,

            role: user.role

        }

    };

};

module.exports = {
  signup,
  login
};
