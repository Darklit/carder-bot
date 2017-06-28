const Commando = require('discord.js-commando');
const fs = require('fs');
const file = ('./commands/economy/money.txt');
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
    var client1 = this.client;
    var mes = message;
    var mem = message.member;
    const filter = m => m.author.id == message.author.id;
    var num1 = Math.floor(Math.random()*100);
    var num2 = Math.floor(Math.random()*100);
    var sign = signs[Math.floor(Math.random()*3)];
    var ret = false;
    var answer;
    if(sign == 'x'){
      answer = num1 * num2;
    }else if(sign == '-'){
      answer = num1-num2;
    }else if(sign == '+'){
      answer = num1+num2;
    }
    console.log(answer);
    message.reply('What is ' + num1 + ' ' + sign + ' ' + num2);
    message.channel.awaitMessages(filter, {max:1, time:120000, errors: ['time']})
    .then(collected => {
      console.log('he');
      var mes = collected.array();
      if(mes[0] == answer){
        ret = true;
      }else{
        ret = false;
      }
      if(ret){
        this.readMoney().then(function(res){
          var dat = res;
          var mem2 = mem;
          var mes2 = mes;
          //client1.registry.resolveCommand('economy:work').setMoney(dat,mem2,mes2);
//Start
          var moneyList = res.split('  ');
          var playerMoney;
          var where = 0;

          for(var i = 0; i<moneyList.length;i++){
            if(moneyList[i].includes(mem.displayName.toLowerCase())){
              where = i;
              playerMoney = parseInt(moneyList[i].replace(message.member.displayName.toLowerCase(),''));
              moneyList[i] = moneyList[i] + "  ";
            }else{
              moneyList[i] = moneyList[i] + "  ";
            }
          }
          if(playerMoney>=100){
            message.reply("You can't earn more than 100 dollars from working! Go gamble!");
          }else{
            message.reply('Correct! $20 added to your account!');
            playerMoney+=20;
            moneyList[where] = (message.member.displayName.toLowerCase() + playerMoney.toString() + "  ");
          }
          var final = moneyList.join();
          while(final.includes(',')){
            final = final.replace(',','');
          }
          fs.writeFileSync(file,final);
//End

        })
        .catch(console.error);
      }else{
        message.reply('Incorrect!');
      }
    })
    .catch(console.error);
  }

  readMoney(){
    return new Promise(function (fulfill, reject){
      fs.readFile(file, 'utf8', function (err,res){
        if(err) reject(err);
        else fulfill(res);
      });
    });
  }


  setMoney(data,member,message){
  }
}

//End name
module.exports = WorkCommand;
