const Commando = require('discord.js-commando');
const fs = require('fs');
const file = ('./commands/economy/money.txt');

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
    if(args.amount >0){
      console.log('started');
      var client1 = this.client;
      var user = args.name.toLowerCase().replace('_',' ');
      while(user.includes('_')){
        console.log('stuck');
        user = user.replace('_',' ');
      }
      var money = args.amount;
      var mes = message;
      var guildMem = message.guild.members.array();

      if(!fs.existsSync(file)){
        fs.appendFile(file,'',(err)=> {
          if (err) throw err;
          console.log('file created');
        });
      }

      for(var i = 0; i<guildMem.length;i++){
        if(guildMem[i].displayName.toLowerCase().includes(user.toLowerCase())){
          this.readMoney().then(function(res) {
            var dat = res;
            client1.registry.resolveCommand('economy:pay').setMoney(user,money,mes,dat);
          })
          .catch(console.error);
          mes.reply('Paid ' + user + " " + money + " dollars.");
          break;
        }
      }
    }else{
      message.reply('fuck off');
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
  setMoney(name,money,mes,data){
    console.log(data);
    var moneyList = data.split('  ');
    for(var i = 0; i<moneyList.length;i++){
      if(moneyList[i].includes(mes.member.displayName.toLowerCase())){
        var tempMon = parseInt(moneyList[i].replace(mes.member.displayName.toLowerCase(),''));
        if(tempMon>=money){
          tempMon= tempMon - money;
        }else{
          mes.reply('Error! You do not have enough money to do that.');
        }
        moneyList[i] = (mes.member.displayName.toLowerCase() + tempMon + '  ');
      }else{
        moneyList[i] = moneyList[i] + "  ";
      }
    }
    for(var g = 0; g<moneyList.length;g++){
      if(moneyList[g].includes(name.toLowerCase())){
        var tempMon2 = parseInt(moneyList[g].replace(name.toLowerCase(),''));
          tempMon2+=money;
          console.log(tempMon2);
        moneyList[g] = (name.toLowerCase() + tempMon2 + "  ");
      }else if(moneyList[g].includes(mes.member.displayName.toLowerCase())){

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
module.exports = PayCommand;
