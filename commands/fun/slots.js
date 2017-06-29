const Commando = require('discord.js-commando');
const fs = require('fs');
const emojis = [
  '🤔',
  '😂',
  '💩',
  '😺',
  '👌',
  '🐘'
];

var emojilist = [];

//Change Name
class SlotsCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'slots',
      group: 'fun',
      memberName: 'slots',
      description: 'Play the slot machine!',
      guildOnly: true,

      aliases: ['slot', 'slots'],

      throttling: {
        usages: 1,
        duration: 2
      },

      args: [
        {
          key: 'money',
          prompt: 'How much are you betting?',
          type: 'integer'
        }
      ]

    });
  }

  run(message,args){
    const file = ('./commands/economy/money/' + message.guild.name.toLowerCase() + '/' + message.member.displayName.toLowerCase().replace('/','-') + '.txt');
    if(!(fs.existsSync(file))){
      this.client.registry.resolveCommand('economy:createmoney').run(message,args);
    }
    var money = parseInt(fs.readFileSync(file));

    if(args.money<=money){
      if(this.slots(money,args.money,file,message)){
        this.winner(message.guild,message.member.displayName.toLowerCase().replace('/','-'),money,args.money,message);
      }else{
        message.channel.sendMessage('You lost! Try again');
      }
    }else{
      message.reply("You don't have that much money!");
    }
  }

  slots(money,bet,file,message){
    var final = money - bet;

    fs.writeFileSync(file,final);

    var rand1 = Math.floor(Math.random()*emojis.length);
    var rand2 = Math.floor(Math.random()*emojis.length);
    var rand3 = Math.floor(Math.random()*emojis.length);

    emojilist[0] = emojis[rand1];
    emojilist[1] = emojis[rand2];
    emojilist[2] = emojis[rand3];

    message.reply(emojilist[0] + emojilist[1] + emojilist[2]);
    if(emojilist[0] == emojilist[1] && emojilist[2] == emojilist[0]){
      return true;
    }else{
      return false;
    }
  }

  winner(guild,name,money,bet,message){
    var winnings = 0;
    if(emojilist[0] == '🤔'){
      winnings = Math.floor(Math.random()*bet);
    }else if(emojilist[0] == '😂'){
      winnings = money*2;
    }else if(emojilist[0] == '💩'){
      winnings = bet*5;
    }else if(emojilist[0] == '😺'){
      winnings = bet * Math.floor(Math.random()*money);
    }else if(emojilist[0] == '👌'){
      winnings = bet * 100;
    }else if(emojilist[0] == '🐘'){
      winnings = bet * Math.floor(money/50);
    }
    var final = money + winnings;
    var pat = ('./commands/economy/money/' + guild.name.toLowerCase() + '/' + name + '.txt');
    fs.writeFileSync(pat,final.toString());
    message.channel.sendMessage('You won ' + winnings + ' dollars!');
  }
}

//End name
module.exports = SlotsCommand;
