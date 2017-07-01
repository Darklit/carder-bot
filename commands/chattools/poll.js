const Commando = require('discord.js-commando');
const request = require('request');

//Change Name
class PollCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'poll',
      group: 'chattools',
      memberName: 'poll',
      description: 'Creates a poll on strawpoll',
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
    var options1 = [];
    var optionNum = 0;
    //Asks the user for the options and then puts them in an array.
    message.reply('What do you want for the options? Say stop to stop creating options.');
    const collector = message.channel.createCollector(
      m => m.author.id == message.author.id
    );
    collector.on('message', m => {
      //Stops collecting options if they say stop.
      if(m.content.toLowerCase() == 'stop'){
        collector.stop();
      }else{
        options1[optionNum] = m.content;
        optionNum++;
        m.reply('Added the option ' + m.content);
      }
    });
    collector.on('end', collected => {
      //Creates the json text being sent to the strawpoll api.
      var test = {
        title: args,
        options: options1,
        multi: true
      };
      this.post(test,message);
    });
  }

  post(text,message){
    //Requests to post data to strawpoll.
    request.post({
      url: 'https://strawpoll.me/api/v2/polls',
      json: text,
      followAllRedirects: true
    }, function(error, response, body){
      console.log('error:', error);
      //200 status code is basically a success code.
      if(response.statusCode == 200){
        message.reply('http://www.strawpoll.me/' + body.id);
      }else{
        message.reply('Error!');
      }
    });
  }
}

//End name
module.exports = PollCommand;
