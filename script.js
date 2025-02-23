// 获取所有DOM元素
const cardElements = {
    country: document.getElementById('country'),
    cost: document.getElementById('cost'),
    fuel: document.getElementById('fuel'),
    unitType: document.getElementById('unitType'),
    attack: document.getElementById('attack'),
    defense: document.getElementById('defense'),
    attributes: document.getElementById('attributes'),
    effects: document.getElementById('effects')
};

// 数据配置
const config = {
    attributes: ['闪击', '守护', '烟幕', '奋战', '伏击', '冲击', '重甲', '收缴', '动员', '山地'],
    effects: {
        conditions: ['攻击时', '获得攻击力时', '获得防御力时', '被攻击时', '部署时', '被摧毁时', '移动时', '被压制时', '被抑制时', '成为指令目标时', '攻击比自己攻击力更高的目标时'],
        conditionTargets: ['自身', '指定单位', '相邻单位', '所有友方单位', '所有敌方单位'],
        effects: ['造成2点伤害', '获得+2攻击', '获得+2防御', '抽一张牌', '无法攻击', '无法移动', '无法攻击敌方总部', '获得守护', '受到的战斗伤害翻倍', '获得免疫'],
        effectTargets: ['自身', '指定单位', '相邻单位', '所有友方单位', '所有敌方单位']
    },
    countries: ['德国', '苏联', '英国', '美国', '日本', '芬兰', '意大利', '波兰'],
    unitTypes: ['步兵', '坦克', '炮兵', '战斗机', '轰炸机'],
    cost: { min: 1, max: 10 },
    fuel: { min: 0, max: 5 },
    attackDefense: { min: 1, max: 12 },
    attributesCount: { min: 0, max: 3 },
    effectsCount: { min: 0, max: 2 }
};

// 工具函数
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement(array) {
    return array[getRandomInt(0, array.length - 1)];
}

function generateRandomAttributes() {
    const count = getRandomInt(config.attributesCount.min, config.attributesCount.max);
    if (count === 0) return '-';
    const attributes = [];
    for (let i = 0; i < count; i++) {
        attributes.push(getRandomElement(config.attributes));
    }
    return attributes.join(', ');
}

function generateRandomEffects() {
    const count = getRandomInt(config.effectsCount.min, config.effectsCount.max);
    if (count === 0) return '-';
    const effects = [];
    for (let i = 0; i < count; i++) {
        const condition = getRandomElement(config.effects.conditions);
        const conditionTarget = getRandomElement(config.effects.conditionTargets);
        const effect = getRandomElement(config.effects.effects);
        const effectTarget = getRandomElement(config.effects.effectTargets);
        effects.push(`当${conditionTarget}${condition}，${effectTarget}${effect}`);
    }
    return effects.join('；');
}

function generateUnitName(unitType) {
    const prefixes = {
        '步兵': ['突击队', '山地', '空降', '机械化', '伞兵', '近卫', '掷弹兵', '装甲掷弹兵', '山地猎兵团', '空降猎兵团', '装甲', '摩托化'],
        '坦克': ['虎式', 'T-34', '谢尔曼', '潘兴', '丘吉尔', '豹式', 'KV-1', 'IS-2', '克伦威尔', '瓦伦丁', '四号坦克', '三号突击炮', 'SU-76', 'M3斯图亚特', 'M24霞飞'],
        '炮兵': ['榴弹炮', '加农炮', '反坦克炮', '高射炮', '88炮', '喀秋莎', 'M2榴弹炮', 'ML-20', 'M7牧师'],
        '战斗机': ['喷火式', 'BF-109', 'P-51', '零式', '拉-5', 'Fw-190', 'P-47', '雅克-3', 'F4U海盗', 'P-38闪电', 'Ki-84疾风', 'Me-262', 'He-162', 'Ta-152', 'I-16'],
        '轰炸机': ['B-17', '兰开斯特', '斯图卡', '伊尔-2', 'B-29', 'B-24解放者', 'He-111', 'Ju-88', 'Pe-2', 'A-20浩劫', 'B-25米切尔', 'Do-17', 'SM.79', 'G4M一式陆攻', 'Tu-2']
    };
    return `${getRandomElement(prefixes[unitType])} ${unitType}`;
}

function spinWheel() {
    // 生成随机数据
    const unitType = getRandomElement(config.unitTypes);  // 先获取unitType
    const cardData = {
        country: getRandomElement(config.countries),
        cost: getRandomInt(config.cost.min, config.cost.max),
        fuel: getRandomInt(config.fuel.min, config.fuel.max),
        unitType: unitType,
        attack: getRandomInt(config.attackDefense.min, config.attackDefense.max),
        defense: getRandomInt(config.attackDefense.min, config.attackDefense.max),
        attributes: generateRandomAttributes(),
        effects: generateRandomEffects(),
        unitName: generateUnitName(unitType)  // 使用已获取的unitType
    };

    // 更新DOM
    const updateCard = (element, value) => {
        element.textContent = value;  // 移除label
    };

    updateCard(cardElements.country, cardData.country);
    updateCard(cardElements.cost, cardData.cost);
    updateCard(cardElements.fuel, cardData.fuel);
    updateCard(cardElements.unitType, cardData.unitType);
    updateCard(cardElements.attack, cardData.attack);
    updateCard(cardElements.defense, cardData.defense);
    updateCard(cardElements.attributes, cardData.attributes);
    updateCard(cardElements.effects, cardData.effects);
    
    document.querySelector('.card h2').textContent = cardData.unitName;
    document.querySelector('.cost-fuel').innerHTML = `${cardData.cost} <br> ${cardData.fuel}`;
}

// 初始化
document.querySelector('button').addEventListener('click', spinWheel);