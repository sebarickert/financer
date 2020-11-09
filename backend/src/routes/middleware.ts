export const authCheck = (req: any, res: any, next: any) => {
    if (!req.user) {
      res.status(401).json({
        authenticated: false,
        message: "user has not been authenticated",
      });
    } else {
      next();
    }
  };
  