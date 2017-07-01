const Commando = require('discord.js-commando');
const fs = require('fs');
const config = require('../../config.js');

class PermissionCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'permission',
      group: 'admin',
      memberName: 'permission',
      description: 'Change permissions for commands on this bot.',
      guildOnly: true,


      args: [
      {
        key: 'type',
        prompt: 'Add or remove permission?',
        type: 'string'
      },
      {
        key: 'group',
        prompt: 'Enter a role name or user id.',
        type: 'string',
        validate: str => str.toLowerCase() != 'owner'
      },
      {
        key: 'permission',
        prompt: 'What permission are you giving?',
        type: 'string'
      }
    ]

  });
  }

  run(message,args){
    var works = false;
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
      fs.appendFile(file,JSON.stringify(permissions), err => {
        if(err){
          message.reply('Error creating permissions file!');
        }else{
          this.setup(message,args,file);
        }
      });
    }else{
      works = true;
    }
    if(works){
      this.setup(message,args,file);
    }else{
      console.log("Didn't work");
    }
  }
  addPermission(args,perms,message){
    var exists = false;
    var members = message.guild.members.array();
    var group = args.group
    for(var i = 0; i < members.length; i++){
      if(args.group.toLowerCase() == members[i].displayName.toLowerCase()){
        group = members[i].user.id;
        break;
      }
    }
    if(perms[args.permission]){
      for(var i = 0; i < perms[args.permission].length; i++){
        if(group.toLowerCase() == perms[args.permission][i].toLowerCase()){
          exists = true;
          break;
        }else{
          exists = false;
        }
      }
      if(!exists){
        var newPerms = perms;
        newPerms[args.permission][perms[args.permission].length] = group;
        return newPerms;
      }else{
        message.reply('Permission already exists!');
        return perms;
      }
    }else{
      message.reply('Error setting permissions. Check the permission.');
      return perms;
    }
  }
  removePermission(args,perms,message){
    var exists = false;
    var members = message.guild.members.array();
    var group = args.group;
    for(var i = 0; i < members.length; i++){
      if(args.group.toLowerCase() == members[i].displayName.toLowerCase()){
        group = members[i].user.id;
        break;
      }
    }
    if(perms[args.permission]){
      for(var i = 0; i < perms[args.permission].length; i++){
        if(perms[args.permission][i].toLowerCase() == group.toLowerCase()){
          exists = true;
          break;
        }
      }
      if(exists){
        var newPerms = perms;
        console.log(newPerms[args.permission]);
        var newArray = [];
        var arrayNum = 0;
        for(var i = 0; i < newPerms[args.permission].length; i++){
          if(newPerms[args.permission][i].toLowerCase() == group.toLowerCase()){
            console.log('removed');
          }else{
            newArray[arrayNum] = newPerms[args.permission][i];
            arrayNum++;
          }
        }
        console.log(newArray);
        newPerms[args.permission] = newArray;
        return newPerms;
      }else{
        message.reply("They don't have that permission!");
        return perms;
      }
    }else{
      message.reply('Error setting permissions. Check the permission.');
      return perms;
    }
  }
  setup(message,args,file){
    var perms = JSON.parse(fs.readFileSync(file));
    var hasPermission = false;
    var roles = message.member.roles.array();
    if(message.author.id == config.ownerid){
      hasPermission = true;
    }
    for(var i = 0; i < perms.all.length; i++){
      if((message.guild.ownerID == message.author.id) || (message.author.id == perms.all[i])){
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
    if(hasPermission){
      if(args.type.toLowerCase() == 'add'){
        fs.writeFileSync(file,JSON.stringify(this.addPermission(args,perms,message)));
        message.reply('Permissions added');
      }else if(args.type.toLowerCase() == 'remove'){
        fs.writeFileSync(file,JSON.stringify(this.removePermission(args,perms,message)));
        message.reply('Permissions removed');
      }else{
        message.reply('Invalid arguments. Example: "permissions add owner all"');
      }
    }else{
      message.reply('Insufficient permissions!');
    }
  }
}

module.exports = PermissionCommand;
