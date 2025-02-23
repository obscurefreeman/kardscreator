const cardElements = {
    cost: document.getElementById('cost'),
    fuel: document.getElementById('fuel'),
    unitType: document.getElementById('unitType'),
    attack: document.getElementById('attack'),
    defense: document.getElementById('defense'),
    attributes: document.getElementById('attributes'),
    effects: document.getElementById('effects')
};

const config = {
    attributes: ['闪击', '守护', '烟幕', '奋战', '伏击', '冲击', `重甲${getRandomInt(1, 3)}`, '收缴', '动员', '山地', `情报${getRandomInt(1, 3)}`, '流亡'],
    effects: {
        conditions: ['攻击时', '获得攻击力时', '获得防御力时', '被攻击时', '部署时', '被消灭时', '移动时', '被压制时', '被抑制时', '成为指令目标时', '攻击比自己攻击力更高的目标时', '触发反制时'],
        conditionTargets: ['自身', '指定单位', '相邻单位', '任意友方单位', '任意敌方单位', '任意前线单位', '任意受伤单位', `任意{attributes}单位`],
        effects: [
            `当{conditionTargets}{conditions}，使{target}获得+${getRandomInt(1, 5)}攻击力`,
            `当{conditionTargets}{conditions}，使{target}获得+${getRandomInt(1, 5)}防御力`,
            `当{conditionTargets}{conditions}，使{target}获得+${getRandomInt(1, 5)} +${getRandomInt(1, 5)}`,
            `当{conditionTargets}{conditions}，对{target}造成${getRandomInt(1, 5)}点伤害`,
            `当{conditionTargets}{conditions}，使{target}无法攻击`,
            `当{conditionTargets}{conditions}，使{target}无法攻击敌方总部`,
            `当{conditionTargets}{conditions}，使{target}获得守护`,
            `当{conditionTargets}{conditions}，使{target}受到的战斗伤害翻倍`,
            `当{conditionTargets}{conditions}，使{target}与一个敌方单位战斗`,
            `当{conditionTargets}{conditions}，使{target}进入前线`,
            `当{conditionTargets}{conditions}，使{target}返回其所有者手牌`,
            `当{conditionTargets}{conditions}，使{target}也算做坦克`,
            `当{conditionTargets}{conditions}，使{target}获得{attributes}`,
            `当{conditionTargets}{conditions}，使{target}行动花费+${getRandomInt(1, 5)}`,
            `当{conditionTargets}{conditions}，使{side}抽${getRandomInt(1, 5)}张牌`,
            `当{conditionTargets}{conditions}，使{side}总部获得+${getRandomInt(1, 5)}防御力`,
            `当{conditionTargets}{conditions}，结束该回合`
        ],
        effectTargets: ['自身', '指定单位', '相邻单位', '随机单位', '所有友方单位', '所有敌方单位', '所有前线单位', '所有受伤单位', `所有{attributes}单位`],
        effectside: ['友方', '敌方']
    },
    countries: ['德国', '苏联', '英国', '美国', '日本', '芬兰', '意大利', '波兰'],
    unitTypes: ['步兵', '坦克', '炮兵', '战斗机', '轰炸机'],
    cost: { min: 1, max: 9 },
    fuel: { min: 0, max: 5 },
    attackDefense: { min: 1, max: 12 },
    attributesCount: { min: 0, max: 3 },
    effectsCount: { min: 0, max: 2 },
    unitImagePaths: {
        '步兵': 'infantry',
        '坦克': 'tank',
        '炮兵': 'artillery',
        '战斗机': 'plane',
        '轰炸机': 'plane'
    },
    unitImageUsage: {
        infantry: [],
        tank: [],
        artillery: [],
        plane: []
    }
};

const commonPrefixes = [
    '急切的', '临近的', '坚决的', '荒谬的', '骇人听闻的', '燃烧的', '灼热的', '大笑的', '咳嗽的',
    '潜伏的', '打喷嚏', '失踪的', '抖动的', '抽搐的', '鸣叫的', '抽烟的', '柔软的', '温暖的',
    '寒冷的', '冰冻的', '跳跃的', '哭泣的', '祈祷的', '玩耍的', '偷窃的', '摇摆的', '暗中的',
    '聪明的', '松软的', '最好的', '高兴的', '黄金', '金制', '铁制', '木制', '铜制', '银制',
    '红色', '深红', '橙色', '黑色', '粉色', '无能的', '湿润的', '沙漠', '复仇', '得意的', '魔法',
    '幽灵', '隐藏的', '海王星', '阿瑞斯', '鹰', '傍晚', '清晨', '午餐', '酸性的', '皇后的', '国王的',
    '力量', '治疗者', '健康', '恶心的', '肮脏的', '腐烂的', '飞行的', '爬行的', '离开的', '喊叫的',
    '悲伤的', '第一', '第二', '第三', '最后', '致命', '可怕的', '不错的', '被冒犯的', '完美的',
    '幸运的', '发臭的', '寂静的', '钢铁', '天使', '狂野的', '神秘的', '孤独的', '深邃', '阴影',
    '迟钝的', '无用的', '快乐的', '旅行的'
];

