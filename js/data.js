/* 英语启航 EnglishQuest - 内容数据库 */

// 26 个字母：字母、读音、例词、中文（第 1-26 天每天一个）
// 26 个字母：ph=字母名读音（已认识，快速带过）；sound=字母音（重点），tip=口型提示，hint=与字母名的区别
const LETTERS = [
  { letter: 'A a', ph: '/eɪ/', ex: 'apple', cn: '苹果', sound: '/æ/', tip: '嘴巴张大、嘴角向两边拉，像“安”但更扁', hint: '字母名叫“诶”，在词里发 /æ/', soundEx: 'apple', soundCn: '苹果' },
  { letter: 'B b', ph: '/biː/', ex: 'book', cn: '书', sound: '/b/', tip: '双唇闭紧再突然打开，短促的“波”', hint: '声带要振动，和 P 的 /p/ 不同', soundEx: 'book', soundCn: '书' },
  { letter: 'C c', ph: '/siː/', ex: 'cat', cn: '猫', sound: '/k/', tip: '舌根顶住喉咙后释放，像咳嗽前的“科”', hint: '这里不发“西”，和 K 同音', soundEx: 'cat', soundCn: '猫' },
  { letter: 'D d', ph: '/diː/', ex: 'dog', cn: '狗', sound: '/d/', tip: '舌尖抵上牙床再弹开，像“得”的轻声', hint: '声带要振动，和 T 的 /t/ 不同', soundEx: 'dog', soundCn: '狗' },
  { letter: 'E e', ph: '/iː/', ex: 'egg', cn: '鸡蛋', sound: '/e/', tip: '嘴微张、嘴角向两边，像“诶”但更短', hint: '字母名是 /iː/，词里常发 /e/', soundEx: 'egg', soundCn: '鸡蛋' },
  { letter: 'F f', ph: '/ef/', ex: 'fish', cn: '鱼', sound: '/f/', tip: '上牙轻咬下唇吹气，像“夫”的开头', hint: '嘴唇要碰到牙齿', soundEx: 'fish', soundCn: '鱼' },
  { letter: 'G g', ph: '/dʒiː/', ex: 'go', cn: '去', sound: '/g/', tip: '舌根顶住喉咙后释放，比 /k/ 更沉', hint: '常发 /g/，有时发 /dʒ/（如 gem）', soundEx: 'go', soundCn: '去' },
  { letter: 'H h', ph: '/eɪtʃ/', ex: 'hat', cn: '帽子', sound: '/h/', tip: '张嘴呵气，像冬天哈气暖手', hint: '别发成中文“喝”的完整音', soundEx: 'hat', soundCn: '帽子' },
  { letter: 'I i', ph: '/aɪ/', ex: 'ink', cn: '墨水', sound: '/ɪ/', tip: '嘴微张、舌位靠前，短促的“衣”', hint: '字母名是 /aɪ/，短音是 /ɪ/', soundEx: 'ink', soundCn: '墨水' },
  { letter: 'J j', ph: '/dʒeɪ/', ex: 'jump', cn: '跳', sound: '/dʒ/', tip: '舌尖抵上牙床后弹开，像“知”带摩擦', hint: '和 G 的 /dʒ/ 同音', soundEx: 'jump', soundCn: '跳' },
  { letter: 'K k', ph: '/keɪ/', ex: 'key', cn: '钥匙', sound: '/k/', tip: '舌根轻咳一声“科”', hint: '和 C 的 /k/ 同音', soundEx: 'key', soundCn: '钥匙' },
  { letter: 'L l', ph: '/el/', ex: 'leg', cn: '腿', sound: '/l/', tip: '舌尖抵上牙床，声音从舌头两侧出来', hint: '像中文“勒”的开头', soundEx: 'leg', soundCn: '腿' },
  { letter: 'M m', ph: '/em/', ex: 'map', cn: '地图', sound: '/m/', tip: '双唇闭合、鼻子出气，闭嘴哼“嗯”', hint: '嘴不能张开', soundEx: 'map', soundCn: '地图' },
  { letter: 'N n', ph: '/en/', ex: 'nose', cn: '鼻子', sound: '/n/', tip: '舌尖抵上牙床、鼻子出气，像“恩”', hint: '嘴微张，和 /m/ 的闭嘴不同', soundEx: 'nose', soundCn: '鼻子' },
  { letter: 'O o', ph: '/əʊ/', ex: 'orange', cn: '橙子', sound: '/ɒ/', tip: '嘴张大、嘴唇收圆，像“哦”但更短', hint: '字母名是 /əʊ/，词里常发 /ɒ/', soundEx: 'orange', soundCn: '橙子' },
  { letter: 'P p', ph: '/piː/', ex: 'pen', cn: '钢笔', sound: '/p/', tip: '双唇闭紧再打开送气，像“泼”', hint: '不振动声带，和 B 的 /b/ 不同', soundEx: 'pen', soundCn: '钢笔' },
  { letter: 'Q q', ph: '/kjuː/', ex: 'queen', cn: '女王', sound: '/k/', tip: '和 K 同音，后面总跟着 u', hint: 'Q 几乎总是 qu = /kw/', soundEx: 'queen', soundCn: '女王' },
  { letter: 'R r', ph: '/ɑː/', ex: 'red', cn: '红色', sound: '/r/', tip: '舌尖卷起靠近上牙床但不碰，像“若”的开头', hint: '中文没有这个音，别发成“啦”', soundEx: 'red', soundCn: '红色' },
  { letter: 'S s', ph: '/es/', ex: 'sun', cn: '太阳', sound: '/s/', tip: '舌尖靠近上牙床，像蛇“嘶嘶”', hint: '别发成“西”', soundEx: 'sun', soundCn: '太阳' },
  { letter: 'T t', ph: '/tiː/', ex: 'tea', cn: '茶', sound: '/t/', tip: '舌尖抵上牙床再弹开送气，像“特”的轻声', hint: '不振动声带，和 D 的 /d/ 不同', soundEx: 'tea', soundCn: '茶' },
  { letter: 'U u', ph: '/juː/', ex: 'umbrella', cn: '雨伞', sound: '/ʌ/', tip: '嘴微张、舌位靠后，像短促的“啊”', hint: '字母名是 /juː/，词里常发 /ʌ/', soundEx: 'umbrella', soundCn: '雨伞' },
  { letter: 'V v', ph: '/viː/', ex: 'van', cn: '货车', sound: '/v/', tip: '上牙咬下唇并震动，像“夫”但带振动', hint: '声带要振动，和 F 的 /f/ 不同', soundEx: 'van', soundCn: '货车' },
  { letter: 'W w', ph: '/ˈdʌbljuː/', ex: 'water', cn: '水', sound: '/w/', tip: '双唇收圆再滑开，像“屋”的开头', hint: '是滑音，和圆唇的 /uː/ 不同', soundEx: 'water', soundCn: '水' },
  { letter: 'X x', ph: '/eks/', ex: 'box', cn: '盒子', sound: '/ks/', tip: '/k/ 接 /s/ 连读，像“克斯”', hint: '常在词尾发 /ks/', soundEx: 'box', soundCn: '盒子' },
  { letter: 'Y y', ph: '/waɪ/', ex: 'yes', cn: '是的', sound: '/j/', tip: '舌面靠近上牙床再滑开，像“耶”的开头', hint: '在词尾可发 /ɪ/ 或 /aɪ/', soundEx: 'yes', soundCn: '是的' },
  { letter: 'Z z', ph: '/ziː/', ex: 'zoo', cn: '动物园', sound: '/z/', tip: '舌尖靠近上牙床并震动，像“兹”', hint: '声带要振动，和 S 的 /s/ 不同', soundEx: 'zoo', soundCn: '动物园' },
];

// 自然拼读：把已学音标拼成简单词（音标筑基完成后使用）
const BLEND_LESSONS = [
  { parts: ['b', 'æ', 't'], word: 'bat', cn: '蝙蝠' },
  { parts: ['k', 'æ', 't'], word: 'cat', cn: '猫' },
  { parts: ['h', 'æ', 't'], word: 'hat', cn: '帽子' },
  { parts: ['m', 'æ', 't'], word: 'mat', cn: '垫子' },
  { parts: ['r', 'æ', 't'], word: 'rat', cn: '老鼠' },
  { parts: ['b', 'æ', 'g'], word: 'bag', cn: '书包' },
  { parts: ['t', 'æ', 'g'], word: 'tag', cn: '标签' },
  { parts: ['m', 'æ', 'p'], word: 'map', cn: '地图' },
  { parts: ['v', 'æ', 'n'], word: 'van', cn: '货车' },
  { parts: ['b', 'e', 'd'], word: 'bed', cn: '床' },
  { parts: ['r', 'e', 'd'], word: 'red', cn: '红色' },
  { parts: ['p', 'e', 'n'], word: 'pen', cn: '钢笔' },
  { parts: ['t', 'e', 'n'], word: 'ten', cn: '十' },
  { parts: ['h', 'e', 'n'], word: 'hen', cn: '母鸡' },
  { parts: ['j', 'e', 's'], word: 'yes', cn: '是的' },
  { parts: ['b', 'ɪ', 'g'], word: 'big', cn: '大的' },
  { parts: ['p', 'ɪ', 'g'], word: 'pig', cn: '猪' },
  { parts: ['d', 'ɪ', 'g'], word: 'dig', cn: '挖' },
  { parts: ['l', 'ɪ', 'p'], word: 'lip', cn: '嘴唇' },
  { parts: ['t', 'ɪ', 'p'], word: 'tip', cn: '小提示' },
  { parts: ['b', 'ɒ', 'ks'], word: 'box', cn: '盒子' },
  { parts: ['f', 'ɒ', 'ks'], word: 'fox', cn: '狐狸' },
  { parts: ['h', 'ɒ', 't'], word: 'hot', cn: '热的' },
  { parts: ['p', 'ɒ', 't'], word: 'pot', cn: '锅' },
  { parts: ['d', 'ɒ', 'g'], word: 'dog', cn: '狗' },
  { parts: ['l', 'ɒ', 'g'], word: 'log', cn: '木头' },
  { parts: ['k', 'ʌ', 'p'], word: 'cup', cn: '杯子' },
  { parts: ['s', 'ʌ', 'n'], word: 'sun', cn: '太阳' },
  { parts: ['r', 'ʌ', 'n'], word: 'run', cn: '跑' },
  { parts: ['f', 'ʌ', 'n'], word: 'fun', cn: '乐趣' },
  { parts: ['b', 'ʌ', 's'], word: 'bus', cn: '公交车' },
];

// 音标启蒙：符号、类型、例词、中文
const PHONETICS = [
  { sym: '/iː/', type: '长元音', ex: 'see', cn: '看见' },
  { sym: '/ɪ/', type: '短元音', ex: 'sit', cn: '坐' },
  { sym: '/e/', type: '短元音', ex: 'bed', cn: '床' },
  { sym: '/æ/', type: '短元音', ex: 'cat', cn: '猫' },
  { sym: '/ɑː/', type: '长元音', ex: 'father', cn: '父亲' },
  { sym: '/ɒ/', type: '短元音', ex: 'dog', cn: '狗' },
  { sym: '/ɔː/', type: '长元音', ex: 'door', cn: '门' },
  { sym: '/ʊ/', type: '短元音', ex: 'book', cn: '书' },
  { sym: '/uː/', type: '长元音', ex: 'food', cn: '食物' },
  { sym: '/ʌ/', type: '短元音', ex: 'cup', cn: '杯子' },
  { sym: '/ɜː/', type: '长元音', ex: 'bird', cn: '鸟' },
  { sym: '/ə/', type: '弱元音', ex: 'about', cn: '关于' },
  { sym: '/eɪ/', type: '双元音', ex: 'name', cn: '名字' },
  { sym: '/aɪ/', type: '双元音', ex: 'like', cn: '喜欢' },
  { sym: '/ɔɪ/', type: '双元音', ex: 'boy', cn: '男孩' },
  { sym: '/aʊ/', type: '双元音', ex: 'house', cn: '房子' },
  { sym: '/əʊ/', type: '双元音', ex: 'go', cn: '去' },
  { sym: '/ɪə/', type: '双元音', ex: 'here', cn: '这里' },
  { sym: '/eə/', type: '双元音', ex: 'there', cn: '那里' },
  { sym: '/ʊə/', type: '双元音', ex: 'tour', cn: '旅行' },
  { sym: '/p/', type: '清辅音', ex: 'pen', cn: '钢笔' },
  { sym: '/b/', type: '浊辅音', ex: 'bag', cn: '书包' },
  { sym: '/t/', type: '清辅音', ex: 'tea', cn: '茶' },
  { sym: '/d/', type: '浊辅音', ex: 'desk', cn: '桌子' },
  { sym: '/k/', type: '清辅音', ex: 'cat', cn: '猫' },
  { sym: '/g/', type: '浊辅音', ex: 'go', cn: '去' },
  { sym: '/f/', type: '清辅音', ex: 'fish', cn: '鱼' },
  { sym: '/v/', type: '浊辅音', ex: 'van', cn: '货车' },
  { sym: '/s/', type: '清辅音', ex: 'sun', cn: '太阳' },
  { sym: '/z/', type: '浊辅音', ex: 'zoo', cn: '动物园' },
  { sym: '/ʃ/', type: '清辅音', ex: 'ship', cn: '船' },
  { sym: '/ʒ/', type: '浊辅音', ex: 'measure', cn: '测量' },
  { sym: '/tʃ/', type: '清辅音', ex: 'chair', cn: '椅子' },
  { sym: '/dʒ/', type: '浊辅音', ex: 'jump', cn: '跳' },
  { sym: '/θ/', type: '清辅音', ex: 'think', cn: '思考' },
  { sym: '/ð/', type: '浊辅音', ex: 'this', cn: '这个' },
  { sym: '/m/', type: '鼻音', ex: 'map', cn: '地图' },
  { sym: '/n/', type: '鼻音', ex: 'nose', cn: '鼻子' },
  { sym: '/ŋ/', type: '鼻音', ex: 'sing', cn: '唱歌' },
  { sym: '/l/', type: '边音', ex: 'leg', cn: '腿' },
  { sym: '/r/', type: '近音', ex: 'red', cn: '红色' },
  { sym: '/j/', type: '半元音', ex: 'yes', cn: '是的' },
  { sym: '/w/', type: '半元音', ex: 'we', cn: '我们' },
  { sym: '/h/', type: '喉音', ex: 'hat', cn: '帽子' }
];

