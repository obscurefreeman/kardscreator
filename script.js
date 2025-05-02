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
        conditions: ['攻击时', '交战并存活后', '获得攻击力时', '获得防御力时', '被攻击时', '部署时', '被消灭时', '移动时', '被压制时', '被抑制时', '成为指令目标时', '攻击比自己攻击力更高的目标时', '触发反制时', '被完全修复时', '升为老兵后', '攻击敌方总部后'],
        conditionTargets: ['本单位', '指定单位', '相邻单位', '任意友方单位', '任意敌方单位', '任意前线单位', '任意支援阵线单位', '任意受伤单位', `任意{attributes}单位`],
        effects: [
            `{conditionTargets}{conditions}，使{target}获得<b>+${getRandomInt(1, 5)}</b>攻击力`,
            `{conditionTargets}{conditions}，使{target}获得<b>+${getRandomInt(1, 5)}</b>防御力`,
            `{conditionTargets}{conditions}，使{target}获得<b>+${getRandomInt(1, 5)} +${getRandomInt(1, 5)}</b>`,
            `{conditionTargets}{conditions}，对{target}造成<b>${getRandomInt(1, 5)}</b>点伤害`,
            `{conditionTargets}{conditions}，使{target}无法攻击`,
            `{conditionTargets}{conditions}，使{target}无法攻击敌方总部`,
            `{conditionTargets}{conditions}，使{target}获得守护`,
            `{conditionTargets}{conditions}，使{target}受到的战斗伤害翻倍`,
            `{conditionTargets}{conditions}，使{target}与一个敌方单位战斗`,
            `{conditionTargets}{conditions}，使{target}进入前线，如果可能`,
            `{conditionTargets}{conditions}，使{target}返回其所有者手牌`,
            `{conditionTargets}{conditions}，使{target}也算做坦克`,
            `{conditionTargets}{conditions}，使{target}获得{attributes}`,
            `{conditionTargets}{conditions}，抽一张{attributes}单位`,
            `{conditionTargets}{conditions}，使{target}行动花费<b>+${getRandomInt(1, 5)}</b>`,
            `{conditionTargets}{conditions}，消灭{target}`,
            `{conditionTargets}{conditions}，使{side}抽<b>${getRandomInt(1, 5)}</b>张牌`,
            `{conditionTargets}{conditions}，{side}需要选择并弃掉<b>${getRandomInt(1, 3)}</b>张牌`,
            `{conditionTargets}{conditions}，使{side}总部获得<b>+${getRandomInt(1, 5)}</b>防御力`,
            `{conditionTargets}{conditions}，对{side}总部造成<b>${getRandomInt(1, 5)}</b>点伤害`,
            `{conditionTargets}{conditions}，结束该回合`,
            `{side}总部获得防御力时，{target}获得等量攻击力`,
            `{side}{attributes}单位受到的战斗伤害<b>-${getRandomInt(1, 5)}</b>`,
            `{side}{attributes}单位受到的指令伤害<b>-${getRandomInt(1, 5)}</b>`,
            `{side}部署无法触发`,
            `{side}亡计无法触发`,
            `{side}部署触发两次`,
            `{side}亡计触发两次`,
            `{side}{attributes}单位具有<b>+${getRandomInt(1, 5)}</b>攻击力`,
            `每回合，{side}只能使用至多1张指令`,
            `{side}回合结束时，若友方总部防御力大于敌方总部，对{side}总部造成<b>${getRandomInt(1, 5)}</b>点伤害`,
            `{side}使用指令时，对{side}总部造成等同于其花费的伤害`,
            `无法攻击敌方总部`,
            `{conditionTargets}攻击时，溢出的伤害转移至{side}总部`
        ],
        effectTargets: ['本单位', '指定单位', '相邻单位', '随机单位', '所有友方单位', '所有敌方单位', '所有前线单位', '所有支援阵线单位', '所有受伤单位', `所有{attributes}单位`],
        effectside: ['友方', '敌方', '双方']
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
    '迟钝的', '无用的', '快乐的', '旅行的',
    '强健的','坚韧的', '痴情的', '冷眼旁观', '旁若无人', '风尘仆仆', '面有赧颜', '容光焕发',
    '津津有味的', '无聊的', '绅士的', '面冷心慈的', '豪情万千的', '年轻有为的', '贼头贼脑',
    '鬼鬼祟祟', '缩手缩脚', '丑态百出的', '漫不经心', '心不在焉', '怅然若失', '垂涎三尺',
    '有口无心的', '因祸得福的', '时髦的', '讲究的', '邋遢的', '俗气的', '诚挚的', '羞涩的',
    '腼腆的', '冷酷的', '傲慢的', '疲惫的', '沮丧的', '失神的', '诧异的', '发愣的', '尴尬的',
    '踌躇的'
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

        // 处理特殊条件
        if (conditionTarget === '本单位' && condition === '部署时') {
            effect = effect.replace('{conditionTargets}{conditions}，', '<b>部署：</b>');
        } else if (conditionTarget === '本单位' && condition === '被消灭时') {
            effect = effect.replace('{conditionTargets}{conditions}，', '<b>亡计：</b>');
        } else {
            conditionTarget = conditionTarget.replace(/{attributes}/g, randomAttribute);
            effectTarget = effectTarget.replace(/{attributes}/g, randomAttribute);
        }

        // 添加粗体效果
        effect = effect
            .replace(/{target}/g, effectTarget)
            .replace(/{side}/g, effectSide)
            .replace(/{conditionTargets}/g, conditionTarget)
            .replace(/{conditions}/g, condition)
            .replace(/{attributes}/g, randomAttribute)
            .replace(/{value}/g, getRandomInt(1,5))
            .replace(/友方/g, '<b>友方</b>')
            .replace(/敌方/g, '<b>敌方</b>')
            .replace(/双方/g, '<b>双方</b>')
            .replace(/指令/g, '<b>指令</b>')
            .replace(/反制/g, '<b>反制</b>')
            .replace(/受伤/g, '<b>受伤</b>')
            .replace(/支援阵线/g, '<b>支援阵线</b>')
            .replace(/前线/g, '<b>前线</b>')
            .replace(/相邻/g, '<b>相邻</b>')
            .replace(/随机/g, '<b>随机</b>')
            .replace(/指定/g, '<b>指定</b>')
            .replace(/交战/g, '<b>交战</b>')
            .replace(/闪击/g, '<b>闪击</b>')
            .replace(/守护/g, '<b>守护</b>')
            .replace(/烟幕/g, '<b>烟幕</b>')
            .replace(/奋战/g, '<b>奋战</b>')
            .replace(/伏击/g, '<b>伏击</b>')
            .replace(/冲击/g, '<b>冲击</b>')
            .replace(/重甲1/g, '<b>重甲1</b>')
            .replace(/重甲2/g, '<b>重甲2</b>')
            .replace(/重甲3/g, '<b>重甲3</b>')
            .replace(/收缴/g, '<b>收缴</b>')
            .replace(/动员/g, '<b>动员</b>')
            .replace(/山地/g, '<b>山地</b>')
            .replace(/情报1/g, '<b>情报1</b>')
            .replace(/情报2/g, '<b>情报2</b>')
            .replace(/情报3/g, '<b>情报3</b>')
            .replace(/流亡/g, '<b>流亡</b>')
            .replace(/坦克/g, '<b>坦克</b>')
            .replace(/步兵/g, '<b>步兵</b>')
            .replace(/炮兵/g, '<b>炮兵</b>')
            .replace(/战斗机/g, '<b>战斗机</b>')
            .replace(/轰炸机/g, '<b>轰炸机</b>');

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
            infantry: 114,
            tank: 36,
            artillery: 17,
            plane: 53
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
        element.innerHTML = value === '-' ? '' : value;
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
    unitTypeImage.className = 'unit-type-image';
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
    
    const generateBtn = document.createElement('button');
    generateBtn.textContent = '生成新卡牌';
    generateBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

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
    
    const saveBtn = document.createElement('button');
    saveBtn.className = 'save-btn';
    saveBtn.textContent = '保存卡牌';
    saveBtn.addEventListener('click', saveCardAsImage);
    
    buttonContainer.appendChild(generateBtn);
    buttonContainer.appendChild(saveBtn);
    
    document.querySelector('.wheel').appendChild(buttonContainer);

    document.getElementById('minimize-btn').addEventListener('click', minimizeWindow);
    document.getElementById('maximize-btn').addEventListener('click', maximizeWindow);
    document.getElementById('close-btn').addEventListener('click', closeWindow);

    const card = document.querySelector('.card');
    card.removeEventListener('mousemove', handleCardMove);
    card.removeEventListener('mouseleave', handleCardLeave);
    card.addEventListener('mousemove', handleCardMove);
    card.addEventListener('mouseleave', handleCardLeave);
}

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
    const card = document.getElementById('card')
    const cardName = document.querySelector('.card h2').textContent
    
    // 获取卡牌的尺寸和位置
    const rect = card.getBoundingClientRect()
    
    // 使用 Electron 的 webContents.capturePage API
    window.ipc.postMessage('capture-page', {
        x: Math.round(rect.left),
        y: Math.round(rect.top),
        width: Math.round(rect.width),
        height: Math.round(rect.height)
    })
}

