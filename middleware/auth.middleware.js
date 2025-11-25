import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers?.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No Token" });
    }

    const token = authHeader.split(" ")[1]; // "Bearer <token>"

    if (!token) {
      return res.status(401).json({ message: "No Token" });
    }

    // Verify token
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data; // attach payload to request

    next(); // pass to next middleware / route
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default authMiddleware;
