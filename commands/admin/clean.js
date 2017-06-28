const Commando = require('discord.js-commando');
const fs = require('fs');
const file = ('./commands/economy/money.txt')

//Change Name
class CleanCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'clean',
      group: 'admin',
      memberName: 'clean',
      description: 'Cleans my stuff',
      guildOnly: false,

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
    this.readMoney().then(function(res){
      var dat = res;
      var mes = message;
      client1.registry.resolveCommand('admin:clean').cleanUp(mes,dat);
    })
    .catch(console.error);
  }
//Retrieves data from the money.txt file.
  readMoney(){
    return new Promise(function (fulfill, reject){
      fs.readFile(file, 'utf8', function (err,res){
        if(err) reject(err);
        else fulfill(res);
      });
    });
  }
  //Removes unnecessary spaces in the money file. Just cleans it up.
  cleanUp(message,data){
    var moneyList = data.split('  ');
    for(var i = 0; i<moneyList.length;i++){
      if(moneyList[i] == ' ' || moneyList[i] == '  ' || moneyList[i] == '   ' || moneyList[i] == undefined){
        moneyList[i] = '';
      }else{
        moneyList[i] = moneyList[i] + "  ";
      }
    }
    var final = moneyList.join();
    while(final.includes(',')){
      final = final.replace(',','');
    }
    while(final.includes("   ")){
      final = final.replace("   ",'');
    }
    fs.writeFileSync(file,final);
  }
}

//End name
module.exports = CleanCommand;
