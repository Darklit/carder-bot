const Commando = require('discord.js-commando');
const fs = require('fs');
const file = ('./commands/economy/money.txt');

//Change Name
class MoneyCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'money',
      group: 'economy',
      memberName: 'money',
      description: 'Look how much money you have',
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
      thismessage.reply('You have ' + client1.registry.resolveCommand('economy:money').getMoney(dat,mes) + " dollars.");
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
    //Gets the data from the money file.
    var dat = data;
    var moneyList = data.split('  ');
    var temp = 0;
    if(moneyList != ''){
      for(var i = 0; i<moneyList.length;i++){
        if(moneyList[i].includes(message.member.displayName.toLowerCase())){
          return moneyList[i].replace(message.member.displayName.toLowerCase(),'');
        }else{
          temp++;
        }
      }
    }else{
      this.createMoney(message);
      return('100');
    }
    if(temp == moneyList.length){
      this.renewMoney(message,data);
      //return('100');
    }
  }
  createMoney(message){
    //Gets all members and adds them to a money file.
    var members = message.guild.members.array();
      for(var g = 0; g<message.guild.memberCount;g++){
        this.writer.write(members[g].displayName.toLowerCase() + '100  ');
    }
  }
  renewMoney(message,data){
    var moneyList = data.split('  ');
    var members = message.guild.members.array();
    for(var i = 0; i<members.length; i++){
      for(var g = 0; g<moneyList.length; g++){
        if(moneyList[g].includes(members[i].displayName.toLowerCase())){
          break;
        }else{
          moneyList[moneyList.length] = members[i].displayName.toLowerCase()+'100  ';
        }
      }
    }
    var final = moneyList.join('  ');
    fs.writeFileSync(file,final);
  }
}

//End name
module.exports = MoneyCommand;
