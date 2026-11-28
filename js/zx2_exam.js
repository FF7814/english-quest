/* 英语启航 - 自考英语二（00015）题库
   严格按全国统考七大题型：阅读判断10分 / 阅读选择10分 / 概括段落大意和补全句子10分 /
   填句补文10分 / 填词补文15分 / 完形补文15分 / 写作30分，满分100、60分及格。
   题库离线可用，全部带答案与中文解析。 */

// 题型一：阅读判断（判断正误，0=正确 True，1=错误 False）
const ZX2_JUDGE = [
  { id:'J1', title:'How to learn new words', text:'Many students try to learn new words by reading a list again and again. This method can work, but it is slow. A better way is to put each word into a sentence that means something to you. For example, instead of memorizing the word "benefit" alone, you can write "Regular exercise benefits my health." A word used in your own sentence is much easier to remember. Experts also suggest reviewing words after one day, then after three days, and again after one week. This is called spaced repetition, and it helps the brain keep information for a longer time.', qs:[
    { q:'Reading a word list again and again is the best way to learn words.', ans:1, why:'原文说这种方法"can work, but it is slow"，并推荐更好的方法，故该说法错误。' },
    { q:'Putting a new word into a personal sentence helps memory.', ans:0, why:'原文"A word used in your own sentence is much easier to remember"直接支持。' },
    { q:'The word "benefit" is used in an example sentence in the passage.', ans:0, why:'原文举例 "Regular exercise benefits my health."，确实使用了 benefit。' },
    { q:'Spaced repetition means reviewing words only once a month.', ans:1, why:'原文建议一天后、三天后、一周后复习，不是一月一次。' },
    { q:'Spaced repetition helps the brain keep information longer.', ans:0, why:'结尾"helps the brain keep information for a longer time"与题意一致。' }
  ]},
  { id:'J2', title:'Sleep and memory', text:'Students often stay up late before an exam, hoping to review as much as possible. However, sleep is the time when the brain strengthens what we have learned. Research shows that a student who sleeps seven or eight hours after studying remembers more than one who sleeps only four hours. During deep sleep, the brain organizes new information and connects it with old knowledge. Experts therefore advise students to stop reviewing at least one hour before bed and to keep the bedroom quiet, dark and cool. A short nap in the afternoon can also help, as long as it does not make it hard to fall asleep at night.', qs:[
    { q:'Staying up late before an exam is an effective way to review.', ans:1, why:'原文用"However"转折，指出睡眠才巩固记忆，故熬夜并非有效方法。' },
    { q:'The brain strengthens learning during sleep.', ans:0, why:'原文"sleep is the time when the brain strengthens what we have learned"。' },
    { q:'Students who sleep four hours remember more than those who sleep eight.', ans:1, why:'原文说睡7-8小时的学生比睡4小时的记得更多，与题意相反。' },
    { q:'Experts advise reviewing until the moment you go to bed.', ans:1, why:'原文建议"stop reviewing at least one hour before bed"。' },
    { q:'An afternoon nap can be helpful if it does not affect night sleep.', ans:0, why:'结尾"as long as it does not make it hard to fall asleep at night"支持该说法。' }
  ]},
  { id:'J3', title:'The public library', text:'A public library is one of the few places where anyone can stay for hours without being asked to buy anything. This matters especially in big cities, where space is expensive. For students, a library offers quiet desks, reliable Internet and free books that would be too costly to buy. Librarians can also help people find information, a skill that becomes more important as online sources increase. In many communities, the library has become a learning center rather than just a place to borrow books. It offers classes for children and job training for adults, making knowledge available to everyone.', qs:[
    { q:'You must buy something if you stay long in a public library.', ans:1, why:'原文"without being asked to buy anything"，故无需消费。' },
    { q:'Libraries are especially important in expensive cities.', ans:0, why:'原文"This matters especially in big cities, where space is expensive"。' },
    { q:'Students have to pay for the Internet in a library.', ans:1, why:'原文说图书馆提供"reliable Internet"，并未要求付费，且与免费资源描述矛盾。' },
    { q:'Librarians can help people find information.', ans:0, why:'原文"Librarians can also help people find information"直接支持。' },
    { q:'The library now serves only as a place to borrow books.', ans:1, why:'原文"has become a learning center rather than just a place to borrow books"，故错误。' }
  ]},
  { id:'J4', title:'Online learning', text:'Online courses have become popular because they are flexible and can be watched at any time. However, they require strong self-control. A good online learner sets a clear goal, takes notes while watching, and asks questions in the discussion area. Without these steps, it is easy to give up a course halfway. Studies show that students who treat online classes just like real classes get better results. They choose a regular time and a quiet place for study, and they do not watch videos while doing other things. In short, the key to online learning is not the technology but the learner\'s own discipline.', qs:[
    { q:'Online courses can only be watched at a fixed time.', ans:1, why:'原文"can be watched at any time"，可随时观看。' },
    { q:'Online learning requires self-control.', ans:0, why:'原文"they require strong self-control"。' },
    { q:'A good learner should take notes and ask questions.', ans:0, why:'原文"takes notes while watching, and asks questions in the discussion area"。' },
    { q:'Students who treat online classes casually get better results.', ans:1, why:'原文说"treat online classes just like real classes"的学生成绩更好，故随意对待不会更好。' },
    { q:'The most important factor in online learning is discipline.', ans:0, why:'结尾"the key ... is not the technology but the learner\'s own discipline"。' }
  ]},
  { id:'J5', title:'Teamwork at work', text:'In most modern jobs, people work in teams. Good teamwork does not mean that everyone thinks in the same way. It means that members listen to one another and share their ideas clearly. When a team meets a problem, the best members focus on a solution instead of blaming others. They also divide the work according to each person\'s strength, so that everyone can contribute. Research shows that a team with different opinions often makes better decisions than a group of people who always agree. Therefore, disagreement, when handled well, can be a source of strength rather than weakness.', qs:[
    { q:'Good teamwork means all members think alike.', ans:1, why:'原文"does not mean that everyone thinks in the same way"。' },
    { q:'Team members should listen and share ideas clearly.', ans:0, why:'原文"listen to one another and share their ideas clearly"。' },
    { q:'Blaming others is a good way to solve team problems.', ans:1, why:'原文说应"focus on a solution instead of blaming others"。' },
    { q:'Dividing work by personal strength helps everyone contribute.', ans:0, why:'原文"divide the work according to each person\'s strength"。' },
    { q:'Different opinions can make a team stronger.', ans:0, why:'结尾"disagreement ... can be a source of strength"。' }
  ]},
  { id:'J6', title:'The habit of reading', text:'Reading is one of the most useful habits a person can build. Unlike watching television, reading requires the mind to work actively. When we read, we have to follow ideas, remember details and imagine scenes, all of which train the brain. Studies have found that people who read regularly have larger vocabularies and better writing skills. Reading also reduces stress: a few pages of a good book can take the mind away from daily worries. It is never too late to start. Even fifteen minutes of reading a day can make a difference over a year. The important thing is to choose material that is interesting but not too difficult.', qs:[
    { q:'Reading requires less active thinking than watching television.', ans:1, why:'原文"Unlike watching television, reading requires the mind to work actively"，阅读需要更积极的思考。' },
    { q:'Reading trains the brain by following ideas and imagining scenes.', ans:0, why:'原文"follow ideas, remember details and imagine scenes, all of which train the brain"。' },
    { q:'People who read regularly usually have larger vocabularies.', ans:0, why:'原文"people who read regularly have larger vocabularies and better writing skills"。' },
    { q:'Reading can help reduce stress.', ans:0, why:'原文"Reading also reduces stress"。' },
    { q:'You should only read materials that are very easy.', ans:1, why:'原文建议"interesting but not too difficult"，并非只要非常容易的材料。' }
  ]}
];

