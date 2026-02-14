const {
  signupService,
  loginService,
  refreshService,
  logoutService,
} = require("./auth.service");

const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await signupService(email, password);

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { accessToken, refreshToken } = await loginService(email, password);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      accessToken,
    });
  } catch {
    res.status(401).json({
      message: "Invalid credentials",
    });
  }
};

const getMe = async (req, res) => {
  res.status(200).json({
    id: req.user.id,
    email: req.user.email,
    role: req.user.role,
  });
};

const refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { accessToken, refreshToken } = await refreshService(token);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    res.status(200).json({ accessToken });
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
};

const logout = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (token) {
    await logoutService(token);
  }

  res.clearCookie("refreshToken");

  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = {
  signup,
  login,
  getMe,
  refresh,
  logout,
};
