const Commando = require('discord.js-commando');
const config = require('../../config.js');
const fs = require('fs');
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
    if((message.author.id == config.ownerid) || this.checkPermission1(message)){
      if(!fs.existsSync('./commands/economy/money/' + message.guild.name.toLowerCase())){
        fs.mkdirSync('./commands/economy/money/' + message.guild.name.toLowerCase());
      }
      var file = ('./commands/economy/money/' + message.guild.name.toLowerCase() + '/' + args.name.toLowerCase().replace('_',' ') + '.txt');
      if(!fs.existsSync(file)){
        fs.appendFile(file,args.money.toString(),(err) => {
          if(err){
            message.reply('Error creating money file.');
          }
        });
      }else{
        fs.writeFileSync(file,args.money.toString());
      }
      message.reply('Money set');
    }else{
      message.reply('Insufficient permissions');
    }
  }
  checkPermission1(message){
    if(!(fs.existsSync('./commands/admin/permissions'))){
      fs.mkdirSync('./commands/admin/permissions');
    }
    var file = ('./commands/admin/permissions/' + message.guild.name.toLowerCase() + '.json');
    if(!(fs.existsSync(file))){
      var permissions = {
        clear: [
          'owner'
        ],
        setmoney: [
          'owner'
        ],
        forceskip: [
          'owner'
        ],
        all: [
          'owner'
        ]
      };
      fs.appendFile(file,JSON.stringify(permissions), err =>{
        if(err){
          message.reply('Error creating permissions file.');
          return false;
        }else{
        return this.checkPermission2(message,file);
        }
      });
    }else{
      return this.checkPermission2(message,file);
    }
  }
  checkPermission2(message,file){
    var perms = JSON.parse(fs.readFileSync(file));
    var roles = message.member.roles.array();
    var hasPermission = false;
    if(message.author.id == config.ownerid){
      hasPermission = true;
    }
    for(var i = 0; i < perms.all.length; i++){
      if((message.author.id == perms.all[i]) || (message.author.id == message.guild.ownerID)){
        hasPermission = true;
        break;
      }
      for(var g = 0; g < roles.length; g++){
        if(roles[g].name.toLowerCase() == perms.all[i].toLowerCase()){
          hasPermission = true;
          break;
        }
      }
    }
    for(var i = 0; i < perms.setmoney.length; i++){
      if(message.author.id == perms.setmoney[i]){
        hasPermission = true;
        break;
      }
      for(var g = 0; g < roles.length; g++){
        if(roles[g].name.toLowerCase() == perms.setmoney[i].toLowerCase()){
          hasPermission = true;
          break;
        }
      }
    }
    return hasPermission;
  }
}

//End name
module.exports = SetMoneyCommand;
