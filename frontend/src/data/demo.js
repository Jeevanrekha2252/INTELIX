export const projects=[
{id:1,name:'Smart Campus 360',owner:'Aarav Mehta',health:82,status:'On Track',deadline:'18 Sep 2026',progress:76,tasks:34,done:26,risks:3,members:8,predicted:'21 Sep 2026'},
{id:2,name:'Citizen Service Portal',owner:'Meera Shah',health:68,status:'At Risk',deadline:'25 Sep 2026',progress:61,tasks:41,done:25,risks:7,members:11,predicted:'30 Sep 2026'},
{id:3,name:'Green Mobility Pilot',owner:'Rohan Kulkarni',health:91,status:'On Track',deadline:'02 Oct 2026',progress:88,tasks:27,done:24,risks:1,members:6,predicted:'30 Sep 2026'}];
export const tasks=[
{id:1,title:'Database schema & migrations',project:'Smart Campus 360',assignee:'Ishaan',avatar:'IM',status:'In Progress',priority:'High',progress:64,due:'Sep 10',risk:72,blocked:false},
{id:2,title:'Authentication & RBAC',project:'Smart Campus 360',assignee:'Ananya',avatar:'AS',status:'Completed',priority:'High',progress:100,due:'Sep 08',risk:5,blocked:false},
{id:3,title:'API integration layer',project:'Smart Campus 360',assignee:'Kabir',avatar:'KS',status:'Blocked',priority:'Critical',progress:38,due:'Sep 09',risk:91,blocked:true},
{id:4,title:'Mobile responsive QA',project:'Smart Campus 360',assignee:'Diya',avatar:'DP',status:'Pending',priority:'Medium',progress:15,due:'Sep 15',risk:34,blocked:false},
{id:5,title:'Analytics dashboard',project:'Citizen Service Portal',assignee:'Arjun',avatar:'AR',status:'In Progress',priority:'Medium',progress:54,due:'Sep 14',risk:61,blocked:false},
{id:6,title:'Notification service',project:'Citizen Service Portal',assignee:'Sana',avatar:'SK',status:'In Progress',priority:'High',progress:43,due:'Sep 12',risk:67,blocked:false}
];
export const activity=[['09:42','Ishaan updated Database schema to 64%','progress'],['09:18','Risk engine flagged API integration as critical','risk'],['08:55','Ananya completed Authentication & RBAC','done'],['08:31','Project health recalculated: 82 → 82','health'],['Yesterday','Kabir reported a dependency blocker on API layer','risk']];
export const workload=[['Ishaan','Backend','88%',88],['Ananya','Security','71%',71],['Kabir','Integration','96%',96],['Diya','QA','42%',42],['Arjun','Analytics','78%',78]];
export const trend=[{day:'Mon',health:73},{day:'Tue',health:76},{day:'Wed',health:74},{day:'Thu',health:79},{day:'Fri',health:81},{day:'Sat',health:80},{day:'Sun',health:82}];
export const deps=[['Database schema','API integration','Critical'],['API integration','Frontend integration','High'],['Frontend integration','QA & UAT','Medium'],['QA & UAT','Production release','Medium']];
