const Commando = require('discord.js-commando');
const fs = require('fs');
const signs = [
  '+',
  'x',
  '-'
];
const config = require('../../config.js');

//Change Name
class WorkCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'work',
      group: 'economy',
      memberName: 'work',
      description: 'Work to get your basic money back.',
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
//Subject to change
  run(message,args){
    var answer = 0;
    var right = false;
    var num1 = Math.floor(Math.random()*50);
    var num2 = Math.floor(Math.random()*50);
    var sign = signs[Math.floor(Math.random()*signs.length)];
    if(sign == 'x'){
      answer = num1 * num2;
    }else if(sign == '+'){
      answer = num1 + num2;
    }else if(sign == '-'){
      answer = num1 - num2;
    }
    console.log(answer);
    var file = ('./commands/economy/money/' + message.guild.name.toLowerCase() + '/' + message.member.displayName.toLowerCase() + '.txt');
    if(!(fs.existsSync('./commands/economy/money/' + message.guild.name.toLowerCase()))){
      fs.mkdirSync('./commands/economy/money/' + message.guild.name.toLowerCase());
    }
    if(!(fs.existsSync(file))){
      fs.appendFileSync(file,'100');
    }
    message.reply('What is ' + num1 + ' ' + sign + ' ' + num2 + '?');
    const collector = message.channel.createCollector((m => m.author.id == message.author.id),
    { time: 12000});
    collector.on('message', m => {
      if(parseInt(m.content) == answer){
        right = true;
        collector.stop();
      }else{
        right = false;
        collector.stop();
      }
    });
    collector.on('end', collected => {
      if(right){
        message.reply('Correct! $10 was added to your account.');
        var money = parseInt(fs.readFileSync(file));
        money+=10;
        fs.writeFileSync(file,money.toString());
      }else if(collected.array()[0] == undefined){
        message.reply('Time ran out!');
      }else{
        message.reply('Wrong!');
      }
    });
  }
}

//End name
module.exports = WorkCommand;
