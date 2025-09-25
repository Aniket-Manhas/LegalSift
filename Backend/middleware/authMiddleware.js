import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.js";
import Lawyer from "../models/Lawyer.js";

export const protect = (roles = []) => {
  return async (req, res, next) => {
    try {
      // ✅ Read token from cookie first, then Authorization header
      const token =
        req.cookies.token ||
        (req.headers.authorization && req.headers.authorization.split(" ")[1]);
      if (!token) return res.status(401).json({ message: "Not authorized" });

      const decoded = verifyToken(token);

      let account;
      if (decoded.role === "user")
        account = await User.findById(decoded.id).select("-password");
      else if (decoded.role === "lawyer")
        account = await Lawyer.findById(decoded.id).select("-password");

      if (!account) return res.status(401).json({ message: "User not found" });

      if (roles.length && !roles.includes(decoded.role))
        return res.status(403).json({ message: "Forbidden" });

      req.user = account;
      req.userRole = decoded.role;
      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid token" });
    }
  };
};
