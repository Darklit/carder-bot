const Commando = require('discord.js-commando');
const config = require('../../config.js');

//Change Name
class DestructCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'destruct',
      group: 'admin',
      memberName: 'destruct',
      description: 'Leaves all servers. Only in emergancy.',
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
    if(this.checkOwner(message.author.id)){
      var servers = this.client.guilds.array();
      var server = message.guild;
      for(var i = 0; i<servers.length;i++){
        if(servers[i] != server){
          servers[i].leave();
          console.log('Left ' + servers[i].name);
        }
      }
    }
  }

  checkOwner(id){
    if(id == config.ownerid){
      return true;
    }else{
      return false;
    }
  }

}

//End name
module.exports = DestructCommand;
