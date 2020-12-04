import { Router } from "express";
import passport from "passport";
import { AUTH0_TOKENS, GITHUB_TOKENS } from "../config/keys";

const CLIENT_HOME_PAGE_URL = process.env.PUBLIC_URL || "http://localhost:3000";
const router = Router();

// when login is successful, retrieve user info
router.get("/login/success", (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      message: "user has successfully authenticated",
      user: req.user,
      cookies: req.cookies,
    });
  }
});

// when login failed, send failed msg
router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate.",
  });
});

// When logout, redirect to client
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(CLIENT_HOME_PAGE_URL);
});

if (GITHUB_TOKENS.IS_ACTIVATED) {
  // auth with github
  router.get("/github", passport.authenticate("github"));
  router.get(
    "/github/redirect",
    passport.authenticate("github", {
      successRedirect: CLIENT_HOME_PAGE_URL,
      failureRedirect: "/auth/login/failed",
    })
  );
}

if (AUTH0_TOKENS.IS_ACTIVATED) {
  // auth with github
  router.get("/auth0", passport.authenticate("auth0"));
  router.get(
    "/auth0/redirect",
    passport.authenticate("auth0", {
      successRedirect: CLIENT_HOME_PAGE_URL,
      failureRedirect: "/auth/login/failed",
    })
  );
}

export default router;
