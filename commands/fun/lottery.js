const Commando = require('discord.js-commando');
const fs = require('fs');
const file = ('./commands/economy/money.txt');
const file2 = ('./commands/economy/lottery.txt');
//Change Name
class LotteryCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'lottery',
      group: 'fun',
      memberName: 'lottery',
      description: 'Try your luck at the lottery!',
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
    console.log('works!');
    var client1 = this.client;
    var start = false;
    if(!(fs.existsSync(file2))){
      fs.appendFile(file2,'0',(err)=> {
        if (err) throw err;
        console.log('file created');
      });
    }else{

    }
    if(!(fs.existsSync(file))){
      fs.appendFile(file,'',(err)=> {
        if(err) throw errl
        console.log('file created');
      });
    }else{

    }
    this.readMoney().then(function(res){
      var dat = res;
      var mes = message;
      if(client1.registry.resolveCommand('fun:lottery').addPot(dat,mes)){
        start = true;
      }else{
        console.log('failed!');
      }
      if(start){
        if(client1.registry.resolveCommand('fun:lottery').doLottery()){
          mes.reply('You won!');
          client1.registry.resolveCommand('fun:lottery').addMoney(mes);
        }else{
          mes.reply('You lost! Try again!');
        }
      }
    })
    .catch(console.error);
  }

  readLottery(){
    return new Promise(function (fulfill, reject){
      fs.readFile(file2, 'utf8', function (err,res){
        if(err) reject(err);
        else fulfill(res);
      });
    });
  }

  readMoney(){
    return new Promise(function (fulfill, reject){
      fs.readFile(file, 'utf8', function (err,res){
        if(err) reject(err);
        else fulfill(res);
      });
    });
  }

  addPot(data,mes){
    var works = false;
    var moneyList = data.split('  ');
    for(var i = 0; i<moneyList.length;i++){
      if(moneyList[i].includes(mes.member.displayName.toLowerCase())){
        var tempMon = parseInt(moneyList[i].replace(mes.member.displayName.toLowerCase(),''));
        if(tempMon>=10){
          tempMon= tempMon - 10;
          works = true;
        }else{
          works = false;
          mes.reply('Error! You do not have enough money to do that.');
        }
        moneyList[i] = (mes.member.displayName.toLowerCase() + tempMon + '  ');
      }else{
        moneyList[i] = moneyList[i] + "  ";
      }
    }
    var final = moneyList.join();
    while(final.includes(',')){
      final = final.replace(',','');
    }
    fs.writeFileSync(file,final);
    if(works){
      return true;
    }else{
      return false;
    }
  }

  doLottery(){
    this.readLottery().then(function(res){
      var dat = parseInt(res);
      if(dat === 0 || dat == undefined || dat == 'NaN'){
        dat = 0;
      }
      dat+=10;
      var final = (dat);
      fs.writeFileSync(file2,final.toString());
    })
    .catch(console.error);
    if(Math.floor(Math.random() * 50) == 1){
      return true;
    }else{
      return false;
    }
  }
  addMoney(mes){
    var playerMoney;
    var potMoney;
    var moneyList;
    var final;
    this.readLottery().then(function(res){
      var dat = res;
      potMoney = parseInt(dat);
    })
    .catch(console.error);
    this.readMoney().then(function(res){
      var dat = res;
      moneyList = dat.split("  ");
      for(var i = 0; i<moneyList.length;i++){
        if(moneyList[i].includes(mes.member.displayName.toLowerCase())){
          playerMoney = parseInt(moneyList[i].replace(mes.member.displayName.toLowerCase(), ''));
          var finalmoney = playerMoney + potMoney + 10;
          finalmoney = finalmoney.toString();
          moneyList[i] = (mes.member.displayName.toLowerCase() + finalmoney + '  ');
        }else{
          moneyList[i] = moneyList[i] + "  ";
        }
      }
      final = moneyList.join();
      while(final.includes(',')){
        final = final.replace(',','');
      }
      fs.writeFileSync(file,final);
      fs.writeFileSync(file2,'0');
    })
    .catch(console.error);
  }
}

//End name
module.exports = LotteryCommand;