// 题型二：阅读选择（每题2分）
const ZX2_READ = [
  { id:'R1', title:'The value of slow reading', text:'Many students believe that reading fast is a sign of good English. In a survey of college students, nearly seventy percent said they tried to read as many words per minute as possible. However, teachers found that the fastest readers were not the ones who answered questions best. Strong readers spent more time on key sentences and connected them with what they already knew. Researchers suggest reading a text twice: first for the main idea, and then for details. This method takes a little longer but leads to much better understanding.', qs:[
    { q:'What did most students in the survey try to do?', opts:['Read slowly on purpose','Read as fast as possible','Read only for exams','Avoid reading in English'], ans:1, why:'原文"nearly seventy percent said they tried to read as many words per minute as possible"。' },
    { q:'Who answered questions best according to teachers?', opts:['The fastest readers','The slowest readers','The students who read twice','The students who skipped details'], ans:2, why:'最快的学生并非答得最好，研究者建议读两遍，理解更好。' },
    { q:'What do strong readers spend more time on?', opts:['Easy words','Key sentences','Pictures','The last line'], ans:1, why:'原文"Strong readers spent more time on key sentences"。' },
    { q:'What do researchers suggest?', opts:['Reading a text twice','Reading only once fast','Memorizing every word','Skipping difficult parts'], ans:0, why:'原文"suggest reading a text twice: first for the main idea, and then for details"。' },
    { q:'What is the main idea of the passage?', opts:['Fast reading is the key to English','Reading slowly with method improves understanding','Students should give up reading','Tests are too difficult'], ans:1, why:'全文强调有方法地慢读、读两遍能提升理解。' }
  ]},
  { id:'R2', title:'Why handwriting still helps', text:'Typing is faster, but a growing number of studies suggest that writing by hand helps students learn. When students take notes by hand, they cannot write every word, so they must listen carefully and decide what is important. This extra thinking makes the information easier to remember. In one experiment, students who wrote notes by hand remembered more concepts a week later than students who typed the same notes. The researchers do not say that typing is bad; they simply advise using handwriting when the goal is deep understanding.', qs:[
    { q:'Why does handwriting help learning?', opts:['It is faster than typing','It forces students to choose key points','It makes notes look cleaner','It avoids using computers'], ans:1, why:'原文"they must listen carefully and decide what is important"。' },
    { q:'What did the experiment show?', opts:['Typing was better for memory','Handwriting helped remember more concepts','Students forgot everything','Handwriting was too slow'], ans:1, why:'原文"students who wrote notes by hand remembered more concepts a week later"。' },
    { q:'What is the researchers attitude to typing?', opts:['They think it is useless','They say it is bad for health','They do not say it is bad','They advise it for deep understanding'], ans:2, why:'原文"do not say that typing is bad"。' },
    { q:'When do researchers advise using handwriting?', opts:['When taking quick notes','When the goal is deep understanding','When typing is not available','When writing long essays'], ans:1, why:'原文"advise using handwriting when the goal is deep understanding"。' },
    { q:'Which title fits best?', opts:['The End of Typing','Why Writing by Hand Still Matters','How to Type Faster','A Survey of Students'], ans:1, why:'全文主题是手写记笔记的益处。' }
  ]},
  { id:'R3', title:'Coffee and daily life', text:'Coffee is one of the most popular drinks in the world. It is made from the beans of the coffee plant, which grow best in warm countries. The beans are picked, dried and then roasted, a process that gives coffee its special smell and taste. People drink coffee mainly because it contains caffeine, a substance that can make a person feel more awake and less sleepy. However, too much caffeine may cause sleeplessness or a fast heartbeat, so doctors advise drinking it in moderation. In many cultures, coffee is more than a drink: it is a reason to meet friends and talk.', qs:[
    { q:'Where do coffee beans grow best?', opts:['In cold countries','In warm countries','Only in mountains','Only near the sea'], ans:1, why:'原文"grow best in warm countries"。' },
    { q:'What happens to beans before they become coffee?', opts:['They are picked, dried and roasted','They are frozen and cut','They are mixed with milk','They are left in the sun for years'], ans:0, why:'原文"The beans are picked, dried and then roasted"。' },
    { q:'Why do people mainly drink coffee?', opts:['It tastes sweet','It contains caffeine that helps people stay awake','It is cheaper than water','It has no effect on the body'], ans:1, why:'原文"mainly because it contains caffeine ... feel more awake"。' },
    { q:'What do doctors advise?', opts:['Drinking as much as possible','Drinking in moderation','Never drinking coffee','Drinking only at night'], ans:1, why:'原文"doctors advise drinking it in moderation"。' },
    { q:'In many cultures, coffee is also a way to ______.', opts:['stay alone','meet friends and talk','avoid work','replace meals'], ans:1, why:'结尾"it is a reason to meet friends and talk"。' }
  ]},
  { id:'R4', title:'Exercise and the brain', text:'Most people exercise to keep their body fit, but research shows that physical activity is also good for the brain. When we exercise, the heart pumps more blood, carrying oxygen and nutrients to brain cells. Studies have found that regular exercise can improve memory and attention, especially in older adults. Even a thirty-minute walk a day may help. Scientists believe that exercise increases a substance called BDNF, which supports the growth of new brain connections. This may explain why people who exercise regularly often feel sharper and less forgetful.', qs:[
    { q:'Why do most people exercise according to the passage?', opts:['To improve memory','To keep their body fit','To make friends','To sleep less'], ans:1, why:'原文"Most people exercise to keep their body fit"。' },
    { q:'What does exercise carry to brain cells?', opts:['Oxygen and nutrients','Only water','Sugar','Noise'], ans:0, why:'原文"carrying oxygen and nutrients to brain cells"。' },
    { q:'Who especially benefits from exercise for memory?', opts:['Young children','Older adults','Office workers only','Students only'], ans:1, why:'原文"especially in older adults"。' },
    { q:'What is BDNF?', opts:['A kind of exercise','A substance supporting brain connections','A brain disease','A type of food'], ans:1, why:'原文"a substance called BDNF, which supports the growth of new brain connections"。' },
    { q:'What is the best title?', opts:['Exercise Is Only for the Body','How Exercise Helps the Brain','The History of Walking','Sleep and Health'], ans:1, why:'全文讲运动对大脑的益处。' }
  ]},
  { id:'R5', title:'Time management', text:'Many people feel that they never have enough time. In fact, most of us have the same twenty-four hours each day; the difference lies in how we use them. A useful method is to write down the three most important tasks each evening and do them first the next day. Another idea is the "twenty-five minute rule": work without interruption for twenty-five minutes, then take a short break. This keeps the mind fresh and makes big tasks feel smaller. Experts also warn against spending too much time on email and social media, which can eat up hours without our noticing.', qs:[
    { q:'What is the main cause of lacking time according to the passage?', opts:['Having fewer hours than others','How we use our time','Working too hard','Sleeping too much'], ans:1, why:'原文"the difference lies in how we use them"。' },
    { q:'What should we do each evening?', opts:['Plan the whole week','Write down three important tasks','Stop working early','Check email for hours'], ans:1, why:'原文"write down the three most important tasks each evening"。' },
    { q:'What is the twenty-five minute rule?', opts:['Work 25 minutes then take a break','Work only 25 minutes a day','Rest 25 minutes each hour','Sleep 25 minutes'], ans:0, why:'原文"work without interruption for twenty-five minutes, then take a short break"。' },
    { q:'What do experts warn against?', opts:['Taking short breaks','Writing down tasks','Too much time on email and social media','Morning work'], ans:2, why:'原文"warn against spending too much time on email and social media"。' },
    { q:'What is the passage mainly about?', opts:['How to manage time well','How to make more hours','Why emails are useful','The value of sleep'], ans:0, why:'全文讲时间管理方法。' }
  ]},
  { id:'R6', title:'City green spaces', text:'Parks and green spaces are an important part of a city. They give people a place to rest, exercise and meet neighbors. Research has shown that people who live near parks walk more and report better health. Green spaces also help the environment: trees clean the air, provide shade and lower the temperature in hot summers. For children, a park is an outdoor classroom where they can learn about nature. City planners therefore argue that parks should be treated as basic public services, just like schools and hospitals, rather than as luxury decoration.', qs:[
    { q:'What do parks give people according to the passage?', opts:['Only a place to sleep','A place to rest, exercise and meet neighbors','Free food','Cars and roads'], ans:1, why:'原文"give people a place to rest, exercise and meet neighbors"。' },
    { q:'What did research find about people near parks?', opts:['They walk more and report better health','They stay at home more','They get sick more often','They dislike exercise'], ans:0, why:'原文"people who live near parks walk more and report better health"。' },
    { q:'How do trees help the environment?', opts:['They make the city hotter','They clean the air and provide shade','They stop all traffic','They increase noise'], ans:1, why:'原文"trees clean the air, provide shade and lower the temperature"。' },
    { q:'What is a park for children?', opts:['An outdoor classroom','A place to study exams','A kind of school bus','A computer room'], ans:0, why:'原文"a park is an outdoor classroom"。' },
    { q:'What do city planners argue?', opts:['Parks are luxury decoration','Parks should be basic public services','Parks cost too much','Parks are only for children'], ans:1, why:'结尾"parks should be treated as basic public services"。' }
  ]}
];

