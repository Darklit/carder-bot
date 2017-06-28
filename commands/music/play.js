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
    this.setup();
    if(message.member.voiceChannel != undefined){
      //Checks if the link is a youtube link.
      if((args.includes('youtube.com/watch?')) ||( args.includes('youtu.be'))){
        this.queue[this.currentqueue] = args;
        if(!this.playing){
          //If the bot is not playing music it will start playing the song.
          this.playMusic(message,this.queue[this.currentqueue]);
        }else{
          //If the bot is playing music the song is added to the queue.
          this.queue[this.queue.length] = args;
          message.reply('Added to the queue');
        }
      }else{
        message.reply('This is not a YouTube link!');
      }
    }else{
      message.reply('Join a voice channel first!');
    }

  }
  setup(){
    //If it's the first time running the command, variables will be set.
    if(this.currentqueue == undefined){
      this.currentqueue = 0;
    }
    if(this.queue == undefined){
      this.queue = [];
    }
    if(this.playing == undefined){
      this.playing = false;
    }
  }

  playMusic(message,link){
    var com = this.client.registry.resolveCommand('music:play');
    var mes = message;
    var client1 = this.client;
    message.member.voiceChannel.join().then(connection =>{
      com.playing = true;
      const stream = ytdl(link, {filter: 'audioonly'});
      stream.on('info',title => {
        //Sets the bot's game title to the music title.
        client1.user.setGame(title.title);
      })
      com.dispatcher = connection.playStream(stream,streamOptions); //Starts playing a stream of music.
      com.dispatcher.on('end',reason => {
        if(reason.toLowerCase().includes('stream is')){
          //If the song ends it deletes the song in the queue and plays the next one.
          client1.user.setGame(null);
          com.queue[com.currentqueue] = '';
          com.currentqueue++;
          if(com.queue[com.currentqueue] != undefined){
            com.playMusic(mes,com.queue[com.currentqueue]);
            com.queue[com.currentqueue] = '';
          }else{
            com.playing = false;
            com.currentqueue = 0;
            com.queue = [];
            mes.member.voiceChannel.leave();
          }
        }else if(reason == 'user'){
          //Basically does the same as the first but only if skipped forcefully.
          client1.user.setGame(null);
          com.queue[com.currentqueue] = '';
          com.currentqueue++;
          if(com.queue[com.currentqueue] != undefined){
            com.playMusic(mes,com.queue[com.currentqueue]);
            com.queue[com.currentqueue] = '';
          }else{
            com.playing = false;
            com.currentqueue = 0;
            com.queue = [];
            mes.member.voiceChannel.leave();
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
