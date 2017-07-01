const Commando = require('discord.js-commando');
const fs = require('fs');
const config = require('../../config.js');

//Change Name
class ClearCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'clear',
      group: 'chattools',
      memberName: 'clear',
      description: 'Clears the chat of a certain person and/or a certain amount',
      guildOnly: true,


      args: [
        {
          key: 'amount',
          prompt: 'How many messages would you like to delete?',
          type: 'integer',
          max: 100
        },
        {
          key: 'user',
          prompt: "Who's messages would you like to delete?",
          type: 'string',
          default: '',
          parse: str => str.toLowerCase()
        }
      ]

    });
  }

  run(message,args){
    if((this.checkPermission1(message)) && message.guild.member(config.botid).hasPermission('MANAGE_MESSAGES')){
      var client1 = this.client;
      var messageDel;
      var dothis = false;
      message.channel.fetchMessages({limit:100})
      .then(messages => {
        var go = 0;
        messageDel = messages.array();
        var delMessage = [];
        //Checks if the user wants to delete messages from another user.
        if(args.user == undefined || args.user == ''){
          message.channel.bulkDelete(args.amount);
          message.reply(args.amount + ' messages removed.');
        }else{
          dothis = true;
          console.log(dothis + ' set');
        }
      })
      .catch(console.error);
      console.log(dothis);
      setTimeout(function(){
        if(dothis){
          client1.registry.resolveCommand('chattools:clear').delMessages(messageDel,message,args);
        }else{
          console.log('sorry sweaty');
        }
      },1000);
    }else if(!(message.guild.member(config.botid).hasPermission('MANAGE_MESSAGES'))){
      message.reply("I don't have the permissions to do that!");
    }else{
      message.reply('Insufficient permissions');
    }
  }
  delMessages(messageDel,message,args){
    //Retrieves a certain amount of messages and then deletes them.
    var go = 0;
    var delMessage = [];
    for(var o = 0; o<messageDel.length;o++){
      if(messageDel[o].member.displayName.toLowerCase().includes(args.user)){
        delMessage[go] = messageDel[o];
        go++;
      }else{

      }
      if(go == (args.amount)){
        message.channel.bulkDelete(delMessage);
        message.reply(go + " messages removed.");
        break;
      }else{

      }
    }
    message.channel.bulkDelete(delMessage);
    message.reply(go + " messages removed.");
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
    for(var i = 0; i < perms.clear.length; i++){
      if(message.author.id == perms.clear[i]){
        hasPermission = true;
        break;
      }
      for(var g = 0; g < roles.length; g++){
        if(roles[g].name.toLowerCase() == perms.clear[i].toLowerCase()){
          hasPermission = true;
          break;
        }
      }
    }
    return hasPermission;
  }
}

//End name
module.exports = ClearCommand;
