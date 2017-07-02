const Commando = require('discord.js-commando');
const ytdl = require('ytdl-core');
const streamOptions = { seek: 0, volume: 1};

//Change Name
class PlayCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'play',
      group: 'music',
      memberName: 'play',
      description: 'Plays a YouTube video.',
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

  //setEnabledIn('160886651340587008',false);

  run(message,args){
    this.setup(message);
    var guildName = message.guild.name.toLowerCase()
    if(message.member.voiceChannel != undefined){
      //Checks if the link is a youtube link.
      if((args.includes('youtube.com/watch?')) ||( args.includes('youtu.be'))){
        this.queue[guildName].songs[this.queue[guildName].queuenum] = args;
        if(!(this.queue[guildName].playing)){
          //If the bot is not playing music it will start playing the song.
          this.playMusic(message,this.queue[guildName].songs[this.queue[guildName].queuenum]);
        }else{
          //If the bot is playing music the song is added to the queue.
          this.queue[guildName].songs[this.queue[guildName].songs.length] = args;
          console.log(guildName);
          console.log(this.queue[guildName].songs);
          message.reply('Added to the queue');
        }
      }else{
        message.reply('This is not a YouTube link!');
      }
    }else{
      message.reply('Join a voice channel first!');
    }

  }
  setup(message){
    //If it's the first time running the command, variables will be set.
    if(this.queue == undefined){
      this.queue = {};
    }
    if(!(this.queue[message.guild.name.toLowerCase()])){
      var jso = {
        songs: [

        ],
        queuenum: 0,
        playing: false,
        voiceChannel: '',
        dispatcher: null
      };
      this.queue[message.guild.name.toLowerCase()] = jso;
    }
  }

  playMusic(message,link){
    var com = this.client.registry.resolveCommand('music:play');
    var mes = message;
    var guildName = message.guild.name.toLowerCase();
    var client1 = this.client;
    if(message.member.voiceChannel){
      this.queue[guildName].voiceChannel = message.member.voiceChannel;
    }
    this.queue[guildName].voiceChannel.join().then(connection =>{
      com.queue[guildName].playing = true;
      const stream = ytdl(link, {filter: 'audioonly'});
      stream.on('info',title => {
        //Sets the bot's game title to the music title.
      })
      com.queue[guildName].dispatcher = connection.playStream(stream,streamOptions); //Starts playing a stream of music.
      com.queue[guildName].dispatcher.on('end',reason => {
        console.log(reason);
        if(reason.toLowerCase().includes('stream is')){
          //If the song ends it deletes the song in the queue and plays the next one.
          com.queue[guildName].songs[com.queue[guildName].queuenum] = '';
          com.queue[guildName].queuenum++;
          if(com.queue[guildName].songs[com.queue[guildName].queuenum] != undefined){
            com.playMusic(mes,com.queue[guildName].songs[com.queue[guildName].queuenum]);
            com.queue[guildName].songs[com.queue[guildName].queuenum] = '';
          }else{
            com.queue[guildName].playing = false;
            com.queue[guildName].queuenum = 0;
            com.queue[guildName].songs = [];
            com.queue[guildName].voiceChannel.leave();
            com.queue[guildName].voiceChannel = null;
          }
        }else if(reason == 'user'){
          console.log(guildName);
          console.log(com.queue[guildName].songs);
          //Basically does the same as the first but only if skipped forcefully.
          com.queue[guildName].songs[com.queue[guildName].queuenum] = '';
          com.queue[guildName].queuenum++;
          if(com.queue[guildName].songs[com.queue[guildName].queuenum] != undefined){
            com.playMusic(mes,com.queue[guildName].songs[com.queue[guildName].queuenum]);
            com.queue[guildName].songs[com.queue[guildName].queuenum] = '';
          }else{
            com.queue[guildName].playing = false;
            com.queue[guildName].queuenum = 0;
            com.queue[guildName].songs = [];
            com.queue[guildName].voiceChannel.leave();
            com.queue[guildName].voiceChannel = null;
          }
        }else{
          console.log(reason);
        }
      });
    })
    .catch(console.error);
  }

}

//End name
module.exports = PlayCommand;
