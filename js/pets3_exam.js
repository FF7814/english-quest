/* 英语启航 - 全国英语等级考试三级（PETS-3）备考题库
   笔试结构：听力理解 / 英语知识运用（完形填空）/ 阅读理解 / 阅读配伍 /
   短文改错 / 短文写作，另含口试模拟。全部离线可用，带答案与中文解析。
   难度定位：高中后至大专两年水平，约 2000 词。 */

// ============ 备考目标配置 ============
// 官方 2028 年 3 月公告未出，按 2025(3/22)、2026(3/21) 上半年笔试均在 3 月第三个周六推算
const PETS3_EXAM_DATE = '2028-03-18';
const PETS3_DAYS = 476;
const PETS3_PHASES = [
  { id:1, name:'启蒙筑基期', days:[1,60], goal:'音标 + 基础词汇 + 简单句', desc:'先用两个月补齐音标与拼读，掌握 PETS-3 所需的基础高频词和简单句结构，同时熟悉数字、时间、方位等听力常考表达，为后续题型打底。', focus:['音标与自然拼读','基础高频词','简单句五大句型','数字 / 时间表达'], color:'mint' },
  { id:2, name:'词汇语法期', days:[61,180], goal:'核心词 2000 + 基础语法', desc:'系统铺开约 2000 个核心词，重点攻克时态、语态、从句、非谓语和词性转换——这些是英语知识运用与短文改错的必考内容，并辅以分级阅读。', focus:['核心词 2000','时态与语态','三大从句','词性转换 / 非谓语'], color:'blue' },
  { id:3, name:'题型专项期', days:[181,380], goal:'笔试五大题型 + 写作口试逐个攻克', desc:'按 PETS-3 真实题型轮训听力、完形填空、阅读理解、阅读配伍、短文改错与短文写作，练定位、同义替换和语法判断，并准备口试常用表达。', focus:['听力技巧','完形与阅读','阅读配伍 / 短文改错','写作与口试'], color:'violet' },
  { id:4, name:'真题冲刺期', days:[381,476], goal:'整套真题模考 + 写作口语模板', desc:'最后三个多月每周做整套限时模考，按 100 分制估分，整理错题与高频错词，默写作文模板、打磨口试应答，目标稳定 60 分以上进考场。', focus:['整套限时模考','错题与高频词','写作 / 口语模板','60 分达标'], color:'orange' }
];
// PETS-3 七大训练模式 + 完整模考（8 天一循环）
const PETS3_TYPE_MODES = [
  { mod:'pets3Listening', name:'听力理解', icon:'🎧', xp:20 },
  { mod:'pets3Use', name:'英语知识运用', icon:'🔤', xp:20 },
  { mod:'pets3Reading', name:'阅读理解', icon:'📚', xp:20 },
  { mod:'pets3Match', name:'阅读配伍', icon:'🧩', xp:20 },
  { mod:'pets3Error', name:'短文改错', icon:'✏️', xp:20 },
  { mod:'pets3Writing', name:'短文写作', icon:'✍️', xp:20 },
  { mod:'pets3Speaking', name:'口试模拟', icon:'🎤', xp:20 },
  { mod:'pets3Mock', name:'完整模考', icon:'📝', xp:30 }
];

// ============ 题型一：听力理解（短对话 / 独白，四选一）============
const PETS3_LISTENING = [
  { id:'L1', title:'At the Airport', qs:[
    { q:'Where does this conversation most probably take place?', opts:['At a railway station','At the airport','At a hotel','In a bank'], ans:1, why:'对话中出现 ticket、passport、luggage、flight、Gate 12，可判断在机场。', audio:'W: Good morning, sir. May I see your ticket and passport?' },
    { q:'What does the woman ask the man to do first?', opts:['Show his ticket and passport','Open his luggage','Pay for the ticket','Choose a seat'], ans:0, why:'女士第一句说 "May I see your ticket and passport?"。', audio:'W: May I see your ticket and passport? M: Of course, here you are.' },
    { q:'Does the man have anything to declare?', opts:['Yes, some gifts','Yes, a watch','No, he has nothing','The woman does not ask'], ans:2, why:'男士回答 "No, I have nothing to declare."。', audio:'W: Do you have anything to declare? M: No, I have nothing to declare.' },
    { q:'What time does the flight leave?', opts:['8:30','9:30','10:30','12:10'], ans:2, why:'原文 "Your flight leaves at ten thirty"。', audio:'Your flight leaves at ten thirty from Gate 12.' },
    { q:'Which gate will the man go to?', opts:['Gate 2','Gate 10','Gate 12','Gate 20'], ans:2, why:'原文 "from Gate 12"。', audio:'Your flight leaves at ten thirty from Gate 12. Have a nice trip!' }
  ]},
  { id:'L2', title:'A Job Interview', qs:[
    { q:'What is the relationship between the two speakers?', opts:['Teacher and student','Interviewer and interviewee','Doctor and patient','Friends'], ans:1, why:'男士是经理，女士来面试，是面试官与应聘者。', audio:'M: I am Mr. Smith, the manager.' },
    { q:'When did the woman graduate from college?', opts:['This year','Last year','Two years ago','Five years ago'], ans:1, why:'原文 "I graduated from college last year"。', audio:'I graduated from college last year.' },
    { q:'What was the woman\'s job?', opts:['A teacher','A nurse','A sales assistant','A manager'], ans:2, why:'原文 "worked as a sales assistant for six months"。', audio:'I have worked as a sales assistant for six months.' },
    { q:'How long did she do that job?', opts:['Six months','Six years','One year','Two years'], ans:0, why:'原文 "for six months"。', audio:'I have worked as a sales assistant for six months.' },
    { q:'Why does she want a new job?', opts:['More money only','More responsibility and chances','Shorter working hours','To travel abroad'], ans:1, why:'原文 "a position with more responsibility and better chances for advance"。', audio:'I am looking for a position with more responsibility and better chances for advance.' }
  ]},
  { id:'L3', title:'A Telephone Message', qs:[
    { q:'Who does the man want to speak to?', opts:['Mr. Brown','Tom White','The manager','Green Office'], ans:0, why:'男士说 "may I speak to Mr. Brown"。', audio:'M: Yes, may I speak to Mr. Brown, please?' },
    { q:'Why can\'t Mr. Brown answer the phone?', opts:['He is asleep','He is not in','He is in a meeting','He is ill'], ans:1, why:'女士说 "he is not in at the moment"。', audio:'W: I am afraid he is not in at the moment.' },
    { q:'Who is the caller?', opts:['Mr. Brown','Tom White','Mr. Smith','A secretary'], ans:1, why:'男士说 "This is Tom White."。', audio:'M: This is Tom White.' },
    { q:'What change is mentioned about the meeting?', opts:['It is cancelled','It is moved to Monday','It is moved to Friday','It starts earlier'], ans:1, why:'原文 "the meeting on Friday has been moved to Monday"。', audio:'Tell him the meeting on Friday has been moved to Monday.' },
    { q:'What is the caller\'s phone number?', opts:['663-2188','636-2818','663-2818','666-2188'], ans:0, why:'原文 "my number is 663-2188"。', audio:'M: Yes, my number is 663-2188.' }
  ]},
  { id:'L4', title:'At the Doctor\'s', qs:[
    { q:'Where does the conversation take place?', opts:['In a classroom','At the doctor\'s','In a library','At a bank'], ans:1, why:'对话有 doctor、headache、medicine，判断在诊所。', audio:'W: Good morning, doctor.' },
    { q:'What is the woman\'s main problem?', opts:['A toothache','A headache and tiredness','A cold','A stomachache'], ans:1, why:'原文 "I have a headache and I feel tired all the time"。', audio:'I have a headache and I feel tired all the time.' },
    { q:'How long has she felt like this?', opts:['Two days','Two weeks','Two months','Two years'], ans:1, why:'原文 "About two weeks."。', audio:'W: About two weeks. I have been working late every night.' },
    { q:'What does the doctor think is the cause?', opts:['Bad food','Working too hard','Cold weather','Lack of exercise'], ans:1, why:'原文 "You are probably working too hard."。', audio:'You are probably working too hard. You need more rest and less coffee.' },
    { q:'How often should she take the medicine?', opts:['Once a day','Twice a day','Three times a day','Every four hours'], ans:1, why:'原文 "Take this medicine twice a day"。', audio:'Take this medicine twice a day and come back in a week.' }
  ]},
  { id:'L5', title:'A Weather Report', qs:[
    { q:'What is the passage mainly about?', opts:['A sports report','A weather report','A news story','A travel plan'], ans:1, why:'开头 "Here is the weather report for tomorrow"。', audio:'Good evening. Here is the weather report for tomorrow.' },
    { q:'What will the weather be like in the north?', opts:['Sunny','Cloudy with a chance of rain','Heavy snow','Strong winds'], ans:1, why:'原文 "In the north, it will be cloudy with a chance of rain"。', audio:'In the north, it will be cloudy with a chance of rain in the afternoon.' },
    { q:'Which area will be sunny and warm?', opts:['The north','The south','The east','The west'], ans:1, why:'原文 "In the south, it will be sunny and warm"。', audio:'In the south, it will be sunny and warm.' },
    { q:'What is the highest temperature in the south?', opts:['18 degrees','20 degrees','26 degrees','30 degrees'], ans:2, why:'原文 "a high of twenty-six degrees"。', audio:'With a high of twenty-six degrees.' },
    { q:'What should boats do in the east?', opts:['Go out to sea','Stay in port','Sail faster','Move to the west'], ans:1, why:'原文 "boats should stay in port"。', audio:'The east will have strong winds, so boats should stay in port.' }
  ]},
  { id:'L6', title:'Booking a Hotel Room', qs:[
    { q:'Where does the conversation take place?', opts:['In a restaurant','At a hotel','In a bank','At a cinema'], ans:1, why:'有 book a room、Grand Hotel，判断在酒店预订。', audio:'W: Grand Hotel. How may I help you?' },
    { q:'How many nights will the man stay?', opts:['One','Two','Three','Four'], ans:1, why:'原文 "book a room for two nights"。', audio:'M: I would like to book a room for two nights.' },
    { q:'What kind of room does he want?', opts:['A double room','A single room with a bathroom','A family room','A room without a bathroom'], ans:1, why:'原文 "A single room with a bathroom"。', audio:'A single room with a bathroom, please.' },
    { q:'How much is the room per night?', opts:['60 dollars','70 dollars','80 dollars','90 dollars'], ans:2, why:'原文 "eighty dollars a night, including breakfast"。', audio:'That will be eighty dollars a night, including breakfast.' },
    { q:'What is the man\'s room number?', opts:['203','305','350','503'], ans:1, why:'原文 "Your room is number 305."。', audio:'Thank you, Mr. Cooper. Your room is number 305.' }
  ]}
];

