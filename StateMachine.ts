export class State {
    onStart() {}

    onEnd() {}

    onUpdate() {}
}

export class StateMachine {
    currentState: State;

    constructor() {}

    changeState(newState: State) {
        if (this.currentState) {
            this.currentState.onEnd();
        }
        this.currentState = newState;
        this.currentState.onStart();
    }

    update() {
        if (this.currentState) {
            this.currentState.onUpdate();
        }
    }
}

class LoginState extends State {
    onStart() {
        console.log("open login panel");
        window.addEventListener("click", this.onClickHandler);
    }

    onClickHandler = () => {
        stateMachine.changeState(new GamingState());
    };

    onEnd() {
        window.removeEventListener("click", this.onClickHandler);
        console.log("close login panel");
    }

    onUpdate() {}
}

class GamingState extends State {
    onStart() {
        console.log("start game");
    }

    onEnd() {
        console.log("end game");
    }

    onUpdate() {}
}

const stateMachine = new StateMachine();
stateMachine.changeState(new LoginState());

// stateMachine.changeState(new State2());
