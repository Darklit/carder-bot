const Commando = require('discord.js-commando');

//Change Name
class JoinCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'join',
      group: 'music',
      memberName: 'join',
      description: 'Joins the channel',
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
    var channel = message.member.voiceChannel;
    channel.join();
  }
}

//End name
module.exports = JoinCommand;
