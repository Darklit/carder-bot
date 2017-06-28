const Commando = require('discord.js-commando');
const config = require('../../config.js');
const fs = require('fs');
const file = ('./commands/economy/money.txt');
//Change Name
class SetMoneyCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'setmoney',
      group: 'economy',
      memberName: 'setmoney',
      description: 'Sets the money of another user.',
      guildOnly: true,


      args: [
        {
          key: 'name',
          prompt: 'Who do you want to set money to?',
          type: 'string'
        },
        {
          key: 'money',
          prompt: 'How much money do you want them to have?',
          type: 'integer'
        }
      ]

    });
  }
//Subject to change
  run(message,args){
    var user = args.name.toLowerCase().replace('_',' ');
    while(user.includes('_')){
      user = user.replace('_',' ');
    }
    console.log(user);
    var client1 = this.client;
    var setMon = args.money;
    if(message.author.id == config.ownerid){
      if(!fs.existsSync(file)){
        fs.appendFile(file,'',(err)=> {
          if (err) throw err;
          console.log('file created');
        });
      }
      this.readMoney().then(function(res) {
        var dat = res;
        client1.registry.resolveCommand('economy:setmoney').setMoney(user,setMon,res);
      })
      .catch(console.error);
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
  setMoney(name,money,data){
    var moneyList = data.split('  ');
    for(var i = 0; i<moneyList.length;i++){
      if(moneyList[i].includes(name)){
        moneyList[i] = (name + money + '  ');
      }else{
        moneyList[i] = moneyList[i] + "  ";
      }
    }
    var final = moneyList.join();
    while(final.includes(',')){
      final = final.replace(',','');
    }
    fs.writeFileSync(file,final);
  }
}

//End name
module.exports = SetMoneyCommand;
