import userDataBase from "~/config/mongodb";
import {
    ReasonPhrases,
    StatusCodes,
    getReasonPhrase,
    getStatusCode,
} from "http-status-codes";
import {
    checkEmailIsAlreadyExists,
    checkIsNameAlreadExists,
    checkIsPasswordComfir,
    generateAccessToken,
    generateRrefreshToken,
    getVerifyToken,
    hashPassword,
    blackListTokens,
} from "~/services/authSerices";
import { CLIENT_URL, REFRESH_TOKEN_KEY } from "~/config/environment";
import passport from "passport";

const REFRESH_COOKIE_NAME = "refresh-token";

const authRegister = async (req, res) => {
    try {
        const { name, email, pass, role } = req.body;
        const checkIsEmail = checkEmailIsAlreadyExists(email, userDataBase);
        const checkIsName = checkIsNameAlreadExists(name, userDataBase);

        if (checkIsEmail) {
            return res.status(StatusCodes.CONFLICT).json({
                messages:
                    "email đã tồn tại mời bạn đăng nhập lại hoặc tạo với email khác",
            });
        }

        if (checkIsName) {
            return res.status(StatusCodes.CONFLICT).json({
                messages:
                    "tên người dùng đã tồn tại mời bạn đăng nhập lại hoặc tạo với email khác",
            });
        }

        const passWordProtect = await hashPassword(pass).catch((err) => {
            console.error("Lỗi khi mã hóa mật khẩu:", err);
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                messages: "Đã xảy ra lỗi khi xử lý mật khẩu.",
            });
        });
        if (!checkIsEmail && !checkIsName) {
            userDataBase.push({
                name,
                email,
                pass: passWordProtect,
                role,
            });
            if (userDataBase.length > 0 && Array.isArray(userDataBase)) {
                return res.status(StatusCodes.OK).json(userDataBase);
            }
        }
    } catch (error) {
        console.error("Lỗi khi xử lý yêu cầu:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            messages: "Đã xảy ra lỗi khi xử lý yêu cầu.",
        });
    }
};

const authLogin = async (req, res) => {
    try {
        const { name, email, pass, role, provider } = req.body;
        const checkIsEmail = checkEmailIsAlreadyExists(email, userDataBase);
        const checkIsName = checkIsNameAlreadExists(name, userDataBase);
        if (!checkIsEmail && !checkIsName) {
            return res.status(StatusCodes.NOT_FOUND).json({
                messages:
                    "tên đăng nhập hoặc email không khớp mời bạn nhập lại",
            });
        }

        if (!checkIsPasswordComfir(pass, email, userDataBase)) {
            return res
                .status(StatusCodes.NOT_FOUND)
                .json({ messages: "Mật khẩu của bạn chưa khớp" });
        }

        const userFilter = userDataBase.filter((user) => {
            return user.email === email;
        });

        if (userFilter) {
            const dataPayload = { name, email, role, provider };
            const accessToken = generateAccessToken(dataPayload);

            const refreshToken = generateRrefreshToken({
                name,
                email,
            });
            res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
                httpOnly: true,
                sameSite: "None",
                secure: true,
                maxAge: 24 * 60 * 60 * 1000,
            });
            return res.status(StatusCodes.OK).json({
                accessToken,
                usercurrent: { ...userFilter },
            });
        }
    } catch (error) {
        console.log(error);
    }
};

const authLoginSuccess = async (req, res) => {
    if (req.user) {
        res.status(StatusCodes.OK).json({
            success: true,
            message: "successful",
            token: req.user,
        });
    } else {
        res.status(200).json({
            success: false,
            message: "fail",
        });
    }
};

const authLoginFail = async (req, res) => {
    try {
        res.status(StatusCodes.OK).json({
            success: false,
            message: "failure",
        });
    } catch (error) {
        console.log(error);
    }
};

const authLogout = async (req, res) => {
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
    const decoded = await getVerifyToken(refreshToken, REFRESH_TOKEN_KEY);
    if (decoded) {
        blackListTokens.push(refreshToken);
    }

    res.clearCookie(REFRESH_COOKIE_NAME);
    res.send("user logout successfully");
    return res.redirect(CLIENT_URL);
};

const authRefreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];
        if (!refreshToken) {
            res.status(401).json("Error cookie");
        }

        const decoded = await getVerifyToken(refreshToken, REFRESH_TOKEN_KEY);
        if (decoded) {
            const tokenLifeTime = Math.floor(Date.now() / 1000) + 50000000;
            const accessToken = generateToken(tokenLifeTime, decoded.userData);
            return res.status(StatusCodes.OK).json({
                accessToken,
                usercurrent: decoded.userData,
            });
        }
    } catch (error) {
        console.log(error);
    }
};

const authWithGoogle = (req, res, next) => {
    return passport.authenticate("google", {
        scope: ["email", "profile"],
    })(req, res, next);
};

const authWithGoogleCallback = (req, res, next) => {
    return passport.authenticate("google", {
        successRedirect: CLIENT_URL,
        failureRedirect: "/auth/failed",
    })(req, res, next);
};

const authWithGithub = (req, res, next) => {
    const passportMiddlware = passport.authenticate("github", {
        scope: ["profile"],
    });
    return passportMiddlware(req, res, next);
};

const authWithGithubCallback = (req, res, next) => {
    return passport.authenticate("github", {
        successRedirect: CLIENT_URL,
        failureRedirect: "/auth/github/failed",
    })(req, res, next);
};

export {
    authRegister,
    authLogin,
    authLogout,
    authRefreshToken,
    authWithGoogle,
    authWithGoogleCallback,
    authWithGithub,
    authWithGithubCallback,
    authLoginSuccess,
    authLoginFail,
};
