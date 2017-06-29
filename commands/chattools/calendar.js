const Commando = require('discord.js-commando');
var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

//Change Name
class CalendarCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'calendar',
      group: 'chattools',
      memberName: 'calendar',
      description: 'Google Calendar stuff tbd',
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

  }
}

//End name
module.exports = CalendarCommand;
