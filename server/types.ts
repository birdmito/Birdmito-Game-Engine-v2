// 玩家行动类型定义
export interface PlayerAction {
    type: 'move_unit' | 'build_structure' | 'research_tech' | 'end_turn' | 'attack' | 'colonize';
    data: any;
    timestamp: number;
}

// 行动结果
export interface ActionResult {
    success: boolean;
    error?: string;
    data?: any;
}

// 游戏状态验证结果
export interface ValidationResult {
    valid: boolean;
    error?: string;
}

// 序列化的游戏对象
export interface SerializableProvince {
    id: number;
    coord: { x: number; y: number };
    nationId: number;
    isLand: boolean;
    buildingList: SerializableBuilding[];
    unitList: SerializableUnit[];
}

export interface SerializableNation {
    nationId: number;
    resource: {
        dora: number;
        production: number;
        science: number;
    };
    techTree: SerializableTechnology[];
    unitList: SerializableUnit[];
}

export interface SerializableUnit {
    uuid: string;
    nationId: number;
    unitParam: {
        name: string;
        cost: number;
        power: number;
        apMax: number;
        quantity: number;
    };
    currentProvince: { x: number; y: number };
    ap: number;
}

export interface SerializableBuilding {
    name: string;
    buildingProduction: {
        dora: number;
        production: number;
        science: number;
    };
}

export interface SerializableTechnology {
    techName: string;
    techProcess: number;
    techProcessMax: number;
    techEffect: string;
    techEffectValueList: number[];
}

// 完整游戏状态
export interface SerializableGameState {
    provinces: SerializableProvince[];
    nations: SerializableNation[];
    currentTurn: number;
    currentRound: number;
}