// 题型三：概括段落大意和补全句子（heading 为段落标题匹配，comp 为补全句子）
const ZX2_SUMMARY = [
  { id:'S1', title:'Ways to improve focus', paras:[
    'A. Put your phone in another room while studying. Even a silent phone on the desk can take part of your attention, because you expect it to ring.',
    'B. Work in blocks of twenty-five minutes, then take a five-minute break. Short breaks keep the mind fresh and make a long task feel less difficult.',
    'C. Write down the single most important task before you start. When you finish it, anything else you do is a bonus, not a duty.',
    'D. Study at the same time each day. A fixed time turns studying into a habit, so you need less willpower to begin.',
    'E. Get enough sleep the night before. A tired brain finds it much harder to concentrate than a rested one.'
  ], headings:['A. Set a fixed study time','B. Rest well before studying','C. Remove distraction','D. Choose one key task','E. Take short breaks','F. Eat before studying'], headAns:[2,4,3,0,1],
  comps:[
    { q:'A silent phone on the desk can still ______.', opts:['save your time','distract you','improve focus','help you rest'], ans:1, why:'A 段指出即使静音的手机也会占用注意力。' },
    { q:'Short breaks make a long task feel ______.', opts:['more difficult','less difficult','much longer','very boring'], ans:1, why:'B 段"make a long task feel less difficult"。' },
    { q:'After finishing the key task, other work is a ______.', opts:['duty','bonus','problem','rule'], ans:1, why:'C 段"anything else you do is a bonus, not a duty"。' },
    { q:'A fixed study time turns studying into a ______.', opts:['burden','habit','test','game'], ans:1, why:'D 段"turns studying into a habit"。' },
    { q:'A tired brain finds it harder to ______.', opts:['sleep','concentrate','walk','remember names'], ans:1, why:'E 段"a tired brain finds it much harder to concentrate"。' }
  ]},
  { id:'S2', title:'Four ways to save money as a student', paras:[
    'A. The cheapest place to live is often a shared room. Splitting rent with one or two friends can cut your housing cost in half.',
    'B. Before you buy a textbook, check the library or an online second-hand store. Many used books cost less than a quarter of the new price.',
    'C. A daily coffee from a cafe may seem small, but it can cost over six hundred dollars a year. Making coffee at home keeps that money.',
    'D. Many cities offer free or cheap tickets for students to museums and concerts. Bring your student card and enjoy culture without spending much.',
    'E. Plan your meals before shopping. A short list stops you from buying things you do not need and reduces food waste.'
  ], headings:['A. Use your student card','B. Share a room','C. Buy used books','D. Make coffee at home','E. Plan meals ahead','F. Work part-time'], headAns:[1,2,3,0,4],
  comps:[
    { q:'Sharing a room can cut housing cost ______.', opts:['in half','by a quarter','to zero','by ten percent'], ans:0, why:'A 段"cut your housing cost in half"。' },
    { q:'Used books may cost less than ______ of the new price.', opts:['a half','a quarter','twice','ten times'], ans:1, why:'B 段"less than a quarter of the new price"。' },
    { q:'Daily coffee from a cafe can cost over ______ a year.', opts:['sixty dollars','six hundred dollars','six thousand dollars','six dollars'], ans:1, why:'C 段"over six hundred dollars a year"。' },
    { q:'With a student card you can enjoy culture ______.', opts:['at high prices','for free or cheap','only at home','only online'], ans:1, why:'D 段"free or cheap tickets ... Bring your student card"。' },
    { q:'A shopping list helps you avoid buying ______.', opts:['food','unneeded things','books','coffee'], ans:1, why:'E 段"stops you from buying things you do not need"。' }
  ]},
  { id:'S3', title:'Simple habits for better health', paras:[
    'A. Drinking enough water is the simplest step. Water helps the body remove waste and keeps the skin healthy.',
    'B. A short walk after lunch improves digestion and lifts your mood. It does not have to be fast or long.',
    'C. Going to bed at a regular time helps the body clock. A regular schedule makes it easier to fall asleep and wake up.',
    'D. Taking a deep breath for a few minutes can calm the mind. This simple action reduces stress before an important task.',
    'E. Stretching the neck and shoulders during work prevents pain caused by sitting for hours in front of a screen.'
  ], headings:['A. Breathe to calm down','B. Drink more water','C. Stretch during work','D. Walk after meals','E. Keep a regular bedtime','F. Eat more meat'], headAns:[1,3,4,0,2],
  comps:[
    { q:'Water helps the body ______.', opts:['remove waste','gain weight','sleep less','stop breathing'], ans:0, why:'A 段"Water helps the body remove waste"。' },
    { q:'A short walk after lunch improves ______.', opts:['memory','digestion and mood','speed','hearing'], ans:1, why:'B 段"improves digestion and lifts your mood"。' },
    { q:'A regular bedtime helps the ______.', opts:['body clock','stomach only','eyes only','hands'], ans:0, why:'C 段"helps the body clock"。' },
    { q:'Deep breathing can ______ before a task.', opts:['increase stress','calm the mind','cause pain','make noise'], ans:1, why:'D 段"can calm the mind ... reduces stress"。' },
    { q:'Stretching prevents pain from ______.', opts:['walking','sitting for hours','sleeping','drinking water'], ans:1, why:'E 段"prevents pain caused by sitting for hours"。' }
  ]},
  { id:'S4', title:'Why reading paper books still matters', paras:[
    'A. Paper books do not send notifications. When you read a novel on paper, nothing pulls your attention away.',
    'B. Studies show that people remember details better after reading on paper. Turning pages gives the brain a clear sense of progress.',
    'C. A printed book is easy to lend to a friend. You can write notes in the margin, and a used book can be passed on for years.',
    'D. For students, paper books reduce eye tiredness during long reading sessions.',
    'E. A physical book works without electricity, so it can be read anywhere, even on a train or in a park.'
  ], headings:['A. Easy to share','B. No messages to interrupt','C. Works without power','D. Better memory of details','E. Less eye tiredness','F. Cheaper than all ebooks'], headAns:[1,3,0,4,2],
  comps:[
    { q:'Paper books do not send ______.', opts:['notifications','smells','pages','words'], ans:0, why:'A 段"do not send notifications"。' },
    { q:'Turning pages gives a sense of ______.', opts:['failure','progress','danger','humor'], ans:1, why:'B 段"a clear sense of progress"。' },
    { q:'You can write notes in the ______.', opts:['margin','cover','back','box'], ans:0, why:'C 段"write notes in the margin"。' },
    { q:'Paper books reduce eye ______ during long reading.', opts:['happiness','tiredness','speed','size'], ans:1, why:'D 段"reduce eye tiredness"。' },
    { q:'A physical book can be read without ______.', opts:['light','electricity','hands','words'], ans:1, why:'E 段"works without electricity"。' }
  ]},
  { id:'S5', title:'Tips for a successful job interview', paras:[
    'A. Prepare before the interview. Read the job description and think about examples from your past work that match the position.',
    'B. Arrive on time, or even ten minutes early. Being late gives a bad first impression that is hard to change.',
    'C. Dress appropriately. Clothes do not decide your ability, but they show respect for the company and the interviewer.',
    'D. Listen carefully to each question and answer directly. It is better to give one clear example than a long, unfocused story.',
    'E. Ask questions at the end. This shows interest in the job and helps you decide if the company is right for you.'
  ], headings:['A. Dress appropriately','B. Prepare in advance','C. Ask questions','D. Arrive early','E. Answer clearly','F. Bring a gift'], headAns:[1,3,0,4,2],
  comps:[
    { q:'Being late gives a ______ first impression.', opts:['good','bad','funny','strong'], ans:1, why:'B 段"Being late gives a bad first impression"。' },
    { q:'Clothes show ______ for the company.', opts:['respect','money','speed','fear'], ans:0, why:'C 段"they show respect for the company"。' },
    { q:'It is better to give one clear ______.', opts:['story','example','joke','number'], ans:1, why:'D 段"one clear example than a long, unfocused story"。' },
    { q:'Asking questions shows ______ in the job.', opts:['interest','doubt','anger','boredom'], ans:0, why:'E 段"This shows interest in the job"。' },
    { q:'Before the interview, think about ______ from past work.', opts:['salary','examples','photos','names'], ans:1, why:'A 段"think about examples from your past work"。' }
  ]},
  { id:'S6', title:'How to build a vocabulary', paras:[
    'A. Do not memorize a word list only. Put each new word into a sentence you care about, so that it becomes part of your own language.',
    'B. Read material that is slightly above your level. New words met in a real context are easier to understand and remember.',
    'C. Review at planned times: after one day, three days and one week. This spaced review moves words into long-term memory.',
    'D. Use a new word three times in speaking or writing. Active use is far more effective than silent reading.',
    'E. Learn common word parts, such as prefixes and suffixes. Knowing "un-" or "-ful" helps you guess many new words.'
  ], headings:['A. Read a bit above your level','B. Learn word parts','C. Use words actively','D. Review at spaced times','E. Put words in sentences','F. Watch more videos'], headAns:[4,0,3,2,1],
  comps:[
    { q:'New words met in a real ______ are easier to remember.', opts:['list','context','dictionary','test'], ans:1, why:'B 段"New words met in a real context"。' },
    { q:'Spaced review moves words into ______ memory.', opts:['short-term','long-term','working','visual'], ans:1, why:'C 段"moves words into long-term memory"。' },
    { q:'Using a new word three times is more ______ than silent reading.', opts:['effective','difficult','boring','expensive'], ans:0, why:'D 段"far more effective than silent reading"。' },
    { q:'Knowing "un-" helps you ______ new words.', opts:['forget','guess','spell wrongly','avoid'], ans:1, why:'E 段"helps you guess many new words"。' },
    { q:'You should not memorize only a ______.', opts:['sentence','word list','story','passage'], ans:1, why:'A 段"Do not memorize a word list only"。' }
  ]}
];