window.ipc = {
    postMessage: (channel, data) => require('electron').ipcRenderer.send(channel, data),
    on: (channel, callback) => require('electron').ipcRenderer.on(channel, callback)
}

// 监听捕获页面的结果
window.ipc.on('capture-page-reply', (event, image) => {
    if (image) {
        // 将捕获的图像转换为 Data URL
        const dataURL = image.toDataURL()
        const cardName = document.querySelector('.card h2').textContent
        
        // 发送保存图片的请求，包含卡牌名称
        window.ipc.postMessage('save-card-image', {
            dataURL: dataURL,
            cardName: cardName
        })
    }
})

window.onload = function() {
    // 检测是否在Electron环境中
    const isElectron = typeof require !== 'undefined' && typeof window !== 'undefined' && window.process && window.process.type;
    
    // 如果是Electron环境，给body添加electron类
    if (isElectron) {
        document.body.classList.add('electron');
    }
    
    init();
}

// 窗口控制函数
function minimizeWindow() {
    window.ipc.postMessage('window-minimize');
}

function maximizeWindow() {
    window.ipc.postMessage('window-maximize');
}

function closeWindow() {
    window.ipc.postMessage('window-close');
}

// 添加窗口大小调整事件监听器
window.addEventListener('resize', adjustScale);