// ============ 题型二：英语知识运用（完形填空，5 空）============
const PETS3_USE = [
  { id:'U1', title:'A Trip to the Mountains',
  text:'Last summer, our family took a trip to the mountains. We __1__ early in the morning and arrived there before noon. The air was fresh and the scenery was beautiful. My father __2__ a map and led the way. At the top of the hill, we __3__ for a rest and enjoyed the view. My mother took many photos __4__ the trip. We felt tired __5__ happy, and I hope we can go there again next year.',
  keys:['started','brought','stopped','during','but'],
  opts:[['started','arrived','returned','stopped'],['bought','brought','sold','drew'],['stopped','kept','went','ran'],['during','among','between','through'],['so','but','and','or']],
  why:['"started early in the morning" 指清晨出发，与后文 arrived 呼应。','"brought a map" 表示带了地图，符合语境。','"stopped for a rest" 意为停下来休息。','"during the trip" 表示在旅行期间。','tired 与 happy 为转折关系，用 but。'] },
  { id:'U2', title:'Learning a Second Language',
  text:'Learning a second language takes time, but it is very useful. First, you should not be afraid of making __1__. Mistakes help you learn. Second, try to speak as much as __2__, even if you are not perfect. Listening to songs and watching films can also __3__ your pronunciation. Third, review new words every day, because words are easily __4__ if you do not use them. Finally, find a friend to practise __5__. With constant effort, your English will surely improve.',
  keys:['mistakes','possible','improve','forgotten','with'],
  opts:[['notes','mistakes','plans','decisions'],['possible','quickly','soon','well'],['change','improve','reduce','forget'],['forgotten','remembered','learned','kept'],['to','with','for','at']],
  why:['"making mistakes" 犯错误，下文 Mistakes help you learn 有提示。','"as much as possible" 尽可能多地，为固定搭配。','"improve your pronunciation" 改善发音，符合语义。','不使用的词容易被遗忘，故用 forgotten。','"practise with a friend" 意为和朋友一起练习。'] },
  { id:'U3', title:'A Part-time Job',
  text:'Many college students take part-time jobs. Last term, I worked in a small bookshop __1__ weekends. I had to arrive at nine and __2__ until five. At first, I felt nervous because I had never __3__ with customers before. My manager was kind and taught me __4__ to deal with different people. After a few weeks, I became more confident. That experience taught me the __5__ of hard work and communication.',
  keys:['on','stay','dealt','how','value'],
  opts:[['in','on','at','for'],['stay','leave','sleep','rest'],['talked','dealt','agreed','played'],['what','how','when','why'],['value','price','cost','money']],
  why:['"on weekends" 在周末，固定搭配。','"stay until five" 意为待到五点。','"dealt with customers" 与顾客打交道，下文有 deal with 提示。','"taught me how to deal with..." 教我如何应对。','"the value of hard work" 努力的价值。'] },
  { id:'U4', title:'Healthy Eating',
  text:'Good eating habits are important for our health. We should eat a __1__ diet, with plenty of vegetables and fruit. Too much junk food can __2__ weight problems and heart disease. It is also wise to drink enough water instead of sweet drinks. Many people skip breakfast, __3__ is actually a bad habit. Breakfast gives us the __4__ we need for the morning. Remember, eating well does not mean eating __5__; it means eating wisely.',
  keys:['balanced','cause','which','energy','much'],
  opts:[['balance','balanced','balancing','balances'],['cause','make','take','give'],['that','which','what','it'],['energy','power','force','spirit'],['many','much','little','few']],
  why:['"a balanced diet" 均衡饮食，修饰名词用形容词。','"cause weight problems" 导致体重问题。','非限制性定语从句用 which 指代前面整个句子。','"the energy we need" 我们所需的能量。','"eating much" 吃得多，与 eating wisely 形成对比。'] },
  { id:'U5', title:'An Old Friend',
  text:'Yesterday I met an old friend in the street. We had not seen each other __1__ five years. He looked quite different, but I recognized him __2__. We talked about our school days and laughed a lot. He told me that he __3__ in a big city then. Before we said goodbye, we __4__ to meet again next month. I felt very happy because true friendship never __5__.',
  keys:['for','at once','lived','promised','changes'],
  opts:[['for','since','from','during'],['at once','at last','at first','at all'],['lives','lived','has lived','had lived'],['promised','decided','planned','agreed'],['changes','fades','ends','dies']],
  why:['"for five years" 表示一段时间，与完成时连用。','"recognized him at once" 意为立刻认出他。','宾语从句与主句 told 时态一致，用一般过去时。','"promised to meet again" 约定再见面。','"true friendship never changes" 真正的友谊永不改变。'] },
  { id:'U6', title:'Public Transport',
  text:'More people are choosing public transport these days. Buses and subways can carry many passengers __1__ once, so they help reduce traffic jams. They are also __2__ friendly, because they produce less pollution than private cars. In addition, taking a bus is much __3__ than driving, as you do not have to pay for fuel or parking. Of course, public transport can be __4__ during rush hours. However, with better service, more people will __5__ their cars at home.',
  keys:['at','environmentally','cheaper','crowded','leave'],
  opts:[['at','in','on','for'],['environment','environments','environmentally','environmental'],['cheap','cheaper','cheapest','more cheap'],['crowded','crowding','crowd','crowds'],['leave','take','drive','bring']],
  why:['"at once" 一次，固定搭配。','"environmentally friendly" 环保的，用副词修饰 friendly。','句中有 than，应用比较级 cheaper。','"be crowded" 拥挤的，用形容词。','"leave their cars at home" 把车留在家里。'] }
];

