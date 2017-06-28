const Commando = require('discord.js-commando');

//Change Name
class SkipCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'skip',
      group: 'music',
      memberName: 'skip',
      description: 'Calls for a vote to skip a song.',
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
    if(this.skipping == undefined){
      this.skipping = false;
    }
    if(message.member.voiceChannel != undefined){
      if(!this.skipping){
        message.channel.sendMessage('If you want to skip this song, say I');
        const filter = m => (m.content.toLowerCase() == 'i');
        var mems = message.member.voiceChannel.members.array();
        var skips = 1;
        var skipped = [message.author.id];
        const collector = message.channel.createCollector(filter);

        collector.on('message',message =>{
          var temp = 0;
          if(message.content.toLowerCase() == 'i'){
            for(var i = 0; i<skipped.length; i++){
              if(message.author.id == skipped[i]){
                break;
              }else{
                temp++;
              }
            }
            if(temp == skipped.length){
              skipped[skips] = message.author.id;
              skips++;
              temp = 0;
            }
            message.channel.sendMessage(skips + '/' + (mems.length - 1) + ' voted to skip.');
            if(skips>= Math.floor((mems.length/2))){
              client1.registry.resolveCommand('music:play').dispatcher.end();
              message.channel.sendMessage('Skipped!');
              collector.stop();
            }
          }
        });
      }
    }else{
      message.reply('Join a voice channel first!');
    }
  }
}

//End name
module.exports = SkipCommand;
