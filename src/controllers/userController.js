import userDataBase from "~/config/mongodb";

const getUserWithToken = (req, res) => {
    try {
        const findUser = userDataBase.filter((user) => {
            return user.email === req.user.email;
        });
        res.status(200).json({
            message: true,
            user: findUser,
        });
    } catch (error) {
        console.log(error);
    }
};

export { getUserWithToken };