// 核心词库：lvl 1-4 对应四个学习阶段
const WORDS = [
  // 阶段一：零基础高频词
  { w: 'hello', ph: '/həˈləʊ/', cn: '你好', ex: 'Hello, my friend!', cnEx: '你好，我的朋友！', lvl: 1 },
  { w: 'good', ph: '/ɡʊd/', cn: '好的', ex: 'Good morning!', cnEx: '早上好！', lvl: 1 },
  { w: 'morning', ph: '/ˈmɔːnɪŋ/', cn: '早晨', ex: 'I get up in the morning.', cnEx: '我早上起床。', lvl: 1 },
  { w: 'book', ph: '/bʊk/', cn: '书', ex: 'This is my book.', cnEx: '这是我的书。', lvl: 1 },
  { w: 'apple', ph: '/ˈæpl/', cn: '苹果', ex: 'I eat an apple every day.', cnEx: '我每天吃一个苹果。', lvl: 1 },
  { w: 'cat', ph: '/kæt/', cn: '猫', ex: 'The cat is sleeping.', cnEx: '猫正在睡觉。', lvl: 1 },
  { w: 'dog', ph: '/dɒɡ/', cn: '狗', ex: 'I have a dog.', cnEx: '我有一只狗。', lvl: 1 },
  { w: 'water', ph: '/ˈwɔːtə/', cn: '水', ex: 'Drink more water.', cnEx: '多喝水。', lvl: 1 },
  { w: 'friend', ph: '/frend/', cn: '朋友', ex: 'She is my best friend.', cnEx: '她是我最好的朋友。', lvl: 1 },
  { w: 'teacher', ph: '/ˈtiːtʃə/', cn: '老师', ex: 'My teacher is kind.', cnEx: '我的老师很和蔼。', lvl: 1 },
  { w: 'student', ph: '/ˈstjuːdnt/', cn: '学生', ex: 'I am a student.', cnEx: '我是一名学生。', lvl: 1 },
  { w: 'school', ph: '/skuːl/', cn: '学校', ex: 'I go to school by bus.', cnEx: '我坐公交去上学。', lvl: 1 },
  { w: 'home', ph: '/həʊm/', cn: '家', ex: 'I go home at five.', cnEx: '我五点回家。', lvl: 1 },
  { w: 'happy', ph: '/ˈhæpi/', cn: '开心的', ex: 'I am happy today.', cnEx: '我今天很开心。', lvl: 1 },
  { w: 'big', ph: '/bɪɡ/', cn: '大的', ex: 'What a big house!', cnEx: '多么大的房子！', lvl: 1 },
  { w: 'small', ph: '/smɔːl/', cn: '小的', ex: 'A small cat is there.', cnEx: '那里有一只小猫。', lvl: 1 },
  { w: 'today', ph: '/təˈdeɪ/', cn: '今天', ex: 'Today is Monday.', cnEx: '今天是星期一。', lvl: 1 },
  { w: 'tomorrow', ph: '/təˈmɒrəʊ/', cn: '明天', ex: 'See you tomorrow!', cnEx: '明天见！', lvl: 1 },
  { w: 'thanks', ph: '/θæŋks/', cn: '谢谢', ex: 'Thanks for your help.', cnEx: '谢谢你的帮助。', lvl: 1 },
  { w: 'please', ph: '/pliːz/', cn: '请', ex: 'Water, please.', cnEx: '请给我水。', lvl: 1 },
  { w: 'eat', ph: '/iːt/', cn: '吃', ex: 'Let us eat lunch.', cnEx: '我们吃午饭吧。', lvl: 1 },
  { w: 'drink', ph: '/drɪŋk/', cn: '喝', ex: 'I drink milk at night.', cnEx: '我晚上喝牛奶。', lvl: 1 },
  { w: 'love', ph: '/lʌv/', cn: '爱', ex: 'I love my family.', cnEx: '我爱我的家人。', lvl: 1 },
  { w: 'new', ph: '/njuː/', cn: '新的', ex: 'I have a new bike.', cnEx: '我有一辆新自行车。', lvl: 1 },
  { w: 'nice', ph: '/naɪs/', cn: '好的，友好的', ex: 'Nice to meet you.', cnEx: '很高兴认识你。', lvl: 1 },

  // 阶段二：生活常用词
  { w: 'because', ph: '/bɪˈkɒz/', cn: '因为', ex: 'I stay home because it rains.', cnEx: '因为下雨我待在家里。', lvl: 2 },
  { w: 'important', ph: '/ɪmˈpɔːtnt/', cn: '重要的', ex: 'English is important for us.', cnEx: '英语对我们很重要。', lvl: 2 },
  { w: 'different', ph: '/ˈdɪfrənt/', cn: '不同的', ex: 'We have different ideas.', cnEx: '我们有不同的想法。', lvl: 2 },
  { w: 'problem', ph: '/ˈprɒbləm/', cn: '问题', ex: 'No problem at all.', cnEx: '完全没问题。', lvl: 2 },
  { w: 'answer', ph: '/ˈɑːnsə/', cn: '回答；答案', ex: 'Please answer my question.', cnEx: '请回答我的问题。', lvl: 2 },
  { w: 'question', ph: '/ˈkwestʃən/', cn: '问题', ex: 'I have a question.', cnEx: '我有一个问题。', lvl: 2 },
  { w: 'remember', ph: '/rɪˈmembə/', cn: '记住', ex: 'Remember to drink water.', cnEx: '记得喝水。', lvl: 2 },
  { w: 'forget', ph: '/fəˈɡet/', cn: '忘记', ex: 'Do not forget your keys.', cnEx: '别忘了你的钥匙。', lvl: 2 },
  { w: 'understand', ph: '/ˌʌndəˈstænd/', cn: '理解', ex: 'I understand the lesson now.', cnEx: '我现在理解这一课了。', lvl: 2 },
  { w: 'practice', ph: '/ˈpræktɪs/', cn: '练习', ex: 'Practice makes perfect.', cnEx: '熟能生巧。', lvl: 2 },
  { w: 'lesson', ph: '/ˈlesn/', cn: '课程', ex: 'This lesson is fun.', cnEx: '这节课很有趣。', lvl: 2 },
  { w: 'minute', ph: '/ˈmɪnɪt/', cn: '分钟', ex: 'Wait a minute, please.', cnEx: '请等一分钟。', lvl: 2 },
  { w: 'travel', ph: '/ˈtrævl/', cn: '旅行', ex: 'I want to travel to Beijing.', cnEx: '我想去北京旅行。', lvl: 2 },
  { w: 'weather', ph: '/ˈweðə/', cn: '天气', ex: 'The weather is nice today.', cnEx: '今天天气很好。', lvl: 2 },
  { w: 'explain', ph: '/ɪkˈspleɪn/', cn: '解释', ex: 'Can you explain this word?', cnEx: '你能解释这个单词吗？', lvl: 2 },
  { w: 'decide', ph: '/dɪˈsaɪd/', cn: '决定', ex: 'I decide to study hard.', cnEx: '我决定努力学习。', lvl: 2 },
  { w: 'future', ph: '/ˈfjuːtʃə/', cn: '未来', ex: 'The future is bright.', cnEx: '未来是光明的。', lvl: 2 },
  { w: 'agree', ph: '/əˈɡriː/', cn: '同意', ex: 'I agree with you.', cnEx: '我同意你的看法。', lvl: 2 },
  { w: 'choose', ph: '/tʃuːz/', cn: '选择', ex: 'Choose the right answer.', cnEx: '选出正确答案。', lvl: 2 },
  { w: 'health', ph: '/helθ/', cn: '健康', ex: 'Health comes first.', cnEx: '健康第一。', lvl: 2 },
  { w: 'family', ph: '/ˈfæməli/', cn: '家庭', ex: 'I love my family.', cnEx: '我爱我的家庭。', lvl: 2 },
  { w: 'market', ph: '/ˈmɑːkɪt/', cn: '市场', ex: 'We buy food at the market.', cnEx: '我们在市场买食物。', lvl: 2 },
  { w: 'result', ph: '/rɪˈzʌlt/', cn: '结果', ex: 'The result is great.', cnEx: '结果很棒。', lvl: 2 },
  { w: 'language', ph: '/ˈlæŋɡwɪdʒ/', cn: '语言', ex: 'English is a useful language.', cnEx: '英语是一门有用的语言。', lvl: 2 },
  { w: 'improve', ph: '/ɪmˈpruːv/', cn: '提高', ex: 'I want to improve my English.', cnEx: '我想提高我的英语。', lvl: 2 },
  { w: 'study', ph: '/ˈstʌdi/', cn: '学习', ex: 'I study English every day.', cnEx: '我每天学英语。', lvl: 2 },
  { w: 'word', ph: '/wɜːd/', cn: '单词', ex: 'This word is new to me.', cnEx: '这个单词对我来说是新的。', lvl: 2 },
  { w: 'sentence', ph: '/ˈsentəns/', cn: '句子', ex: 'Read the sentence aloud.', cnEx: '大声朗读这个句子。', lvl: 2 },
  { w: 'listen', ph: '/ˈlɪsn/', cn: '听', ex: 'Listen to me carefully.', cnEx: '仔细听我说。', lvl: 2 },
  { w: 'speak', ph: '/spiːk/', cn: '说', ex: 'I can speak a little English.', cnEx: '我会说一点英语。', lvl: 2 },

  // 阶段三：四级核心词
  { w: 'achieve', ph: '/əˈtʃiːv/', cn: '实现，达到', ex: 'You can achieve your goal.', cnEx: '你能实现你的目标。', lvl: 3 },
  { w: 'ability', ph: '/əˈbɪləti/', cn: '能力', ex: 'She has the ability to learn fast.', cnEx: '她有快速学习的能力。', lvl: 3 },
  { w: 'attitude', ph: '/ˈætɪtjuːd/', cn: '态度', ex: 'A good attitude helps a lot.', cnEx: '好态度大有帮助。', lvl: 3 },
  { w: 'benefit', ph: '/ˈbenɪfɪt/', cn: '益处', ex: 'Reading has many benefits.', cnEx: '阅读有很多好处。', lvl: 3 },
  { w: 'challenge', ph: '/ˈtʃælɪndʒ/', cn: '挑战', ex: 'Learning English is a challenge.', cnEx: '学英语是一个挑战。', lvl: 3 },
  { w: 'confidence', ph: '/ˈkɒnfɪdəns/', cn: '信心', ex: 'I speak with confidence.', cnEx: '我充满信心地说。', lvl: 3 },
  { w: 'consider', ph: '/kənˈsɪdə/', cn: '考虑', ex: 'Please consider my advice.', cnEx: '请考虑我的建议。', lvl: 3 },
  { w: 'develop', ph: '/dɪˈveləp/', cn: '发展', ex: 'We develop a good habit.', cnEx: '我们养成一个好习惯。', lvl: 3 },
  { w: 'effort', ph: '/ˈefət/', cn: '努力', ex: 'Hard work and effort pay off.', cnEx: '努力和付出会有回报。', lvl: 3 },
  { w: 'environment', ph: '/ɪnˈvaɪrənmənt/', cn: '环境', ex: 'We should protect the environment.', cnEx: '我们应该保护环境。', lvl: 3 },
  { w: 'experience', ph: '/ɪkˈspɪəriəns/', cn: '经验；经历', ex: 'I have no work experience.', cnEx: '我没有工作经验。', lvl: 3 },
  { w: 'fail', ph: '/feɪl/', cn: '失败', ex: 'Do not be afraid to fail.', cnEx: '不要害怕失败。', lvl: 3 },
  { w: 'focus', ph: '/ˈfəʊkəs/', cn: '专注', ex: 'Focus on one thing at a time.', cnEx: '一次专注一件事。', lvl: 3 },
  { w: 'habit', ph: '/ˈhæbɪt/', cn: '习惯', ex: 'Reading is a good habit.', cnEx: '阅读是个好习惯。', lvl: 3 },
  { w: 'increase', ph: '/ɪnˈkriːs/', cn: '增加', ex: 'I increase my vocabulary daily.', cnEx: '我每天增加词汇量。', lvl: 3 },
  { w: 'knowledge', ph: '/ˈnɒlɪdʒ/', cn: '知识', ex: 'Knowledge is power.', cnEx: '知识就是力量。', lvl: 3 },
  { w: 'method', ph: '/ˈmeθəd/', cn: '方法', ex: 'This method really works.', cnEx: '这个方法真的有效。', lvl: 3 },
  { w: 'opportunity', ph: '/ˌɒpəˈtjuːnəti/', cn: '机会', ex: 'Do not miss this opportunity.', cnEx: '别错过这个机会。', lvl: 3 },
  { w: 'patience', ph: '/ˈpeɪʃns/', cn: '耐心', ex: 'Learning needs patience.', cnEx: '学习需要耐心。', lvl: 3 },
  { w: 'progress', ph: '/ˈprəʊɡres/', cn: '进步', ex: 'I make progress every day.', cnEx: '我每天都在进步。', lvl: 3 },
  { w: 'purpose', ph: '/ˈpɜːpəs/', cn: '目的', ex: 'What is your purpose?', cnEx: '你的目的是什么？', lvl: 3 },
  { w: 'quality', ph: '/ˈkwɒləti/', cn: '质量', ex: 'Quality is more important.', cnEx: '质量更重要。', lvl: 3 },
  { w: 'realize', ph: '/ˈriːəlaɪz/', cn: '意识到；实现', ex: 'I realize my dream is near.', cnEx: '我意识到梦想很近了。', lvl: 3 },
  { w: 'schedule', ph: '/ˈʃedjuːl/', cn: '计划表', ex: 'I follow my study schedule.', cnEx: '我遵守我的学习计划。', lvl: 3 },
  { w: 'success', ph: '/səkˈses/', cn: '成功', ex: 'Success needs time.', cnEx: '成功需要时间。', lvl: 3 },
  { w: 'support', ph: '/səˈpɔːt/', cn: '支持', ex: 'Thanks for your support.', cnEx: '谢谢你的支持。', lvl: 3 },
  { w: 'understand', ph: '/ˌʌndəˈstænd/', cn: '理解', ex: 'Now I fully understand.', cnEx: '现在我完全理解了。', lvl: 3 },
  { w: 'vocabulary', ph: '/vəˈkæbjələri/', cn: '词汇', ex: 'My vocabulary is growing.', cnEx: '我的词汇量在增长。', lvl: 3 },
  { w: 'whether', ph: '/ˈweðə/', cn: '是否', ex: 'I do not know whether to go.', cnEx: '我不知道是否该去。', lvl: 3 },
  { w: 'worth', ph: '/wɜːθ/', cn: '值得', ex: 'This book is worth reading.', cnEx: '这本书值得读。', lvl: 3 },

  // 阶段四：四级冲刺高频词
  { w: 'according', ph: '/əˈkɔːdɪŋ/', cn: '根据', ex: 'According to the report, sales rose.', cnEx: '根据报告，销量上升了。', lvl: 4 },
  { w: 'affect', ph: '/əˈfekt/', cn: '影响', ex: 'Sleep affects your study.', cnEx: '睡眠影响你的学习。', lvl: 4 },
  { w: 'alternative', ph: '/ɔːlˈtɜːnətɪv/', cn: '替代的', ex: 'We need an alternative plan.', cnEx: '我们需要一个备选方案。', lvl: 4 },
  { w: 'analyse', ph: '/ˈænəlaɪz/', cn: '分析', ex: 'Analyse the question first.', cnEx: '先分析这个问题。', lvl: 4 },
  { w: 'approach', ph: '/əˈprəʊtʃ/', cn: '方法；接近', ex: 'A new approach to learning.', cnEx: '一种新的学习方法。', lvl: 4 },
  { w: 'assume', ph: '/əˈsjuːm/', cn: '假设；认为', ex: 'I assume you are right.', cnEx: '我认为你是对的。', lvl: 4 },
  { w: 'available', ph: '/əˈveɪləbl/', cn: '可获得的', ex: 'The book is available online.', cnEx: '这本书网上有售。', lvl: 4 },
  { w: 'concern', ph: '/kənˈsɜːn/', cn: '关心；担忧', ex: 'This concerns everyone here.', cnEx: '这关系到这里每个人。', lvl: 4 },
  { w: 'consequence', ph: '/ˈkɒnsɪkwəns/', cn: '后果', ex: 'Every action has a consequence.', cnEx: '每个行为都有后果。', lvl: 4 },
  { w: 'curious', ph: '/ˈkjʊəriəs/', cn: '好奇的', ex: 'Children are curious about the world.', cnEx: '孩子们对世界充满好奇。', lvl: 4 },
  { w: 'decline', ph: '/dɪˈklaɪn/', cn: '下降；婉拒', ex: 'Prices began to decline.', cnEx: '物价开始下降。', lvl: 4 },
  { w: 'demonstrate', ph: '/ˈdemənstreɪt/', cn: '证明；演示', ex: 'Let me demonstrate the method.', cnEx: '让我演示这个方法。', lvl: 4 },
  { w: 'efficient', ph: '/ɪˈfɪʃnt/', cn: '高效的', ex: 'This is an efficient way to study.', cnEx: '这是一种高效的学习方法。', lvl: 4 },
  { w: 'eliminate', ph: '/ɪˈlɪmɪneɪt/', cn: '消除', ex: 'We must eliminate the errors.', cnEx: '我们必须消除错误。', lvl: 4 },
  { w: 'essential', ph: '/ɪˈsenʃl/', cn: '必要的', ex: 'Water is essential to life.', cnEx: '水对生命必不可少。', lvl: 4 },
  { w: 'estimate', ph: '/ˈestɪmeɪt/', cn: '估计', ex: 'I estimate it will take two years.', cnEx: '我估计这需要两年。', lvl: 4 },
  { w: 'evidence', ph: '/ˈevɪdəns/', cn: '证据', ex: 'There is no clear evidence.', cnEx: '没有明确的证据。', lvl: 4 },
  { w: 'exhibit', ph: '/ɪɡˈzɪbɪt/', cn: '展览；展示', ex: 'The museum exhibits old photos.', cnEx: '博物馆展出老照片。', lvl: 4 },
  { w: 'identify', ph: '/aɪˈdentɪfaɪ/', cn: '识别', ex: 'Can you identify the problem?', cnEx: '你能找出问题所在吗？', lvl: 4 },
  { w: 'ignore', ph: '/ɪɡˈnɔː/', cn: '忽视', ex: 'Do not ignore small mistakes.', cnEx: '不要忽视小错误。', lvl: 4 },
  { w: 'imply', ph: '/ɪmˈplaɪ/', cn: '暗示', ex: 'What does the author imply?', cnEx: '作者暗示了什么？', lvl: 4 },
  { w: 'indicate', ph: '/ˈɪndɪkeɪt/', cn: '表明', ex: 'The chart indicates a rise.', cnEx: '图表显示有所上升。', lvl: 4 },
  { w: 'inevitable', ph: '/ɪnˈevɪtəbl/', cn: '不可避免的', ex: 'Change is inevitable.', cnEx: '改变是不可避免的。', lvl: 4 },
  { w: 'influence', ph: '/ˈɪnfluəns/', cn: '影响', ex: 'Family influences children deeply.', cnEx: '家庭对孩子影响很深。', lvl: 4 },
  { w: 'maintain', ph: '/meɪnˈteɪn/', cn: '保持；维持', ex: 'Maintain your learning rhythm.', cnEx: '保持你的学习节奏。', lvl: 4 },
  { w: 'obtain', ph: '/əbˈteɪn/', cn: '获得', ex: 'You can obtain a certificate.', cnEx: '你可以获得证书。', lvl: 4 },
  { w: 'obvious', ph: '/ˈɒbviəs/', cn: '明显的', ex: 'The answer is obvious.', cnEx: '答案很明显。', lvl: 4 },
  { w: 'participate', ph: '/pɑːˈtɪsɪpeɪt/', cn: '参与', ex: 'I participate in class discussion.', cnEx: '我参与课堂讨论。', lvl: 4 },
  { w: 'previous', ph: '/ˈpriːviəs/', cn: '先前的', ex: 'Review the previous lesson.', cnEx: '复习上一课。', lvl: 4 },
  { w: 'reduce', ph: '/rɪˈdjuːs/', cn: '减少', ex: 'Reduce the time on your phone.', cnEx: '减少看手机的时间。', lvl: 4 },
  { w: 'reflect', ph: '/rɪˈflekt/', cn: '反映；反思', ex: 'Reflect on your mistakes.', cnEx: '反思你的错误。', lvl: 4 },
  { w: 'relevant', ph: '/ˈreləvənt/', cn: '相关的', ex: 'Only relevant information counts.', cnEx: '只有相关信息才有用。', lvl: 4 },
  { w: 'significant', ph: '/sɪɡˈnɪfɪkənt/', cn: '重要的；显著的', ex: 'There is a significant change.', cnEx: '有显著的变化。', lvl: 4 },
  { w: 'suggest', ph: '/səˈdʒest/', cn: '建议', ex: 'I suggest reading aloud.', cnEx: '我建议大声朗读。', lvl: 4 },
  { w: 'survive', ph: '/səˈvaɪv/', cn: '生存', ex: 'Few plants survive the drought.', cnEx: '很少植物能在干旱中存活。', lvl: 4 },
  { w: 'tendency', ph: '/ˈtendənsi/', cn: '趋势', ex: 'There is a tendency to improve.', cnEx: '有改善的趋势。', lvl: 4 },
  { w: 'transform', ph: '/trænsˈfɔːm/', cn: '转变', ex: 'English can transform your life.', cnEx: '英语能改变你的人生。', lvl: 4 },
  { w: 'vary', ph: '/ˈveəri/', cn: '变化', ex: 'Prices vary from shop to shop.', cnEx: '各家店的价格不同。', lvl: 4 },
  { w: 'widespread', ph: '/ˈwaɪdspred/', cn: '普遍的', ex: 'It is a widespread problem.', cnEx: '这是个普遍问题。', lvl: 4 }
];

