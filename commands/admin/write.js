const Commando = require('discord.js-commando');
const fs = require('fs');
const file = ('./commands/admin/test.txt');

//Change Name
class WriteCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'write',
      group: 'admin',
      memberName: 'write',
      description: 'Write in a file.',
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
    //Creates a file and writes the given arguments.
    if(fs.existsSync(file)){
      this.writeMoney(args).then(function(value){
        console.log(value);
      })
      .catch(console.error);
    }else{
      message.reply('File does not exist!');
      fs.appendFile(file,args, (err) => {
        if (err) throw err;
        console.log('file created');
      });
    }
  }

  writeMoney(mes){
    var writing = mes;
    return new Promise(function (resolve, reject){
      fs.writeFile(file, mes,{encoding: 'utf8',flag:'a'}, function (err){
        if(err) reject(err);
        else resolve('finished!');
      });
    });
  }

}

//End name
module.exports = WriteCommand;
