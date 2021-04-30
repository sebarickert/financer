import { Router } from "express";
import passport from "passport";
import { AUTH0_TOKENS, GITHUB_TOKENS } from "../config/keys";

const CLIENT_HOME_PAGE_URL = process.env.PUBLIC_URL || "http://localhost:3000";
const router = Router();

router.get("/api/status", (req, res) => {
  const status: IAuthenticationStatus = {
    authenticated: Boolean(req.user),
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { authenticationErrors } = req.session as any;
  if (authenticationErrors) {
    status.errors = [
      authenticationErrors,
      "Please see common login issues for solution.",
    ];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (req.session as any).authenticationErrors = undefined;
  }

  res.json(status);
});

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
  // @TODO: refactor to use proper way with Declaration merging like req.session document suggest
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (req.session as any).authenticationErrors = "Authentication failed.";
  res.redirect(CLIENT_HOME_PAGE_URL);
});

// When logout, redirect to client
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(CLIENT_HOME_PAGE_URL);
});

if (GITHUB_TOKENS.IS_ACTIVATED) {
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
  router.get(
    "/auth0",
    passport.authenticate("auth0", { scope: "openid email profile" })
  );
  router.get(
    "/auth0/redirect",
    passport.authenticate("auth0", {
      successRedirect: CLIENT_HOME_PAGE_URL,
      failureRedirect: "/auth/login/failed",
    })
  );
  router.get("/logout/auth0", (req, res) => {
    res.redirect(
      `https://${AUTH0_TOKENS.AUTH0_DOMAIN}/v2/logout?client_id=${AUTH0_TOKENS.AUTH0_CLIENT_ID}&returnTo=${CLIENT_HOME_PAGE_URL}/auth/logout`
    );
  });
}

export default router;
