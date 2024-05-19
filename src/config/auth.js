import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { Strategy as GithubStrategy } from "passport-github2";

import {
    CLIENT_SECRET_GITHUB,
    CLIENT_ID_GITHUB,
    CLIENT_ID_GOOGLE,
    CLIENT_SECRET_GOOGLE,
} from "./environment";
import { checkEmailIsAlreadyExists, generateAccessToken } from "~/utils/authen";
import userDataBase from "./mongodb";

// config passport với passport-google-oauth2

passport.use(
    new GoogleStrategy(
        {
            clientID: CLIENT_ID_GOOGLE,
            clientSecret: CLIENT_SECRET_GOOGLE,
            callbackURL: "http://localhost:3005/v1/auth/google/callback",
            passReqToCallback: true,
        },
        function (req, accessToken, refreshToken, profile, done) {
            try {
                const userData = userDataBase; // data mork

                const checkIsEmail = checkEmailIsAlreadyExists(
                    profile.email,
                    userData
                );

                if (!checkIsEmail) {
                    const newUser = {
                        name: profile.displayName,
                        email: profile.email,
                        provider: profile.provider,
                        avatarUrl: profile.picture,
                    };
                    userData.push(newUser);
                }

                if (profile.verified) {
                    const userAccount = userData.filter((userInfor) => {
                        return userInfor.email === profile.email;
                    });
                    const createAccessToken = generateAccessToken(userAccount);
                    done(null, createAccessToken);
                }
            } catch (error) {
                done(error, null);
            }
        }
    )
);

passport.use(
    new GithubStrategy(
        {
            clientID: CLIENT_ID_GITHUB,
            clientSecret: CLIENT_SECRET_GITHUB,
            callbackURL: "http://localhost:3005/v1/auth/github/callback",
        },
        function (req, accessToken, refreshToken, profile, done) {
            try {
                done(null, profile);
            } catch (error) {
                done(error, null);
            }
        }
    )
);

// hai phương thức dưới chỉ sử dụng cho session của passport khi dùng jwt sẽ không cần
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    // console.log(`thoong tin người dùng từ hàm deserializeUser`);
    // console.log(user);
    done(null, user);
});

export default passport;
