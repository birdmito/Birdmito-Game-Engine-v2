import { Behaviour } from "../engine/Behaviour";

export class SoilderFunction extends Behaviour{

    onUpdate(): void {
        this.gameObject.onClick = () => {
            console.log('is cliceked')
        }
    }
}