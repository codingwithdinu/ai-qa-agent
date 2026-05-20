import passport
  from "passport";

import {
  Strategy as GoogleStrategy
} from "passport-google-oauth20";

import {
  Strategy as GitHubStrategy
} from "passport-github2";

import prisma
  from "./database";

passport.serializeUser(
  (user: any, done) => {

    done(null, user.id);
  }
);

passport.deserializeUser(
  async (
    id: string,
    done
  ) => {

    try {

      const user =
        await prisma.user.findUnique({
          where: { id },
        });

      done(null, user);

    } catch (error) {

      done(error);
    }
  });

passport.use(

  new GoogleStrategy(

    {

      clientID:
        process.env.GOOGLE_CLIENT_ID!,

      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET!,

      callbackURL:
        "https://ai-qa-agent-1.onrender.com/api/auth/google/callback",
    },

    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) => {

      try {

        let user =
          await prisma.user.findUnique({
            where: {
              email:
                profile.emails?.[0]
                  .value,
            },
          });

        if (!user) {

          user =
            await prisma.user.create({

              data: {

                email:
                  profile.emails?.[0]
                    .value || "",

                name:
                  profile.displayName,

                password:
                  "oauth",

                role:
                  "user",
              },
            });
        }

        done(null, user);

      } catch (error) {

        done(error);
      }
    }
  )
);

passport.use(

  new GitHubStrategy(

    {

      clientID:
        process.env.GITHUB_CLIENT_ID!,

      clientSecret:
        process.env.GITHUB_CLIENT_SECRET!,

      callbackURL:
        "https://ai-qa-agent-1.onrender.com/api/auth/github/callback",
    },

    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) => {

      try {

        const email =
          profile.emails?.[0]
            ?.value;

        let user =
          await prisma.user.findUnique({
            where: {
              email,
            },
          });

        if (!user) {

          user =
            await prisma.user.create({

              data: {

                email:
                  email || "",

                name:
                  profile.displayName
                  || "GitHub User",

                password:
                  "oauth",

                role:
                  "user",
              },
            });
        }

        done(null, user);

      } catch (error) {

        done(error);
      }
    }
  )
);


export default passport;