// 扩充词库：单词|中文（按难度分层，供后期大量刷题使用）
const EXTRA_WORDS = {
  cet4: (typeof CET4_EXTRA !== 'undefined' ? CET4_EXTRA : ''),
  3: 'abandon|放弃,abstract|抽象的,accompany|陪伴,accomplish|完成,accurate|准确的,acquire|获得,adapt|适应,adequate|足够的,adjust|调整,adventure|冒险,aggressive|好斗的,agriculture|农业,ancestor|祖先,anxiety|焦虑,apparent|明显的,appeal|吸引,appreciate|欣赏,appropriate|合适的,approve|赞成,argue|争论,arise|出现,arrange|安排,artificial|人造的,aspect|方面,assess|评估,assign|分配,assist|协助,associate|联系,attach|附上,attempt|尝试,attract|吸引,average|平均的,avoid|避免,aware|意识到的,behave|表现,brief|简短的,campaign|运动,candidate|候选人,capable|有能力的,capacity|容量,capable|能够的,capture|捕获,category|类别,cause|导致,cease|停止,challenge|挑战,characteristic|特征,circumstance|环境,cite|引用,claim|声称,comment|评论,commit|承诺,compare|比较,compete|竞争,complex|复杂的,concentrate|集中,concept|概念,conduct|实施,confirm|确认,conflict|冲突,confuse|使困惑,consist|组成,constant|持续的,construct|建造,consume|消耗,contact|联系,contain|包含,context|上下文,contract|合同,contrast|对比,contribute|贡献,convince|说服,cooperate|合作,critical|批判的,crucial|关键的,culture|文化,curious|好奇的,deadline|截止日期,dedicate|奉献,define|定义,deliberate|故意的,deliver|递送,demand|要求,deny|否认,depend|依赖,deserve|值得,despite|尽管,determine|决定,device|设备,devote|投入,digest|消化,direct|直接的,disadvantage|缺点,discover|发现,dismiss|解雇,display|展示,distribute|分发,disturb|打扰,diverse|多样的,divide|划分,domestic|国内的,dominate|支配,donate|捐赠,doubt|怀疑,dramatic|戏剧性的,dynamic|有活力的,eager|渴望的,economic|经济的,educate|教育,effect|效果,efficient|高效的,elect|选举,eliminate|消除,emergency|紧急情况,emotion|情感,emphasize|强调,employ|雇用,enable|使能够,encounter|遭遇,encourage|鼓励,energy|能量,enhance|增强,enormous|巨大的,ensure|确保,entire|整个的,entrance|入口,equal|平等的,equip|装备,error|错误,escape|逃跑,essential|必要的,establish|建立,evaluate|评价,eventually|最终,evidence|证据,exact|确切的,exchange|交换,exclude|排除,exhibit|展出,expand|扩大,expense|费用,expert|专家,explore|探索,expose|暴露,extend|延伸,external|外部的,facility|设施,factor|因素,fail|失败,familiar|熟悉的,fault|缺点,feature|特征,feedback|反馈,fiction|小说,firm|公司,fit|适合,flame|火焰,flexible|灵活的,forecast|预测,formal|正式的,former|先前的,fortune|财富,foundation|基础,frame|框架,frequent|频繁的,function|功能,fund|资金,fundamental|基本的,generous|慷慨的,genuine|真正的,gesture|手势,glance|瞥见,global|全球的,glory|荣耀,govern|治理,gradual|逐渐的,grant|授予,grasp|掌握,grateful|感激的,guarantee|保证,guilt|内疚,halt|停止,handle|处理,harbor|港口,hardship|困难,harmony|和谐,harvest|收获,headline|标题,hesitate|犹豫,highlight|强调,honor|荣誉,horizon|地平线,household|家庭,humble|谦逊的,humor|幽默,ideal|理想的,identical|完全相同的,ignore|忽视,illegal|非法的,imagine|想象,imitate|模仿,immediate|立即的,impact|影响,implement|实施,imply|暗示,impose|强加,impress|使印象深刻,incident|事件,income|收入,indicate|表明,individual|个人,industry|行业,inevitable|不可避免的,inform|通知,initial|最初的,injure|伤害,innovation|创新,insist|坚持,inspire|激励,install|安装,instance|例子,instant|立即的,instead|相反,institute|机构,instruct|指导,instrument|仪器,insurance|保险,intend|打算,intense|强烈的,interpret|解释,interrupt|打断,interval|间隔,introduce|介绍,invent|发明,invest|投资,involve|涉及,isolate|孤立,issue|问题,job|工作,justice|公正,keen|热衷的,label|标签,labor|劳动,lack|缺乏,launch|发起,leader|领导者,lecture|讲座,legal|合法的,leisure|闲暇,length|长度,liberty|自由,license|执照,lifetime|一生,limit|限制,link|联系,literature|文学,local|当地的,logic|逻辑,lonely|孤独的,loose|松的,loyal|忠诚的,luxury|奢侈品,maintain|维持,majority|多数,manage|管理,manner|方式,manufacturer|制造商,margin|边缘,mark|标记,marriage|婚姻,mass|大量,master|掌握,maximum|最大,measure|测量,medical|医疗的,medium|媒介,memory|记忆,mental|精神的,mention|提及,merit|优点,message|信息,method|方法,middle|中间,mild|温和的,military|军事的,mind|头脑,minimum|最小,minor|较小的,mirror|镜子,mission|任务,mistake|错误,mode|模式,modern|现代的,modest|谦虚的,moment|时刻,monitor|监控,mood|心情,moral|道德的,motion|运动,motor|发动机,mountain|山,multiple|多个的,muscle|肌肉,museum|博物馆,mutual|相互的,mystery|神秘,narrow|狭窄的,nation|国家,native|本土的,natural|自然的,nature|自然,necessary|必要的,negative|消极的,neglect|忽视,negotiate|谈判,nervous|紧张的,network|网络,neutral|中立的,noble|贵族的,noise|噪音,normal|正常的,note|笔记,novel|小说,nuclear|核的,object|物体,observe|观察,obtain|获得,obvious|明显的,occasion|场合,occupy|占据,occur|发生,ocean|海洋,offer|提供,officer|官员,official|官方的,omit|省略,operate|操作,opinion|观点,oppose|反对,option|选项,order|命令,ordinary|普通的,organ|器官,origin|起源,original|原始的,otherwise|否则,outer|外部的,output|输出,overcome|克服,owe|欠,owner|所有者,pace|步伐,pack|打包,page|页,pain|痛苦,paint|绘画,panel|面板,paper|论文,parade|游行,parent|父母,partial|部分的,particular|特别的,partner|伙伴,pass|通过,patient|病人,pattern|模式,pause|暂停,pay|支付,peace|和平,peak|顶峰,peculiar|奇怪的,peer|同龄人,penalty|惩罚,percent|百分之,perfect|完美的,perform|表演,perhaps|也许,period|时期,permanent|永久的,permit|允许,personal|个人的,phone|电话,photo|照片,phrase|短语,physical|身体的,piano|钢琴,pick|挑选,piece|片,pile|堆,pilot|飞行员,pipe|管道,place|地方,plain|简单的,plan|计划,plane|飞机,plant|植物,plastic|塑料,plate|盘子,pleasant|愉快的,pleasure|快乐,plenty|大量,pocket|口袋,poem|诗,poet|诗人,point|点,pole|杆,police|警察,policy|政策,polish|擦亮,polite|礼貌的,pool|水池,poor|贫穷的,popular|受欢迎的,population|人口,port|港口,position|位置,positive|积极的,possess|拥有,possible|可能的,potential|潜在的,pound|磅,pour|倒,poverty|贫穷,power|力量,practical|实用的,praise|表扬,predict|预测,prefer|更喜欢,prepare|准备,present|呈现,pressure|压力,pretend|假装,pretty|漂亮的,prevent|阻止,previous|先前的,price|价格,pride|骄傲,primary|主要的,principle|原则,print|打印,priority|优先,prison|监狱,private|私人的,prize|奖品,probable|可能的,process|过程,produce|生产,product|产品,profession|职业,professor|教授,profit|利润,program|程序,progress|进步,project|项目,promise|承诺,promote|促进,proof|证据,proper|适当的,property|财产,proposal|提议,protect|保护,prove|证明,provide|提供,public|公共的,publish|出版,punish|惩罚,purchase|购买,pure|纯粹的,purpose|目的,pursue|追求,puzzle|谜,quality|质量,quantity|数量,quarrel|争吵,quarter|四分之一,queue|排队,quick|迅速的,quit|放弃,quiz|测验,race|比赛,radio|收音机,raise|提高,range|范围,rank|排名,rapid|迅速的,rare|罕见的,rate|比率,rather|相当,ratio|比例,reach|到达,react|反应,ready|准备好的,reality|现实,realize|实现,reason|理由,recall|回忆,receive|收到,recent|最近的,recognize|认出,recommend|推荐,record|记录,recover|恢复,reduce|减少,refer|参考,reflect|反思,reform|改革,refuse|拒绝,region|地区,regret|后悔,regular|定期的,reject|拒绝,relate|联系,relation|关系,relative|亲戚,relax|放松,release|释放,relevant|相关的,reliable|可靠的,relief|宽慰,remain|保持,remind|提醒,remove|移除,rent|租,repair|修理,repeat|重复,replace|取代,reply|回复,report|报告,represent|代表,request|请求,require|要求,rescue|救援,research|研究,reserve|预订,resist|抵抗,resolve|解决,resource|资源,respect|尊重,respond|回应,responsible|负责的,restore|恢复,restrict|限制,retain|保留,retire|退休,return|返回,reveal|揭示,review|复习,revise|修订,reward|奖励,rhythm|节奏,rice|米,rich|富有的,right|正确的,risk|风险,rival|对手,river|河,road|路,rock|岩石,role|角色,roof|屋顶,root|根,rose|玫瑰,rough|粗糙的,route|路线,routine|常规,royal|皇家的,ruin|毁灭,rule|规则,rumor|谣言,rural|农村的,rush|匆忙,safe|安全的,safety|安全,salary|薪水,sale|销售,salt|盐,sample|样品,sand|沙,satisfy|满足,save|节省,scale|规模,scan|扫描,scene|场景,schedule|日程,scheme|计划,scholar|学者,science|科学,scope|范围,score|分数,screen|屏幕,sea|海,search|搜索,season|季节,seat|座位,secret|秘密,section|部分,secure|安全的,seed|种子,seek|寻找,seem|似乎,seize|抓住,seldom|很少,select|选择,sell|卖,send|发送,senior|年长的,sense|感觉,separate|分离,serious|严肃的,serve|服务,service|服务,session|会议,settle|解决,several|几个,severe|严重的,shade|阴影,shadow|影子,shake|摇动,shape|形状,share|分享,sharp|锋利的,sheet|薄片,shelf|架子,shelter|庇护,shift|转变,shine|发光,ship|船,shock|震惊,shoot|射击,short|短的,shoulder|肩膀,shout|喊叫,shower|淋浴,shut|关闭,shy|害羞的,sick|生病的,sight|视力,sign|标志,signal|信号,significant|重要的,silence|沉默,silk|丝,silly|愚蠢的,silver|银,similar|相似的,simple|简单的,sincere|真诚的,single|单一的,sink|下沉,situation|情况,size|尺寸,skill|技能,skin|皮肤,skirt|裙子,sky|天空,sleep|睡觉,slice|薄片,slide|滑动,slight|轻微的,slim|苗条的,slow|慢的,small|小的,smart|聪明的,smile|微笑,smoke|烟,smooth|平滑的,snake|蛇,snow|雪,soap|肥皂,social|社会的,society|社会,sock|袜子,soft|柔软的,soil|土壤,solar|太阳的,soldier|士兵,solid|固体的,solution|解决方案,solve|解决,sort|种类,soul|灵魂,sound|声音,soup|汤,source|来源,south|南,space|空间,spare|多余的,speak|说话,special|特别的,specific|具体的,speech|演讲,speed|速度,spell|拼写,spend|花费,spirit|精神,split|分裂,spoil|破坏,sponsor|赞助,spoon|勺子,sport|运动,spot|地点,spread|传播,spring|春天,square|正方形,stable|稳定的,staff|员工,stage|阶段,stair|楼梯,stamp|邮票,stand|站立,standard|标准,star|星,stare|凝视,start|开始,state|状态,statement|陈述,station|车站,steady|稳定的,steal|偷,steam|蒸汽,steel|钢,step|步骤,stick|坚持,still|仍然,stimulate|刺激,stir|搅拌,stock|库存,stomach|胃,stone|石头,stop|停止,store|商店,storm|暴风雨,story|故事,stove|炉子,straight|直的,strange|奇怪的,strategy|策略,street|街道,strength|力量,stress|压力,stretch|伸展,strict|严格的,strike|打击,string|字符串,strip|条,stroke|笔画,strong|强壮的,struggle|挣扎,study|学习,stuff|东西,stupid|愚蠢的,style|风格,subject|主题,submit|提交,succeed|成功,success|成功,sudden|突然的,suffer|遭受,sufficient|足够的,sugar|糖,suggest|建议,suit|适合,summer|夏天,summit|顶峰,sun|太阳,supply|供应,support|支持,suppose|假设,surface|表面,surprise|惊讶,surround|包围,survey|调查,survive|幸存,suspect|怀疑,suspend|暂停,sustain|维持,swallow|吞咽,sweat|汗,sweep|扫,sweet|甜的,swim|游泳,switch|切换,symbol|符号,sympathy|同情,system|系统,table|桌子,tackle|处理,tag|标签,take|拿,talent|天赋,talk|谈话,tank|坦克,tape|磁带,target|目标,task|任务,taste|味道,tax|税,tea|茶,teach|教,team|团队,tear|眼泪,technical|技术的,technique|技巧,technology|技术,teenager|青少年,telephone|电话,television|电视,tell|告诉,temperature|温度,temporary|临时的,tend|倾向于,term|学期,terrible|可怕的,test|测试,text|文本,theme|主题,theory|理论,thick|厚的,thin|薄的,thing|东西,think|思考,thirst|口渴,thorough|彻底的,threat|威胁,throat|喉咙,through|通过,throughout|贯穿,throw|扔,thumb|拇指,thunder|雷,thus|因此,ticket|票,tidy|整洁的,tie|领带,tight|紧的,tiny|极小的,tip|建议,tired|疲倦的,title|标题,today|今天,together|一起,toilet|厕所,tomorrow|明天,tone|语气,tongue|舌头,tonight|今晚,tool|工具,topic|话题,total|总的,touch|触摸,tough|艰难的,tour|旅行,tourist|游客,toward|朝向,tower|塔,town|城镇,toy|玩具,trace|痕迹,track|轨道,trade|贸易,tradition|传统,traffic|交通,train|火车,transfer|转移,transform|转变,translate|翻译,transport|运输,trap|陷阱,travel|旅行,treasure|宝藏,treat|对待,trend|趋势,trial|审判,tribe|部落,trick|诡计,trip|旅行,trouble|麻烦,true|真的,truly|真正地,trust|信任,truth|真相,try|尝试,tube|管子,tune|曲调,tunnel|隧道,turn|转动,twice|两次,twist|扭曲,typical|典型的,ugly|丑的,unable|无法的,uncle|叔叔,under|在下面,undergo|经历,undertake|承担,uniform|制服,unique|独特的,unit|单元,unite|联合,universal|普遍的,university|大学,unless|除非,unlike|不像,until|直到,unusual|不寻常的,upper|上面的,upset|沮丧的,urban|城市的,urge|催促,useful|有用的,usual|通常的,utility|效用,vacant|空的,vacation|假期,valley|山谷,valuable|有价值的,value|价值,variable|可变的,variety|多样,various|各种的,vast|巨大的,vegetable|蔬菜,vehicle|车辆,venture|冒险,verb|动词,version|版本,vessel|船只,veteran|老兵,via|通过,victim|受害者,victory|胜利,video|视频,view|观点,village|村庄,violate|违反,violence|暴力,virtual|虚拟的,virtue|美德,virus|病毒,visible|可见的,vision|视力,visit|拜访,visual|视觉的,vital|重要的,voice|声音,vote|投票,voyage|航行,wage|工资,wait|等待,wake|醒来,walk|走路,wall|墙,wander|漫步,want|想要,warm|温暖的,warn|警告,wash|洗,waste|浪费,watch|观看,wave|挥手,way|方法,weak|虚弱的,wealth|财富,weapon|武器,wear|穿,weather|天气,weave|编织,web|网,wedding|婚礼,week|周,weekend|周末,weight|重量,welcome|欢迎,welfare|福利,wet|湿的,whale|鲸鱼,wheel|轮子,whether|是否,whisper|低语,white|白色,whole|整个,wider|更宽的,wild|野生的,will|意志,win|赢,wind|风,window|窗户,wine|酒,wing|翅膀,winter|冬天,wipe|擦,wire|电线,wise|明智的,wish|愿望,withdraw|撤回,within|在之内,without|没有,witness|目击,woman|女人,wonder|想知道,wonderful|精彩的,wood|木头,wool|羊毛,word|单词,work|工作,worker|工人,world|世界,worry|担心,worth|值得,wound|伤口,wrap|包裹,write|写,wrong|错误的,yard|院子,year|年,yellow|黄色,yesterday|昨天,yield|产生,young|年轻的,youth|青年,zero|零,zone|区域',
  4: 'abnormal|异常的,absence|缺席,absolute|绝对的,absorb|吸收,academic|学术的,access|通道,accommodation|住宿,accompany|陪伴,accomplish|完成,account|账户,accurate|准确的,achieve|实现,acquire|获得,adapt|适应,adequate|足够的,adjust|调整,administer|管理,admit|承认,adopt|采用,advanced|高级的,advantage|优势,adventure|冒险,advertise|做广告,advocate|提倡,aesthetic|审美的,affection|喜爱,affirm|肯定,afford|负担得起,agenda|议程,aggressive|侵略的,agriculture|农业,aisle|过道,alter|改变,alternative|替代的,ambiguous|模糊的,ambition|野心,ample|充足的,analyse|分析,ancestor|祖先,anchor|锚,ancient|古代的,anniversary|周年,announce|宣布,annual|年度的,anonymous|匿名的,anxiety|焦虑,apparent|明显的,appeal|呼吁,appliance|器具,applicable|适用的,appoint|任命,appreciate|欣赏,approach|方法,appropriate|适当的,approve|批准,approximate|近似的,arbitrary|任意的,architect|建筑师,architecture|建筑学,argue|争论,arise|升起,arrange|安排,arrest|逮捕,artificial|人造的,aspect|方面,assess|评估,asset|资产,assign|分配,assist|协助,associate|联系,assume|假定,assure|保证,astonish|使惊讶,atmosphere|气氛,attach|附上,attain|达到,attempt|尝试,attend|出席,attitude|态度,attract|吸引,attractive|有吸引力的,audience|观众,authority|权威,available|可获得的,average|平均,avoid|避免,aware|意识到的,awkward|尴尬的,balance|平衡,barrier|障碍,behave|行为,being|存在,belief|信念,believe|相信,benefit|利益,bias|偏见,bid|出价,bound|一定会,brake|刹车,brand|品牌,brilliant|杰出的,broadcast|广播,budget|预算,burden|负担,bureau|局,cable|电缆,calm|平静的,campaign|运动,cancel|取消,candidate|候选人,capacity|能力,capital|首都,capture|捕捉,career|生涯,carrier|载体,casual|随意的,category|类别,cautious|谨慎的,cease|停止,celebrate|庆祝,cellular|细胞的,challenge|挑战,champion|冠军,characteristic|特征,charity|慈善,charm|魅力,chemical|化学的,chronic|慢性的,circumstance|情况,cite|引用,civil|公民的,claim|声称,clarify|澄清,classic|经典的,clause|从句,client|客户,climate|气候,clue|线索,cluster|群,coach|教练,coherent|连贯的,collapse|倒塌,colleague|同事,combat|战斗,combine|结合,comment|评论,commercial|商业的,commit|犯（罪）,committee|委员会,communicate|沟通,community|社区,compare|比较,compete|竞争,complain|抱怨,complex|复杂的,component|组成部分,compose|组成,compound|化合物,comprehensive|全面的,compromise|妥协,conceal|隐藏,concede|承认,concentrate|集中,concept|概念,concern|关心,conclude|得出结论,conduct|行为,conference|会议,confess|坦白,confidence|信心,confirm|确认,conflict|冲突,conform|遵守,confront|面对,confuse|困惑,congress|国会,consequence|后果,conservative|保守的,consider|考虑,considerable|相当大的,consist|组成,consistent|一致的,constant|不断的,constitute|构成,construct|建造,consult|咨询,consume|消耗,contact|接触,contain|包含,contemplate|沉思,contemporary|当代的,contempt|轻蔑,content|内容,contest|比赛,context|语境,continue|继续,contract|合同,contradict|反驳,contrary|相反的,contrast|对比,contribute|贡献,controversial|有争议的,convenient|方便的,convey|传达,convince|说服,cool|冷静的,cooperate|合作,coordinate|协调,cope|应对,corporate|公司的,correspond|符合,council|委员会,counter|柜台,courage|勇气,courtesy|礼貌,craft|工艺,crash|碰撞,crazy|疯狂的,create|创造,credible|可信的,credit|信用,crime|犯罪,crisis|危机,critical|批评的,criticize|批评,crop|农作物,crucial|关键的,cruel|残忍的,crush|压碎,culture|文化,cunning|狡猾的,curious|好奇的,current|当前的,curriculum|课程,curse|诅咒,customer|顾客,cut|削减,cycle|循环,daily|每日的,damage|损害,deadline|截止日期,deal|处理,debate|辩论,decade|十年,deceive|欺骗,decide|决定,decision|决定,decline|下降,decorate|装饰,decrease|减少,dedicate|奉献,deem|认为,defeat|击败,defend|防御,define|定义,definite|明确的,delicate|精致的,deliver|递送,demand|要求,democracy|民主,demonstrate|演示,deny|否认,depart|离开,depend|依赖,depict|描绘,deploy|部署,deposit|存款,depress|使沮丧,derive|获得,descend|下降,describe|描述,desert|沙漠,deserve|应得,design|设计,desirable|合意的,despair|绝望,despite|尽管,dessert|甜点,detach|分离,detail|细节,detect|发现,determine|决定,develop|发展,devote|献身,differ|不同,digest|消化,dignity|尊严,dilemma|困境,dimension|维度,diminish|减少,diploma|文凭,direct|指导,directory|目录,disable|使残疾,disagree|不同意,disappear|消失,disappoint|使失望,discipline|纪律,discover|发现,discriminate|歧视,discuss|讨论,disease|疾病,dismiss|驳回,display|展示,dispose|处理,dispute|争论,distinct|明显不同的,distinguish|区分,distort|扭曲,distract|分心,disturb|打扰,diverse|不同的,divide|划分,divorce|离婚,document|文件,domestic|国内的,dominate|支配,donate|捐赠,doubt|怀疑,download|下载,draft|草稿,drag|拖,dramatic|显著的,dream|梦想,dress|穿衣,drift|漂流,drill|训练,drive|驾驶,drop|下降,drown|溺水,due|到期的,dull|枯燥的,dump|倾倒,durable|耐用的,dynamic|有活力的,eager|热切的,earn|赚得,ease|容易,economic|经济的,economy|经济,edition|版本,educate|教育,effect|影响,effective|有效的,efficiency|效率,effort|努力,either|两者之一,elaborate|详尽的,elect|选举,electric|电的,elegant|优雅的,element|元素,eliminate|消除,embarrass|使尴尬,embrace|拥抱,emerge|出现,emergency|紧急情况,emotion|情绪,emphasize|强调,employ|雇用,employee|雇员,employer|雇主,empty|空的,enable|使能够,encounter|邂逅,encourage|鼓励,endless|无尽的,endure|忍受,energy|能源,enforce|执行,engage|从事,enhance|提高,enjoy|享受,enlarge|扩大,enormous|巨大的,ensure|确保,enter|进入,enthusiasm|热情,entire|全部的,entrance|入口,environment|环境,equal|平等的,equip|装备,error|错误,escape|逃脱,essential|必要的,establish|建立,estimate|估计,evaluate|评估,event|事件,eventually|最终,evidence|证据,evil|邪恶的,exact|准确的,exaggerate|夸张,exam|考试,examine|检查,example|例子,exceed|超过,excel|擅长,exchange|交换,excite|使兴奋,exclude|排除,excuse|借口,execute|执行,exercise|锻炼,exhaust|耗尽,exhibit|展出,exist|存在,expand|扩张,expect|期待,expense|费用,experience|经验,expert|专家,explain|解释,explode|爆炸,exploit|利用,explore|探索,export|出口,expose|暴露,express|表达,extend|延长,external|外部的,extra|额外的,extraordinary|非凡的,facility|设施,factor|因素,fade|褪色,fail|失败,faint|晕倒,fair|公平的,faith|信念,false|错误的,familiar|熟悉的,famous|著名的,fancy|花哨的,far|遥远的,fashion|时尚,fatal|致命的,fault|过错,favor|偏爱,feature|特色,fee|费用,feedback|反馈,female|女性的,fertile|肥沃的,fiction|小说,field|领域,fierce|凶猛的,figure|数字,file|文件,fill|填满,filter|过滤,final|最终的,finance|财政,financial|金融的,finite|有限的,firm|坚定的,fit|合适的,fix|修理,flame|火焰,flash|闪光,flat|平坦的,flavor|风味,flee|逃跑,flexible|灵活的,focus|集中,force|力量,forecast|预测,foreign|外国的,formal|正式的,former|先前的,formula|公式,fortune|运气,forum|论坛,found|建立,foundation|基础,fraction|小部分,frame|框架,frequent|频繁的,fresh|新鲜的,friend|朋友,frontier|前沿,function|功能,fund|资金,fundamental|基础的,funny|有趣的,generous|慷慨的,genuine|真正的,gesture|手势,giant|巨大的,glance|一瞥,global|全球的,glory|荣耀,goal|目标,govern|统治,grace|优雅,grade|等级,gradual|逐渐的,grand|宏伟的,grant|授予,grasp|抓住,grateful|感激的,grave|严重的,guarantee|保证,guide|指导,guilt|罪责,habit|习惯,halt|停止,handle|处理,hang|悬挂,harbor|港口,hardship|困苦,harmony|和谐,harvest|收获,haste|匆忙,headline|头条,heal|治愈,health|健康,heap|堆,heart|心,heavy|重的,height|高度,hesitate|犹豫,highlight|强调,historic|历史性的,hollow|空的,honor|荣誉,hope|希望,horizon|地平线,hotel|旅馆,household|家庭,huge|巨大的,human|人类,humble|谦逊的,humor|幽默,hunger|饥饿,hunt|狩猎,hurry|匆忙,ideal|理想的,identical|相同的,identify|识别,ignore|忽视,illegal|非法的,illness|疾病,image|形象,imagine|想象,imitate|模仿,immense|巨大的,immediate|立即的,impact|影响,impatient|不耐烦的,implement|实施,imply|暗示,import|进口,impose|强加,impress|留下印象,improve|改善,incident|事件,include|包括,income|收入,increase|增加,indeed|确实,indicate|表明,individual|个人,industry|工业,inevitable|不可避免的,influence|影响,inform|告知,initial|最初的,injure|伤害,innocent|无辜的,innovation|创新,inquiry|询问,insight|洞察,insist|坚持,inspire|鼓舞,install|安装,instance|实例,instant|立即,instead|代替,institute|机构,instruct|指导,instrument|乐器,insult|侮辱,insurance|保险,intend|打算,intense|强烈的,interpret|解释,interrupt|打断,interval|间隔,introduce|介绍,invent|发明,invest|投资,invite|邀请,involve|包含,isolate|隔离,issue|议题,item|项目,job|工作,join|加入,journal|期刊,journey|旅程,joy|快乐,judge|判断,junior|初级的,justice|正义,justify|证明正当,keen|渴望的,keep|保持,kind|种类,knowledge|知识,label|标签,labor|劳动,lack|缺乏,ladder|梯子,launch|启动,law|法律,layer|层,layout|布局,leader|领导,league|联盟,lecture|讲座,legal|合法的,legend|传说,leisure|闲暇,lending|借出,length|长度,lesson|教训,letter|信,level|水平,liberty|自由,library|图书馆,license|许可证,lifetime|一生,lift|电梯,light|轻的,limit|限制,link|联系,liquid|液体,list|列表,literature|文学,live|生活,local|当地的,logic|逻辑,lonely|孤独的,long|长的,loose|松散的,lose|失去,loyal|忠诚的,luxury|奢侈,main|主要的,maintain|维持,majority|多数,manage|设法做到,manner|方式,manufacturer|制造商,margin|边缘,mark|记号,market|市场,marriage|婚姻,mass|大量,master|掌握,match|匹配,material|材料,matter|事情,maximum|最大值,mean|意味着,meaning|意义,measure|措施,mechanical|机械的,medical|医学的,medium|媒介,memory|记忆,mental|精神的,mention|提到,merit|优点,message|消息,method|方法,middle|中间,mild|温和的,military|军事的,million|百万,mind|头脑,minimum|最小值,minor|次要的,minute|分钟,mirror|镜子,miss|错过,mission|使命,mistake|错误,mix|混合,mode|模式,model|模型,modern|现代的,modest|谦虚的,moment|时刻,monitor|监测,mood|情绪,moral|道德的,moreover|此外,motion|运动,motor|发动机,mount|登上,mountain|山,move|感动,multiple|多种的,muscle|肌肉,museum|博物馆,mutual|相互的,mystery|神秘,naked|赤裸的,narrow|狭窄的,nation|国家,native|本地的,natural|自然的,nature|大自然,nearly|几乎,necessary|必要的,negative|消极的,neglect|忽略,negotiate|谈判,neither|两者都不,nervous|紧张的,network|网络,neutral|中立的,never|从不,newspaper|报纸,nice|好的,noble|高尚的,noise|噪音,normal|正常的,north|北方,nose|鼻子,note|笔记,nothing|没有东西,notice|注意,novel|小说,nuclear|核的,number|数字,object|物体,objective|目标,observe|观察,obtain|获得,obvious|明显的,occasion|场合,occupy|占据,occur|发生,ocean|海洋,offer|提供,office|办公室,officer|官员,official|官方的,often|经常,oil|油,omit|省略,once|曾经,only|唯一,open|打开,operate|操作,opinion|意见,oppose|反对,option|选择,orange|橙色,order|顺序,ordinary|普通的,organ|器官,origin|起源,original|原创的,other|其他的,otherwise|否则,ought|应该,outer|外部的,output|产出,outside|外面,overcome|克服,owe|欠,own|自己的,owner|所有者,pace|步伐,pack|包装,page|页,pain|疼痛,paint|绘画,panel|面板,paper|纸张,parade|游行,parent|父母,park|公园,part|部分,partial|部分的,particular|特定的,partner|伙伴,pass|通过,past|过去,path|道路,patient|耐心的,pattern|模式,pause|暂停,pay|付款,peace|和平,peak|顶峰,peculiar|独特的,peer|同伴,penalty|处罚,people|人们,percent|百分比,perfect|完美的,perform|表演,perhaps|也许,period|时期,permanent|永久的,permit|许可,person|人,personal|个人的,phone|电话,photo|照片,phrase|短语,physical|身体的,piano|钢琴,pick|挑选,picture|图画,piece|碎片,pile|堆,pilot|飞行员,pink|粉色,pipe|管子,pitch|音调,place|地方,plain|平淡的,plan|计划,plane|飞机,plant|工厂,plastic|塑料,plate|盘子,play|播放,pleasant|令人愉快的,please|使高兴,pleasure|愉悦,plenty|充足的,plus|加,pocket|口袋,poem|诗,poet|诗人,point|观点,pole|杆,police|警察,policy|政策,polish|抛光,polite|礼貌的,pool|池塘,poor|贫穷的,popular|流行的,population|人口,port|港口,position|职位,positive|积极的,possess|拥有,possible|可能的,post|邮寄,potential|潜力,pound|英镑,pour|倾倒,poverty|贫穷,power|权力,practical|实用的,practice|练习,praise|赞扬,predict|预测,prefer|更喜欢,prepare|准备,present|现在的,pressure|压力,pretend|假装,pretty|相当,prevent|阻止,previous|先前的,price|价格,pride|自豪,primary|初级的,principle|原则,print|打印,prior|在先的,priority|优先事项,prison|监狱,private|私人的,prize|奖品,probable|很可能的,problem|问题,process|过程,produce|生产,product|产品,profession|职业,professor|教授,profit|利润,program|节目,progress|进步,project|项目,promise|承诺,promote|推广,proof|证据,proper|合适的,property|财产,proposal|提案,protect|保护,prove|证明,provide|提供,public|公众,publish|出版,pull|拉,punctual|准时的,punish|惩罚,purchase|购买,pure|纯净的,purpose|目的,pursue|追求,push|推,put|放置,puzzle|谜题,qualify|合格,quality|质量,quantity|数量,quarrel|争吵,quarter|四分之一,question|问题,queue|队列,quick|快速的,quit|退出,quiz|小测验,race|种族,radio|广播,raise|筹集,range|范围,rank|等级,rapid|快速的,rare|稀有的,rate|速度,rather|相当,ratio|比率,reach|达到,react|反应,read|阅读,ready|准备好,real|真实的,reality|现实,realize|意识到,really|真正地,reason|原因,recall|回忆,receive|收到,recent|最近的,recognize|认出,recommend|推荐,record|记录,recover|恢复,red|红色,reduce|减少,refer|提及,reflect|反映,reform|改革,refuse|拒绝,region|地区,regret|遗憾,regular|有规律的,reject|驳回,relate|关联,relation|关系,relative|相对的,relax|放松,release|发布,relevant|有关的,reliable|可靠的,relief|缓解,remain|保持,remember|记得,remind|提醒,remove|移除,rent|租金,repair|修理,repeat|重复,replace|替换,reply|回答,report|报道,represent|代表,request|请求,require|要求,rescue|营救,research|研究,reserve|保留,resist|抵抗,resolve|决定,resource|资源,respect|尊重,respond|回应,responsible|负责的,rest|休息,restore|恢复,restrict|限制,result|结果,retain|保持,retire|退休,return|归还,reveal|揭露,review|回顾,revise|复习,reward|回报,rhythm|韵律,rice|米饭,rich|富有的,ride|骑,right|权利,ring|戒指,rise|上升,risk|危险,rival|对手,river|河流,road|道路,rob|抢劫,rock|摇滚,role|角色,roll|滚动,roof|屋顶,room|房间,root|根源,rose|玫瑰,rough|粗糙的,round|圆的,route|路线,routine|例行公事,row|排,royal|皇家的,rub|摩擦,ruin|毁灭,rule|规则,rumor|谣言,run|经营,rural|乡村的,rush|冲,safe|安全的,safety|安全,sail|航行,salary|薪水,sale|出售,salt|盐,same|相同的,sample|样本,sand|沙子,satisfy|满足,save|节省,say|说,scale|规模,scan|浏览,scar|伤疤,scene|场景,schedule|时间表,scheme|方案,scholar|学者,school|学校,science|科学,scope|范围,score|得分,screen|屏幕,sea|海洋,seal|海豹,search|搜索,season|季节,seat|座位,second|秒,secret|秘密,section|部分,secure|获得,see|看见,seed|种子,seek|寻找,seem|似乎,seize|抓住,seldom|很少,select|选择,sell|出售,send|发送,senior|高级的,sense|感觉,sentence|句子,separate|分开,serious|严重的,serve|服务,service|服务,session|会议,set|设置,settle|解决,several|几个,severe|严重的,shade|阴凉,shadow|影子,shake|摇晃,shall|将要,shape|形状,share|分享,sharp|锋利的,shave|剃,sheep|羊,sheet|床单,shelf|架子,shell|贝壳,shelter|避难所,shield|盾牌,shift|轮班,shine|照耀,ship|船,shirt|衬衫,shock|震惊,shoe|鞋,shoot|射击,shop|商店,short|短的,should|应该,shoulder|肩膀,shout|呼喊,show|展示,shower|淋浴,shut|关闭,shy|害羞的,sick|生病的,side|一边,sigh|叹气,sight|景象,sign|签名,signal|信号,significant|重大的,silence|寂静,silk|丝绸,silly|愚蠢的,silver|银色,similar|类似的,simple|简单的,since|自从,sincere|真诚的,sing|唱,single|单身的,sink|水槽,sir|先生,sister|姐妹,sit|坐,site|地点,situation|处境,size|大小,skill|技巧,skin|皮肤,skirt|裙子,sky|天空,sleep|睡觉,slice|片,slide|幻灯片,slight|轻微的,slim|苗条的,slow|慢的,small|小的,smart|聪明的,smile|微笑,smoke|烟雾,smooth|光滑的,snake|蛇,snow|雪,soap|肥皂,social|社会的,society|社会,sock|袜子,soft|柔软的,soil|土壤,solar|太阳的,soldier|士兵,solid|固体,solution|解决办法,solve|解决,some|一些,somebody|某人,somehow|以某种方式,someone|某人,something|某事,sometimes|有时,somewhere|某处,song|歌曲,soon|不久,sorry|遗憾的,sort|种类,soul|灵魂,sound|声音,soup|汤,source|来源,south|南方,space|空间,spare|备用的,speak|讲话,special|特别的,specific|明确的,speech|演讲,speed|速度,spell|拼写,spend|花费,spirit|精神,split|分开,spoil|破坏,sponsor|赞助商,spoon|勺子,sport|运动,spot|发现,spread|传播,spring|春天,square|广场,stable|稳定的,staff|工作人员,stage|舞台,stair|楼梯,stamp|邮票,stand|站立,standard|标准,star|明星,stare|盯着,start|开始,state|陈述,statement|声明,station|车站,stay|停留,steady|稳定的,steal|偷,steam|蒸汽,steel|钢铁,step|步骤,stick|棍,still|静止的,stimulate|刺激,stir|搅拌,stock|股票,stomach|胃,stone|石头,stop|停止,store|存储,storm|暴风,story|故事,stove|炉子,straight|直的,strange|陌生的,strategy|战略,street|街道,strength|力量,stress|压力,stretch|伸展,strict|严格的,strike|罢工,string|线,strip|带状物,stroke|划水,strong|强壮的,struggle|奋斗,student|学生,study|学习,stuff|材料,stupid|愚蠢的,style|风格,subject|科目,submit|提交,succeed|成功,success|成功,such|这样的,sudden|突然的,suffer|遭受,sufficient|充足的,sugar|糖,suggest|建议,suit|西装,summer|夏天,summit|峰会,sun|太阳,superior|更好的,supply|供应,support|支持,suppose|假定,sure|确定的,surface|表面,surprise|惊喜,surround|环绕,survey|调查,survive|幸存,suspect|嫌疑人,suspend|暂停,sustain|维持,swallow|燕子,sweat|汗水,sweep|打扫,sweet|甜的,swim|游泳,switch|开关,symbol|象征,sympathy|同情,system|系统,table|表格,tackle|处理,tag|标签,take|拿,tale|故事,talent|才能,talk|谈话,tank|坦克,tape|磁带,target|目标,task|任务,taste|品味,tax|税,tea|茶,teach|教,team|团队,tear|撕裂,technical|技术的,technique|技巧,technology|科技,teenager|青少年,telephone|电话,television|电视,tell|告诉,temperature|温度,temporary|临时的,ten|十,tend|倾向于,term|术语,terrible|糟糕的,territory|领土,test|测试,text|文本,than|比,thank|感谢,that|那个,theme|主题,then|然后,theory|理论,there|那里,therefore|因此,these|这些,thick|厚的,thin|薄的,thing|事物,think|认为,third|第三,thirst|渴,thorough|彻底的,those|那些,though|尽管,thought|想法,thousand|千,threat|威胁,three|三,throat|喉咙,through|穿过,throughout|遍及,throw|投掷,thumb|拇指,thunder|雷,thus|这样,ticket|票,tide|潮汐,tidy|整洁的,tie|系,tight|紧的,till|直到,timing|时机,tiny|微小的,tip|尖端,tired|疲劳的,title|标题,toe|脚趾,together|一起,toilet|厕所,token|代币,tomorrow|明天,tone|音调,tongue|舌头,tonight|今晚,too|也,tool|工具,top|顶部,topic|话题,total|总计,touch|触摸,tough|艰难的,tour|旅游,tourist|游客,toward|朝向,tower|塔,town|城镇,toy|玩具,trace|追踪,track|轨道,trade|贸易,tradition|传统,traffic|交通,train|训练,transfer|转移,transform|改变,translate|翻译,transport|运输,trap|陷阱,travel|旅行,treasure|财富,treat|款待,trend|趋势,trial|试验,tribe|部落,trick|技巧,trip|旅行,trouble|麻烦,true|真的,truly|真诚地,trust|信任,truth|真相,try|尝试,tube|管道,tune|曲调,tunnel|隧道,turn|转动,twelve|十二,twenty|二十,twice|两次,twin|双胞胎,twist|扭曲,two|二,type|类型,typical|典型的,ugly|丑陋的,unable|不能的,uncle|叔叔,under|在下面,undergo|经历,understand|理解,undertake|承担,uniform|制服,unique|独特的,unit|单位,unite|团结,universal|通用的,university|大学,unless|除非,unlike|不同,until|直到,unusual|不寻常的,up|向上,upon|在...之上,upper|较高的,upset|心烦的,urban|城市的,urge|敦促,use|使用,useful|有用的,usual|通常的,utility|实用,vacant|空缺的,vacation|假期,valley|山谷,valuable|贵重的,value|价值,variable|变量,variety|多样性,various|多样的,vast|广阔的,vegetable|蔬菜,vehicle|车辆,venture|冒险,verb|动词,version|版本,very|非常,vessel|容器,veteran|退伍军人,via|经由,victim|受害者,victory|胜利,video|视频,view|视野,village|村庄,violate|违反,violence|暴力,virtual|虚拟的,virtue|美德,virus|病毒,visible|看得见的,vision|愿景,visit|访问,visual|视觉的,vital|至关重要的,voice|嗓音,vote|投票,voyage|航行,wage|工资,wait|等待,wake|醒来,walk|步行,wall|墙,wander|游荡,want|想要,war|战争,warm|温暖的,warn|警告,wash|清洗,waste|浪费,watch|观看,water|水,wave|波浪,way|方式,weak|虚弱的,wealth|财富,weapon|武器,wear|穿着,weather|天气,weave|编织,web|网络,wedding|婚礼,weed|杂草,week|星期,weekend|周末,weight|重量,welcome|欢迎,welfare|福利,well|好,west|西方,wet|湿的,whale|鲸,what|什么,whatever|无论什么,wheel|轮子,when|何时,where|哪里,whether|是否,which|哪一个,while|当...时,whisper|耳语,white|白色,who|谁,whole|整个,whom|谁（宾格）,whose|谁的,why|为什么,wide|宽的,widespread|广泛的,wife|妻子,wild|野生的,will|将会,win|赢,wind|风,window|窗户,wine|葡萄酒,wing|翅膀,winter|冬天,wipe|擦拭,wire|电线,wise|明智的,wish|希望,with|和,withdraw|撤回,within|在...内,without|没有,witness|见证,woman|女人,wonder|想知道,wonderful|美妙的,wood|木头,wool|羊毛,word|词,work|工作,worker|工人,world|世界,worry|担忧,worth|值得,would|将会,wound|伤口,wrap|包裹,write|写,wrong|错误的,yard|院子,year|年,yellow|黄色,yes|是的,yesterday|昨天,yet|还,yield|产出,young|年轻的,youth|青春,zero|零,zone|区域'
};