// 初始调整缩放比例
adjustScale();

function adjustScale() {
    const container = document.querySelector('.container');
    const isElectron = typeof require !== 'undefined' && typeof window !== 'undefined' && window.process && window.process.type;

    if (!isElectron) {
        // 网页环境下使用固定缩放比例
        container.style.transform = 'scale(0.5)';
        container.style.margin = '20px auto';
        return;
    }

    // 以下为Electron环境下的自适应缩放逻辑
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // 设置边距
    const margin = 20; // 20像素的边距

    // 获取标题栏的高度
    const titlebarHeight = document.querySelector('.titlebar').offsetHeight;

    // 计算缩放比例，考虑边距和标题栏高度
    const scaleWidth = (windowWidth - margin * 2) / 500; // 500是卡牌的宽度
    const scaleHeight = (windowHeight - margin * 2 - titlebarHeight) / 889; // 889是加上按钮的高度
    const scale = Math.min(scaleWidth, scaleHeight);

    // 设置最大缩放比例
    const maxScale = 1; // 最大缩放比例为1倍
    const finalScale = Math.min(scale, maxScale);

    // 应用缩放比例和边距
    container.style.transform = `scale(${finalScale})`;
    container.style.margin = `${margin + titlebarHeight}px auto ${margin}px`; // 设置顶部和底部边距
}