// 题型四：填句补文（短文挖 5 空，从 6 个句子中选 5 个；ans 为句子在 bank 中的下标）
const ZX2_GAPSENT = [
  { id:'GS1', title:'A morning routine', bank:[
    'This small habit can change the whole day.',
    'For example, you can write three sentences about your plans.',
    'Instead, leave ten minutes for yourself.',
    'Many successful people share one simple habit.',
    'Over time, this quiet time becomes something you look forward to.',
    'They check their phone immediately after waking up.'
  ], keys:['Many successful people share one simple habit.','Instead, leave ten minutes for yourself.','For example, you can write three sentences about your plans.','This small habit can change the whole day.','Over time, this quiet time becomes something you look forward to.'],
  text:'___1___ They do not rush out of bed and start working right away. ___2___ In those ten minutes, they may drink a glass of water, stretch, or simply sit and think. Some people keep a short morning journal. ___3___ The goal is not to do more work, but to begin the day calmly. ___4___ It gives the mind a moment to organize before the demands of the day arrive. ___5___',
  why:['首句总起：许多成功者有一个简单习惯。','承接"不立刻工作"，改为留十分钟给自己。','举例说明晨间日记写什么。','总结这个小习惯的意义。','点明独处时间会逐渐令人期待。'] },
  { id:'GS2', title:'Learning from mistakes', bank:[
    'The important thing is what you do after failing.',
    'A student who fails a test can review the wrong answers.',
    'Mistakes are often treated as something shameful.',
    'In this way, failure becomes information rather than judgment.',
    'This attitude turns a bad experience into real progress.',
    'Therefore, no one should ever make a mistake.'
  ], keys:['Mistakes are often treated as something shameful.','The important thing is what you do after failing.','A student who fails a test can review the wrong answers.','In this way, failure becomes information rather than judgment.','This attitude turns a bad experience into real progress.'],
  text:'___1___ In fact, they are a natural part of learning. When we try something new, we cannot expect to be perfect at once. ___2___ Some people give up, while others look for the reason and try again. ___3___ They can find out which points they did not understand and study them again. ___4___ ___5___ So the next time you fail, ask yourself what you can learn from it.',
  why:['首句对比：错误常被看作羞耻的事。','转折到关键在失败后怎么做。','举例说明学生如何复盘错题。','总结失败变成信息而非评判。','点明这种态度带来进步。'] },
  { id:'GS3', title:'Why we need breaks at work', bank:[
    'The brain, however, is not built to focus for hours without rest.',
    'A short break does not mean that you are lazy.',
    'Many workers try to keep working without stopping.',
    'They may take a walk, look out of the window, or drink some water.',
    'After the break, they usually return with more energy.',
    'Long breaks are always better than short ones.'
  ], keys:['Many workers try to keep working without stopping.','The brain, however, is not built to focus for hours without rest.','They may take a walk, look out of the window, or drink some water.','After the break, they usually return with more energy.','A short break does not mean that you are lazy.'],
  text:'___1___ They believe that more hours always mean more work. ___2___ Research shows that attention drops after about twenty-five minutes of continuous effort. This is why some people use short, regular breaks. ___3___ These small actions give the mind a chance to rest. ___4___ ___5___ A few minutes away from the desk can improve both mood and efficiency.',
  why:['首句：许多工作者不停歇。','转折指出大脑无法长时间专注。','说明休息时做什么。','讲休息后精力更足。','总结短暂休息不等于偷懒。'] },
  { id:'GS4', title:'The joy of cooking', bank:[
    'Cooking at home is becoming popular again.',
    'It also saves money compared with eating out every day.',
    'You do not need to be a professional cook to enjoy it.',
    'Even a simple dish can give a sense of achievement.',
    'Most importantly, cooking is a skill that lasts a lifetime.',
    'Ordering food online is always healthier.'
  ], keys:['Cooking at home is becoming popular again.','You do not need to be a professional cook to enjoy it.','Even a simple dish can give a sense of achievement.','It also saves money compared with eating out every day.','Most importantly, cooking is a skill that lasts a lifetime.'],
  text:'___1___ More young people are choosing to prepare their own meals. ___2___ A beginner can start with eggs, vegetables and a little practice. ___3___ When a meal turns out well, the cook feels proud. Besides the pleasure, there is a practical reason. ___4___ ___5___ For these reasons, learning to cook is worth the effort.',
  why:['首句总起：在家做饭重新流行。','说明不必是专业厨师。','讲简单菜品也有成就感。','补充省钱的实际好处。','强调厨艺是受用一生的技能。'] },
  { id:'GS5', title:'Making friends in a new city', bank:[
    'Moving to a new city can feel lonely at first.',
    'Joining a club is one practical way to meet people.',
    'Friendship usually grows from repeated, relaxed contact.',
    'You might also volunteer for activities you care about.',
    'It takes time, but the effort is worth it.',
    'Nobody ever feels lonely after moving.'
  ], keys:['Moving to a new city can feel lonely at first.','Joining a club is one practical way to meet people.','You might also volunteer for activities you care about.','Friendship usually grows from repeated, relaxed contact.','It takes time, but the effort is worth it.'],
  text:'___1___ You may know no one, and daily life can seem strange. Fortunately, there are ways to build a social circle. ___2___ There you meet people who share the same interest. ___3___ Working together with others creates natural conversation. Remember that close friends are rarely made in one meeting. ___4___ Be patient and keep showing up. ___5___ Before long, the new city will start to feel like home.',
  why:['首句：搬到新城市起初会孤独。','建议加入社团认识人。','建议参加志愿活动。','说明友谊来自反复轻松的接触。','总结努力是值得的。'] },
  { id:'GS6', title:'The benefits of handwriting notes', bank:[
    'Many students now type their notes on a laptop.',
    'Handwriting forces you to decide what is truly important.',
    'This selection process helps you understand the material.',
    'As a result, handwritten notes often lead to better memory.',
    'You can also draw arrows and marks to connect ideas.',
    'Typing is always slower and less useful than handwriting.'
  ], keys:['Many students now type their notes on a laptop.','Handwriting forces you to decide what is truly important.','This selection process helps you understand the material.','As a result, handwritten notes often lead to better memory.','You can also draw arrows and marks to connect ideas.'],
  text:'___1___ It is fast and tidy, but research suggests that writing by hand has special value. When you write by hand, you cannot record every word. ___2___ ___3___ You must put ideas into your own words, which deepens understanding. Some learners use different colors or symbols. ___4___ For exams that require real understanding, this method is helpful. ___5___ Of course, typing still has its place for long documents.',
  why:['首句对比现状：许多学生用电脑打字。','手写迫使你筛选重点。','筛选过程帮助理解材料。','结果：手写笔记更利于记忆。','补充可用箭头符号连接想法。'] }
];

