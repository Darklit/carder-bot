const Commando = require('discord.js-commando');
const fs = require('fs');

class PermissionsCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'permissions',
      group: 'admin',
      memberName: 'permissions',
      description: 'List all permissions.',
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
    if(!(fs.existsSync('./commands/admin/permissions'))){
      fs.mkdirSync('./commands/admin/permissions');
    }
    var works = false;
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
      fs.appendFile(file,JSON.stringify(permissions), (err) => {
        if(err){
          message.reply('Error creating permissions file.');
        }else{
          this.listPerms(message,file);        }
      });
    }else{
      works = true;
    }
    if(works){
      this.listPerms(message,file);
    }
  }
  listPerms(message,file){
    var checkNum = 0;
    var perms = JSON.parse(fs.readFileSync(file));
    var groups = ['owner'];
    var num = 0;
    for(var i = 0; i < Object.keys(perms).length; i++){
      for(var g = 0; g < perms[Object.keys(perms)[i]].length; g++){
        for(var q = 0; q < groups.length; q++){
          if(perms[Object.keys(perms)[i]][g] == groups[q]){
            break;
          }else{
            num++;
          }
          if(num == groups.length){
            groups[groups.length] = perms[Object.keys(perms)[i]][g];
            num = 0;
          }
        }
      }
    }
    var listPerm = [];
    for(var i = 0; i < Object.keys(perms).length; i++){
      for(var q = 0; q < perms[Object.keys(perms)[i]].length; q++){
        for(var g = 0; g < groups.length; g++){
          if(perms[Object.keys(perms)[i]][q] == groups[g]){
            listPerm[g] += '- ' + Object.keys(perms)[i] + '\n';
          }
        }
      }
    }
    var mes = '**' + message.guild.name + ' Permissions:**\n';
    var id;
    var checkNum2 = 0;
    for(var i = 0; i < groups.length; i++){
      if(parseInt(groups[i]) > 0){
        id = groups[i];
        this.client.fetchUser(id).then(user => {
          mes+= '\n' + user.username + ' has:\n' + listPerm[groups.indexOf(user.id)].substring(0,1).toUpperCase() + listPerm[groups.indexOf(user.id)].substring(1);
          checkNum++;
          if(checkNum == groups.length){
            this.sendPerms(message,mes);
          }
        })
        .catch(console.error);
      }else{
        mes+= '\n' + groups[i].substring(0,1).toUpperCase() + groups[i].substring(1) + ' has:\n' + listPerm[i].substring(0,1).toUpperCase() + listPerm[i].substring(1);
        checkNum++;
        checkNum2++;
      }
    }
    if(checkNum2 == groups.length){
      this.sendPerms(message,mes);
    }
  }
  sendPerms(message,mes){
    while(mes.toLowerCase().includes('undefined')){
      mes = mes.replace('undefined','');
      mes = mes.replace('Undefined','');
    }

    message.author.send(mes);
    message.reply('I have sent you a DM with a list of permissions.');
  }
}

module.exports = PermissionsCommand;
