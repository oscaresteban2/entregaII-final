import BaseRouter from "./BaseRouter.js";
import usersControllers from "../controllers/users.controllers.js";

class UsersRouter extends BaseRouter {
    init() {
        this.get("/", ["ADMIN"], usersControllers.getUsers);
        this.get("/:uid", ["ADMIN"], usersControllers.getUserBy);
        this.put("/:user", ["ADMIN"], usersControllers.updateUser);
        this.delete("/:uid", ["ADMIN"], usersControllers.deleteUser);
    }
}
const usersRouter = new UsersRouter();

export default usersRouter.getRouter();