// 题型五：填词补文（词库选词；keys 按空格顺序给出正确答案，干扰项从 bank 生成）
const ZX2_GAPWORD = [
  { id:'GW1', title:'A healthy lifestyle', bank:['enough','regular','instead of','however','energy','sleep','habits','affect','improve','small','decide','together','especially','avoid','long'],
  keys:['habits','small','improve','enough','sleep','affect','decide','together','however','regular'],
  why:['small daily habits 每日小习惯','a small change 一个小小的改变','improve your life 改善生活','get enough 获得充足','sleep every night 每晚睡眠','affect attention 影响注意力','decide to move 决定活动','exercise together 一起锻炼','however 表转折','regular schedule 规律作息'],
  text:'Good health is built from small daily __1__. You do not need to change everything at once. Even a __2__ change can __3__ your life. First, make sure you get __4__ __5__ every night. Lack of sleep will __6__ your attention the next day. Second, __7__ to move your body for thirty minutes a day. You can walk, run, or exercise with friends __8__. __9__, many people find it hard to keep a __10__ schedule. Start with one step and keep going.' },
  { id:'GW2', title:'The art of listening', bank:['carefully','understand','questions','speaker','notes','meaning','interrupt','respect','clear','actually','quickly','summarize','opinion','words','silence'],
  keys:['carefully','notes','opinion','meaning','words','respect','actually','questions','clear','summarize'],
  why:['listen carefully 认真听','take notes 记笔记','form your opinion 形成自己的看法','the meaning behind the words 字面背后的含义','not just the words 不只是单词','show respect 表示尊重','actually 实际上','ask questions 提问','make things clear 弄清楚','summarize 总结'],
  text:'Good listening is an active skill. When someone speaks, listen __1__ and take short __2__. Do not form your __3__ before the other person finishes. Try to catch the __4__ behind the words, not just the __5__. This shows __6__ and builds trust. Listening is __7__ harder than speaking, because it requires patience. When you are unsure, ask __8__ to make things __9__. At the end, __10__ what you heard to confirm you understood correctly.' },
  { id:'GW3', title:'Saving for a goal', bank:['goal','save','budget','spend','monthly','actually','small','add up','worth','patient','impulse','track','reward','instead','soon'],
  keys:['goal','add up','monthly','save','track','spend','impulse','patient','worth','reward'],
  why:['a clear goal 明确目标','small amounts add up 小额累积','a monthly plan 月度计划','how much you can save 能存多少','track what you spend 记录开销','spend on 花费在','on impulse 冲动消费','be patient 有耐心','what is really worth 真正值得的','a small reward 小奖励'],
  text:'A clear __1__ makes saving easier. Many small amounts __2__ over time. Start by setting a __3__ plan and decide how much you can __4__ each month. Then __5__ what you __6__ on. It is easy to buy things on __7__. Be __8__ and think about what is really __9__. When you reach your goal, give yourself a small __10__.' },
  { id:'GW4', title:'The power of reading aloud', bank:['pronunciation','aloud','fluency','confidence','meaning','sentences','pause','meaningful','gradually','shadow','record','alone','attention','rhythm','fear'],
  keys:['aloud','pronunciation','confidence','pause','sentences','rhythm','alone','record','fear','fluency'],
  why:['read aloud 朗读','train pronunciation 训练发音','build confidence 建立信心','where you pause 在哪里停顿','group sentences 划分意群','the rhythm of speech 语音节奏','repeat it alone 自己跟读','record your voice 录音','worry about fear 克服恐惧','fluency 流利度'],
  text:'Reading __1__ is a simple but powerful way to improve English. It trains your __2__ and builds __3__. When you read, pay attention to where you __4__, because that is how native speakers group __5__. The __6__ of speech becomes natural over time. A useful method is "shadowing": listen to a short audio and repeat it __7__. You can __8__ your voice and compare it with the original. Do not worry about __9__ at first; __10__ will come with practice.' },
  { id:'GW5', title:'Dealing with stress', bank:['stress','breath','exercise','support','manage','deadline','pause','clear','restore','positive','ignore','regular','situation','talk','energy'],
  keys:['stress','deadline','situation','pause','breath','exercise','restore','positive','ignore','support'],
  why:['face stress 面对压力','a tight deadline 紧迫的期限','a difficult situation 困境','take a pause 暂停一下','a deep breath 深呼吸','physical exercise 体育锻炼','restore energy 恢复精力','a positive view 积极看法','rather than ignore 而不是忽视','ask for support 寻求支持'],
  text:'Everyone faces __1__ at some point. It may come from a tight __2__ or a difficult __3__. The first step is to __4__ and take a deep __5__. Short physical __6__ can __7__ your energy and calm the mind. Try to keep a __8__ view rather than __9__ the problem. Do not hide your feelings; ask for __10__ from someone you trust.' },
  { id:'GW6', title:'Why punctuality matters', bank:['punctual','respect','trust','waste','meeting','habit','reputation','value','arrive','plan','excuse','others','time','early','lose'],
  keys:['punctual','respect','time','waste','meeting','reputation','habit','early','excuse','arrive','trust'],
  why:['being punctual 守时','show respect 表示尊重','other people and their time 他人的时间','waste the time 浪费时间','everyone in the meeting 与会者','build a reputation 建立声誉','a habit 一个习惯','leave a few minutes early 提前几分钟','need a real excuse 需要正当理由','arrive on time 准时到达','trusted with responsibility 被委以重任'],
  text:'Being __1__ is more than a social rule. It shows __2__ for other people and their __3__. When someone is late, it may __4__ the time of everyone in the __5__. Over time, punctuality builds a good __6__. It is a __7__ that you can develop by leaving a few minutes __8__. Of course, unexpected things happen, but frequent delays need a real __9__. People who __10__ on time are often __11__ with more responsibility.' }
];