// ============ 题型三：阅读理解（四项选择）============
const PETS3_READ = [
  { id:'R1', title:'The Benefits of Reading Books', text:'Reading books is one of the best habits a person can develop. Unlike watching television, reading requires the mind to work actively. When we read, we follow ideas, remember details and imagine scenes, all of which train the brain. Studies have shown that people who read regularly have larger vocabularies and better writing skills than those who rarely open a book. Reading also helps reduce stress. A few pages of a good book can take the mind away from daily worries. Experts say it is never too late to start. Even fifteen minutes of reading a day can make a real difference over a year. The important thing is to choose material that is interesting but not too difficult.', qs:[
    { q:'According to the passage, how is reading different from watching TV?', opts:['It is more relaxing','It requires active thinking','It is easier','It needs no effort'], ans:1, why:'原文 "Unlike watching television, reading requires the mind to work actively"。' },
    { q:'What do regular readers usually have?', opts:['Better memory only','Larger vocabularies and better writing','More free time','Higher salaries'], ans:1, why:'原文 "people who read regularly have larger vocabularies and better writing skills"。' },
    { q:'How does reading help reduce stress?', opts:['By making people sleep','By taking the mind away from worries','By stopping work','By making people laugh'], ans:1, why:'原文 "take the mind away from daily worries"。' },
    { q:'What do experts say about starting to read?', opts:['Start as early as possible','It is never too late to start','Only read easy books','Read for hours every day'], ans:1, why:'原文 "it is never too late to start"。' },
    { q:'What kind of material should we choose?', opts:['Very difficult ones','Interesting but not too difficult','Only newspapers','Short stories only'], ans:1, why:'结尾 "interesting but not too difficult"。' }
  ]},
  { id:'R2', title:'Protecting the Environment', text:'Environmental protection has become a topic of worldwide concern. Air pollution in cities is mainly caused by factory waste and car exhaust. To fight it, many governments have introduced stricter rules and encouraged the use of public transport. Water pollution is another serious problem. Rivers and lakes are often polluted by chemicals from farms and factories. Everyone can help in daily life: saving water, using reusable bags and sorting rubbish are simple but effective steps. Some people believe that protecting the environment is only the duty of governments, but in fact it requires the effort of every person. If we all make a small change, we can leave a cleaner world for the next generation.', qs:[
    { q:'What mainly causes air pollution in cities?', opts:['Rubbish and plastic','Factory waste and car exhaust','Too many trees','Water shortage'], ans:1, why:'原文 "Air pollution ... is mainly caused by factory waste and car exhaust"。' },
    { q:'What have many governments done?', opts:['Built more factories','Introduced stricter rules','Stopped public transport','Cut down trees'], ans:1, why:'原文 "introduced stricter rules and encouraged the use of public transport"。' },
    { q:'What pollutes rivers and lakes?', opts:['Chemicals from farms and factories','Too much rain','Fish','Boats'], ans:0, why:'原文 "polluted by chemicals from farms and factories"。' },
    { q:'Which of the following is a simple daily step?', opts:['Buying more cars','Using reusable bags','Wasting water','Throwing away rubbish'], ans:1, why:'原文列举 "saving water, using reusable bags and sorting rubbish"。' },
    { q:'What is the author\'s opinion?', opts:['Only governments should act','It needs everyone\'s effort','Nothing can be done','It is too late'], ans:1, why:'原文 "it requires the effort of every person"。' }
  ]},
  { id:'R3', title:'The Internet and Our Life', text:'The Internet has changed the way we live, work and communicate. With a few clicks, we can get information from almost anywhere in the world. Online shopping saves time, and video calls allow families far apart to see each other. However, the Internet also brings problems. False information spreads quickly, and some people spend so much time online that they forget the real world. Experts advise us to use the Internet wisely: check the source of information, set a limit on online time and never share personal secrets. Used properly, the Internet can be a powerful tool for learning and communication; used carelessly, it can waste a great deal of our time.', qs:[
    { q:'What can we do with a few clicks online?', opts:['Get information worldwide','Grow food','Fix cars','Build houses'], ans:0, why:'原文 "we can get information from almost anywhere"。' },
    { q:'How does the Internet help families?', opts:['By saving money','Through video calls','By cooking meals','By doing homework'], ans:1, why:'原文 "video calls allow families far apart to see each other"。' },
    { q:'What is one problem of the Internet?', opts:['Too little information','False information','No shopping','High cost'], ans:1, why:'原文 "False information spreads quickly"。' },
    { q:'What do experts advise?', opts:['Never use the Internet','Share personal secrets','Limit online time','Believe everything'], ans:2, why:'原文 "set a limit on online time"。' },
    { q:'What is the main idea of the passage?', opts:['The Internet is useless','The Internet has both benefits and risks','Shopping online is bad','People should stop using it'], ans:1, why:'全文既讲好处也讲问题，主旨是互联网有利有弊。' }
  ]},
  { id:'R4', title:'Sleep and Health', text:'Sleep is as important to our health as food and water. During sleep, the body repairs itself and the brain organizes what we have learned. Adults usually need seven to eight hours of sleep each night, but many people get less because of work or entertainment. Lack of sleep can lead to tiredness, poor memory and even heart problems. Doctors suggest keeping a regular sleep schedule: go to bed and get up at about the same time every day. It also helps to avoid coffee and mobile phones before bedtime. A short nap during the day can be useful, as long as it does not make it hard to fall asleep at night.', qs:[
    { q:'What happens during sleep?', opts:['The body stops working','The body repairs and the brain organizes','People eat more','The brain rests completely'], ans:1, why:'原文 "the body repairs itself and the brain organizes what we have learned"。' },
    { q:'How much sleep do adults usually need?', opts:['4-5 hours','7-8 hours','10-12 hours','2 hours'], ans:1, why:'原文 "seven to eight hours"。' },
    { q:'What can lack of sleep cause?', opts:['Poor memory and heart problems','Better memory','More energy','Nothing'], ans:0, why:'原文 "Lack of sleep can lead to tiredness, poor memory and even heart problems"。' },
    { q:'What do doctors suggest?', opts:['Sleeping at different times','A regular sleep schedule','Drinking coffee at night','Using phones in bed'], ans:1, why:'原文 "keeping a regular sleep schedule"。' },
    { q:'When can a short nap be useful?', opts:['When it is very long','When it does not affect night sleep','At night only','Never'], ans:1, why:'原文 "as long as it does not make it hard to fall asleep at night"。' }
  ]},
  { id:'R5', title:'A Visit to the Science Museum', text:'Last month our class visited the city science museum. The guide showed us many interesting exhibitions, from old machines to modern robots. What impressed me most was a small machine that could turn sunlight into electricity. The guide explained how it worked and let us try it ourselves. I learned more in one afternoon than from several textbook chapters. Before we left, the teacher asked us to write a short report about what we had seen. This visit taught me that science is not far from our life; it is all around us. I hope we can have more such trips in the future.', qs:[
    { q:'Where did the class go last month?', opts:['A park','The science museum','A farm','A library'], ans:1, why:'原文 "visited the city science museum"。' },
    { q:'What impressed the writer most?', opts:['Old machines','Modern robots','A machine using sunlight','A book'], ans:2, why:'原文 "a small machine that could turn sunlight into electricity"。' },
    { q:'What did the guide let the students do?', opts:['Try the machine','Buy the machine','Take photos only','Leave early'], ans:0, why:'原文 "let us try it ourselves"。' },
    { q:'What did the teacher ask them to do?', opts:['Draw pictures','Write a short report','Sing a song','Read a book'], ans:1, why:'原文 "write a short report about what we had seen"。' },
    { q:'What did the writer learn?', opts:['Science is difficult','Science is all around us','Museums are boring','Textbooks are useless'], ans:1, why:'原文 "science is not far from our life; it is all around us"。' }
  ]},
  { id:'R6', title:'Making Friends at Work', text:'Making friends at work is good for both our happiness and our career. When we get along well with colleagues, we feel more comfortable and are more willing to share ideas. Good workplace friendships are built on trust and respect. It is important to listen to others and to give help when they need it. However, we should also keep a proper distance. Sharing too much private information or complaining about others can cause problems. Experts suggest being friendly but professional: take part in team activities, offer help, and avoid gossip. In this way, we can enjoy good relationships without harming our work.', qs:[
    { q:'What are good workplace friendships built on?', opts:['Money and gifts','Trust and respect','Same age','Same school'], ans:1, why:'原文 "built on trust and respect"。' },
    { q:'What should we do when colleagues need help?', opts:['Ignore them','Give help','Laugh at them','Complain'], ans:1, why:'原文 "give help when they need it"。' },
    { q:'What can cause problems at work?', opts:['Listening to others','Sharing too much private information','Team activities','Offering help'], ans:1, why:'原文 "Sharing too much private information or complaining about others can cause problems"。' },
    { q:'What do experts suggest?', opts:['Being friendly but professional','Keeping silent always','Avoiding all activities','Telling gossip'], ans:0, why:'原文 "being friendly but professional"。' },
    { q:'What is the passage mainly about?', opts:['How to find a job','How to make friends at work','How to use computers','How to write reports'], ans:1, why:'全文围绕职场交友展开。' }
  ]}
];

