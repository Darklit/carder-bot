const Commando = require('discord.js-commando');
const config = require('../../config.js');

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
    if(message.author.id == config.ownerid){
      this.client.registry.resolveCommand('music:play').dispatcher.end();
      message.reply('Skipped!');
    }else{
      message.reply('Insufficient permissions');
    }
  }
}

//End name
module.exports = ForceSkipCommand;
