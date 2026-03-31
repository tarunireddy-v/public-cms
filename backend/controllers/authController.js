const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET || "development_jwt_secret_change_me",
    { expiresIn: "7d" }
  );
};

const generateId = (role) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "";

  const prefix =
    role === "Admin" ? "AD" :
    role === "Officer" ? "OF" :
    "RS";

  for (let i = 0; i < 3; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }

  return prefix + id;
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "name, email and password are required" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    let residentId;
    let exists = true;

    while (exists) {
      residentId = generateId("Citizen");
      exists = await User.findOne({ residentId });
    }

    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      role: "Citizen",
      residentId,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    return res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        residentId: user.residentId,
        department: user.role === "Officer" ? user.department : undefined,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // #region agent log
    fetch('http://127.0.0.1:7310/ingest/01adc724-ab50-433b-84c6-e04288c98483',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'e9425a'},body:JSON.stringify({sessionId:'e9425a',runId:'pre-fix',hypothesisId:'H1',location:'backend/controllers/authController.js:85',message:'Login request received',data:{emailLower:String(email||'').toLowerCase(),passwordLength:String(password||'').length,hasEmail:!!email,hasPassword:!!password},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

    if (!email || !password) {
      // #region agent log
      fetch('http://127.0.0.1:7310/ingest/01adc724-ab50-433b-84c6-e04288c98483',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'e9425a'},body:JSON.stringify({sessionId:'e9425a',runId:'pre-fix',hypothesisId:'H2',location:'backend/controllers/authController.js:89',message:'Missing credentials branch',data:{hasEmail:!!email,hasPassword:!!password},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      return res.status(400).json({ message: "email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    // #region agent log
    fetch('http://127.0.0.1:7310/ingest/01adc724-ab50-433b-84c6-e04288c98483',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'e9425a'},body:JSON.stringify({sessionId:'e9425a',runId:'pre-fix',hypothesisId:'H1',location:'backend/controllers/authController.js:94',message:'User lookup result',data:{emailLower:String(email||'').toLowerCase(),userFound:!!user,userId:user?String(user._id):null,userRole:user?.role||null,hasStoredHash:!!user?.password},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // #region agent log
    fetch('http://127.0.0.1:7310/ingest/01adc724-ab50-433b-84c6-e04288c98483',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'e9425a'},body:JSON.stringify({sessionId:'e9425a',runId:'pre-fix',hypothesisId:'H3',location:'backend/controllers/authController.js:100',message:'Before bcrypt compare',data:{passwordLength:String(password||'').length,storedHashPrefix:user?.password?String(user.password).slice(0,7):null,storedHashLength:user?.password?String(user.password).length:0},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

    const isMatch = await bcrypt.compare(password, user.password);
    // #region agent log
    fetch('http://127.0.0.1:7310/ingest/01adc724-ab50-433b-84c6-e04288c98483',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'e9425a'},body:JSON.stringify({sessionId:'e9425a',runId:'pre-fix',hypothesisId:'H3',location:'backend/controllers/authController.js:104',message:'Bcrypt compare result',data:{isMatch},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    return res.status(200).json({
      message: "Login successful",
      token: generateToken(user),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        residentId: user.residentId,
        department: user.role === "Officer" ? user.department : undefined,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed", error: error.message });
  }
};

const resetPasswordToDefault = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash("Pass@123", salt);
    user.password = hashed;
    await user.save();

    return res.status(200).json({
      message: "Password reset successful",
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    return res.status(500).json({ message: "Password reset failed", error: error.message });
  }
};

module.exports = {
  register,
  login,
  resetPasswordToDefault,
};
