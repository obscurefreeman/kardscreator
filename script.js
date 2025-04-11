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
        conditionTargets: ['此单位', '指定单位', '相邻单位', '任意友方单位', '任意敌方单位', '任意前线单位', '任意支援阵线单位', '任意受伤单位', `任意{attributes}单位`],
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
        effectTargets: ['此单位', '指定单位', '相邻单位', '随机单位', '所有友方单位', '所有敌方单位', '所有前线单位', '所有支援阵线单位', '所有受伤单位', `所有{attributes}单位`],
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
    '迟钝的', '无用的', '快乐的', '旅行的',
    '温柔的', '内向的', '腼腆的', '害羞的', '率性的', '活泼的', '开朗的', '多情的', '热情的', '飘逸的', '可爱的', '慈祥的', '老实的', '暴躁的', '急躁的', '虚心的', '勤奋的', '热心的', '自信的', '任性的', '冲动的', '胆小的', '安静的', '憨厚的', '淡定的', '坚强的', '火爆的', '奔放的', '痴情的', '调皮的', '捣蛋的', '坏坏的', '斯文的', '愉快的', '痛苦的', '烦恼的', '紧张的', '忧郁的', '焦虑的', '苦闷的', '着急的', '难过的', '愤怒的', '失望的', '苦恼的', '悲伤的', '开心的', '不开心的', '无聊的', '孤独的', '空虚的', '寂寞的', '失恋的', '单身的', '发呆的', '发怒的', '失眠的', '睡不着的', '刚分手的', '刚失恋的', '曾经爱过的', '曾深爱过的', '伤情的', '时尚的', '路过的', '飞翔的', '行走的', '奔跑的', '暴走的', '飞奔的', '销魂的', '火星上的', '星星上的', '月球上的', '呐喊的', '没人理的', '会搭讪的', '爱搭讪的', '私奔的', '逃跑的', '越狱的', '打盹的', '喝醉的', '微醺的', '求醉的', '买醉的', '犯傻的', '旅途中的', '被表白的', '道上混的', '玩手机的', '不要命的', '玩命的', '有爱心的', '热心肠的', '会开车的', '闯红灯的', '唠叨的', '迷茫的', '彷徨的', '忐忑的', '茫然的', '失落的', '逃课的', '想出国的', '读研的', '爱逃课的', '挂过科的', '不爱学习的', '暗恋学妹的', '爱玩的', '贪玩的', '有腹肌的', '瘦瘦的', '小眼睛的', '眼睛小的', '鼻子大的', '大鼻子的', '眉毛粗的', '粗眉毛的', '帅气的', '帅呆的', '好帅的', '近视的', '跑龙套的', '打酱油的', '爱听歌的', '爱跑步的', '玩滑板的', '爱看书的', '爱热闹的', '吹牛的', '阳光的', '绅士的', '礼貌的', '宽容的', '大气的', '爱笑的', '不羁的', '追风的', '完美的', '魁梧的', '睿智的', '深沉的', '稳重的', '豪爽的', '低调的', '狂野的', '高大的', '仗义的', '正直的', '博学的', '爽快的', '直爽的', '果断的', '豁达的', '沉着的', '儒雅的', '冷静的', '从容的', '谦逊的', '精明的', '干练的', '机灵的', '聪明的', '健壮的', '阳刚的', '慷慨的', '善良的', '心软的', '刚毅的', '俊逸的', '俊秀的', '严肃的', '成熟的', '谦和的', '坚韧的', '含蓄的', '文雅的', '强悍的', '强健的', '长情的', '踏实的', '体贴的', '细心的', '独立的', '个性的', '另类的', '腹黑的', '纯真的', '冷冷的', '听话的', '乖乖的', '卖萌的', '叛逆的', '鬼畜的', '无邪的', '傻傻的', '逼格高的', '性感的', '留胡子的', '小胡子的', '英俊的', '潇洒的', '风流的', '骑白马的', '风流倜傥的', '玉树临风的', '神勇威武的', '文武双全的', '力能扛鼎的', '刀枪不入的', '侠义非凡的', '谦虚好学的', '聪明伶俐的', '慷慨大方的', '有情有义的', '有胆有识的', '谈吐大方的', '风度翩翩的', '气势凌人的', '英勇无比的', '千杯不醉的', '坐怀不乱的', '知识渊博的', '才高八斗的', '傲视众生的', '光明磊落的', '文质彬彬的', '面冷心慈的', '豪情万千的', '温文尔雅的', '年轻有为的', '英姿勃勃的', '朝气蓬勃的', '不拘小节的', '胡子拉碴的', '闷骚的',
    '大腹便便', '脑满肠肥', '身材高挑', '亭亭玉立', '袅袅婷婷', '弱不禁风', '瘦骨嶙峋', '瘦骨如柴', '短小精悍', '朴素', '大方', '整洁', '时髦', '摩登', '讲究', '笔挺', '邋遢', '俗气', '穿戴整齐', '衣冠楚楚', '穿红戴绿', '衣着入时', '珠光宝气', '花枝招展', '衣衫不整', '赤身裸体', '一丝不挂', '庄重', '端庄', '安闲', '安详', '恬静', '文雅', '镇静', '沉着', '诚挚', '憨厚', '恳切', '潇洒', '妩媚', '羞涩', '腼腆', '严厉', '冷酷', '坚毅', '傲慢', '疲惫', '沮丧', '失神', '诧异', '发愣', '尴尬', '踌躇', '容光焕发', '英姿勃勃', '精神矍铄', '精神抖擞', '生龙活虎', '威风凛凛', '英姿飒爽', '风度翩翩', '热情洋溢', '热情奔放', '温文尔雅', '和蔼可亲', '和颜悦色', '心平气和', '平心静气', '悠然自得', '毕恭毕敬', '从容不迫', '泰然自若', '津津有味', '若无其事', '不露声色', '面红耳赤', '面有赧颜', '无精打彩', '郁郁寡欢', '闷闷不乐', '局促不安', '垂头丧气', '精疲力竭', '风尘仆仆', '气喘吁吁', '呆若木鸡', '瞠目结舌', '哑口无言', '交头接耳', '笨头笨脑', '疯疯癫癫', '凶神恶煞', '杀气腾腾', '装腔作势', '盛气凌人', '龇牙咧嘴', '神气十足', '傲慢无礼', '神气活现', '趾高气扬', '咄咄逼人', '目空一切', '不屑一顾', '目中无人', '旁若无人', '冷眼旁观', '贼头贼脑', '鬼鬼祟祟', '半信半疑', '不知所措', '漫不经心', '心不在焉', '怅然若失', '垂涎三尺', '死皮赖脸', '缩手缩脚', '丑态百出'
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

const updateCard = (element, value) => {
    element.textContent = value === '-' ? '' : value;
    element.contentEditable = true;
};

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
    
    // 设置缩放比例
    const scale = 2;
    
    html2canvas(card, {
        scale: scale,
        logging: true,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
    }).then(canvas => {
        // 将canvas转换为图片
        const imgData = canvas.toDataURL('image/png');
        
        // 创建下载链接
        const link = document.createElement('a');
        link.download = 'card.png';
        link.href = imgData;
        
        // 触发下载
        link.click();
    }).catch(error => {
        console.error('截图失败:', error);
    });
}

window.ipc = {
    postMessage: (channel) => require('electron').ipcRenderer.send(channel)
}

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