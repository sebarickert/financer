import passport from "passport";
import {
  Strategy as GitHubStrategy,
  Profile as GithubProfile,
} from "passport-github2";
import { Strategy as Auth0Strategy } from "passport-auth0";

import { AUTH0_TOKENS, GITHUB_TOKENS } from "./keys";
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
        callbackURL: `${process.env.PUBLIC_URL}/auth/github/redirect`,
      },
      async (
        _accessToken: unknown,
        _refreshToken: unknown,
        profile: GithubProfile,
        done: (err?: Error | null, profile?: IUserModel | null) => void
      ) => {
        if (!profile.id) {
          // eslint-disable-next-line no-console
          console.error(
            "Error, Github oAuth returned with unexpected value",
            profile
          );
          return done(null, undefined);
        }

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
            return done(null, newUser);
          }
        }
        return done(null, currentUser);
      }
    )
  );
}

if (AUTH0_TOKENS.IS_ACTIVATED) {
  // eslint-disable-next-line no-console
  console.log("Auth0 Oauth plugin enabled.");
  passport.use(
    new Auth0Strategy(
      {
        domain: AUTH0_TOKENS.AUTH0_DOMAIN,
        clientID: AUTH0_TOKENS.AUTH0_CLIENT_ID,
        clientSecret: AUTH0_TOKENS.AUTH0_CLIENT_SECRET,
        callbackURL: `${process.env.PUBLIC_URL}/auth/auth0/redirect`,
      },
      async (_accessToken, _refreshToken, _extraParams, profile, done) => {
        console.log(profile);
        if (!profile.id) {
          // eslint-disable-next-line no-console
          console.error(
            "Error, Auth0 oAuth returned with unexpected value",
            profile
          );
          return done(null, undefined);
        }
        const currentUser = await User.findOne({
          auth0Id: profile.id,
        });
        // create new user if the database doesn't have this user
        if (!currentUser) {
          const newUser = await new User({
            name: profile.displayName,
            screenName: profile.username,
            auth0Id: profile.id,
            profileImageUrl: profile.photos?.slice().shift()?.value,
          }).save();
          if (newUser) {
            return done(null, newUser);
          }
        }
        return done(null, currentUser);
      }
    )
  );
}
