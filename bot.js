const Commando = require('discord.js-commando');
const config = require('./config.js');
const client = new Commando.Client({
  owner: config.ownerid,
  commandPrefix: '=',
  unknownCommandResponse: false
});

const path = require('path');

const fs = require('fs');
const file = ('./commands/economy/money.txt');

//Registers the different command groups.
client.registry
  .registerGroups([
    ['fun', 'Fun commands'],
    ['chattools', 'Chat moderation'],
    ['prob', 'Probability and decision makers.'],
    ['admin', 'Tools to help the bot and admins'],
    ['music', 'Music commands'],
    ['economy', 'Manage money']
  ])

  .registerDefaults()

  .registerCommandsIn(path.join(__dirname, 'commands'));

  client.on('ready', () =>{
    console.log('I am ready!');
  });

  client.login(config.token);

  client.on('message',message => {
    if(message.author.id == config.ownerid){
      if(message.content.toLowerCase() == '!forcedata'){
        getData();
      }
    }
  });

//Makes the bot unmutable.
  client.on('voiceStateUpdate', (oldMember, newMember) => {
    if(newMember.id == config.botid){
      if(newMember.serverMute){
        newMember.setMute(false);
      }
    }
  });

  //This changes their name in the money.txt file if they change their name.
  client.on('guildMemberUpdate',(oldMember,newMember)=> {

  });

  function getData(){
    if(!(fs.existsSync('./commands/chattools/plans.json'))){
      var js = {
        example: {
          dates: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Friday'
          ],
          times: [
            '6-4',
            '10-5',
            '4-10',
            '6-10'
          ],
          busy: false
        }
      };
      fs.appendFile('./commands/chattools/plans.json',JSON.stringify(js), err => {
        if(err){
          console.log(err);
        }
      });
    }
    for(var i = 0; i < config.planUsers.length; i++){
      client.fetchUser(config.planUsers[i]).then(user => {
        user.send('Are you going to be busy this week with work, vacation, etc?');
        var filter = m => (m.content.toLowerCase() == 'yes' || m.content.toLowerCase() == 'no');
        user.dmChannel.awaitMessages(filter, {max:1})
        .then(collected => {
          var js = JSON.parse(fs.readFileSync('./commands/chattools/plans.json'));
          if(collected.array()[0].content.toLowerCase() == 'yes'){
            collected.array()[0].reply('What days are you working? Correct format for message is "Monday Tuesday Wednesday Thursday Friday Saturday Sunday"')
            var days = [];
            var times = [];
            var collector = collected.array()[0].channel.createCollector(m => m.author.id == collected.array()[0].author.id);

            collector.on('message', m => {
              if(m.content.toLowerCase().includes('day')){
                if(m.content.toLowerCase().includes(',')){
                  m.reply('Incorrect format!');
                }else{
                  days = m.content.split(' ');
                  var dayNum = 0;
                  m.reply(`When are you busy on ${days[0]}?`);
                  var col = m.channel.createCollector(mes => m.author.id == mes.author.id);
                  col.on('message', mes => {
                    times[dayNum] = mes.content;
                    dayNum++;
                    if(days[dayNum]){
                      mes.reply(`When are you busy on ${days[dayNum]}?`);
                    }
                    if(dayNum == days.length){
                      col.stop();
                    }
                  });
                  col.on('end', collected => {
                    m.reply('Thank you');
                    js = JSON.parse(fs.readFileSync('./commands/chattools/plans.json'));
                      var jsStart = {
                        dates: [

                        ],
                        times: [

                        ],
                        busy: true
                      };
                    js[m.author.username] = jsStart;
                    js[m.author.username].busy = true;
                    js[m.author.username].dates = days;
                    js[m.author.username].times = times;
                    days = [];
                    times = [];
                    fs.writeFileSync('./commands/chattools/plans.json',JSON.stringify(js));
                    console.log('Saved');
                  });
                }
              }
            });
          }else{
            js = JSON.parse(fs.readFileSync('./commands/chattools/plans.json'));
            var jsStart = {
              dates: [

              ],
              times: [

              ],
              busy: true
            };
            collected.array()[0].reply('Thank you.');
            js[collected.array()[0].author.username] = jsStart;
            js[collected.array()[0].author.username].busy = false;
            fs.writeFileSync('./commands/chattools/plans.json',JSON.stringify(js));
            console.log('Saved');
          }
        })
      })
      .catch(console.error);
    }
  }

  setInterval(function(){
    getData();
  },464800000);
