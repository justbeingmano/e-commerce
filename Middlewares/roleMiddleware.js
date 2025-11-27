export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
        console.log("ROLE CHECK:", req.user.role);

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Not allowed" });
    }
    next();
  };
};