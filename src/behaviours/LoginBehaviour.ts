import { Behaviour } from "../engine/Behaviour";

export class LoginBehaviour extends Behaviour {
    onStart() {
        console.log("open login panel");
        window.addEventListener("click", this.onClickHandler);
    }

    onClickHandler = () => {
        console.log("click");
        this.engine.changeScene("./assets/scenes/main.yaml");
    };

    onEnd() {
        window.removeEventListener("click", this.onClickHandler);
        console.log("close login panel");
    }
}