// 语法小课堂：24 个核心语法点
const GRAMMAR = [
  { title: 'be 动词的用法', point: 'I 用 am，you 用 are，he/she/it 用 is；复数全用 are。', ex: 'I am a student. She is my teacher.', cn: '我是学生。她是我的老师。', q: 'He ___ my friend.', opts: ['am', 'is', 'are', 'be'], ans: 1, why: 'he 是第三人称单数，用 is。' },
  { title: '一般现在时', point: '表示经常性动作。主语是第三人称单数时，动词加 -s/-es。', ex: 'I study English every day. He studies too.', cn: '我每天学英语。他也学。', q: 'She ___ to school by bike.', opts: ['go', 'goes', 'going', 'gone'], ans: 1, why: 'she 是三单，go 变 goes。' },
  { title: '现在进行时', point: 'be + 动词-ing，表示此刻正在做的事。', ex: 'I am reading a book now.', cn: '我现在正在读书。', q: 'Look! The cat ___ on the chair.', opts: ['sleep', 'sleeps', 'is sleeping', 'slept'], ans: 2, why: 'Look! 提示动作正在发生，用 is sleeping。' },
  { title: '一般过去时', point: '表示过去发生的动作，规则动词加 -ed，不规则动词需单独记。', ex: 'I visited my friend yesterday.', cn: '我昨天拜访了朋友。', q: 'I ___ TV last night.', opts: ['watch', 'watched', 'watching', 'watches'], ans: 1, why: 'last night 表示过去，用 watched。' },
  { title: '一般将来时', point: 'will + 动词原形 或 be going to + 动词原形，表示将要发生的事。', ex: 'I will study harder. / I am going to travel.', cn: '我会更努力学习。/ 我打算去旅行。', q: 'It ___ rain tomorrow.', opts: ['will', 'is', 'was', 'did'], ans: 0, why: 'tomorrow 表将来，用 will + 动词原形。' },
  { title: '名词单复数', point: '一般加 -s；以 s/x/ch/sh 结尾加 -es；不规则如 child→children。', ex: 'two books, three boxes, many children', cn: '两本书，三个盒子，许多孩子', q: 'There are three ___ on the desk.', opts: ['book', 'books', 'bookes', 'booking'], ans: 1, why: 'three 后面用复数 books。' },
  { title: '人称代词', point: '主格作主语（I/you/he/she/it/we/they），宾格作宾语（me/you/him/her/it/us/them）。', ex: 'She helps me. I help her.', cn: '她帮助我。我帮助她。', q: 'Please give ___ a pen.', opts: ['I', 'me', 'my', 'mine'], ans: 1, why: 'give 后面用宾格 me。' },
  { title: '物主代词', point: '形容词性：my/your/his/her/our/their + 名词；名词性：mine/yours/his/hers/ours/theirs。', ex: 'This is my book. The book is mine.', cn: '这是我的书。这本书是我的。', q: 'This pen is ___.', opts: ['my', 'me', 'mine', 'I'], ans: 2, why: '空格后无名词，用名词性物主代词 mine。' },
  { title: 'There be 句型', point: '表示"某地有某物"，be 与后面第一个名词保持数一致。', ex: 'There is a book on the desk.', cn: '桌上有一本书。', q: 'There ___ some water in the cup.', opts: ['is', 'are', 'have', 'has'], ans: 0, why: 'water 不可数，用 is。' },
  { title: '形容词比较级', point: '两者比较用比较级：一般加 -er，长词用 more；than 引出比较对象。', ex: 'This book is more interesting than that one.', cn: '这本书比那本更有趣。', q: 'He is ___ than his brother.', opts: ['tall', 'taller', 'tallest', 'more tall'], ans: 1, why: 'than 前用比较级 taller。' },
  { title: '形容词最高级', point: '三者及以上比较用 the + 最高级（-est / most）。', ex: 'She is the tallest girl in our class.', cn: '她是我们班最高的女孩。', q: 'This is ___ movie I have ever seen.', opts: ['good', 'better', 'the best', 'best'], ans: 2, why: 'ever seen 提示用最高级 the best。' },
  { title: '频度副词', point: 'always > usually > often > sometimes > seldom > never，一般放在实义动词前、be 动词后。', ex: 'I often get up at six.', cn: '我经常六点起床。', q: 'He ___ goes to bed before ten.', opts: ['often', 'is often', 'often is', 'does often'], ans: 0, why: '实义动词 goes 前用 often。' },
  { title: '情态动词', point: 'can/may/must/should + 动词原形，无人称变化。', ex: 'You should study hard.', cn: '你应该努力学习。', q: 'I ___ swim when I was five.', opts: ['can', 'could', 'am', 'do'], ans: 1, why: '过去的能力用 could。' },
  { title: '介词 in/on/at', point: 'in 用于大时间/地点，on 用于具体某天/表面，at 用于具体时刻/小地点。', ex: 'in the morning, on Monday, at six o clock', cn: '在早上，在周一，在六点', q: 'We have a meeting ___ Monday.', opts: ['in', 'on', 'at', 'for'], ans: 1, why: '具体星期几用 on。' },
  { title: '疑问词与特殊疑问句', point: 'what/who/where/when/why/how + 一般疑问句语序（疑问词+助动词+主语+动词）。', ex: 'Where do you live?', cn: '你住在哪里？', q: '___ do you go to school? - By bus.', opts: ['What', 'How', 'Where', 'When'], ans: 1, why: '回答是方式 By bus，用 How 提问。' },
  { title: '现在完成时', point: 'have/has + 过去分词，表示过去动作对现在的影响，常与 already/yet/since/for 连用。', ex: 'I have learned 500 words.', cn: '我已经学了 500 个单词。', q: 'I ___ my homework already.', opts: ['finish', 'finished', 'have finished', 'will finish'], ans: 2, why: 'already 常与现在完成时连用。' },
  { title: '过去进行时', point: 'was/were + 动词-ing，表示过去某一时刻正在进行的动作。', ex: 'I was studying at eight last night.', cn: '昨晚八点我正在学习。', q: 'They ___ football when it rained.', opts: ['play', 'were playing', 'played', 'are playing'], ans: 1, why: 'when 引导的过去时间点用过去进行时。' },
  { title: '被动语态', point: 'be + 过去分词，表示"被……"。', ex: 'English is spoken worldwide.', cn: '英语在世界范围内被使用。', q: 'The window ___ by Tom yesterday.', opts: ['breaks', 'broke', 'was broken', 'is breaking'], ans: 2, why: '窗户是被打破的，且是过去，用 was broken。' },
  { title: '不定式 to do', point: '作宾语、目的状语或后置定语；want/decide/hope + to do。', ex: 'I want to improve my English.', cn: '我想提高英语。', q: 'He decided ___ harder.', opts: ['study', 'to study', 'studying', 'studied'], ans: 1, why: 'decide 后接 to do。' },
  { title: '动名词 doing', point: 'enjoy/finish/avoid/mind/practice + doing；介词后也用 doing。', ex: 'I enjoy reading English stories.', cn: '我喜欢读英语故事。', q: 'She practices ___ every day.', opts: ['speak', 'to speak', 'speaking', 'spoke'], ans: 2, why: 'practice 后接动名词 speaking。' },
  { title: '宾语从句', point: '注意三要素：引导词、语序（陈述句语序）、时态呼应。', ex: 'I think that English is useful.', cn: '我认为英语很有用。', q: 'I don t know ___ he will come.', opts: ['that', 'whether', 'what', 'which'], ans: 1, why: '表示"是否"用 whether。' },
  { title: '定语从句', point: 'who 指人，which 指物，that 可指人或物；先行词在从句中作主语不可省略。', ex: 'The boy who is speaking is my brother.', cn: '正在说话的男孩是我弟弟。', q: 'This is the book ___ I bought yesterday.', opts: ['who', 'which', 'what', 'whom'], ans: 1, why: '先行词 book 是物，用 which/that。' },
  { title: '状语从句', point: 'because 原因，if 条件，when/while 时间，although 让步，so that 目的/结果。', ex: 'If you study hard, you will pass.', cn: '如果你努力，就会通过。', q: '___ he was tired, he kept working.', opts: ['Because', 'Although', 'If', 'When'], ans: 1, why: '前后是让步关系，用 Although。' },
  { title: '虚拟语气', point: 'If I were... 表示与事实相反；wish 后的从句也常用虚拟语气。', ex: 'If I were you, I would study harder.', cn: '如果我是你，我会更努力。', q: 'If I ___ you, I would take the chance.', opts: ['am', 'was', 'were', 'be'], ans: 2, why: '与现在事实相反，be 动词用 were。' }
];

