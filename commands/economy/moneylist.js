const Commando = require('discord.js-commando');
const fs = require('fs');
const file = ('./commands/economy/money.txt');

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
    var members = message.guild.members.array();
    if(fs.existsSync())
  }
  createMoney(guild,members){

  }

}

//End name
module.exports = MoneyListCommand;
