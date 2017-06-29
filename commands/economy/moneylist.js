const Commando = require('discord.js-commando');
const fs = require('fs');

//Change Name
class MoneyListCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'moneylist',
      group: 'economy',
      memberName: 'moneylist',
      description: 'Look how much money everyone has',
      guildOnly: true,

      /*
      args: [
        {
          key: 'name',
          prompt: 'Enter this...',
          type: 'variable type'
        }
      ]
      */
    });
  }
//All subject to change.
  run(message,args){
    var tempnum = 0;
    var members = message.guild.members.array();
    if(!fs.existsSync('./commands/economy/money/' + message.guild.name.toLowerCase())){
      fs.mkdirSync('./commands/economy/money/' + message.guild.name.toLowerCase());
    }
    var moneys = [];
    for(var i = 0; i < members.length; i++){
      tempnum = i;
      var file = ('./commands/economy/money/' + message.guild.name.toLowerCase() + '/' + members[i].displayName.toLowerCase() + '.txt');
      if(fs.existsSync(file)){
        moneys[i] = parseInt(fs.readFileSync(file));
      }else{
        fs.appendFile(file,'100',(err) => {
          if (err){
            message.channel.send('Error creating a file.');
          }else{
            console.log(members[tempnum].displayName.toLowerCase());
          }
        });
        moneys[i] = 100;
      }
    }
    message.reply(this.maxNum(moneys,members));

  }
  maxNum(moneys,users){
    var revised = [];
    var temp = 0;
    for(var i = 0; i<moneys.length;i++){
      var max = Math.max.apply(null,moneys);
      revised[temp] = '(' + (temp+1) + ') ' + users[moneys.indexOf(max)].displayName + ': ' + max + "\n";
      moneys[moneys.indexOf(max)] = null;
      temp++;
      if(temp == 10){
        break;
      }
    }
    var final = revised.join();
    while(final.includes(',')){
      final = final.replace(',','');
    }
    while(final.includes('@')){
      final = final.replace('@','');
    }
    return final;
  }
}

//End name
module.exports = MoneyListCommand;