// 听力句子库：英文句子 + 中文意思（配合语音朗读做听音选义）
const LISTEN_BANK = [
  ['Good morning, how are you today?', '早上好，你今天怎么样？'],
  ['My name is Lily and I am a student.', '我叫莉莉，是一名学生。'],
  ['I usually get up at seven o clock.', '我通常七点起床。'],
  ['The weather is sunny and warm today.', '今天天气晴朗温暖。'],
  ['Would you like a cup of tea?', '你想来杯茶吗？'],
  ['I go to school by bike every day.', '我每天骑自行车上学。'],
  ['She is reading a book in the library.', '她正在图书馆看书。'],
  ['We had a great time at the weekend.', '我们周末玩得很开心。'],
  ['Can you help me with my homework?', '你能帮我做作业吗？'],
  ['The train will leave at half past eight.', '火车将在八点半出发。'],
  ['I want to improve my spoken English.', '我想提高我的英语口语。'],
  ['Practice makes perfect, so keep going.', '熟能生巧，所以坚持下去。'],
  ['There is a cat sleeping on the sofa.', '有只猫正在沙发上睡觉。'],
  ['I have been learning English for six months.', '我已经学英语六个月了。'],
  ['If you need help, just call me.', '如果需要帮助，打电话给我。'],
  ['The meeting has been moved to Friday.', '会议已经改到星期五。'],
  ['She suggested taking a walk after dinner.', '她建议晚饭后散步。'],
  ['I am afraid I cannot come tomorrow.', '恐怕我明天不能来了。'],
  ['This book is worth reading twice.', '这本书值得读两遍。'],
  ['Hard work always pays off in the end.', '努力最终总会有回报。'],
  ['Could you speak a little more slowly?', '你能说慢一点吗？'],
  ['I look forward to hearing from you.', '期待你的回信。'],
  ['The new method is more efficient.', '这个新方法更高效。'],
  ['He was late because of the heavy traffic.', '他因为交通拥堵迟到了。'],
  ['English is spoken in many countries.', '许多国家都说英语。'],
  ['I plan to pass the CET-4 exam next year.', '我计划明年通过四级考试。'],
  ['Reading aloud helps me remember words.', '朗读帮助我记单词。'],
  ['Please turn off the light when you leave.', '离开时请关灯。'],
  ['My favorite subject is English.', '我最喜欢的科目是英语。'],
  ['Nothing is impossible if you try your best.', '只要尽力，没有什么是不可能的。']
];

