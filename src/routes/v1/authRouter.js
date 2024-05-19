import express from "express";
import { StatusCodes } from "http-status-codes";
import {
    authRegister,
    authLogin,
    authLogout,
    authRefreshToken,
    authWithGoogle,
    authWithGithub,
    authWithGithubCallback,
    authLoginSuccess,
    authLoginFail,
} from "~/controllers/authController";
import { verifyToKen, accessLevelAuthor } from "~/middlewares/authMiddleware";
import {
    ROLE_TYPE_ADMIN,
    ROLE_TYPE_STUDEN,
    ROLE_TYPE_TEACHER,
} from "~/utils/constants";
import passport from "passport";
const Routes = express.Router();

Routes.get("/auth", (req, res) => {
    res.json("trang auth");
});

Routes.get("/auth/login", (req, res) => {
    res.json("trang login ");
});

Routes.get(
    "/routerForAdmin",
    [verifyToKen, accessLevelAuthor([ROLE_TYPE_ADMIN])],
    (req, res) => {
        res.json("Bạn đã truy cập vào được tuyến đường của admin");
    }
);

Routes.post("/auth/register", authRegister);
Routes.post("/auth/login", authLogin);
Routes.get("/auth/login/success", authLoginSuccess);
Routes.get("/auth/login/fail", authLoginFail);
Routes.post("/auth/logout", verifyToKen, authLogout);
Routes.post("/auth/refresh-token", authRefreshToken);
Routes.get("/auth/google", authWithGoogle);
Routes.get(
    "/auth/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/auth/failed",
        session: false,
    }),
    (req, res) => {
        res.redirect(`http://localhost:5174?access-token=${req.user}`);
    }
);
Routes.get("/auth/github", authWithGithub);
Routes.get("/auth/google/callback", authWithGithubCallback);

// Và vì chúng tôi đang sử dụng khung Passport JS, nên chúng tôi cũng sẽ có quyền truy cập vào “người dùng được xác thực” trong “req.user” và có thể sử dụng “req.isAuthenticated()” và “req.logOut()” các phương thức được cung cấp bởi Passport JS.

// khi sử dụng dịch vụ của facebook thì sẽ không dùng được ở dạng domain không có bảo mật
export default Routes;
