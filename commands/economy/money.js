const Commando = require('discord.js-commando');
const fs = require('fs');
const file = ('./commands/economy/money.txt');

//Change Name
class MoneyCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'money',
      group: 'economy',
      memberName: 'money',
      description: 'Look how much money you have',
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

  run(message,args){
    if(fs.existsSync('./commands/economy/' + message.guild.name.toLowerCase())){
      var file = ('./commands/economy/' + message.guild.name.toLowerCase() + '/' + message.member.displayName.toLowerCase() + '.txt');
      if(fs.existsSync(file)){
        var content = fs.readFileSync(file);
        message.reply('You have ' + content + ' dollars.');
      }else{
        fs.appendFileSync(file,'100');
      }
    }else{
      fs.mkdirSync('./commands/economy/' + message.guild.name.toLowerCase());
    }
  }
}

//End name
module.exports = MoneyCommand;