// ============ 题型四：阅读配伍（段落与小标题匹配）============
const PETS3_MATCH = [
  { id:'M1', title:'Five Ways to Save Money',
  text:['A shared flat is the cheapest choice for most students. By splitting the rent with one or two roommates, you can cut your housing cost almost in half.',
    'Before buying a new textbook, check the school library or a second-hand bookshop. Used books usually cost only a quarter of the new price.',
    'A cup of coffee from a cafe every day may add up to more than six hundred dollars a year. Making coffee at home keeps that money in your pocket.',
    'Many museums and concerts offer cheap tickets for students. Bring your student card and enjoy culture without spending too much.',
    'Plan your meals before you go shopping. A short shopping list stops you from buying things you do not need and reduces food waste.'],
  options:['Share housing','Use student discounts','Buy used books','Make coffee at home','Plan meals ahead'],
  statements:[
    { q:'Splitting rent with roommates can greatly reduce housing cost.', ans:0, why:'对应第一段讲合租省钱，小标题为 "Share housing"。' },
    { q:'Used textbooks are much cheaper than new ones.', ans:2, why:'对应第二段买二手书，小标题为 "Buy used books"。' },
    { q:'Making coffee at home can save hundreds of dollars a year.', ans:3, why:'对应第三段自己煮咖啡，小标题为 "Make coffee at home"。' },
    { q:'A student card helps you enjoy culture at low prices.', ans:1, why:'对应第四段学生证优惠，小标题为 "Use student discounts"。' },
    { q:'A shopping list helps you avoid unnecessary food purchases.', ans:4, why:'对应第五段购物前列清单，小标题为 "Plan meals ahead"。' }
  ]},
  { id:'M2', title:'Five People and Their Hobbies',
  text:['Linda is a nurse who works night shifts. In her free time she enjoys growing flowers on her balcony, because it helps her relax after a busy night.',
    'Tom is a university student. He spends every weekend playing basketball with his classmates and never misses a match on television.',
    'Mrs. Green is retired. She goes swimming every morning and reads novels in the afternoon.',
    'Jack works in a bank. He likes travelling and has already visited more than ten countries.',
    'Anna is a high school teacher. She loves music and plays the piano for about an hour every evening.'],
  options:['Growing flowers','Playing basketball','Swimming and reading','Travelling','Playing the piano'],
  statements:[
    { q:'A nurse grows flowers to relax after night shifts.', ans:0, why:'Linda 是护士，业余种花放松，对应 "Growing flowers"。' },
    { q:'A student plays basketball with classmates every weekend.', ans:1, why:'Tom 周末打篮球，对应 "Playing basketball"。' },
    { q:'A retired woman swims in the morning and reads in the afternoon.', ans:2, why:'Mrs. Green 游泳加读小说，对应 "Swimming and reading"。' },
    { q:'A bank worker has visited over ten countries.', ans:3, why:'Jack 在银行工作且爱旅行，对应 "Travelling"。' },
    { q:'A teacher plays an instrument for an hour each evening.', ans:4, why:'Anna 每晚弹钢琴，对应 "Playing the piano"。' }
  ]},
  { id:'M3', title:'Notices Around the School',
  text:['The school library will be closed next Monday for cleaning. Please return all borrowed books before Friday. Thank you for your cooperation.',
    'A welcome party for new students will be held in the school hall this Saturday evening at seven. Everyone is invited.',
    'The computer room will open from 8 a.m. this week because of the exams. Students may use the computers after class.',
    'A lost wallet with a student ID card was found yesterday. Please come to the office to claim it.',
    'The sports meeting, planned for next Friday, has been put off until further notice because of the rain.'],
  options:['Library closure','Welcome party','Computer room hours','Lost and found','Sports meeting delay'],
  statements:[
    { q:'Borrowed books must be returned before Friday.', ans:0, why:'第一则图书馆闭馆通知，对应 "Library closure"。' },
    { q:'New students are invited to a party on Saturday evening.', ans:1, why:'第二则迎新晚会，对应 "Welcome party"。' },
    { q:'The computer room opens earlier this week.', ans:2, why:'第三则电脑房开放时间，对应 "Computer room hours"。' },
    { q:'Someone can get a lost wallet at the office.', ans:3, why:'第四则失物招领，对应 "Lost and found"。' },
    { q:'The sports meeting will not be held as planned.', ans:4, why:'第五则运动会延期，对应 "Sports meeting delay"。' }
  ]},
  { id:'M4', title:'Advice Columns',
  text:['If you feel nervous before an exam, take a few deep breaths and remind yourself that you have prepared well. A calm mind works better.',
    'When you have a disagreement with a friend, listen to his or her view first instead of arguing immediately. Understanding comes before being understood.',
    'To improve your English, try reading short stories every day. Look up new words only after you finish the story.',
    'If you cannot sleep at night, avoid coffee after four o\'clock and do not use your phone in bed.',
    'Before you buy something expensive, ask yourself whether you really need it. Waiting for one day often helps you decide wisely.'],
  options:['On making friends','On shopping wisely','On dealing with exam stress','On improving English','On sleeping well'],
  statements:[
    { q:'Deep breathing can help you feel calm before an exam.', ans:2, why:'第一则讲考试焦虑，对应 "On dealing with exam stress"。' },
    { q:'Listening first helps solve disagreements with friends.', ans:0, why:'第二则讲朋友分歧，对应 "On making friends"。' },
    { q:'Reading short stories daily improves your English.', ans:3, why:'第三则讲学英语，对应 "On improving English"。' },
    { q:'Avoiding coffee late in the day helps you sleep.', ans:4, why:'第四则讲睡眠，对应 "On sleeping well"。' },
    { q:'Waiting a day before buying helps you decide.', ans:1, why:'第五则讲理性消费，对应 "On shopping wisely"。' }
  ]},
  { id:'M5', title:'Five Jobs',
  text:['Mr. Wang drives a bus every day. He knows the city roads very well and always arrives on time.',
    'Miss Li works in a hospital. She looks after patients and gives them medicine according to the doctor\'s orders.',
    'Mr. Chen repairs machines in a factory. He can fix almost any broken machine in a short time.',
    'Mrs. Zhao teaches English in a middle school. Her students enjoy her lively classes very much.',
    'Mr. Liu grows vegetables on his farm and sells them at the local market every weekend.'],
  options:['A bus driver','A nurse','A teacher','A farmer','A machine repairman'],
  statements:[
    { q:'He knows city roads well and drives passengers every day.', ans:0, why:'Mr. Wang 开公交，对应 "A bus driver"。' },
    { q:'She gives medicine to patients in a hospital.', ans:1, why:'Miss Li 在医院照顾病人，对应 "A nurse"。' },
    { q:'He fixes broken machines in a factory.', ans:4, why:'Mr. Chen 修机器，对应 "A machine repairman"。' },
    { q:'Her students enjoy her lively English classes.', ans:2, why:'Mrs. Zhao 教英语，对应 "A teacher"。' },
    { q:'He grows vegetables and sells them at the market.', ans:3, why:'Mr. Liu 种菜，对应 "A farmer"。' }
  ]},
  { id:'M6', title:'Travel Tips',
  text:['Before you travel, make sure your passport is valid and keep a copy of it in a safe place. This can save you a lot of trouble abroad.',
    'It is wise to book your hotel in advance, especially during holidays, because prices rise and rooms become scarce.',
    'Pack light. A small suitcase is easier to carry and leaves more space for the things you buy on the trip.',
    'Learn a few basic words of the local language, such as "hello" and "thank you". Local people appreciate your effort.',
    'Keep your valuables, such as your wallet and camera, in a safe place and never leave them unattended in public.'],
  options:['Pack lightly','Keep documents safe','Book ahead','Respect local culture','Guard your valuables'],
  statements:[
    { q:'Carry a small suitcase so that it is easy to handle.', ans:0, why:'第三则建议轻装，对应 "Pack lightly"。' },
    { q:'Keep a copy of your passport in a safe place.', ans:1, why:'第一则讲证件安全，对应 "Keep documents safe"。' },
    { q:'Reserve your hotel early during holidays.', ans:2, why:'第二则讲提前预订，对应 "Book ahead"。' },
    { q:'Learning a few local words is appreciated by local people.', ans:3, why:'第四则讲尊重当地文化，对应 "Respect local culture"。' },
    { q:'Never leave your wallet or camera unattended.', ans:4, why:'第五则讲保管财物，对应 "Guard your valuables"。' }
  ]}
];