const prefixes = {
    '步兵': commonPrefixes,
    '坦克': commonPrefixes,
    '炮兵': commonPrefixes,
    '战斗机': commonPrefixes,
    '轰炸机': commonPrefixes
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement(array) {
    return array[getRandomInt(0, array.length - 1)];
}

function generateRandomAttributes() {
    const count = getRandomInt(config.attributesCount.min, config.attributesCount.max);
    if (count === 0) return '-';
    const attributes = new Set();
    while (attributes.size < count) {
        attributes.add(getRandomElement(config.attributes));
    }
    return Array.from(attributes).join(', ');
}

function generateRandomEffects() {
    const count = getRandomInt(config.effectsCount.min, config.effectsCount.max);
    if (count === 0) return '-';
    const effects = [];
    for (let i = 0; i < count; i++) {
        const randomAttribute = getRandomElement(config.attributes.filter(a => !a.includes('${')));

        const condition = getRandomElement(config.effects.conditions);
        let conditionTarget = getRandomElement(config.effects.conditionTargets);
        let effectTarget = getRandomElement(config.effects.effectTargets);
        const effectSide = getRandomElement(config.effects.effectside);
        let effect = getRandomElement(config.effects.effects);

        conditionTarget = conditionTarget.replace(/{attributes}/g, randomAttribute);
        effectTarget = effectTarget.replace(/{attributes}/g, randomAttribute);

        effect = effect
            .replace(/{target}/g, effectTarget)
            .replace(/{side}/g, effectSide)
            .replace(/{conditionTargets}/g, conditionTarget)
            .replace(/{conditions}/g, condition)
            .replace(/{attributes}/g, randomAttribute)
            .replace(/{value}/g, getRandomInt(1,5));

        effects.push(effect);
    }
    return effects.join('；');
}

function generateUnitName(unitType) {
    const unitPrefix = getRandomElement(prefixes[unitType]);
    return `${unitPrefix}${unitType}`;
}

function spinWheel() {
    const existingContainer = document.querySelector('.unit-display-container');
    if (existingContainer) {
        existingContainer.remove();
    }
    
    const unitType = getRandomElement(config.unitTypes);
    const country = getRandomElement(config.countries);
    const cardData = {
        country: country,
        cost: getRandomInt(config.cost.min, config.cost.max),
        fuel: getRandomInt(config.fuel.min, config.fuel.max),
        unitType: unitType,
        attack: getRandomInt(config.attackDefense.min, config.attackDefense.max),
        defense: getRandomInt(config.attackDefense.min, config.attackDefense.max),
        attributes: generateRandomAttributes(),
        effects: generateRandomEffects(),
        unitName: generateUnitName(unitType)
    };

    const getUnitImagePath = () => {
        const basePath = 'assets/image/';
        const typeFolder = config.unitImagePaths[cardData.unitType];
        
        const imageCounts = {
            infantry: 87,
            tank: 27,
            artillery: 11,
            plane: 37
        };
        
        let usedImages = config.unitImageUsage[typeFolder];
        
        if (usedImages.length >= imageCounts[typeFolder]) {
            usedImages = [];
            config.unitImageUsage[typeFolder] = [];
        }
        
        let randomNum;
        do {
            randomNum = getRandomInt(1, imageCounts[typeFolder]);
        } while (usedImages.includes(randomNum));
        
        usedImages.push(randomNum);
        config.unitImageUsage[typeFolder] = usedImages;
        
        return `${basePath}${typeFolder}/${randomNum}.jpg`;
    };

    cardData.unitImage = getUnitImagePath();

    const updateCard = (element, value) => {
        element.textContent = value === '-' ? '' : value;
        element.contentEditable = true;
    };

    updateCard(cardElements.cost, cardData.cost);
    updateCard(cardElements.fuel, cardData.fuel);
    updateCard(cardElements.unitType, cardData.unitType);
    updateCard(cardElements.attack, cardData.attack);
    updateCard(cardElements.defense, cardData.defense);
    updateCard(cardElements.attributes, cardData.attributes);
    updateCard(cardElements.effects, cardData.effects);
    
    document.querySelector('.card h2').textContent = cardData.unitName;
    document.querySelector('.card h2').style.color = cardData.country === '芬兰' ? '#0a0a0f' : '#bfc4af';
    document.getElementById('cost').textContent = cardData.cost;
    document.getElementById('fuel').textContent = cardData.fuel;

    const card = document.getElementById('card');
    
    const unitDisplayContainer = document.createElement('div');
    unitDisplayContainer.className = 'unit-display-container';
    card.insertBefore(unitDisplayContainer, card.firstChild);

    const unitDisplay = document.createElement('img');
    unitDisplay.className = 'unit-display';
    unitDisplay.src = cardData.unitImage;
    unitDisplay.onerror = function() {
        this.src = '';
        console.error('图片加载失败:', cardData.unitImage);
    }
    unitDisplayContainer.appendChild(unitDisplay);

    const countryImage = document.createElement('img');
    countryImage.src = `assets/${cardData.country}.png`;
    countryImage.style.width = '100%';
    card.insertBefore(countryImage, card.firstChild);

    if (cardData.unitType === '战斗机' || cardData.unitType === '轰炸机') {
        const airForceImage = document.createElement('img');
        airForceImage.src = `assets/${cardData.country}空军.png`;
        airForceImage.style.width = '100%';
        airForceImage.style.zIndex = 2;
        card.insertBefore(airForceImage, card.firstChild);
    }

    const unitTypeImage = document.createElement('img');
    unitTypeImage.src = `assets/${cardData.unitType}.png`;
    unitTypeImage.style.width = '100%';
    card.insertBefore(unitTypeImage, card.firstChild);

    countryImage.style.zIndex = 2;
    unitTypeImage.style.zIndex = 2;
    unitDisplayContainer.style.zIndex = 1;
}

function init() {
    spinWheel();
    cardElements.attributes.setAttribute('data-placeholder', '点击添加词条');
    cardElements.effects.setAttribute('data-placeholder', '点击添加特效');
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';
    
    const generateBtn = document.querySelector('button');
    generateBtn.textContent = '生成新卡牌';
    
    const saveBtn = document.createElement('button');
    saveBtn.className = 'save-btn';
    saveBtn.textContent = '保存卡牌';
    saveBtn.addEventListener('click', saveCardAsImage);
    
    buttonContainer.appendChild(generateBtn);
    buttonContainer.appendChild(saveBtn);
    
    document.querySelector('.wheel').appendChild(buttonContainer);

    const card = document.querySelector('.card');
    card.removeEventListener('mousemove', handleCardMove);
    card.removeEventListener('mouseleave', handleCardLeave);
    card.addEventListener('mousemove', handleCardMove);
    card.addEventListener('mouseleave', handleCardLeave);
}

const updateCard = (element, value) => {
    element.textContent = value === '-' ? '' : value;
    element.contentEditable = true;
};

document.querySelector('button').addEventListener('click', () => {
    const card = document.getElementById('card');
    const imgs = card.querySelectorAll('img:not([src="assets/模板.png"])');
    imgs.forEach(img => img.remove());
    
    spinWheel();
    
    cardElements.attributes.style.display = 'block';
    cardElements.effects.style.display = 'block';
    setTimeout(() => {
        cardElements.attributes.style.display = '';
        cardElements.effects.style.display = '';
    }, 0);
});

function handleCardMove(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width/2;
    const centerY = rect.top + rect.height/2;
    
    const targetX = (e.clientX - centerX) / 25;
    const targetY = (e.clientY - centerY) / 25;
    
    requestAnimationFrame(() => {
        card.style.transform = `
            perspective(1000px)
            rotateX(${-targetY * 0.6}deg)
            rotateY(${targetX * 0.6}deg)
            scale(1.02)
            translateZ(10px)`;
        card.style.boxShadow = `
            ${targetX * 3}px ${targetY * 3}px 30px rgba(0, 0, 0, 0.2)`;
    });
}

function handleCardLeave() {
    requestAnimationFrame(() => {
        this.style.transform = `
            perspective(1000px)
            rotateX(0)
            rotateY(0)
            scale(1)
            translateZ(0)`;
        this.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    });
}

function saveCardAsImage() {
    const card = document.getElementById('card');
    
    domtoimage.toPng(card, {
        quality: 0.95,
        width: card.offsetWidth * 2,
        height: card.offsetHeight * 2,
        style: {
            transform: 'scale(2)',
            transformOrigin: 'top left'
        }
    })
    .then(dataUrl => {
        const link = document.createElement('a');
        link.download = 'card.png';
        link.href = dataUrl;
        link.click();
    })
    .catch(error => {
        console.error('截图失败:', error);
    });
}

window.onload = init;