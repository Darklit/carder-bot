const Commando = require('discord.js-commando');
const config = require('../../config.js');
const fs = require('fs');
const file = ('./commands/economy/money.txt');
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


  run(message,args){
    var mes = message;
    var arg = args;
    var com = this.client.registry.resolveCommand('fun:blackjack');
    if(this.progress == undefined){
      this.progress = false;
    }
    if(this.pot == undefined){
      this.pot = 0;
    }
    if(!this.progress){
      this.data = '';
      this.readMoney().then(function(res){
        com.easy(res,mes,arg)
      })
      .catch(console.error);

    }else{
      message.reply('Sorry! Game in progress... Please wait');
    }
  }

  checkMoney(data,message,amount){
    var moneyList = data.split('  ');
    var name = message.member.displayName.toLowerCase();
    var check = false;

    for(var i = 0; moneyList.length;i++){
      if(moneyList[i].includes(name)){
        var tempMon = parseInt(moneyList[i].replace(name,''));
        if(tempMon>=amount){
          check = true;
        }
        break;
      }
    }

    if(check){
      for(var g = 0;g<moneyList.length; g++){
        if(moneyList[g].includes(name)){
          var tempMon = parseInt(moneyList[g].replace(name,''));
          tempMon = tempMon - amount;
          moneyList[g] = (name + tempMon);
        }
      }
      var final = moneyList.join('  ');
      fs.writeFileSync(file,final);
      return true;
    }else{
      return false;
    }
  }

  readMoney(){
    return new Promise(function (fulfill, reject){
      fs.readFile(file, 'utf8', function (err,res){
        if(err) reject(err);
        else fulfill(res);
      });
    });
  }
  easy(data,message,args){
    var com = this.client.registry.resolveCommand('fun:blackjack');
    this.channelInt = message.channel;
    this.progress = true;
    if(this.checkMoney(data,message,args.money)){
      this.pot = args.money;
      this.users = [message.author];
      this.mems = [message.member];
      var temp = 0;
      this.numbers = [];
      message.channel.sendMessage('If you are playing, put in your bet. Say begin to start');
      if(this.blackjackGame == undefined){
        this.blackjackGame = false;
      }
      const collector = message.channel.createCollector(
        m => ((parseInt(m.content) != NaN) || (m.content.toLowerCase().includes('begin'))),
        { time: 120000}
      );
      collector.on('message', m => {
        if(m.author.id != config.botid){
          if(parseInt(m.content)>0){
            for(var i = 0; i<this.users.length;i++){
              if(m.author.id == this.users[i].id){
                m.reply('You are already registered!');
                break;
              }else{
                temp++;
              }
            }
            if(temp == this.users.length){
              if(com.checkMoney(data,m,parseInt(m.content))){
                m.reply('You have been registered!');
                this.users[this.users.length] = m.author;
                this.mems[this.mems.length] = m.member;
                this.pot = this.pot + parseInt(m.content);
                temp = 0;
              }else{
                m.reply("You don't have that much money!");
              }
            }
          }else{
            if(m.content.toLowerCase() != 'begin'){
              m.reply("You can't bet 0!");
            }
          }
          if(m.content.toLowerCase().includes('begin')){
            collector.stop();
          }
        }
      });
      collector.on('end', collected => {
        for(var o = 0; o<this.users.length; o++){
          this.numbers[o] = Math.floor(Math.random()*11);
          if(this.numbers[o]<2){
            this.numbers[o] = 2;
          }else if(this.numbers[o]>10){
            this.numbers[o] = 10;
          }
          this.users[o].sendMessage('Your number is ' + this.numbers[o] + ' Hit or stand?');
          this.blackjackGame = true;
        }
      });
    }else{
      message.reply('lol no');
      this.progress = false;
    }
  }
}

//End name
module.exports = BlackjackCommand;
