const Commando = require('discord.js-commando');
const config = require('../../config.js');
const fs = require('fs');
//Change Name
class SetMoneyCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'setmoney',
      group: 'economy',
      memberName: 'setmoney',
      description: 'Sets the money of another user.',
      guildOnly: true,


      args: [
        {
          key: 'name',
          prompt: 'Who do you want to set money to?',
          type: 'string'
        },
        {
          key: 'money',
          prompt: 'How much money do you want them to have?',
          type: 'integer'
        }
      ]

    });
  }
//Subject to change
  run(message,args){
    if(message.author.id == config.ownerid){
      if(!fs.existsSync('./commands/economy/money/' + message.guild.name.toLowerCase())){
        fs.mkdirSync('./commands/economy/money/' + message.guild.name.toLowerCase());
      }
      var file = ('./commands/economy/money/' + message.guild.name.toLowerCase() + '/' + args.name.toLowerCase().replace('_',' ') + '.txt');
      if(!fs.existsSync(file)){
        fs.appendFile(file,args.money.toString(),(err) => {
          if(err){
            message.reply('Error creating money file.');
          }
        });
      }else{
        fs.writeFileSync(file,args.money.toString());
      }
      message.reply('Money set');
    }
  }
}

//End name
module.exports = SetMoneyCommand;
