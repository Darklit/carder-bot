const Commando = require('discord.js-commando');
const request = require('request');

//Change Name
class TestCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'test',
      group: 'admin',
      memberName: 'test',
      description: 'Just testing stuff...',
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
    //Does nothing cause I'm not testing anything.
}

//End name
module.exports = TestCommand;
