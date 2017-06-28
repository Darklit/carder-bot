const Commando = require('discord.js-commando');

//Change Name
class MembersCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'members',
      group: 'admin',
      memberName: 'members',
      description: 'Get all members',
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
    //Just lists all members in the server. Used for debugging mostly.
    var members = message.guild.members.array();
    var newMembers = [];
    for(var i = 0; i<members.length;i++){
      newMembers[i] = members[i].displayName;
    }
    var final = newMembers.join(' ');
    message.channel.sendMessage(final);
  }
}

//End name
module.exports = MembersCommand;