// ============ 题型五：短文改错（选出正确替换词）============
const PETS3_ERROR = [
  { id:'E1', title:'A Sunny Day',
  lines:['Last Sunday we go to the beach for a picnic.','The sun was shining and the sky was blue.','We swim in the sea and played games on the sand.','My mother prepared many delicious food for us.','Everyone was very happy and enjoyed themself.','On the way home, we stop at a small shop.','It was really a wonderful day.'],
  errors:[
    { line:1, wrong:'go', opts:['goes','went','gone','going'], ans:1, why:'全文叙述过去的事，go 应改为过去式 went。' },
    { line:3, wrong:'swim', opts:['swim','swam','swimming','swims'], ans:1, why:'与 played 并列，应用过去式 swam。' },
    { line:4, wrong:'many', opts:['many','much','more','most'], ans:1, why:'food 是不可数名词，应用 much 修饰。' },
    { line:5, wrong:'themself', opts:['themself','themselves','theirself','theirs'], ans:1, why:'反身代词正确形式是 themselves。' },
    { line:6, wrong:'stop', opts:['stop','stops','stopped','stopping'], ans:2, why:'叙述过去的动作，应用过去式 stopped。' }
  ]},
  { id:'E2', title:'My Favourite Subject',
  lines:['English is my favourite subject since I was in Grade One.','At first, I found it difficult to remember new word.','My teacher encouraged me and gave me many useful advice.','I was afraid of speak English in front of the class.','Now I can talk with foreigners free and confidently.','I believe English will become more and more important.','I will keep on learning it.'],
  errors:[
    { line:1, wrong:'is', opts:['is','was','has been','will be'], ans:2, why:'since 引导时间状语从句时，主句用现在完成时 has been。' },
    { line:2, wrong:'word', opts:['word','words','wording','worded'], ans:1, why:'"new words" 泛指生词，应用复数形式。' },
    { line:3, wrong:'many', opts:['many','much','few','several'], ans:1, why:'advice 为不可数名词，应用 much 修饰。' },
    { line:4, wrong:'speak', opts:['speak','speaking','to speak','spoken'], ans:1, why:'"be afraid of doing" 中 of 为介词，后接动名词 speaking。' },
    { line:5, wrong:'free', opts:['free','freely','freedom','freeing'], ans:1, why:'修饰动词 talk 应用副词 freely。' }
  ]},
  { id:'E3', title:'A Letter Home',
  lines:['Dear Mom and Dad, I am writing to tell you about my life here.','I have been away from home for two month.','The college is big and the teachers are very friend.','I have made a lot of friends since I come here.','We study together and help each other with our lesson.','The food here is not so good than at home.','Please take care of yourself and do not worry about me.'],
  errors:[
    { line:2, wrong:'month', opts:['month','months','a month','monthly'], ans:1, why:'two 后接可数名词复数 months。' },
    { line:3, wrong:'friend', opts:['friend','friends','friendly','friendship'], ans:2, why:'be 动词后接形容词作表语，friendly 意为友好的。' },
    { line:4, wrong:'come', opts:['come','came','comes','coming'], ans:1, why:'since 从句用一般过去时，主句用现在完成时。' },
    { line:5, wrong:'lesson', opts:['lesson','lessons','subject','course'], ans:1, why:'"our lessons" 我们的功课，应用复数。' },
    { line:6, wrong:'than', opts:['than','as','then','so'], ans:1, why:'"not so ... as ..." 是同级比较的固定结构。' }
  ]},
  { id:'E4', title:'Keeping Fit',
  lines:['Everyone wants to keep fit, but few people know how to do it.','First, we should have a balance diet.','We need to eat more vegetables and less junk foods.','Second, taking regular exercise are important.','Even a thirty-minutes walk a day can help.','Finally, enough sleep is also very necessary.','If we follow these rules, we will be healthy than before.','Good habits make our life better.'],
  errors:[
    { line:2, wrong:'balance', opts:['balance','balanced','balancing','balances'], ans:1, why:'"a balanced diet" 均衡饮食，应用形容词。' },
    { line:3, wrong:'foods', opts:['foods','food','eating','dishes'], ans:1, why:'junk food 为不可数名词，不用复数。' },
    { line:4, wrong:'are', opts:['are','is','were','be'], ans:1, why:'动名词短语作主语时，谓语动词用单数 is。' },
    { line:5, wrong:'thirty-minutes', opts:['thirty-minutes','thirty-minute','thirty minutes','thirty minute'], ans:1, why:'复合形容词中用单数形式 thirty-minute。' },
    { line:7, wrong:'healthy', opts:['healthy','healthier','healthiest','health'], ans:1, why:'句中有 than，应用比较级 healthier。' }
  ]},
  { id:'E5', title:'A Busy Weekend',
  lines:['I had a busy but happy weekend.','On Saturday morning, I helped my mother cleaning the house.','In the afternoon, I play football with my friends.','In the evening, we watch a new film together.','On Sunday, I visited my grandparents who live in the countryside.','They were very glad to see me and cook a big meal.','I also help them clean the garden.','I was tired but I felt very happy.'],
  errors:[
    { line:2, wrong:'cleaning', opts:['cleaning','clean','to cleaning','cleaned'], ans:1, why:'"help sb. do sth." 中用动词原形 clean。' },
    { line:3, wrong:'play', opts:['play','played','plays','playing'], ans:1, why:'叙述过去的周末，应用过去式 played。' },
    { line:4, wrong:'watch', opts:['watch','watched','watches','watching'], ans:1, why:'与上下文过去时一致，应用 watched。' },
    { line:6, wrong:'cook', opts:['cook','cooked','cooks','cooking'], ans:1, why:'与 were 并列，应用过去式 cooked。' },
    { line:7, wrong:'help', opts:['help','helped','helps','helping'], ans:1, why:'过去发生的动作，应用 helped。' }
  ]},
  { id:'E6', title:'Water Pollution',
  lines:['Water is important for all living thing.','However, many rivers are serious polluted.','Factories pour waste water into rivers without treat it.','As a result, many fish die and the water becomes dirt.','The government should take measures to solve this problem.','We should also tries to save water in our daily life.','If everyone does their part, the rivers will become clean again.'],
  errors:[
    { line:1, wrong:'thing', opts:['thing','things','lively','single'], ans:1, why:'"living things" 意为生物，应用复数。' },
    { line:2, wrong:'serious', opts:['serious','seriously','seriousness','more serious'], ans:1, why:'修饰动词 polluted 应用副词 seriously。' },
    { line:3, wrong:'treat', opts:['treat','treating','treated','to treat'], ans:1, why:'without 为介词，后接动名词 treating。' },
    { line:4, wrong:'dirt', opts:['dirt','dirty','dirtily','dirtiness'], ans:1, why:'becomes 后接形容词作表语，dirty 意为脏的。' },
    { line:6, wrong:'tries', opts:['tries','try','tried','trying'], ans:1, why:'情态动词 should 后接动词原形 try。' }
  ]}
];