// 题型六：完形补文（括号给词，填其正确形式；keys 按空格顺序，bank 提供干扰项）
const ZX2_CLOZE = [
  { id:'CZ1', title:'A trip to the mountains', bank:['beautiful','carefully','suddenly','climbers','safety','tired','slowly','clouds','reached','enjoyed'],
  keys:['climbers','beautiful','slowly','suddenly','clouds','safety','tired','carefully','reached','enjoyed'],
  why:['climbers 登山者们（名词复数）','beautiful 美丽的（形容词）','slowly 慢慢地（副词）','suddenly 突然（副词）','clouds 云（名词复数）','safety 安全（名词作定语）','tired 疲惫的（形容词）','carefully 仔细地（副词）','reached 到达（过去式）','enjoyed 享受（过去式）'],
  text:'Last summer, our group of __1__ (climb) went to the mountains. At first, the sky was clear and the view was __2__ (beauty). We walked __3__ (slow) along the narrow path. __4__ (sudden), dark __5__ (cloud) appeared above us. We stopped to check our __6__ (safe) equipment. Although we felt __7__ (tire), we decided to continue __8__ (care). After two hours, we __9__ (reach) the top and __10__ (joy) the amazing view.' },
  { id:'CZ2', title:'A letter of thanks', bank:['sincerely','kindness','helpful','grateful','arrangement','warmly','memorable','students','guidance','deeply'],
  keys:['grateful','helpful','guidance','deeply','kindness','memorable','arrangement','sincerely','students','warmly'],
  why:['grateful 感激的','helpful 有帮助的','guidance 指导（名词）','deeply 深深地（副词）','kindness 善意（名词）','memorable 难忘的（形容词）','arrangement 安排（名词）','sincerely 真诚地','students 学生们（复数）','warmly 热情地'],
  text:'Dear Professor Li, I am writing to express my __1__ (grate) for your __2__ (help) advice during my study. Your __3__ (guide) was __4__ (deep) valuable to my research. Without your __5__ (kind), I could not have finished the project. I also enjoy the __6__ (memory) days we spent in the reading room. Thank you for the careful __7__ (arrange) of the seminar. I __8__ (sincere) hope that more __9__ (student) can learn from you. We all welcome you __10__ (warm) to our city. Yours, Wang Lin' },
  { id:'CZ3', title:'Protecting the environment', bank:['pollution','widely','reusable','reducing','effect','harmful','government','citizens','gradually','action'],
  keys:['pollution','harmful','reducing','gradually','reusable','government','citizens','widely','action','effect'],
  why:['pollution 污染（名词）','harmful 有害的','reducing 减少（动名词作主语）','gradually 逐渐地','reusable 可重复使用的','government 政府','citizens 市民们','widely 广泛地','action 行动','effect 效果（名词）'],
  text:'Environmental __1__ (pollute) is a serious problem today. Waste from factories is __2__ (harm) to our health. __3__ (reduce) waste is one useful step. People are __4__ (gradual) using __5__ (reuse) bags instead of plastic ones. The __6__ (govern) has passed new laws, and __7__ (citizen) are taking part in clean-up activities. This idea is now __8__ (wide) accepted. If everyone takes __9__ (act), we will see a real __10__ (affect) in the years to come.' },
  { id:'CZ4', title:'A successful interview', bank:['preparation','confident','clearly','examples','impressed','questions','politely','experiences','professional','listening'],
  keys:['preparation','examples','clearly','confident','experiences','listening','politely','impressed','professional','questions'],
  why:['preparation 准备','examples 例子（复数）','clearly 清楚地','confident 自信的','experiences 经历','listening 倾听的','politely 礼貌地','impressed 印象深刻的','professional 专业的','questions 问题'],
  text:'Good __1__ (prepare) is the key to a successful interview. Beforehand, think of __2__ (example) from your past work. During the interview, speak __3__ (clear) and stay __4__ (confidence). When asked about your __5__ (experience), focus on results. The __6__ (listen) skill is equally important: hear the question fully before answering. If you do not understand, ask __7__ (polite) for clarification. At the end, the interviewer was __8__ (impress) by your __9__ (profession) attitude and thoughtful __10__ (question).' },
  { id:'CZ5', title:'The internet and education', bank:['online','recently','knowledge','flexible','learners','easily','traditional','communication','improve','widely'],
  keys:['online','recently','traditional','flexible','communication','learners','easily','widely','knowledge','improve'],
  why:['Online 在线的','Recently 最近','traditional 传统的','flexible 灵活的','communication 交流','learners 学习者','easily 容易地','widely 广泛地','knowledge 知识','improve 提高'],
  text:'__1__ (line) courses have grown fast. __2__ (recent) changes in technology make it possible to study anywhere. Unlike __3__ (tradition) classrooms, internet learning is __4__ (flexibility). It also allows __5__ (communicate) between teachers and students across the world. New __6__ (learn) can find information __7__ (easy) than ever before. This __8__ (wide) available __9__ (know) helps people __10__ (improvement) their skills at their own pace.' },
  { id:'CZ6', title:'A healthy mind', bank:['negative','regularly','happiness','thinking','balanced','energy','social','reduce','chemicals','peaceful'],
  keys:['peaceful','happiness','balanced','regularly','energy','reduce','social','thinking','negative','chemicals'],
  why:['peaceful 平静的','happiness 快乐（名词）','balanced 均衡的','regularly 定期地','energy 精力','reduce 减少','social 社交的','Thinking 思考（动名词）','negative 消极的','chemicals 化学物质'],
  text:'Mental health is as important as physical health. A __1__ (peace) mind helps us deal with daily pressure. Studies show that __2__ (happy) is linked to good sleep and a __3__ (balance) diet. We should exercise __4__ (regular) and get enough __5__ (energy). It is also useful to __6__ (reduction) time spent on negative news. Strong __7__ (society) connections give us support. __8__ (think) too much about problems can create __9__ (negativity) feelings. In the brain, certain __10__ (chemical) affect our mood.' }
];

