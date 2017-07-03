const Commando = require('discord.js-commando');
const fs = require('fs');
const config = require('../../config.js');

//Change Name
class DateCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'dates',
      group: 'chattools',
      memberName: 'dates',
      description: 'Get the available dates of everyone who works.',
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

  //setEnabledIn(config.novatome,true);

  run(message,args){
    if(message.guild.id == config.novatome){
      var file = ('./commands/chattools/plans.json');
      if(fs.existsSync(file)){
        var nums = [
          0,
          0,
          0,
          0,
          0,
          0,
          0
        ];
        var days = [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday'
        ];
        var data = JSON.parse(fs.readFileSync(file));
        for(var i = 0; i < Object.keys(data).length; i++){
          for(var g = 0; g < data[Object.keys(data)[i]].dates.length; g++){
            switch (data[Object.keys(data)[i]].dates[g].toLowerCase()){
              case 'monday':
                nums[0]++;
                break;
              case 'tuesday':
                nums[1]++;
                break;
              case 'wednesday':
                nums[2]++;
                break;
              case 'thursday':
                nums[3]++;
                break;
              case 'friday':
                nums[4]++;
                break;
              case 'saturday':
                nums[5]++;
                break;
              case 'sunday':
                nums[6]++;
                break;
            }
          }
        }
        var min = Math.min.apply(null,nums);
        message.reply(`The best day for plans is ${days[nums.indexOf(min)]} with ${min} people busy`);
        var mes = `**Amount of busy people:**\nMonday: ${nums[0]}\nTuesday: ${nums[1]}\nWednesday: ${nums[2]}\nThursday: ${nums[3]}\nFriday: ${nums[4]}\nSaturday: ${nums[5]}\nSunday: ${nums[6]}`;
        message.channel.send(mes);
      }else{
        message.reply('Data not found.');
      }
    }else{
      message.reply('This command only works on the NovaTome discord!');
    }
  }


}

//End name
module.exports = DateCommand;