// ============ 题型六：短文写作（书信 / 情景作文交替）============
const PETS3_WRITING = [
  { id:'W1', title:'A Letter of Invitation', kind:'书信', prompt:'假设你是李华，想邀请英国朋友 Tom 来参加你的生日聚会。请写一封约 100 词的邀请信，说明时间、地点和活动。',
  model:'Dear Tom, How is everything going? I am writing to invite you to my birthday party. It will be held at my home next Saturday evening and will start at six o\'clock. Several friends from our class will come too. We will have a big dinner, sing songs and play games together. I know you like Chinese food, so my mother will prepare some special dishes for you. After dinner, we can watch a film. I really hope you can join us. Please let me know whether you can come before Friday. Looking forward to your reply. Yours, Li Hua',
  modelCn:'亲爱的汤姆：一切都好吗？我写信邀请你参加我的生日聚会。聚会将于下周六晚上在我家举行，六点开始。我们班几位朋友也会来。我们会吃一顿丰盛的晚餐，唱歌、一起做游戏。我知道你喜欢中国菜，所以妈妈会为你准备几道特别的菜。晚饭后我们可以看电影。真心希望你能来。请周五前告诉我你能否参加。期待你的回信。李华',
  phrases:['how is everything going','invite you to','be held at','look forward to','let me know'] },
  { id:'W2', title:'My Dream Job', kind:'情景作文', prompt:'请以 "My Dream Job" 为题写一篇约 120 词的短文，描述你理想中的工作及原因。',
  model:'Everyone has a dream job, and mine is to be a teacher. There are several reasons for this choice. First of all, I enjoy staying with young people. They are full of energy and always bring me new ideas. Second, I want to share my knowledge with others. When a student finally understands a difficult point, the feeling of success is wonderful. Of course, being a teacher is not easy. It requires patience, responsibility and a good command of the subject. Therefore, I am working hard to improve myself, especially my English and communication skills. I know the road ahead is long, but I will never give up. I believe that one day my dream will come true.',
  modelCn:'每个人都有理想的工作，而我的是当一名老师。这个选择有几个原因。首先，我喜欢和年轻人待在一起，他们充满活力，总能给我带来新想法。其次，我想把知识分享给别人。当学生终于理解一个难点时，那种成功的感觉非常棒。当然，当老师并不容易，它需要耐心、责任心和扎实的专业知识。因此，我正在努力提高自己，尤其是英语和沟通能力。我知道前面的路还很长，但我绝不放弃。我相信总有一天梦想会成真。',
  phrases:['dream job','first of all','be full of','share ... with','come true'] },
  { id:'W3', title:'A Letter of Thanks', kind:'书信', prompt:'假设你生病时得到同学照顾，请写一封约 100 词的感谢信。',
  model:'Dear Wang Lin, I am writing to express my sincere thanks to you. Last week I was ill and had to stay in the hospital for three days. During that time, you came to see me every afternoon and brought me notes for all the missed classes. You also helped me with the difficult exercises when I returned. We studied together in the library. Without your kind help, I would have fallen behind my classmates. I really appreciate what you have done for me. I hope I can return your kindness one day. Thank you again and best wishes! Yours, Li Hua',
  modelCn:'亲爱的王林：我写信向你表示诚挚的感谢。上周我生病了，不得不在医院住三天。那段时间，你每天下午都来看我，并带给我所有落下课程的笔记。我回去后你还帮我讲解难题，我们还一起在图书馆学习。如果没有你的热心帮助，我就会落后于同学。我非常感谢你为我做的一切。希望有一天能回报你的好意。再次感谢，祝好！李华',
  phrases:['express my thanks','stay in the hospital','missed classes','fall behind','return your kindness'] },
  { id:'W4', title:'The Importance of Teamwork', kind:'情景作文', prompt:'请以 "The Importance of Teamwork" 为题写一篇约 120 词的短文。',
  model:'In modern society, few tasks can be finished by one person alone, so teamwork has become more important than ever. When people work in a team, everyone can focus on what he or she does best. This not only saves time but also improves the quality of the work. Good teamwork also helps us learn from one another. By listening to different opinions, we can see problems from new angles and find better solutions. However, teamwork does not mean that everyone must think alike. Respect and communication are the key. Members should be willing to share ideas and offer help when needed. In short, a strong team can achieve much more than any single person.',
  modelCn:'在现代社会，很少有任务能靠一个人单独完成，因此团队合作比以往任何时候都重要。当人们在一个团队中工作时，每个人都能专注于自己最擅长的事。这不仅节省时间，还提高了工作质量。良好的团队合作也帮助我们互相学习。通过倾听不同意见，我们能从新角度看问题并找到更好的解决方法。然而，团队合作并不意味着每个人都必须想法一致。尊重与沟通才是关键。成员应愿意分享想法，并在需要时提供帮助。总之，一个强大的团队能取得远大于个人的成就。',
  phrases:['work in a team','focus on','learn from one another','different opinions','achieve more'] },
  { id:'W5', title:'A Letter of Complaint', kind:'书信', prompt:'假设你买的书有缺页问题，请写一封约 100 词的投诉信。',
  model:'Dear Manager, I am writing to complain about a book I bought in your store last Saturday. When I got home, I found that several pages were missing, which made the book useless to me. I was really disappointed. I have kept the receipt and the book in good condition. I would appreciate it if you could either send me a new copy or give me a full refund. I have always enjoyed shopping in your store and hope this matter can be settled soon. Please reply to me at your earliest convenience. Thank you for your attention. Yours sincerely, Li Hua',
  modelCn:'亲爱的经理：我写信投诉上周六在贵店买的一本书。回家后我发现书缺了几页，这对我来说无法使用，我非常失望。我保留了收据，书也完好无损。如能给我换一本新书或全额退款，我将非常感激。我一直喜欢在贵店购物，希望此事能尽快解决。请尽早回复。谢谢关注。谨启，李华',
  phrases:['complain about','be missing','in good condition','a full refund','at your earliest convenience'] },
  { id:'W6', title:'How to Learn English Well', kind:'情景作文', prompt:'请以 "How to Learn English Well" 为题写一篇约 120 词的短文，给出学习方法。',
  model:'English is one of the most useful languages in the world, but many students find it hard to learn. In fact, with the right methods, anyone can make progress. First, we should practise speaking as much as possible. Do not be afraid of making mistakes, because mistakes help us learn. Second, reading is very important. Try to read short passages every day and guess the meaning of new words from the context. Third, listening to English songs and watching films can improve our pronunciation and build up interest. Finally, reviewing words regularly is necessary. If we keep doing these things every day, our English will surely become better.',
  modelCn:'英语是世界上最有用的语言之一，但许多学生觉得难学。事实上，只要方法得当，任何人都能进步。首先，我们应尽可能多说。不要害怕犯错，因为错误帮助我们学习。其次，阅读非常重要。尽量每天读短文，并根据上下文猜测生词意思。第三，听英文歌和看电影能改善发音、培养兴趣。最后，定期复习单词是必要的。如果每天坚持做这些，我们的英语一定会更好。',
  phrases:['make progress','be afraid of','guess the meaning','build up interest','review words'] },
  { id:'W7', title:'A Letter of Advice', kind:'书信', prompt:'假设朋友想减肥，请写一封约 100 词的信给出健康建议。',
  model:'Dear Lucy, I hear that you want to lose weight, and I am writing to give you some advice. First of all, do not skip meals. Eating three regular meals a day is better than eating nothing, because your body needs energy. Second, take more exercise, such as walking or swimming, for at least thirty minutes a day. Third, drink more water and eat more vegetables instead of sweet drinks and snacks. Remember, losing weight takes time, so be patient and do not believe in quick-fix medicines. I hope my advice will be helpful. Wish you good luck! Yours, Li Hua',
  modelCn:'亲爱的露西：听说你想减肥，我写信给你一些建议。首先，不要不吃饭。一天吃三顿规律的正餐比什么都不吃更好，因为身体需要能量。其次，多运动，比如散步或游泳，每天至少三十分钟。第三，多喝水、多吃蔬菜，代替甜饮料和零食。记住，减肥需要时间，所以要有耐心，不要相信速效药。希望我的建议有帮助。祝好运！李华',
  phrases:['lose weight','skip meals','take exercise','instead of','be patient'] },
  { id:'W8', title:'My Favourite Season', kind:'情景作文', prompt:'请以 "My Favourite Season" 为题写一篇约 120 词的短文。',
  model:'There are four seasons in a year, and my favourite one is autumn. Autumn is neither too hot nor too cold, so it is very comfortable to go out. The weather is usually clear and dry, with a blue sky and gentle wind. Leaves turn yellow and red, making the whole city look beautiful. Autumn is also a season of harvest. Farmers are busy collecting crops, and markets are full of fresh fruit such as apples and grapes. What is more, the Mid-Autumn Festival comes in autumn, when families get together to enjoy mooncakes and admire the moon. For all these reasons, I love autumn best. It always brings me peace and joy.',
  modelCn:'一年有四季，我最喜欢的是秋天。秋天既不太热也不太冷，出门很舒服。天气通常晴朗干燥，天空湛蓝，微风和煦。树叶变黄变红，让整个城市看起来很美。秋天也是收获的季节，农民忙着收庄稼，市场上满是苹果和葡萄等新鲜水果。而且中秋节在秋天，家人团聚吃月饼、赏月。由于这些原因，我最爱秋天。它总能带给我平静与快乐。',
  phrases:['neither ... nor','harvest season','be full of','what is more','admire the moon'] },
  { id:'W9', title:'A Letter to a Pen Pal', kind:'书信', prompt:'假设你是李华，给英国笔友写约 100 词的信介绍自己的学校生活。',
  model:'Dear Peter, I am glad to receive your letter. Now let me tell you something about my school life. I am a student in Grade Two, and we have six classes every day. My favourite subject is English because it is interesting and useful. After class, I often play basketball with my classmates, which makes me strong and relaxed. Our teachers are kind and helpful, and we get along well with each other. I also take part in the English club every Wednesday afternoon. There we practise speaking and watch English films together. What about your school life? I am looking forward to hearing from you soon. Yours, Li Hua',
  modelCn:'亲爱的彼得：很高兴收到你的来信。现在让我介绍一下我的学校生活。我是高二学生，每天上六节课。我最喜欢的科目是英语，因为它有趣又有用。课后我常和同学打篮球，这让我强壮又放松。我们的老师友善又乐于助人，大家相处得很好。每周三下午我还参加英语俱乐部，在那里我们练习口语、一起看英文电影。你的学校生活怎么样？期待很快收到你的回信。李华',
  phrases:['glad to receive','favourite subject','after class','get along well','hear from'] },
  { id:'W10', title:'The Advantages of Public Transport', kind:'情景作文', prompt:'请以 "The Advantages of Public Transport" 为题写一篇约 120 词的短文。',
  model:'With more cars on the road, traffic jams and pollution have become serious problems. Using public transport is a good solution. First of all, buses and subways can carry many passengers at once, so they help reduce traffic jams greatly. Second, they are more environmentally friendly than private cars because they produce less waste gas. Third, taking public transport is cheaper. You only need to buy a ticket instead of paying for fuel and parking. Besides, it gives people a chance to relax and read on the way. For these reasons, I believe public transport will play an even more important role in our cities in the future.',
  modelCn:'随着路上汽车增多，交通拥堵和污染成了严重问题。使用公共交通是个好办法。首先，公交和地铁一次能载很多乘客，大大缓解交通拥堵。其次，它们比私家车更环保，因为排放的废气更少。第三，坐公共交通更便宜，只需买票，不用付油费和停车费。此外，它还让人在路上放松、阅读。基于这些原因，我相信公共交通未来在城市中会发挥更重要的作用。',
  phrases:['traffic jams','at once','environmentally friendly','instead of','play a role'] },
  { id:'W11', title:'A Letter of Apology', kind:'书信', prompt:'假设你没能赴朋友的约，请写一封约 100 词的道歉信。',
  model:'Dear Mary, I am terribly sorry that I failed to keep our appointment last Sunday. I should have arrived at the cinema on time, but on my way there, I met an old man who had fallen down and took him to the hospital. I was so worried that I completely forgot to call you. I know you must have waited a long time and I feel very sorry about it. Please forgive me. Could we please meet again next Sunday? This time I will certainly be on time. Once again, I apologize for all the trouble I caused. Yours, Li Hua',
  modelCn:'亲爱的玛丽：非常抱歉上周日没能赴约。我本应准时到电影院，但在路上遇到一位摔倒的老人，把他送去了医院。我当时很着急，完全忘了给你打电话。我知道你一定等了很久，非常抱歉，请原谅我。我们能不能下周日再见面？这次我一定准时。再次为造成的不便道歉。李华',
  phrases:['keep an appointment','on time','fall down','feel sorry','apologize for'] },
  { id:'W12', title:'The Value of Hard Work', kind:'情景作文', prompt:'请以 "The Value of Hard Work" 为题写一篇约 120 词的短文。',
  model:'Hard work plays an important role in our life. It is the key to success in almost everything we do. First of all, hard work helps us achieve our goals, whether in study or at work. Without effort, even the best plan will remain a dream. Second, working hard builds up our confidence. Every small progress we make encourages us to go further. Of course, working hard does not mean staying up late blindly. We also need good methods and proper rest. As long as we keep trying and never give up, we will surely make our dreams come true. In a word, hard work is the road to a better life.',
  modelCn:'努力在我们的生活中扮演重要角色，几乎是我们做任何事成功的关键。首先，努力帮助我们实现目标，无论学习还是工作。没有努力，再好的计划也只是梦想。其次，努力建立我们的信心，每一点小进步都鼓励我们走得更远。当然，努力并不意味着盲目熬夜，我们还需要好方法和适当休息。只要不断努力、永不放弃，我们一定能实现梦想。总之，努力是通往更好生活的道路。',
  phrases:['play an important role','the key to','achieve goals','build up confidence','stay up late'] }
];

