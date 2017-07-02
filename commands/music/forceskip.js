const Commando = require('discord.js-commando');
const config = require('../../config.js');
const fs = require('fs');

//Change Name
class ForceSkipCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'forceskip',
      group: 'music',
      memberName: 'forceskip',
      description: 'Skips the song forcefully.',
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
    //If the owner issues this command it will skip the current song.
    if((message.author.id == config.ownerid) || (this.checkPermission1(message))){
      var guildName = message.guild.name.toLowerCase()
      this.client.registry.resolveCommand('music:play').queue[guildName].dispatcher.end();
      message.reply('Skipped!');
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
    for(var i = 0; i < perms.forceskip.length; i++){
      if(message.author.id == perms.forceskip[i]){
        hasPermission = true;
        break;
      }
      for(var g = 0; g < roles.length; g++){
        if(roles[g].name.toLowerCase() == perms.forceskip[i].toLowerCase()){
          hasPermission = true;
          break;
        }
      }
    }
    return hasPermission;
  }
}

//End name
module.exports = ForceSkipCommand;
