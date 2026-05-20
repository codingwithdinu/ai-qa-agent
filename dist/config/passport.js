"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_github2_1 = require("passport-github2");
const database_1 = __importDefault(require("./database"));
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await database_1.default.user.findUnique({
            where: { id },
        });
        done(null, user);
    }
    catch (error) {
        done(error);
    }
});
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await database_1.default.user.findUnique({
            where: {
                email: profile.emails?.[0]
                    .value,
            },
        });
        if (!user) {
            user =
                await database_1.default.user.create({
                    data: {
                        email: profile.emails?.[0]
                            .value || "",
                        name: profile.displayName,
                        password: "oauth",
                        role: "user",
                    },
                });
        }
        done(null, user);
    }
    catch (error) {
        done(error);
    }
}));
passport_1.default.use(new passport_github2_1.Strategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:5000/api/auth/github/callback",
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]
            ?.value;
        let user = await database_1.default.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            user =
                await database_1.default.user.create({
                    data: {
                        email: email || "",
                        name: profile.displayName
                            || "GitHub User",
                        password: "oauth",
                        role: "user",
                    },
                });
        }
        done(null, user);
    }
    catch (error) {
        done(error);
    }
}));
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map