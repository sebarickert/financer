import passport from "passport";
import { Strategy as GitHubStrategy, Profile } from "passport-github2";

import { GITHUB_TOKENS } from "./keys";
import User, { IUserModel } from "../models/user-model";

// serialize the user.id to save in the cookie session
// so the browser will remember the user when login
passport.serializeUser((user: IUserModel, done) => {
  done(null, user.id);
});

// deserialize the cookieUserId to user in the database
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user: IUserModel | null) => {
      done(null, user);
    })
    .catch(() => {
      done(new Error("Failed to deserialize an user"));
    });
});

if (GITHUB_TOKENS.IS_ACTIVATED) {
  // eslint-disable-next-line no-console
  console.log("Github Oauth plugin enabled.");
  passport.use(
    new GitHubStrategy(
      {
        clientID: GITHUB_TOKENS.GITHUB_CLIENT_ID,
        clientSecret: GITHUB_TOKENS.GITHUB_CLIENT_SECRET,
        callbackURL: `${process.env.PUBLIC_URL}/api/auth/github/redirect`,
      },
      async (
        _accessToken: unknown,
        _refreshToken: unknown,
        profile: Profile,
        done: (err?: Error | null, profile?: IUserModel | null) => void
      ) => {
        const currentUser = await User.findOne({
          githubId: profile.id,
        });
        // create new user if the database doesn't have this user
        if (!currentUser) {
          const newUser = await new User({
            name: profile.displayName,
            screenName: profile.username,
            githubId: profile.id,
            profileImageUrl: profile.photos?.slice().shift()?.value,
          }).save();
          if (newUser) {
            done(null, newUser);
          }
        }
        done(null, currentUser);
      }
    )
  );
}
