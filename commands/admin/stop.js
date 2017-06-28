const Commando = require('discord.js-commando');
const config = require('../../config.js');

//Change Name
class StopCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'stop',
      group: 'admin',
      memberName: 'stop',
      description: 'Stops the bot. Can only be used by the owner.',
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
    if(message.author.id == config.ownerid){
      var useClient = this.client;
      message.reply('Shutting down...');
      setTimeout(function(){
        useClient.destroy();
      }, 1000);
    }
  }
}

//End name
module.exports = StopCommand;
