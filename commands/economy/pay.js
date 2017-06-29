const Commando = require('discord.js-commando');
const fs = require('fs');

//Change Name
class PayCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'pay',
      group: 'economy',
      memberName: 'pay',
      description: 'Pay another user money.',
      guildOnly: true,


      args: [
        {
          key: 'name',
          prompt: 'Name of person you are paying.',
          type: 'string'
        },
        {
          key: 'amount',
          prompt: 'Amount of money you are paying.',
          type: 'integer'
        }
      ]

    });
  }
//Subject to change
  run(message,args){
    var error = false;
    var memberName = args.name.toLowerCase().replace('_',' ');
    if(fs.existsSync('./commands/economy/money/' + message.guild.name.toLowerCase())){
      fs.mkdirSync('./commands/economy/money/' + message.guild.name.toLowerCase());
    }
    var members = [message.member.displayName.toLowerCase(),memberName];
    var moneys = [];
    for(var i = 0; i < 2; i++){
      var file = ('./commands/economy/money/' + message.guild.name.toLowerCase() + '/' + members[i] + '.txt');
      if(fs.existsSync(file)){
        moneys[i] = fs.readFileSync(file);
      }else{
        fs.appendFile(file,'100',(err) =>{
          if(err){
            erorr = true;
            message.reply('Error retrieving ' + members[i] + "'s money.");
          }
        });
        if(!error){
          moneys[i] = 100;
        }
      }
    }
    if((moneys[0] >= args.amount) && !error){
      moneys[0]-=args.amount;
      moneys[1]+=args.amount;
      for(var i = 0; i < moneys.length; i++){
        file = ('./commands/economy/money/' + message.guild.name.toLowerCase() + '/' + members[i] + '.txt');
        fs.writeFileSync(file,moneys[0].toString());
      }
    }
  }
}

//End name
module.exports = PayCommand;
