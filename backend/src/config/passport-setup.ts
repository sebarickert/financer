import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";

import { GITHUB_TOKENS } from "./keys";
import User from "../models/user-model";
// const TwitterStrategy = require("passport-twitter");

// serialize the user.id to save in the cookie session
// so the browser will remember the user when login
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// deserialize the cookieUserId to user in the database
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user: any) => {
      done(null, user);
    })
    .catch((e: any) => {
      done(new Error("Failed to deserialize an user"));
    });
});

passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_TOKENS.GITHUB_CLIENT_ID,
      clientSecret: GITHUB_TOKENS.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/github/redirect",
    },
    async (accessToken: any, refreshToken: any, profile: any, done: any) => {
      const currentUser = await User.findOne({
        githubId: profile.id,
      });
      // create new user if the database doesn't have this user
      if (!currentUser) {
        console.log(profile);
        const newUser = await new User({
          name: profile.displayName,
          screenName: profile.username,
          githubId: profile.id,
          profileImageUrl: profile.photos[0]?.value
        }).save();
        if (newUser) {
          done(null, newUser);
        }
      }
      done(null, currentUser);
    }
  )
);
