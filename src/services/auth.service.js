const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const env = require("../config/env");
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../utils/jwt");
const RefreshToken = require("../models/RefreshToken");

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
    role,
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
const normalizedEmail = email.trim().toLowerCase();
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(
    password,

    user.password,
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }
const accessToken=generateAccessToken(user);

const refreshToken=generateRefreshToken(user);

await RefreshToken.create({
    user: user._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
});

return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
  // const token = jwt.sign(
  //   {
  //     id: user._id,
  //     email: user.email,
  //     role: user.role,
  //   },
  //   env.JWT_SECRET,
  //   {
  //     expiresIn: env.JWT_EXPIRES_IN,
  //   },
  // );
  // return {
  //   token,
  //   user: {
  //     id: user._id,
  //     name: user.name,
  //     email: user.email,
  //     role: user.role,
  //   },
  // };
};

const refreshAccessToken = async (refreshToken) => {
    if (!refreshToken) {
        throw new Error("Refresh token missing");
    }
    const decoded = verifyRefreshToken(refreshToken);
    const savedToken = await RefreshToken.findOne({
        token: refreshToken
    });
    if (!savedToken) {
        throw new Error("Invalid refresh token");
    }
    const user = await User.findById(decoded.id);
    if (!user) {
        throw new Error("User not found");
    }
    const accessToken = generateAccessToken(user);
    return {
        accessToken
    };

};

module.exports = {
  signup,
  login,
  refreshAccessToken
};
