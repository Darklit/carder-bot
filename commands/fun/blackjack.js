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
    if(this.progress == undefined){
      this.progress = false;
    }
    if(!this.progress){
      if(this.checkMoney(message,message.member)){
        var money = parseInt(fs.readFileSync(file));
        if(money>=args.money){
          money-=args.money;
          var players = [message.member];
          var pot = args.money;
          var playernum = 1;
          fs.writeFileSync(file,money.toString());
          this.game(message,players,pot,playernum);
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
  game(message,players,pot,playernum){
    var file = '';
    this.mes = message;
    var setbet = pot;
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
        for(var i = 0; i < players.length; i++){
          if(players[i].user.id == m.author.id){
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
            if(m.content>=setbet){
              money-= parseInt(m.content);
              fs.writeFileSync(file,money.toString());
              pot += parseInt(m.content);
              players[playernum] = m.member;
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
      this.begin(message,players,pot,playernum);
    });
  }
  begin(message,players,pot,playernum){
    var usernames = [];
    for(var i = 0; i < players.length; i++){
      usernames[i] = players[i].user.username;
    }
    var collectors = [];
    var done = 0;
    var nums = [];
    for(var i = 0; i < players.length; i++){
      var randomNum = Math.floor(Math.random()*10);
      if(randomNum == 0){
        randomNum++;
      }
      nums[i] = randomNum;
      players[i].user.send('Your number is ' + nums[i] + '. Hit or stand?');
      collectors[i] = players[i].user.dmChannel.createCollector(
        m => (m.content.toLowerCase() == 'hit') || (m.content.toLowerCase() == 'stand')
      );
      collectors[i].on('message', m => {
        if(m.content.toLowerCase() == 'hit'){
          var rnum = Math.floor(Math.random()*10);
          if(rnum == 0){
            rnum++;
          }
          nums[usernames.indexOf(m.author.username)]+= rnum;
          if(nums[usernames.indexOf(m.author.username)] > 21){
            collectors[usernames.indexOf(m.author.username)].stop();
            m.reply('You are over 21! Please wait for other players.');
          }else{
            m.reply('Your number is ' + nums[usernames.indexOf(m.author.username)] + '. Hit or stand?');
          }
        }else if(m.content.toLowerCase() == 'stand'){
          m.reply('Please wait for other players.');
          collectors[usernames.indexOf(m.author.username)].stop();
        }
      });
      collectors[i].on('end', collected => {
        done++;
        if(done == players.length){
          this.endGame(message,players,pot,playernum,nums);
        }else{
          console.log(done);
        }
      });
    }
  }
  endGame(message,players,pot,playernum,nums){
    var bjRevised = [];
    for(var i = 0; i < nums.length; i++){
      if(nums[i] <= 21){
        bjRevised[i] = Math.abs((nums[i] - 21));
      }else if(nums[i]>= 21){
        bjRevised[i] = nums[i];
      }
    }
    console.log('here');

    var max = Math.abs(Math.min.apply(null,bjRevised));
    max = Math.abs(Math.min(max));
    console.log(max + ':max');
    for(var i = 0; i < nums.length; i++){
      console.log(nums[i] + ':' + i);
      console.log(bjRevised[i] + '::' + i);
    }

    message.channel.send(players[bjRevised.indexOf(max)].displayName + ' won with ' + nums[bjRevised.indexOf(max)]);
    var file = './commands/economy/money/' + message.guild.name.toLowerCase() + '/' + players[bjRevised.indexOf(max)].displayName.toLowerCase() + '.txt';
    var money = parseInt(fs.readFileSync(file));
    money+=pot;
    fs.writeFileSync(file,money.toString());
    this.progress = false;
  }
}

//End name
module.exports = BlackjackCommand;
