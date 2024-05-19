import express from "express";
import { APPPORT, LOCALHOST } from "./config/environment";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import RouterV1 from "./routes/v1";
import session from "express-session";
import passport from "passport";
import passportConfig from "./config/auth";

const START_APP = () => {
    const app = express();
    app.use(
        cors({
            origin: "http://localhost:5174",
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true,
        })
    );
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.use(cookieParser());
    passportConfig;
    app.use(
        session({
            secret: "secret",
            resave: false,
            saveUninitialized: true,
        })
    );
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(RouterV1);

    app.listen(APPPORT, LOCALHOST, () => {
        console.log(`server chạy trên cổng ${APPPORT}`);
    });
};
START_APP();

// dùng để kiểm tra cho phần secction của passport
// const showlogs = (req, res, next) => {
//     console.log("\n==============================");

//     console.log(`\n req.session.passport -------> `);
//     console.log(req.session.passport);

//     console.log(`\n req.user -------> `);
//     console.log(req.user);

//     console.log("\n Session and Cookie");
//     console.log(`req.session.id -------> ${req.session.id}`);
//     console.log(`req.session.cookie -------> `);
//     console.log(req.session.cookie);

//     console.log("===========================================\n");

//     next();
// };

// app.use(showlogs);
