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
    var client1 = this.client;
    var thismessage = message;
    if(!fs.existsSync(file)){
      fs.appendFile(file,'',(err)=> {
        if (err) throw err;
        console.log('file created');
      });
    }

    if(this.writer === undefined){
      this.writer = fs.createWriteStream(file,{
        flags: 'a'
      });
    }

    this.readMoney().then(function(res){
      var dat = res;
      var mes = message;
      client1.registry.resolveCommand('economy:moneylist').getMoney(dat,mes);
      message.reply(client1.registry.resolveCommand('economy:moneylist').maxNum());
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

  getMoney(data,message){
    var moneyList = data.split('  ');
    var memberList = message.guild.members.array();
    setTimeout(function(){
      console.log('waiting');
    },1000);
    var temp = 0;
    var tempMoney = [];
    var names = [];
    if(moneyList != ''){
      for(var i = 0; i<moneyList.length;i++){
        for(var g = 0; g<memberList.length;g++){
          if(moneyList[i].includes(memberList[g].displayName.toLowerCase())){
            names[temp] = memberList[g].displayName;
            tempMoney[temp] = parseInt(moneyList[i].replace(memberList[g].displayName.toLowerCase(),''));
            temp++;
          }
        }
      }
    }else{
      this.createMoney(message);
      return('100');
    }
    this.moneys = tempMoney;
    this.namey = names;
  }
  createMoney(message){
    var members = message.guild.members.array();
      for(var g = 0; g<message.guild.memberCount;g++){
        this.writer.write(members[g].displayName.toLowerCase() + '100  ');
    }
  }
  maxNum(){
    var revised = [];
    var temp = 0;
    var moneys = this.moneys;
    var users = this.namey;
    for(var i = 0; i<moneys.length;i++){
      var max = Math.max.apply(null,moneys);
      revised[temp] = max;
      revised[temp] = Math.max.apply(null,moneys);
      revised[temp] = '(' + (temp+1) + ') ' + users[moneys.indexOf(revised[temp])] + ': ' + revised[temp] + "\n";
      moneys[moneys.indexOf(max)] = null;
      temp++;
      if(temp == 10){
        break;
      }
    }
    var final = revised.join();
    while(final.includes(',')){
      final = final.replace(',','');
    }
    return final;
  }

}

//End name
module.exports = MoneyListCommand;