// 阅读短文（分难度）
const PASSAGES = [
  { lvl: 1, title: 'My Day', text: 'I get up at six every morning. I have breakfast and then go to school. I like English class very much. After school, I play football with my friends. In the evening, I read a book and go to bed at nine.', cn: '我每天早上六点起床。我吃早饭然后去上学。我非常喜欢英语课。放学后我和朋友踢足球。晚上我读书，九点睡觉。', qs: [{ q: 'When does the writer get up?', opts: ['At five', 'At six', 'At seven', 'At nine'], ans: 1 }, { q: 'What does the writer do after school?', opts: ['Reads a book', 'Plays football', 'Watches TV', 'Sleeps'], ans: 1 }] },
  { lvl: 1, title: 'A Little Cat', text: 'There is a little cat in my home. It is white and black. It likes milk and fish. It sleeps in the afternoon. I love my cat very much. It is my best friend.', cn: '我家有一只小猫。它是黑白相间的。它喜欢牛奶和鱼。它下午睡觉。我非常爱我的猫。它是我最好的朋友。', qs: [{ q: 'What color is the cat?', opts: ['White', 'Black', 'White and black', 'Brown'], ans: 2 }, { q: 'What does the cat like?', opts: ['Milk and fish', 'Rice', 'Apples', 'Bread'], ans: 0 }] },
  { lvl: 2, title: 'My Friend Tom', text: 'Tom is my best friend. He is tall and friendly. He studies hard and often helps me with my English. Last Sunday, we went to the park together. We played football and had a picnic. We were very happy.', cn: '汤姆是我最好的朋友。他又高又友好。他学习努力，经常帮我学英语。上周日我们一起去公园。我们踢足球、野餐。我们非常开心。', qs: [{ q: 'What does Tom often help the writer with?', opts: ['Math', 'English', 'Sports', 'Music'], ans: 1 }, { q: 'Where did they go last Sunday?', opts: ['To the zoo', 'To the park', 'To school', 'To the library'], ans: 1 }] },
  { lvl: 2, title: 'A Rainy Day', text: 'It rained heavily yesterday. I stayed at home and read my favorite book. My mother made some hot tea for me. Although I could not go out, I felt very relaxed. Sometimes a rainy day is really nice.', cn: '昨天雨下得很大。我待在家里读我最喜欢的书。妈妈给我泡了热茶。虽然我不能出门，但我觉得很放松。有时雨天真的很美好。', qs: [{ q: 'What did the writer do yesterday?', opts: ['Went out', 'Read a book', 'Played football', 'Watched a movie'], ans: 1 }, { q: 'How did the writer feel?', opts: ['Sad', 'Angry', 'Relaxed', 'Tired'], ans: 2 }] },
  { lvl: 3, title: 'The Power of Habits', text: 'Good habits shape our lives. If you read for twenty minutes every day, you will finish many books in a year. Small steps, repeated daily, lead to great changes. Remember, success is not an accident but a result of consistent effort.', cn: '好习惯塑造我们的人生。如果每天阅读二十分钟，一年就能读完很多书。小小的步骤，日复一日，会带来巨大的改变。记住，成功不是偶然，而是持续努力的结果。', qs: [{ q: 'What is the main idea of the passage?', opts: ['Reading is difficult', 'Small daily steps lead to big changes', 'Success is luck', 'Books are expensive'], ans: 1 }, { q: 'According to the passage, success is a result of ___', opts: ['luck', 'consistent effort', 'money', 'talent only'], ans: 1 }] },
  { lvl: 3, title: 'Learning a Language', text: 'Many people think learning a language is hard. In fact, the key is daily practice. Listening and speaking are as important as reading and writing. Do not be afraid of making mistakes, because every mistake teaches you something new.', cn: '很多人认为学语言很难。事实上，关键是每天练习。听说和读写一样重要。不要害怕犯错，因为每个错误都教会你新东西。', qs: [{ q: 'What is the key to language learning?', opts: ['Talent', 'Daily practice', 'Expensive courses', 'Good memory'], ans: 1 }, { q: 'What should we do with mistakes?', opts: ['Avoid them', 'Learn from them', 'Forget them', 'Be afraid'], ans: 1 }] },
  { lvl: 4, title: 'Why Reading Matters', text: 'Reading is one of the most valuable habits a person can develop. It broadens our horizons, improves our vocabulary, and teaches us to think critically. In a world full of short videos, the ability to focus on a long text has become a rare and powerful skill.', cn: '阅读是人能养成的最有价值的习惯之一。它开阔视野、扩充词汇，并教会我们批判性思考。在这个充满短视频的世界里，专注长文本的能力已成为稀有而强大的技能。', qs: [{ q: 'Which is NOT mentioned as a benefit of reading?', opts: ['Broadening horizons', 'Improving vocabulary', 'Critical thinking', 'Making money quickly'], ans: 3 }, { q: 'What has become rare according to the passage?', opts: ['Short videos', 'Focusing on long texts', 'Reading books', 'Vocabulary'], ans: 1 }] },
  { lvl: 4, title: 'The Future of Work', text: 'Technology is changing the way we work. Some jobs will disappear, while new ones will be created. The most important skill for the future is the ability to keep learning. Those who adapt quickly will find more opportunities in the changing world.', cn: '科技正在改变我们的工作方式。一些工作会消失，同时新工作会出现。未来最重要的技能是持续学习的能力。那些快速适应的人会在变化的世界中找到更多机会。', qs: [{ q: 'What is the most important skill for the future?', opts: ['Memorizing facts', 'Keeping learning', 'Avoiding technology', 'Working alone'], ans: 1 }, { q: 'Who will find more opportunities?', opts: ['Those who adapt quickly', 'Those who resist change', 'Only young people', 'Only experts'], ans: 0 }] }
];

