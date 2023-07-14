import { getGameObjectById } from "../engine";
import { AudioClip } from "../engine/AudioClip";
import { Behaviour } from "../engine/Behaviour";
import { TextRenderer } from "../engine/TextRenderer";
import { Au_Manager } from "./Au_Manager";
import { GameProcess } from "./GameProcess";
import { Nation } from "./Nation";
import { Province } from "./Province";
import { SelectedObjectInfoMangaer } from "./SelectedObjectInfoManager";
import { generateTip } from "./Tip";
import { UnitBehaviour } from "./UnitBehaviour";

export class UI_DeclareWarButton extends Behaviour {
    audios:{[key:string]: AudioClip} = {}
    audioManager: Au_Manager
    battleAudios: AudioClip[] = [] // 战斗音效
    targetNation: Nation
    onStart(): void {
        this.audios = getGameObjectById('AudioManager').getAudioClips()
        this.audioManager = getGameObjectById('AudioManager').getBehaviour(Au_Manager)
        this.battleAudios = [this.audios['宣战背景音乐1'], this.audios['宣战背景音乐2']]
        const selectedObj = SelectedObjectInfoMangaer.selectedBehaviour as Province | UnitBehaviour
        this.targetNation = Nation.nations[selectedObj.nationId]
    }

    onUpdate(): void {
        if (Nation.nations[GameProcess.playerNationId].enemyNationList.includes(this.targetNation)) {
            getGameObjectById("_DeclareWarText").getBehaviour(TextRenderer).text = '议和'
            getGameObjectById("_DeclareWarText").getBehaviour(TextRenderer).color = '#00ff00'
        } else {
            getGameObjectById("_DeclareWarText").getBehaviour(TextRenderer).text = '宣战'
            getGameObjectById("_DeclareWarText").getBehaviour(TextRenderer).color = '#ff0000'
        }

        this.gameObject.onMouseLeftUp = () => {
            switch (getGameObjectById("_DeclareWarText").getBehaviour(TextRenderer).text) {
                case '议和':
                    Nation.nations[GameProcess.playerNationId].peace(this.targetNation)
                    console.log('我们和他们议和了')
                    generateTip(this, `我们和${this.targetNation.nationName}议和了`)
                    if(this.audioManager.currentBackgroundMusic.isPlaying()){
                        this.audioManager.currentBackgroundMusic.stop()
                    }
                    this.audios['游戏界面背景音乐'].play()
                    this.audioManager.currentBackgroundMusic = this.audios['游戏界面背景音乐']
                    
                    
                    return
                case '宣战':
                    Nation.nations[GameProcess.playerNationId].declareWar(this.targetNation)
                    console.log('我们对他们宣战了')
                    generateTip(this, `我们对${this.targetNation.nationName}宣战了`)
                    console.warn(this.audioManager.currentBackgroundMusic)
                    if(this.audioManager.currentBackgroundMusic.isPlaying()){
                        this.audioManager.currentBackgroundMusic.stop()
                    }
                    // 随机播放宣战音乐
                    const random = Math.floor(Math.random() * 2)
                    this.battleAudios[random].play()
                    this.audioManager.currentBackgroundMusic = this.battleAudios[random]          
                    
                    return
            }
        }
    }
}
