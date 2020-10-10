import router from "@/router";
import AuthService from "@/_reactivestack/auth.service";

export default {
	name: "Logout",
	beforeCreate() {
		AuthService.logout();
		router.push("/");
	}
}