// 口语话题
const SPEAK_TOPICS = [
  { q: 'Please introduce yourself in English.', sample: 'Hello! My name is Li Ming. I am a student. I like reading and music. Nice to meet you!', cn: '你好！我叫李明。我是学生。我喜欢阅读和音乐。很高兴认识你！' },
  { q: 'What do you usually do in the morning?', sample: 'I usually get up at six, brush my teeth, and have breakfast. Then I go to school.', cn: '我通常六点起床、刷牙、吃早餐，然后去上学。' },
  { q: 'What is your favorite food?', sample: 'My favorite food is noodles. My mother makes very delicious noodles.', cn: '我最喜欢的食物是面条。我妈妈做的面条非常美味。' },
  { q: 'Describe your best friend.', sample: 'My best friend is Tom. He is tall and funny. We often play football together.', cn: '我最好的朋友是汤姆。他又高又有趣。我们经常一起踢足球。' },
  { q: 'Why do you want to learn English?', sample: 'I want to learn English because it helps me read more books and communicate with people from other countries.', cn: '我想学英语，因为它能帮我读更多书，和外国朋友交流。' },
  { q: 'What did you do last weekend?', sample: 'Last weekend I visited my grandparents. We had a big dinner and watched TV together.', cn: '上周末我去看望了祖父母。我们吃了大餐，一起看了电视。' },
  { q: 'What is your dream job?', sample: 'My dream job is to be an engineer. I want to build useful things for people.', cn: '我梦想的工作是工程师。我想为人们建造有用的东西。' },
  { q: 'How do you keep healthy?', sample: 'I keep healthy by exercising every day and eating more vegetables and fruit.', cn: '我通过每天锻炼、多吃蔬菜水果来保持健康。' },
  { q: 'Do you like reading? Why?', sample: 'Yes, I do. Reading opens a new world for me and helps me relax.', cn: '喜欢。阅读为我打开新世界，也帮我放松。' },
  { q: 'What will you do tomorrow?', sample: 'Tomorrow I will study English for thirty minutes and then play basketball with friends.', cn: '明天我会学三十分钟英语，然后和朋友打篮球。' },
  { q: 'Describe your hometown.', sample: 'My hometown is a small city. It is clean and quiet. There is a beautiful park near my home.', cn: '我的家乡是个小城市。干净又安静。我家附近有个漂亮的公园。' },
  { q: 'What do you think of the Internet?', sample: 'The Internet is very useful, but we should not spend too much time on it.', cn: '互联网非常有用，但我们不该在上面花太多时间。' }
];

// 每日鼓励语
const QUOTES = [
  'Every day is a new chance. 每一天都是新的机会。',
  'Small steps, big changes. 小小步伐，大大改变。',
  'Believe in yourself! 相信自己！',
  'Practice makes perfect. 熟能生巧。',
  'You are better than yesterday. 你比昨天更棒了。',
  'Never stop learning. 永远不要停止学习。',
  'The future belongs to those who prepare. 未来属于有准备的人。',
  'One more word, one more step. 多记一个词，就多走一步。',
  'Mistakes are proof that you are trying. 犯错说明你在努力。',
  'Keep going, you are doing great! 继续加油，你做得很棒！',
  'A little progress each day adds up. 每天一点进步，终会汇聚成河。',
  'Your effort will pay off. 你的努力会有回报。',
  'Learning is a gift you give yourself. 学习是你送给自己的礼物。',
  'Two years from now, you will thank yourself. 两年后，你会感谢现在的自己。',
  'English is your bridge to the world. 英语是你通往世界的桥。',
  'Show up today, win tomorrow. 今天出现，明天赢。',
  'You can do hard things. 你能做到困难的事。',
  'Consistency beats talent. 坚持胜过天赋。',
  'Make today count! 让今天算数！',
  'The best time to start was yesterday. The second best is now. 最好的开始是昨天，其次是现在。'
];

// 两年四阶段规划
const PHASES = [
  { id: 1, name: '启蒙筑基期', days: [1, 90], goal: '字母音 + 44 个音标 + 基础词', desc: '字母名已认识，不再重复认；先补字母音，再系统学 44 个音标，用自然拼读把音和词连起来。听力从听音辨音起步，词攒够了再听句子。', focus: ['26 个字母音与书写', '44 个国际音标', '自然拼读入门', '基础词反复巩固'], color: 'mint' },
  { id: 2, name: '能力成长期', days: [91, 365], goal: '核心词汇 1800 + 基础语法 + 听说入门', desc: '系统学习基础语法，词汇量扩展到 1800，开始听力磨耳和短文阅读，能进行简单自我介绍。', focus: ['基础语法 24 讲', '核心词汇 1800', '每日听力 10 分钟', '短文阅读与朗读'], color: 'blue' },
  { id: 3, name: '四级进阶期', days: [366, 547], goal: '四级大纲 4540 词 + 题型专项训练', desc: '进入四级核心词汇与长难句，按题型训练听力、阅读、写作、翻译，建立错题本。', focus: ['四级高频词 1700', '长难句分析', '听力精听训练', '写作模板积累'], color: 'violet' },
  { id: 4, name: '冲刺通关期', days: [548, 730], goal: '真题模考 + 弱项突破 + 稳定过级', desc: '每周真题模考，查漏补缺，背诵写作/翻译万能句型，调整作息，自信迎考。', focus: ['历年真题模考', '高频词再巩固', '写作翻译模板', '弱项专项突破'], color: 'orange' }
];

// 每日学习任务模板（按星期轮换）
const WEEK_ROUTINE = [
  { day: 1, name: '单词日', icon: '📖', focus: 'words' },
  { day: 2, name: '语法日', icon: '🧩', focus: 'grammar' },
  { day: 3, name: '听力日', icon: '🎧', focus: 'listening' },
  { day: 4, name: '阅读日', icon: '📚', focus: 'reading' },
  { day: 5, name: '口语日', icon: '🎤', focus: 'speaking' },
  { day: 6, name: '闯关日', icon: '🎮', focus: 'game' },
  { day: 0, name: '轻松复盘日', icon: '🌈', focus: 'review' }
];

// 徽章定义
function badgeDay(s, c) { const t = s.targetDays || 730; return Math.round((c - 1) * (t - 1) / 729) + 1; }
const BADGES = [
  { id: 'first', icon: '🌱', name: '启程之芽', desc: '完成第一天学习', check: s => (s.dayIndex || 0) >= 1 },
  { id: 'streak7', icon: '🔥', name: '七日之火', desc: '连续学习 7 天', check: s => s.bestStreak >= 7 },
  { id: 'streak30', icon: '💎', name: '三十天钻石', desc: '连续学习 30 天', check: s => s.bestStreak >= 30 },
  { id: 'words100', icon: '📖', name: '百词通', desc: '掌握 100 个单词', check: s => Object.keys(s.learnedWords).length >= 100 },
  { id: 'words500', icon: '📚', name: '词汇达人', desc: '掌握 500 个单词', check: s => Object.keys(s.learnedWords).length >= 500 },
  { id: 'xp1000', icon: '⭐', name: '千星闪耀', desc: '累计获得 1000 XP', check: s => s.xp >= 1000 },
  { id: 'phase2', icon: '🚀', name: '破茧而出', desc: '进入第二阶段', check: s => s.dayIndex >= badgeDay(s, 90) },
  { id: 'phase3', icon: '🏔️', name: '四级在望', desc: '进入第三阶段', check: s => s.dayIndex >= badgeDay(s, 365) },
  { id: 'phase4', icon: '🏆', name: '冲刺冠军', desc: '进入最终冲刺阶段', check: s => s.dayIndex >= badgeDay(s, 547) },
  { id: 'finish', icon: '🎓', name: '四级通关', desc: '完成全部计划', check: s => s.dayIndex >= (s.targetDays || 730) },
  { id: 'comeback', icon: '🌈', name: '回归勇士', desc: '断签 3 天以上后重新完成全天任务', check: s => s.comebackDone >= 1 }
];

