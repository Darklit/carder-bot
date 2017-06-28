const Commando = require('discord.js-commando');
const fs = require('fs');
var file = '';

//Change Name
class GameCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'game',
      group: 'fun',
      memberName: 'game',
      description: 'Play an adventure game with the bot!',
      guildOnly: false,


      args: [
        {
          key: 'option',
          prompt: 'Do you want to start new or continue a game?',
          type: 'string'
        }
      ]

    });
  }

  run(message,args){
    file = ('./commands/fun/saves/' + message.author.username.toLowerCase() + '.txt');
    console.log(file);
    if(args.option.toLowerCase().includes('new')){
      this.newGame(file);
    }
  }

  newGame(file){
    //Creates a new game file.
    var newData = [
      'hp:100',
      'money:100',
      'progress:0'
    ];
    if(!(fs.existsSync(file))){
      fs.appendFile(file,newData.join(' '),(err) => {
        if (err) console.log(err);
        console.log('file created');
      });
    }else{
      fs.writeFileSync(file,newData.join(' '));
    }
  }
}

//End name
module.exports = GameCommand;
