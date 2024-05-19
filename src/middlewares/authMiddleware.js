import { StatusCodes } from "http-status-codes";
import { getVerifyToken } from "~/utils/authen";
import { TOKEN_KEY } from "~/config/environment";

const verifyToKen = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res
                .status(StatusCodes.UNAUTHORIZED)
                .send("Access denied: No token provided");
        }

        const decoded = await getVerifyToken(token, TOKEN_KEY);
        req.user = decoded.userData;
        // console.log("decode user");
        // console.log(decoded);
        next();
    } catch (error) {
        console.log(error);
    }
};

const checkAuthenticated = (req, res, next) => {
    // req.isAuthenticated() là req có sản của passportjs
    if (req.isAuthenticated()) {
        console.log("xác thực thành công!");
        return next();
    }
    console.log("trang web vẫn chưa xác thực !");
    res.redirect("/v1/auth/login");
};

const accessLevelAuthor = (permission) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "Bạn cần đăng nhập để truy câp!",
            });
        }

        if (!permission.includes(req.user.role)) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "Bạn không được cấp truyền truy cập!",
            });
        }
        next();
    };
};

const verifyTokenExampleTrue = (account) => {
    return (req, res, next) => {
        req.user = account;
        next();
    };
};

// s:pUoNYAHYTvOR5iHSV1WjaOf2msLRiLgr.JXpTu6y6PQQ5cA90HdBWj9JTmmFMy7PMmva+V4DU//g

export {
    verifyToKen,
    checkAuthenticated,
    accessLevelAuthor,
    verifyTokenExampleTrue,
};
