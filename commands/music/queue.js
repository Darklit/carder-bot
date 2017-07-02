const Commando = require('discord.js-commando');
const ytdl = require('ytdl-core');

//Change Name
class QueueCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'queue',
      group: 'music',
      memberName: 'queue',
      description: 'View the current queue.',
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
    var guildName = message.guild.name.toLowerCase();
    if(this.client.registry.resolveCommand('music:play').queue){
      var songList = this.client.registry.resolveCommand('music:play').queue[guildName].songs;
      var newArray = [];
      var tempvar = 0;
      for(var i = 0; i < songList.length; i++){
        if(!(songList[i] == '')){
          newArray[tempvar] = songList[i];
          tempvar++;
        }
      }
      var mes = 'The current queue is:\n';
      var queuenum = 1;
      if(newArray.length == 0){
        message.channel.stopTyping();
        message.reply('There is no queue!');
      }else{
        message.channel.startTyping();
      }
      for(var i = 0; i < newArray.length; i++){
        console.log(newArray);
        ytdl.getInfo(newArray[i],{downloadURL: true}, (err, info) =>{
          if(err) throw err;
            mes+= `(${queuenum}): ${info.title} \n`;
            queuenum++;
            if(queuenum == (newArray.length + 1)){
              message.channel.stopTyping();
              message.reply(mes);
            }else{
              console.log(queuenum);
            }
        });
      }
    }else{
      message.reply('There is no queue!');
    }
  }
}

//End name
module.exports = QueueCommand;
