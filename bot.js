const Commando = require('discord.js-commando');
const config = require('./config.js');
const client = new Commando.Client({
  owner: config.ownerid,
  commandPrefix: '=',
  unknownCommandResponse: false
});

const path = require('path');

const fs = require('fs');
const file = ('./commands/economy/money.txt');

//Registers the different command groups.
client.registry
  .registerGroups([
    ['fun', 'Fun commands'],
    ['chattools', 'Chat moderation'],
    ['prob', 'Probability and decision makers.'],
    ['admin', 'Tools to help the bot and admins'],
    ['music', 'Music commands'],
    ['economy', 'Manage money']
  ])

  .registerDefaults()

  .registerCommandsIn(path.join(__dirname, 'commands'));

  client.on('ready', () =>{
    console.log('I am ready!');
  });

  client.login(config.token);

//Makes the bot unmutable.
  client.on('voiceStateUpdate', (oldMember, newMember) => {
    if(newMember.id == config.botid){
      if(newMember.serverMute){
        newMember.setMute(false);
      }
    }
  });

  //This changes their name in the money.txt file if they change their name.
  client.on('guildMemberUpdate',(oldMember,newMember)=> {

  });
