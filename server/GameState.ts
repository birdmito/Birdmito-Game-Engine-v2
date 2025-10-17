import { PlayerAction, ActionResult, ValidationResult, SerializableGameState } from './types';

export class GameState {
    private provinces: any[] = [];
    private nations: any[] = [];
    private currentTurn: number = 1;
    private currentRound: number = 1;
    private playerTurnOrder: string[] = [];

    initialize(playerIds: string[]) {
        this.playerTurnOrder = [...playerIds];
        // 这里会从现有的游戏逻辑中复制初始化代码
        this.initializeProvinces();
        this.initializeNations(playerIds);
    }

    validateAction(playerId: string, action: PlayerAction): ValidationResult {
        // 基础验证
        if (!playerId || !action) {
            return { valid: false, error: '无效的玩家ID或行动' };
        }

        // 根据行动类型进行不同的验证
        switch (action.type) {
            case 'move_unit':
                return this.validateMoveUnit(playerId, action.data);
            case 'build_structure':
                return this.validateBuildStructure(playerId, action.data);
            case 'research_tech':
                return this.validateResearchTech(playerId, action.data);
            case 'attack':
                return this.validateAttack(playerId, action.data);
            case 'colonize':
                return this.validateColonize(playerId, action.data);
            case 'end_turn':
                return { valid: true };
            default:
                return { valid: false, error: '未知的行动类型' };
        }
    }

    executeAction(playerId: string, action: PlayerAction): ActionResult {
        try {
            switch (action.type) {
                case 'move_unit':
                    return this.executeMoveUnit(playerId, action.data);
                case 'build_structure':
                    return this.executeBuildStructure(playerId, action.data);
                case 'research_tech':
                    return this.executeResearchTech(playerId, action.data);
                case 'attack':
                    return this.executeAttack(playerId, action.data);
                case 'colonize':
                    return this.executeColonize(playerId, action.data);
                case 'end_turn':
                    return { success: true, data: { message: '回合结束' } };
                default:
                    return { success: false, error: '未知的行动类型' };
            }
        } catch (error) {
            return { success: false, error: error instanceof Error ? error.message : '未知错误' };
        }
    }

    isGameOver(): boolean {
        // 检查胜利条件
        const activeNations = this.nations.filter(nation => nation.isActive);
        return activeNations.length <= 1;
    }

    getWinner(): string | null {
        const activeNations = this.nations.filter(nation => nation.isActive);
        if (activeNations.length === 1) {
            return activeNations[0].playerId;
        }
        return null;
    }

    serialize(): SerializableGameState {
        return {
            provinces: this.provinces.map(p => this.serializeProvince(p)),
            nations: this.nations.map(n => this.serializeNation(n)),
            currentTurn: this.currentTurn,
            currentRound: this.currentRound
        };
    }

    private initializeProvinces() {
        // 从原有的 ProvinceGenerator 逻辑复制
        // 这里先用简单的初始化
        this.provinces = [];
        for (let x = 0; x < 20; x++) {
            for (let y = 0; y < 20; y++) {
                this.provinces.push({
                    id: x * 20 + y,
                    coord: { x, y },
                    nationId: 0,
                    isLand: Math.random() > 0.3,
                    buildingList: [],
                    unitList: []
                });
            }
        }
    }

    private initializeNations(playerIds: string[]) {
        this.nations = [];
        playerIds.forEach((playerId, index) => {
            this.nations.push({
                nationId: index + 1,
                playerId: playerId,
                isActive: true,
                resource: { dora: 100, production: 10, science: 5 },
                techTree: [],
                unitList: []
            });
        });
    }

    private validateMoveUnit(playerId: string, data: any): ValidationResult {
        const { unitId, targetCoord } = data;

        // 检查单位是否存在且属于该玩家
        const unit = this.findUnitById(unitId);
        if (!unit) {
            return { valid: false, error: '单位不存在' };
        }

        const nation = this.getNationByPlayerId(playerId);
        if (!nation || unit.nationId !== nation.nationId) {
            return { valid: false, error: '不能移动其他玩家的单位' };
        }

        // 检查目标位置是否有效
        const targetProvince = this.getProvinceByCoord(targetCoord);
        if (!targetProvince) {
            return { valid: false, error: '无效的目标位置' };
        }

        // 检查移动距离等其他规则...

        return { valid: true };
    }

    private validateBuildStructure(playerId: string, data: any): ValidationResult {
        // 实现建筑验证逻辑
        return { valid: true }; // 临时返回
    }

    private validateResearchTech(playerId: string, data: any): ValidationResult {
        // 实现科技研究验证逻辑
        return { valid: true }; // 临时返回
    }

    private validateAttack(playerId: string, data: any): ValidationResult {
        // 实现攻击验证逻辑
        return { valid: true }; // 临时返回
    }

    private validateColonize(playerId: string, data: any): ValidationResult {
        // 实现殖民验证逻辑
        return { valid: true }; // 临时返回
    }

    private executeMoveUnit(playerId: string, data: any): ActionResult {
        const { unitId, targetCoord } = data;

        const unit = this.findUnitById(unitId);
        const targetProvince = this.getProvinceByCoord(targetCoord);

        // 移除单位从原省份
        const currentProvince = this.getProvinceByCoord(unit.currentProvince);
        currentProvince.unitList = currentProvince.unitList.filter((u: any) => u.uuid !== unitId);

        // 添加单位到目标省份
        unit.currentProvince = targetCoord;
        targetProvince.unitList.push(unit);

        return {
            success: true,
            data: {
                unitId,
                oldPosition: currentProvince.coord,
                newPosition: targetCoord
            }
        };
    }

    private executeBuildStructure(playerId: string, data: any): ActionResult {
        // 实现建筑执行逻辑
        return { success: true }; // 临时返回
    }

    private executeResearchTech(playerId: string, data: any): ActionResult {
        // 实现科技研究执行逻辑
        return { success: true }; // 临时返回
    }

    private executeAttack(playerId: string, data: any): ActionResult {
        // 实现攻击执行逻辑
        return { success: true }; // 临时返回
    }

    private executeColonize(playerId: string, data: any): ActionResult {
        // 实现殖民执行逻辑
        return { success: true }; // 临时返回
    }

    private findUnitById(unitId: string): any {
        for (const province of this.provinces) {
            const unit = province.unitList.find((u: any) => u.uuid === unitId);
            if (unit) return unit;
        }
        return null;
    }

    private getProvinceByCoord(coord: { x: number; y: number }): any {
        return this.provinces.find(p => p.coord.x === coord.x && p.coord.y === coord.y);
    }

    private getNationByPlayerId(playerId: string): any {
        return this.nations.find(n => n.playerId === playerId);
    }

    private serializeProvince(province: any): any {
        return {
            id: province.id,
            coord: province.coord,
            nationId: province.nationId,
            isLand: province.isLand,
            buildingList: province.buildingList,
            unitList: province.unitList
        };
    }

    private serializeNation(nation: any): any {
        return {
            nationId: nation.nationId,
            resource: nation.resource,
            techTree: nation.techTree,
            unitList: nation.unitList
        };
    }
}