// 工具函数：为批量导入词生成一条可朗读的学习例句（无数据时的兜底）
function makeStudyExample(w, cn) {
  const templates = [
    ['I am learning the word "' + w + '" today.', '我今天在学习单词 ' + w + '（' + cn + '）。'],
    ['Do you remember the word "' + w + '"?', '你记得 ' + w + ' 这个单词吗？（' + cn + '）'],
    ['Let us review "' + w + '" together.', '我们一起复习 ' + w + ' 吧。（' + cn + '）'],
    ['The word "' + w + '" is on my study list.', '单词 ' + w + ' 在我的学习清单里。（' + cn + '）']
  ];
  let sum = 0;
  for (let i = 0; i < w.length; i++) sum = (sum * 31 + w.charCodeAt(i)) >>> 0;
  const pair = templates[sum % templates.length];
  return { ex:pair[0], cnEx:pair[1] };
}
// 四级大纲词的学习例句表：单词|英文例句|中文提示
const CET4_EXAMPLE_MAP = (function () {
  const m = {};
  const raw = (typeof CET4_EXAMPLES !== 'undefined' ? CET4_EXAMPLES : '');
  raw.split(',').forEach(pair => {
    const p = pair.split('|');
    if (p.length >= 3) m[p[0]] = { ex:p[1], cnEx:p[2] };
  });
  return m;
})();
// 工具函数：把紧凑词串解析为对象
function parseExtraWords(str, lvl) {
  if (!str) return [];
  return str.split(',').map(pair => {
    const parts = pair.split('|');
    if (parts.length < 2) return null;
    const three = parts.length >= 3 && parts[1].indexOf('/') === 0;
    const w = parts[0];
    const cn = three ? parts.slice(2).join('|') : parts.slice(1).join('|');
    const exInfo = CET4_EXAMPLE_MAP[w] || makeStudyExample(w, cn);
    return {
      w: w,
      ph: three ? parts[1] : '',
      cn: cn,
      ex: exInfo.ex, cnEx: exInfo.cnEx, lvl
    };
  }).filter(Boolean);
}

// 合并所有词库并按单词去重（先出现的核心词保留音标与例句）
const ALL_WORDS = (function () {
  const seen = {}, out = [];
  [WORDS, parseExtraWords(EXTRA_WORDS[3], 3), parseExtraWords(EXTRA_WORDS[4], 4),
    parseExtraWords(EXTRA_WORDS.cet4, 3)].forEach(arr => arr.forEach(w => {
      const k = String(w.w || '').toLowerCase();
      if (!k || seen[k]) return;
      seen[k] = 1; out.push(w);
    }));
  return out;
})();

/* 情景口语对话脚本：按学习进度分三档，每档多个场景，每次 4 轮。
   keys = 可接受的关键词（命中任意 1 个即算答对，need 可指定需命中个数）；sample = 参考回答 */
const DIALOGUE_SCENES = {
  starter: [
    { id:'meet', title:'第一次见面', emoji:'👋', turns:[
      { sys:'Hello! Nice to meet you.', cn:'你好！很高兴认识你。', keys:['hello','hi','nice','meet'], sample:'Hello! Nice to meet you, too.', sampleCn:'你好！我也很高兴认识你。', tip:'可以回答 Hello / Hi / Nice to meet you, too.' },
      { sys:'What is your name?', cn:'你叫什么名字？', keys:['my','name','i am'], sample:'My name is Li Ming.', sampleCn:'我叫李明。', tip:'My name is ... / I am ...' },
      { sys:'How are you today?', cn:'你今天怎么样？', keys:['fine','good','great','ok','happy'], sample:'I am fine, thank you.', sampleCn:'我很好，谢谢。', tip:'I am fine / I am good.' },
      { sys:'Goodbye! See you tomorrow.', cn:'再见！明天见。', keys:['bye','goodbye','see you'], sample:'Goodbye! See you tomorrow.', sampleCn:'再见！明天见。', tip:'Goodbye / Bye / See you.' }
    ]},
    { id:'school', title:'我的文具', emoji:'✏️', turns:[
      { sys:'What is this?', cn:'这是什么？', keys:['book','pen','pencil','ruler','bag','it is'], sample:'It is a book.', sampleCn:'它是一本书。', tip:'It is a ...（用你学过的文具单词）' },
      { sys:'Is this your pen?', cn:'这是你的钢笔吗？', keys:['yes','no','is','it'], sample:'Yes, it is.', sampleCn:'是的，它是。', tip:'Yes, it is. / No, it is not.' },
      { sys:'What color is it?', cn:'它是什么颜色？', keys:['red','blue','green','black','white','yellow','color'], sample:'It is blue.', sampleCn:'它是蓝色的。', tip:'It is + 颜色词.' },
      { sys:'Thank you very much.', cn:'非常感谢。', keys:['welcome','not at all','thanks'], sample:'You are welcome.', sampleCn:'不客气。', tip:'You are welcome.' }
    ]},
    { id:'likes', title:'我喜欢', emoji:'🍎', turns:[
      { sys:'Do you like apples?', cn:'你喜欢苹果吗？', keys:['yes','no','like','do'], sample:'Yes, I do. I like apples.', sampleCn:'是的，我喜欢苹果。', tip:'Yes, I do. / No, I do not.' },
      { sys:'What is your favorite color?', cn:'你最喜欢什么颜色？', keys:['favorite','like','blue','red','green','yellow'], sample:'My favorite color is blue.', sampleCn:'我最喜欢的颜色是蓝色。', tip:'My favorite color is ...' },
      { sys:'Can you swim?', cn:'你会游泳吗？', keys:['yes','no','can','swim'], sample:'Yes, I can swim.', sampleCn:'是的，我会游泳。', tip:'Yes, I can. / No, I cannot.' },
      { sys:'Let us go to school together.', cn:'我们一起去上学吧。', keys:['ok','yes','great','sure','let us'], sample:'OK! Let us go.', sampleCn:'好！我们走吧。', tip:'OK / Sure / Great!' }
    ]}
  ],
  builder: [
    { id:'morning', title:'早晨日常', emoji:'🌅', turns:[
      { sys:'What do you usually do in the morning?', cn:'你早上通常做什么？', keys:['get up','brush','breakfast','school','usually'], sample:'I usually get up at six and have breakfast.', sampleCn:'我通常六点起床，然后吃早餐。', tip:'I usually + 你学过的动作.' },
      { sys:'What time do you get up?', cn:'你几点起床？', keys:['six','seven','at','oclock','early'], sample:'I get up at six o clock.', sampleCn:'我六点起床。', tip:'I get up at + 时间.' },
      { sys:'How do you go to school?', cn:'你怎么去上学？', keys:['bus','bike','walk','foot','car','school'], sample:'I go to school by bike.', sampleCn:'我骑自行车上学。', tip:'by bus / by bike / on foot.' },
      { sys:'Are you happy at school?', cn:'你在学校开心吗？', keys:['yes','happy','fun','friends','no'], sample:'Yes, I am happy. I have many friends.', sampleCn:'是的，我很开心，我有很多朋友。', tip:'Yes, I am happy because ...' }
    ]},
    { id:'food', title:'最喜欢的食物', emoji:'🍜', turns:[
      { sys:'What is your favorite food?', cn:'你最喜欢的食物是什么？', keys:['favorite','noodles','rice','fish','chicken','like'], sample:'My favorite food is noodles.', sampleCn:'我最喜欢的食物是面条。', tip:'My favorite food is ...' },
      { sys:'Why do you like it?', cn:'你为什么喜欢它？', keys:['because','delicious','taste','mother','good'], sample:'Because it is delicious.', sampleCn:'因为它很好吃。', tip:'Because it is ...' },
      { sys:'Who makes it for you?', cn:'谁给你做这个？', keys:['mother','mom','father','dad','grandma','i do'], sample:'My mother makes it for me.', sampleCn:'我妈妈做给我吃。', tip:'My ... makes it for me.' },
      { sys:'Do you like vegetables?', cn:'你喜欢蔬菜吗？', keys:['yes','no','vegetables','healthy','like'], sample:'Yes, they are healthy.', sampleCn:'是的，它们很健康。', tip:'Yes, I do. They are healthy.' }
    ]},
    { id:'friend', title:'我的好朋友', emoji:'👫', turns:[
      { sys:'Who is your best friend?', cn:'你最好的朋友是谁？', keys:['friend','my','tom','li','he','she'], sample:'My best friend is Tom.', sampleCn:'我最好的朋友是汤姆。', tip:'My best friend is ...' },
      { sys:'What does he look like?', cn:'他长什么样？', keys:['tall','short','thin','funny','handsome','hair'], sample:'He is tall and funny.', sampleCn:'他又高又有趣。', tip:'He is + 外貌词.' },
      { sys:'What do you do together?', cn:'你们一起做什么？', keys:['play','football','study','read','together','often'], sample:'We often play football together.', sampleCn:'我们经常一起踢足球。', tip:'We often + 活动 + together.' },
      { sys:'Why do you like him?', cn:'你为什么喜欢他？', keys:['because','kind','help','fun','nice','good'], sample:'Because he is kind and funny.', sampleCn:'因为他善良又有趣。', tip:'Because he is ...' }
    ]},
    { id:'weekend', title:'上周末', emoji:'📅', turns:[
      { sys:'What did you do last weekend?', cn:'你上周末做了什么？', keys:['visited','went','played','watched','last','weekend'], sample:'I visited my grandparents.', sampleCn:'我去看望了祖父母。', tip:'I + 过去式 ...' },
      { sys:'Where did you go?', cn:'你去哪儿了？', keys:['park','home','grandparents','school','there','to'], sample:'I went to the park.', sampleCn:'我去了公园。', tip:'I went to + 地点.' },
      { sys:'Did you have a good time?', cn:'你玩得开心吗？', keys:['yes','fun','great','happy','no','good'], sample:'Yes, I had a great time.', sampleCn:'是的，我玩得很开心。', tip:'Yes, I had fun.' },
      { sys:'What will you do next weekend?', cn:'下周末你打算做什么？', keys:['will','going','study','play','read','tomorrow'], sample:'I will read books at home.', sampleCn:'我会在家看书。', tip:'I will ...' }
    ]}
  ],
  fluent: [
    { id:'dream', title:'梦想的工作', emoji:'🚀', turns:[
      { sys:'What is your dream job?', cn:'你梦想的工作是什么？', keys:['dream','want','be','engineer','teacher','doctor','job'], sample:'My dream job is to be an engineer.', sampleCn:'我梦想的工作是当工程师。', tip:'My dream job is to be a ...' },
      { sys:'Why do you want that job?', cn:'你为什么想要那份工作？', keys:['because','like','help','people','interesting','build'], sample:'Because I want to build useful things.', sampleCn:'因为我想建造有用的东西。', tip:'Because I want to ...' },
      { sys:'What skills do you need?', cn:'你需要哪些技能？', keys:['english','skill','learn','hard','work','study','need'], sample:'I need good English and hard work.', sampleCn:'我需要好英语和努力练习。', tip:'I need ...' },
      { sys:'How will you make it come true?', cn:'你打算怎么实现它？', keys:['study','practice','work','learn','every day','will'], sample:'I will study hard and practice every day.', sampleCn:'我会努力学习，每天练习。', tip:'I will + 行动.' }
    ]},
    { id:'health', title:'保持健康', emoji:'💪', turns:[
      { sys:'How do you keep healthy?', cn:'你怎么保持健康？', keys:['exercise','vegetables','fruit','healthy','sleep','every day'], sample:'I exercise every day and eat more vegetables.', sampleCn:'我每天锻炼，多吃蔬菜。', tip:'I + 习惯.' },
      { sys:'How many hours do you sleep?', cn:'你睡几个小时？', keys:['eight','seven','hours','sleep','about'], sample:'I sleep about eight hours.', sampleCn:'我大约睡八小时。', tip:'I sleep about + 数字 + hours.' },
      { sys:'Do you think junk food is bad?', cn:'你觉得垃圾食品不好吗？', keys:['yes','bad','health','no','sometimes','little'], sample:'Yes, too much junk food is bad for health.', sampleCn:'是的，吃太多垃圾食品对健康不好。', tip:'Yes, because ... / No, but ...' },
      { sys:'What advice do you have for others?', cn:'你有什么建议给别人？', keys:['should','eat','sleep','every','advice','exercise'], sample:'They should exercise and sleep early.', sampleCn:'他们应该锻炼并早点睡。', tip:'They should ...' }
    ]},
    { id:'internet', title:'谈谈互联网', emoji:'🌐', turns:[
      { sys:'What do you use the Internet for?', cn:'你用互联网做什么？', keys:['study','read','learn','watch','music','internet'], sample:'I use it to study and listen to music.', sampleCn:'我用它学习和听音乐。', tip:'I use it to ...' },
      { sys:'Is the Internet good for students?', cn:'互联网对学生有好处吗？', keys:['yes','useful','help','information','no','but'], sample:'Yes, it helps me find information.', sampleCn:'是的，它帮我查找资料。', tip:'Yes, because ... / No, but ...' },
      { sys:'How much time do you spend online?', cn:'你每天上网多久？', keys:['hour','minutes','about','one','two','every day'], sample:'About one hour every day.', sampleCn:'大约每天一小时。', tip:'About + 时间 + every day.' },
      { sys:'How can we use it wisely?', cn:'我们怎样明智地使用它？', keys:['should','time','not too much','plan','learn','use'], sample:'We should plan our time and not spend too much.', sampleCn:'我们应该规划时间，不要花太多。', tip:'We should ...' }
    ]},
    { id:'hometown', title:'我的家乡', emoji:'🏡', turns:[
      { sys:'Where is your hometown?', cn:'你的家乡在哪儿？', keys:['hometown','city','small','in','north','south'], sample:'My hometown is a small city.', sampleCn:'我的家乡是个小城市。', tip:'My hometown is ...' },
      { sys:'What is it famous for?', cn:'它以什么闻名？', keys:['famous','food','park','river','mountain','people'], sample:'It is famous for a beautiful park.', sampleCn:'它因一个漂亮的公园而闻名。', tip:'It is famous for ...' },
      { sys:'What do you like most about it?', cn:'你最喜欢它什么？', keys:['like','clean','quiet','people','park','love','best'], sample:'I like its clean air and quiet streets.', sampleCn:'我喜欢它干净的空气和安静的街道。', tip:'I like ...' },
      { sys:'Would you like to live there in the future?', cn:'将来你想住在那儿吗？', keys:['yes','no','future','back','live','home'], sample:'Yes, I would like to live there again.', sampleCn:'是的，我还想住在那里。', tip:'Yes, I would ... / No, I want to ...' }
    ]}
  ]
};
