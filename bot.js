const Commando = require('discord.js-commando');
const config = require('./config.js');
const client = new Commando.Client({
  owner: config.ownerid,
  commandPrefix: '=',
  unknownCommandResponse: false
});

//Sets up needed variables for the blackjack game.
var tempvar = 0;
var done = [];
var blackjack21 = 0;
var blackjackRevised = [];
var blackjackMin = 0;

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

  client.on('message', message => {
    if(message.author.id != config.botid){ //The bot likes to pick up its own messages; this prevents that.
      if(client.registry.resolveCommand('fun:blackjack').blackjackGame){
        var pot = client.registry.resolveCommand('fun:blackjack').pot;
        if(message.channel.type == 'text'){
          //Accesses data setup by the command file blackjack.js and moves it to be used here
          var numbers = client.registry.resolveCommand('fun:blackjack').numbers;
          var users = client.registry.resolveCommand('fun:blackjack').users;
          var members = client.registry.resolveCommand('fun:blackjack').mems;
          if(done.length == 0){
            for(var i = 0; i<users.length;i++){
              done[i] = false;
              console.log('length ' + done.length + done[0]);
            }
          }
          if(message.content.toLowerCase() == 'hit'){
            //This processes the action of hitting in blackjack.
            for(var o = 0; o<users.length;o++){
              if(message.author.id == users[o].id){
                if(!done[o]){
                  var randomNum = Math.floor(Math.random()*11);
                  if(randomNum>10){
                    randomNum = 10;
                  }else if(randomNum<2){
                    randomNum = 2;
                  }
                  numbers[o]+=randomNum;
                  if(numbers[o]>21){
                    message.author.sendMessage('Your number is ' + numbers[o] + ' You are over 21! Please wait for others to finish.');
                    done[o] = true;
                    message.delete();
                  }else{
                    message.author.sendMessage('Your number is ' + numbers[o] + ' Hit or Stand?');
                    message.delete();
                  }
                }
              }
            }
          }else if(message.content.toLowerCase() == 'stand'){
            //This processes the action of standing in blackjack.
            for(var y = 0; y<users.length;y++){
              if(message.author.id == users[y].id){
                message.author.sendMessage('Please wait for others to finish.');
                message.delete();
                done[y] = true;
              }
            }
          }
          //This just checks if everyone is done.
          for(var g = 0; g<done.length;g++){
            if(done[g]){
              tempvar++;
            }else{
              tempvar = 0;
              break;
            }
          }
          if(tempvar == done.length){

          for(var h = 0; h<numbers.length;h++){
            if(numbers[h] == 21){
              blackjack21 = h;
              var blackjack21bo = true;
              break;
            }
            if(numbers[h]<=21){
              blackjackRevised[h] = Math.abs((numbers[h] - 21));
          }else if(numbers[h]>21){
            blackjackRevised[h] = numbers[h];
          }

          }
          //This takes the closest number to 21 as the winner.
          blackjackMin = Math.abs(Math.min.apply(null,blackjackRevised));
          blackjackMin = Math.abs(Math.min(blackjackMin));

          var channelInt = client.registry.resolveCommand('fun:blackjack').channelInt;
            console.log(users[blackjackRevised.indexOf(blackjackMin)].username);
            console.log(tempvar);
            console.log(done.length);
            client.registry.resolveCommand('fun:blackjack').blackjackGame = false;
            client.registry.resolveCommand('fun:blackjack').progress = false;
            if(blackjack21bo != undefined){
              channelInt.sendMessage(users[blackjackRevised.indexOf(blackjackMin)].username + ' won with ' + numbers[blackjackRevised.indexOf(blackjackMin)]);
              readMoney().then(function(res){
                //This retrieves their current money and then adds the new money.
                addMoney(res,members[blackjackRevised.indexOf(blackjackMin)].displayName,pot);
                done = [];
                tempvar = 0;
                blackjack21 = 0;
                blackjackRevised = [];
                blackjackMin = 0;
                console.log('Complete');
              })
              .catch(console.error);
            }else if(blackjack21bo){
              channelInt.sendMessage(users[blackjack21].username + ' won with ' + numbers[blackjackRevised.indexOf(blackjackMin)]);
              readMoney().then(function(res){
                addMoney(res,members[blackjack21].displayName,pot);
                done = [];
                tempvar = 0;
                blackjack21 = 0;
                blackjackRevised = [];
                blackjackMin = 0;
                console.log('Complete');
            })
            .catch(console.error);
          }
        }
      }
    }else{

      }
    }
  });
  //This changes their name in the money.txt file if they change their name.
  client.on('guildMemberUpdate',(oldMember,newMember)=> {
    readMoney().then(function(res){
      var data = res;
      var moneyList = data.split('  ');
      for(var i = 0; i<moneyList.length;i++){
        if(moneyList[i].includes(oldMember.displayName.toLowerCase())){
          moneyList[i] = moneyList[i].replace(oldMember.displayName.toLowerCase(),newMember.displayName.toLowerCase());
        }
      }
      var final = moneyList.join('  ');
      fs.writeFileSync(file,final);
    })
    .catch(console.error);
  });


  //Retrieves money of a user.
  function readMoney(){
    return new Promise(function (fulfill, reject){
      fs.readFile(file, 'utf8', function (err,res){
        if(err) reject(err);
        else fulfill(res);
      });
    });
  }

//Adds money to a user.
  function addMoney(res,winnerName,potMon){
    var dat = res;
    var moneyList = dat.split('  ');
    for(var i = 0; i<moneyList.length;i++){
      if(moneyList[i].includes(winnerName.toLowerCase())){
        var tempMon = parseInt(moneyList[i].replace(winnerName.toLowerCase(),''));
        tempMon = tempMon + potMon;
        moneyList[i] = (winnerName.toLowerCase() + tempMon.toString());
      }
    }
    var final = moneyList.join('  ');
    fs.writeFileSync(file,final);
  }
