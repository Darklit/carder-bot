//WIP
const Commando = require('discord.js-commando');
const config = require('../../config.js');
const fs = require('fs');
//Change Name
class BlackjackCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'blackjack',
      group: 'fun',
      memberName: 'blackjack',
      description: 'Play blackjack with yours friends!',
      guildOnly: true,


      args: [
        {
          key: 'money',
          prompt: 'How much are you betting?',
          type: 'integer'
        }
      ]

    });
  }

//Subject to change
  run(message,args){
    var file = ('./commands/economy/money/' + message.guild.name.toLowerCase() + '/' + message.member.displayName.toLowerCase() + '.txt');
    if(!fs.existsSync('./commands/economy/money/' + message.guild.name.toLowerCase())){
      fs.mkdirSync('./commands/economy/money/' + message.guild.name.toLowerCase());
    }
    if(this.pot == undefined){
      this.pot = 0;
    }
    if(this.players == undefined){
      this.players = [];
    }
    if(this.progress == undefined){
      this.progress = false;
    }
    if(this.playernum == undefined){
      this.playernum = 0;
    }
    if(!this.progress){
      if(this.checkMoney(message,message.member)){
        var money = parseInt(fs.readFileSync(file));
        if(money>=args.money){
          money-=args.money;
          this.players[0] = message.member;
          this.pot = args.money;
          this.playernum++;
          fs.writeFileSync(file,money.toString());
          this.game(message);
        }else{
          message.reply("You don't have that much money!");
        }
      }
    }else{
      message.reply('Sorry! Game in progress.');
    }
  }
  checkMoney(message,member){
    var file = ('./commands/economy/money/' + message.guild.name.toLowerCase() + '/' + member.displayName.toLowerCase() + '.txt');
    if(!fs.existsSync(file)){
      fs.writeFile(file,'',(err) => {
        if (err){
          message.channel.send('Error creating ' + member.displayName.toLowerCase() + "'s money file.");
          return false;
        }else{
          return true;
        }
      });
    }else{
      return true;
    }
  }
  game(message){
    var collectors = [];
    var file = '';
    this.mes = message;
    var setbet = this.pot;
    var check = true;
    this.progress = true;
    const collector = message.channel.createCollector(
      m => ((parseInt(m.content)>0) || (m.content.toLowerCase() == 'stop')),
      { time: 120000 }
    );
    message.channel.send('Whoever wants to join a game of blackjack, put in your bets. It must be higher or the same as ' + setbet);
    message.channel.send('Say stop to start the game.');
    collector.on('message', m => {
      console.log(m.content);
      if(!(m.content.toLowerCase() == 'stop')){
        for(var i = 0; i < this.players.length; i++){
          if(this.players[i].user.id == m.author.id){
            m.reply("You're already registered!");
            check = false;
            break;
          }else{
            check = true;
          }
        }
        if((this.checkMoney(message,m.member)) && check){
          file = ('./commands/economy/money/' + message.guild.name.toLowerCase() + '/' + m.member.displayName.toLowerCase() + '.txt');
          var money = parseInt(fs.readFileSync(file));
          if(money>=m.content){
            if(money>=setbet){
              money-=m.content;
              fs.writeFileSync(file,money.toString());
              this.pot+=m.content;
              this.players[this.playernum] = m.member;
              m.reply('You have been registered!');
            }else{
              m.reply('You must bet over or the same as the set bet!');
            }
          }else{
            m.reply("You don't have that much money!");
          }
        }
      }else{
        collector.stop();
      }
    });
    collector.on('end', collected => {
      this.begin(message);
    });
  }
  begin(message){
    var done = 0;
    if(this.nums == undefined){
      this.nums = [];
    }
    for(var i = 0; i < this.players.length; i++){
      var randomNum = Math.floor(Math.random()*10);
      if(randomNum == 0){
        randomNum++;
      }
      this.nums[i] = randomNum;
      this.players[i].user.send('Your number is ' + this.nums[i] + '. Hit or stand?');
      collectors[i] = this.players[i].user.dmChannel.createCollector(
        m => (m.content.toLowerCase() == 'hit') || (m.content.toLowerCase() == 'stand')
      );
      collectors[i].on('message', m => {
        if(m.content.toLowerCase() == 'hit'){
          var rnum = Math.floor(Math.random()*10);
          if(rnum == 0){
            rnum++;
          }
          this.nums[i]+= rnum;
          if(this.nums[i] > 21){
            collectors[i].stop();
            m.reply('You are over 21! Please wait for other players.');
          }else{
            m.reply('Your number is ' + this.nums[i] + '. Hit or stand?');
          }
        }else if(m.content.toLowerCase() == 'stand'){
          m.reply('Please wait for other players.');
          collectors[i].stop();
        }
      });
      collectors[i].on('end', collected => {
        done++;
        if(done == this.players.length){
          this.endGame(message);
        }
      });
    }
  }
  endGame(message){
    var refined = this.nums;
    for(var i = 0; i < refined.length; i++){
      if(refined[i] > 21){
        refined[i]+=21;
      }
      refined[i]-=21;
    }
    var max = Math.max.apply(null,refined);
    var max2 = max + 21;
    if(max2>=21){
      max2-=21;
    }

    message.channel.send(this.players[this.nums.indexOf(max2)].displayName + ' won with ' + max2);
    var file = './commands/economy/money/' + message.guild.name.toLowerCase() + '/' + this.players[this.nums.indexOf(max2)].displayName.toLowerCase() + '.txt';
    var money = parseInt(fs.readFileSync(file));
    money+=this.pot;
    fs.writeFileSync(file,money.toString());
    this.nums = [];
    this.pot = 0;
    this.players = [];
    this.progress = false;
    this.playernum = 0;
  }
}

//End name
module.exports = BlackjackCommand;
