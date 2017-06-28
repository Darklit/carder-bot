const Commando = require('discord.js-commando');

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
    var client1 = this.client;
    var messageDel;
    var dothis = false;
    message.channel.fetchMessages({limit:100})
    .then(messages => {
      var go = 0;
      messageDel = messages.array();
      var delMessage = [];
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
  }
  delMessages(messageDel,message,args){
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
}

//End name
module.exports = ClearCommand;
