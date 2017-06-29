const Commando = require('discord.js-commando');
const fs = require('fs');

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
    if(!fs.existsSync('./commands/economy/money/' + message.guild.name.toLowerCase())){
      fs.mkdirSync('./commands/economy/money/' + message.guild.name.toLowerCase());
    }
    var file = ('./commands/economy/money/' + message.guild.name.toLowerCase() + '/' + message.member.displayName.toLowerCase() + '.txt');
    if(fs.existsSync(file)){
      var content = fs.readFileSync(file);
      message.reply('You have ' + content + ' dollars.');
    }else{
      fs.appendFile(file,'100',(err) => {
        if(err){
          message.reply('Error creating your money file. Perhaps an error with your name.');
        }else{
          message.reply('You have 100 dollars');
        }
      });
    }
  }
}

//End name
module.exports = MoneyCommand;