// 题型七：写作（30 分，含题目、范文、中文、常用词组）
const ZX2_WRITING = [
  { id:'W1', title:'The Importance of Learning English', prompt:'请以 "The Importance of Learning English" 为题写一篇 100–120 词的短文，谈谈学习英语的重要性。', modelCn:'如今英语在世界各地被广泛使用。首先，它帮助我们阅读英文资料和了解外国文化。其次，掌握英语能为我们的工作和学习带来更多机会。对我们成年人来说，学英语永远不会太晚。只要我们每天坚持练习，就一定能取得进步。总之，英语是一项重要的技能，值得我们投入时间。', phrases:['nowadays','is widely used','first of all','in addition','never too late to learn','make progress','in a word','be worth doing'],
  model:'Nowadays, English is widely used around the world. First of all, it helps us read English materials and learn about foreign cultures. In addition, a good command of English can bring us more chances in work and study. For adults like us, it is never too late to learn English. As long as we keep practising every day, we are sure to make progress. In a word, English is an important skill, and it is worth spending time on it.' },
  { id:'W2', title:'How to Keep Healthy', prompt:'请以 "How to Keep Healthy" 为题写一篇 100–120 词的短文，给出保持健康的建议。', modelCn:'健康对每个人都非常重要。首先，我们应该有均衡的饮食，多吃蔬菜水果，少吃垃圾食品。其次，每天进行适量的运动，比如散步或跑步。此外，充足的睡眠同样不可缺少，我们应尽量在晚上十一点前睡觉。最后，保持积极的心态也很关键。只要坚持这些好习惯，我们就能拥有健康的身体。', phrases:['important for everyone','a balanced diet','plenty of','what is more','enough sleep','stay positive','last but not least','keep fit'],
  model:'Health is important for everyone. First, we should have a balanced diet, with more vegetables and fruit and less junk food. Second, we need to take regular exercise, such as walking or running, for at least thirty minutes a day. What is more, enough sleep is necessary, so we had better go to bed before eleven. Last but not least, staying positive helps us deal with pressure. If we keep these good habits, we will be able to keep fit.' },
  { id:'W3', title:'A Letter to a Friend', prompt:'假设你的朋友李华英语学习遇到困难，请写一封 100–120 词的信，给出你的建议。', modelCn:'亲爱的李华：听说你在英语学习上有困难，我很理解你的感受。其实学英语需要耐心和方法。首先，每天记几个单词并定期复习。其次，多听英语录音，模仿发音。另外，不要害怕犯错，勇敢开口说。我相信只要你坚持，一定会进步。祝好运！', phrases:['hear that','understand how you feel','first of all','what is more','be afraid of','make mistakes','keep trying','best wishes'],
  model:'Dear Li Hua, I hear that you are having trouble with your English, and I quite understand how you feel. Actually, learning English needs patience as well as methods. First of all, remember a few new words every day and review them regularly. What is more, listen to English recordings and imitate the pronunciation. Do not be afraid of making mistakes; just speak up bravely. I believe you will make progress as long as you keep trying. Best wishes! Yours, Zhang Ming' },
  { id:'W4', title:'My Favourite Book', prompt:'请以 "My Favourite Book" 为题写一篇 100–120 词的短文，介绍你最喜欢的一本书及原因。', modelCn:'我最喜欢的书是《鲁滨逊漂流记》。它讲述一个人独自在荒岛上生存的故事。主人公勇敢、聪明，从不放弃希望。这本书让我明白，面对困难时我们应该坚强和独立。每当我感到沮丧时，读这本书都会给我力量。它不仅仅是一本冒险小说，更是一本教人成长的好书。', phrases:['my favourite book','tells the story of','alone on an island','never gives up','face difficulties','in times of trouble','more than','worth reading'],
  model:'My favourite book is Robinson Crusoe. It tells the story of a man who lives alone on a lonely island. The hero is brave and clever, and he never gives up hope. This book teaches me that we should be strong and independent when we face difficulties. In times of trouble, reading it always gives me courage. It is more than an adventure story; it is a good book that helps us grow. I really think it is worth reading.' },
  { id:'W5', title:'The Value of Hard Work', prompt:'请以 "The Value of Hard Work" 为题写一篇 100–120 词的短文。', modelCn:'努力工作在生活中十分重要。首先，努力能帮助我们实现目标，无论是学习还是事业。其次，通过努力获得成功会让我们更有信心。当然，努力并不意味着盲目熬夜，我们还需要好的方法和计划。我相信，只要目标明确并持之以恒，每个人都能通过努力改变自己的生活。', phrases:['plays an important role','achieve our goals','as a result','of course','good methods','stick to','as long as','change our life'],
  model:'Hard work plays an important role in our life. First of all, it helps us achieve our goals, whether in study or in career. As a result of constant effort, we can build up confidence. Of course, working hard does not mean staying up late blindly; we also need good methods and a clear plan. I believe that as long as we stick to our goals, everyone can change their life through hard work.' },
  { id:'W6', title:'Protecting the Environment', prompt:'请以 "Protecting the Environment" 为题写一篇 100–120 词的短文，谈谈如何保护环境。', modelCn:'环境保护是我们共同的责任。首先，我们应节约用水用电，离开房间时随手关灯。其次，尽量乘坐公共交通，减少汽车尾气。此外，使用可重复利用的购物袋，减少塑料污染。政府也应制定更严格的法规。只要每个人都贡献一份力量，我们就能拥有更清洁的世界。', phrases:['our shared responsibility','save water and electricity','turn off','public transport','reusable bags','in addition','make a difference','a cleaner world'],
  model:'Protecting the environment is our shared responsibility. First, we should save water and electricity, such as turning off the lights when we leave a room. Second, we can choose public transport to reduce pollution from cars. In addition, using reusable shopping bags helps cut down plastic waste. The government should also make stricter rules. If everyone makes a small effort, we will enjoy a cleaner world.' },
  { id:'W7', title:'My Plan for the Future', prompt:'请以 "My Plan for the Future" 为题写一篇 100–120 词的短文。', modelCn:'每个人都有对未来的计划。我的计划是先认真学习，顺利通过学位英语考试。之后，我希望在工作中不断提升自己，掌握更多实用技能。同时，我会坚持锻炼身体，保持健康的生活方式。我知道实现计划需要努力和坚持，但我对此充满信心。我相信未来会越来越好。', phrases:['have a plan for','first of all','pass the exam','improve myself','keep doing exercise','in the meantime','be confident about','better and better'],
  model:'Everyone has a plan for the future. My plan is to study hard first and pass the degree English exam. After that, I hope to improve myself at work and learn more practical skills. In the meantime, I will keep doing exercise to stay healthy. I know that carrying out a plan needs effort and persistence, but I am confident about it. I believe the future will be better and better.' },
  { id:'W8', title:'The Benefits of Reading', prompt:'请以 "The Benefits of Reading" 为题写一篇 100–120 词的短文。', modelCn:'阅读是一项受益终生的好习惯。首先，阅读能扩大我们的词汇量，提高语言能力。其次，通过阅读我们可以了解世界各地的知识和文化。此外，阅读还能帮助我们放松，减轻压力。即使在忙碌的日子里，每天读十五分钟也会带来改变。总之，阅读既有趣又有用，我们应该坚持下去。', phrases:['a lifelong habit','expand our vocabulary','learn about','in addition','relax ourselves','reduce stress','even if','in a word'],
  model:'Reading is a lifelong habit that brings us many benefits. First of all, it expands our vocabulary and improves our language skills. Through reading, we can also learn about knowledge and cultures around the world. In addition, reading helps us relax and reduce stress. Even if we are busy, fifteen minutes of reading a day can make a difference. In a word, reading is both enjoyable and useful, so we should keep it up.' },
  { id:'W9', title:'A Letter of Thanks', prompt:'假设你得到了老师的帮助，请写一封 100–120 词的感谢信。', modelCn:'尊敬的王老师：我写信向您表示诚挚的感谢。上周我在准备考试时遇到很大困难，是您耐心地为我讲解难点。您的帮助让我重拾信心，最终顺利通过考试。我非常珍惜您的指导，也希望将来能像您一样帮助别人。再次感谢您的关心！学生：李明', phrases:['write to express','sincere thanks','have difficulty in','patiently explained','regain confidence','ch value','one day','thank you again'],
  model:'Dear Professor Wang, I am writing to express my sincere thanks to you. Last week, I had great difficulty in preparing for the exam, and it was you who patiently explained the difficult points to me. Your help allowed me to regain confidence, and I finally passed the exam. I really value your guidance, and I hope that one day I can help others just as you helped me. Thank you again for your kindness. Yours, Li Ming' },
  { id:'W10', title:'Learning from Failure', prompt:'请以 "Learning from Failure" 为题写一篇 100–120 词的短文。', modelCn:'失败并不可怕，关键在于我们如何面对它。首先，失败能告诉我们哪里出了问题，帮助我们找到改进的方法。其次，它能锻炼我们的意志，让我们更加坚强。许多成功人士都经历过多次失败，但他们从未放弃。因此，当我们遇到挫折时，应该冷静分析原因，继续努力。失败是成功之母。', phrases:['not terrible','the key lies in','find out','what went wrong','strengthen our will','give up','analyse the reason','the mother of success'],
  model:'Failure is not terrible; the key lies in how we face it. First of all, failure can show us what went wrong and help us find ways to improve. Second, it strengthens our will and makes us tougher. Many successful people have experienced failure many times, but they never gave up. Therefore, when we meet setbacks, we should calmly analyse the reason and keep trying. Failure is the mother of success.' },
  { id:'W11', title:'The Internet in Our Life', prompt:'请以 "The Internet in Our Life" 为题写一篇 100–120 词的短文。', modelCn:'互联网已经成为我们生活中不可缺少的一部分。它让我们快速获取信息、与人交流，也给学习和工作带来便利。然而，互联网也有缺点，比如虚假信息和过度沉迷。因此，我们应合理使用网络，控制上网时间，辨别信息真伪。只要正确利用，互联网就能成为我们学习和生活的好帮手。', phrases:['an important part of','get information','communicate with','however','false information','be addicted to','use it properly','a good helper'],
  model:'The Internet has become an important part of our daily life. It allows us to get information quickly and communicate with others, bringing great convenience to study and work. However, the Internet also has disadvantages, such as false information and the risk of being addicted to it. Therefore, we should use the Internet properly, control our online time and tell true information from false. Used correctly, it can be a good helper in our life.' },
  { id:'W12', title:'Keeping a Good Relationship with Others', prompt:'请以 "Keeping a Good Relationship with Others" 为题写一篇 100–120 词的短文。', modelCn:'良好的人际关系对每个人都很重要。首先，我们要学会倾听，尊重别人的想法。其次，真诚和诚实是友谊的基础，我们应信守承诺。此外，当别人遇到困难时，我们应主动提供帮助。最后，发生分歧时要冷静沟通，而不是争吵。只要用心经营，我们就能拥有真挚长久的友谊。', phrases:['important for everyone','learn to listen','respect others','be sincere and honest','keep our promises','lend a hand','calmly communicate','last a lifetime'],
  model:'Good relationships are important for everyone. First of all, we should learn to listen and respect the ideas of others. Second, being sincere and honest is the basis of friendship, so we must keep our promises. In addition, when others are in trouble, we should lend them a hand. Finally, when disagreement happens, communicate calmly instead of arguing. If we take care of our relationships with heart, we can enjoy true and lasting friendship.' }
];