// ============ 题型七：口试模拟（常见话题）============
const PETS3_SPEAK = [
  { id:'S1', title:'Self-introduction', q:'Could you please introduce yourself briefly?',
  model:'Certainly. My name is Li Hua and I am twenty years old. I am a second-year college student majoring in business English. In my spare time, I like reading and playing basketball. I am an outgoing person and I enjoy working with others. My English is not perfect yet, but I am practising it every day and I am confident that I can improve it.',
  modelCn:'当然。我叫李华，今年二十岁，是商务英语专业的大二学生。业余时间我喜欢阅读和打篮球。我性格外向，喜欢与人合作。我的英语还不够完美，但我每天都在练习，相信能进步。',
  phrases:['major in','in my spare time','outgoing person','be confident that'] },
  { id:'S2', title:'My Hometown', q:'Can you tell me something about your hometown?',
  model:'Sure. My hometown is a small city in the south of China. It is famous for its beautiful lakes and mild climate. The city is not very big, but it is clean and peaceful. There are many trees along the streets, and people there live a relaxed life. I love my hometown because it is where I grew up and it always makes me feel at home.',
  modelCn:'当然。我的家乡是中国南方的一座小城市，以美丽的湖泊和温和的气候闻名。城市不大，但干净宁静。街道两旁有很多树，人们生活悠闲。我爱家乡，因为那里是我成长的地方，总让我有宾至如归的感觉。',
  phrases:['be famous for','mild climate','grow up','feel at home'] },
  { id:'S3', title:'My Favourite Subject', q:'What is your favourite subject and why?',
  model:'My favourite subject is English. I like it for two reasons. First, it is a useful tool for communication and it opens a window to the world. Second, I enjoy learning about different cultures through English. Although grammar is sometimes difficult, I find the whole process interesting. I hope I can use English confidently in my future work.',
  modelCn:'我最喜欢的科目是英语。原因有两个。首先，它是交流的有用工具，为我打开了解世界的窗口。其次，我喜欢通过英语了解不同文化。虽然语法有时难，但整个过程很有趣。希望将来能自信地使用英语。',
  phrases:['a useful tool','open a window','different cultures','in the future'] },
  { id:'S4', title:'A Memorable Trip', q:'Describe a trip you will never forget.',
  model:'I will never forget a trip to the mountains with my family last summer. We started early and arrived there before noon. The air was fresh and the view was amazing. We walked for two hours and had a picnic at the top. What impressed me most was the sunrise the next morning. It was so beautiful that I forgot all my worries. That trip taught me to spend more time with my family.',
  modelCn:'我永远不会忘记去年夏天和家人的登山旅行。我们一早出发，中午前到达。空气清新，景色迷人。我们走了两小时，在山顶野餐。最让我难忘的是第二天早上的日出，美得让我忘了所有烦恼。那次旅行让我懂得要多陪家人。',
  phrases:['start early','fresh air','impress me most','forget worries','spend time with'] },
  { id:'S5', title:'Health and Exercise', q:'How do you keep healthy?',
  model:'I keep healthy mainly through regular exercise and good eating habits. Every morning I go jogging for half an hour, which makes me energetic for the whole day. I also eat plenty of vegetables and fruit and drink enough water. In addition, I try to sleep seven hours a night because rest is important. I believe that small daily habits are the key to good health.',
  modelCn:'我主要通过规律运动和良好的饮食习惯保持健康。每天早上我慢跑半小时，让我一整天精力充沛。我也多吃蔬菜水果、喝足够的水。此外，我尽量每晚睡七小时，因为休息很重要。我相信每天的小习惯是健康的关键。',
  phrases:['regular exercise','eating habits','go jogging','plenty of','the key to'] },
  { id:'S6', title:'Part-time Job Experience', q:'Have you ever had a part-time job? Tell me about it.',
  model:'Yes, I have. Last term I worked in a bookshop on weekends. I had to arrive at nine and stay until five. At first I was nervous when talking with customers, but my manager taught me how to deal with different people. After a few weeks I became more confident. That experience helped me understand the value of hard work and communication.',
  modelCn:'有。上学期我周末在书店打工。我得九点到，待到五点。起初和顾客说话我很紧张，但经理教我如何与不同的人打交道。几周后我变得更自信。那段经历让我懂得了努力与沟通的价值。',
  phrases:['part-time job','on weekends','deal with','become confident','the value of'] },
  { id:'S7', title:'Environmental Protection', q:'What can we do to protect the environment?',
  model:'I think everyone can help protect the environment in daily life. First, we should save water and electricity, such as turning off lights when we leave a room. Second, we can use reusable bags instead of plastic ones. Third, choosing public transport or a bicycle reduces pollution from cars. In addition, sorting rubbish helps recycling. If each of us makes a small effort, we will leave a cleaner world for the next generation.',
  modelCn:'我认为每个人都能在日常生活中保护环境。首先，节约用水用电，比如离开房间时关灯。其次，用可重复使用的袋子代替塑料袋。第三，选择公共交通或骑自行车能减少汽车污染。此外，垃圾分类有助于回收。如果每人出一份力，留给下一代的将是更清洁的世界。',
  phrases:['save water','reusable bags','public transport','sort rubbish','make an effort'] },
  { id:'S8', title:'My Future Plan', q:'What is your plan for the future?',
  model:'My plan for the future is clear. First, I want to finish my studies and pass the PETS-3 exam, which is important for my career. Then I hope to find a job related to my major and learn more practical skills. In the long run, I would like to become a capable professional in my field. I know achieving these goals needs constant effort, so I will keep learning and never stop improving myself.',
  modelCn:'我未来的计划很明确。首先，完成学业并通过PETS-3考试，这对我的职业很重要。然后希望找一份与专业相关的工作，学更多实用技能。长远来看，我想成为所在领域有能力的专业人士。我知道实现这些目标需要不断努力，所以我会坚持学习，永不停止提升自己。',
  phrases:['for the future','related to','practical skills','in the long run','keep learning'] },
  { id:'S9', title:'A Person I Admire', q:'Who is a person you admire and why?',
  model:'The person I admire most is my English teacher. She is not only knowledgeable but also very patient. Whenever I had difficulty with grammar, she would explain it again and again until I understood. She always encourages us to speak bravely and never laughs at our mistakes. Her dedication to teaching has influenced me deeply. I hope I can become a teacher like her one day.',
  modelCn:'我最敬佩的人是我的英语老师。她不仅知识渊博，而且非常耐心。每当我语法有困难，她会一遍遍讲解直到我懂。她总鼓励我们大胆说，从不嘲笑我们的错误。她对教学的投入深深影响了我。希望有一天能成为像她一样的老师。',
  phrases:['admire most','not only ... but also','have difficulty','laugh at','one day'] },
  { id:'S10', title:'Festivals', q:'Which festival do you like best?',
  model:'I like the Spring Festival best. It is the most important traditional festival in China. Before the festival, families clean their houses and prepare special food. On New Year\'s Eve, we have a big dinner together and watch TV. During the holiday, people visit relatives and friends, and children receive red packets. What I like most is the warm feeling of family reunion. It makes me feel loved and hopeful for the new year.',
  modelCn:'我最喜欢春节。这是中国最重要的传统节日。节前，家家打扫房屋、准备特别的食物。除夕夜，我们一起吃年夜饭、看电视。假期里人们走亲访友，孩子收红包。我最喜欢的是家人团聚的温暖感觉，它让我感到被爱并对新年充满希望。',
  phrases:['traditional festival','New Year\'s Eve','red packets','family reunion','hopeful'] },
  { id:'S11', title:'Dealing with Stress', q:'How do you deal with stress in your life?',
  model:'Stress is common in our daily life, especially before exams. When I feel stressed, I usually take a deep breath and go for a walk to calm down. Talking with a friend also helps, because sharing problems makes them seem smaller. In addition, I listen to light music and make sure I get enough sleep. I have learned that keeping a positive attitude is the best way to face pressure.',
  modelCn:'压力在日常生活中很常见，尤其是考试前。当我感到有压力时，通常深呼吸并散步来平静下来。和朋友聊天也有帮助，因为分享问题会让问题显得更小。此外，我听轻音乐并保证充足睡眠。我明白了保持积极心态是面对压力的最好方式。',
  phrases:['deal with stress','calm down','share problems','light music','positive attitude'] },
  { id:'S12', title:'Learning from Mistakes', q:'What do you think of making mistakes?',
  model:'I believe making mistakes is a natural part of learning. Nobody can be perfect all the time. When we make a mistake, the important thing is to find out why it happened and learn from it. For example, if I use a wrong word in English, I will write it down and review it later. In this way, mistakes become valuable lessons. I am never afraid of making mistakes, because each one brings me one step closer to success.',
  modelCn:'我认为犯错是学习中自然的一部分，没有人能一直完美。犯错时，重要的是找出原因并从中学习。比如，如果我在英语中用错词，我会记下来以后复习。这样，错误就成了宝贵的教训。我从不害怕犯错，因为每一次都让我离成功更近一步。',
  phrases:['a natural part','find out','learn from','write it down','one step closer'] }
];

// ============ PETS-3 完整模考卷（按 seed 稳定选型）============
function makePETS3Mock(seed) {
  const s = Math.abs(Number(seed) || 1);
  const pickOne = (arr, n) => arr[n % arr.length];
  return {
    listening: pickOne(PETS3_LISTENING, s),
    use: pickOne(PETS3_USE, s + 1),
    read: pickOne(PETS3_READ, s + 2),
    match: pickOne(PETS3_MATCH, s + 3),
    error: pickOne(PETS3_ERROR, s + 4),
    writing: pickOne(PETS3_WRITING, s + 5),
    speaking: pickOne(PETS3_SPEAK, s + 6)
  };
}