// 英语二备考四阶段（330 天，目标 2027 年 10 月考试）
const ZX2_EXAM_DATE = '2027-10-24';
const ZX2_DAYS = 330;
const ZX2_PHASES = [
  { id:1, name:'启蒙筑基期', days:[1,45], goal:'字母音 + 音标 + 自然拼读', desc:'你只认识字母，先用 6 周补齐字母在词里的发音、44 个音标和拼读规则，同时开始积累高频小词，为后面的阅读打底。', focus:['26 个字母音','44 个国际音标','自然拼读入门','基础高频词'], color:'mint' },
  { id:2, name:'词汇语法期', days:[46,135], goal:'核心高频词 2000 + 考试语法', desc:'按考试要求铺开 2000 核心高频词，重点攻时态、非谓语、从句和词性转换——完形补文就考词性变化。同时用阅读判断和阅读选择入门精读。', focus:['高频词 2000','时态 / 非谓语 / 从句','词性转换','阅读判断 / 选择入门'], color:'blue' },
  { id:3, name:'题型专项期', days:[136,275], goal:'七大题型逐个攻克 + 写作', desc:'按真题分值轮训阅读判断、阅读选择、概括补全、填句补文、填词补文、完形补文和写作，练题干定位、同义替换、词性判断，并背作文框架。', focus:['阅读判断 10分','阅读选择 10分','概括 / 填句 / 填词 / 完形','写作 30分'], color:'violet' },
  { id:4, name:'真题冲刺期', days:[276,330], goal:'整套真题模考 + 作文模板', desc:'近半年每周做整套限时模考，按 100 分制估分，整理错题与高频错词，默写作文模板，目标稳定 60 分以上进考场。', focus:['整套限时模考','错题与高频词','作文模板默写','60 分达标'], color:'orange' }
];
// 英语二七大题型 + 模考轮换（8 天一循环）
const ZX2_TYPE_MODES = [
  { mod:'zx2Judge', name:'阅读判断', icon:'✅', xp:20 },
  { mod:'zx2Read', name:'阅读选择', icon:'📚', xp:20 },
  { mod:'zx2Summary', name:'概括补全', icon:'📝', xp:20 },
  { mod:'zx2GapSent', name:'填句补文', icon:'🧩', xp:20 },
  { mod:'zx2GapWord', name:'填词补文', icon:'🔤', xp:20 },
  { mod:'zx2Cloze', name:'完形补文', icon:'✏️', xp:20 },
  { mod:'zx2Writing', name:'写作训练', icon:'✍️', xp:25 },
  { mod:'zx2Mock', name:'完整真题模考', icon:'📋', xp:30 }
];

// 英语二完整模拟卷（按真题分值：阅读判断10 + 阅读选择10 + 概括补全10 + 填句补文10 + 填词补文15 + 完形补文15 + 写作30 = 100）
function makeZX2Mock(seed) {
  const s = Math.abs(Number(seed) || 1);
  const pickOne = (arr, n) => arr[n % arr.length];
  return {
    judge: pickOne(ZX2_JUDGE, s),
    read: pickOne(ZX2_READ, s + 1),
    summary: pickOne(ZX2_SUMMARY, s + 2),
    gapSent: pickOne(ZX2_GAPSENT, s + 3),
    gapWord: pickOne(ZX2_GAPWORD, s + 4),
    cloze: pickOne(ZX2_CLOZE, s + 5),
    writing: pickOne(ZX2_WRITING, s + 6)
  };
}
