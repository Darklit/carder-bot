const Commando = require('discord.js-commando');
const fs = require('fs');
const file = ('./commands/economy/money.txt');
const emojis = [
  'MEGAchamp',
  'royce',
  'xd',
  'moonman',
  'nut'
];

//Change Name
class SlotCommand extends Commando.Command {
  constructor(client) {
    super(client, {
      name: 'slot',
      group: 'fun',
      memberName: 'slots',
      description: 'Try your luck at the slot machine!',
      guildOnly: true,
      throttling: {
        usages: 1,
        duration: 3
      },


      args: [
        {
          key: 'money',
          prompt: 'How much money are you betting?',
          type: 'integer'
        }
      ]

    });
  }

  run(message,args){

    if(parseInt(args.money)>0){
      if(this.running == undefined){
        console.log('done');
        this.running = false;
      }
      var client1 = this.client;
      var check = false;
      var mes = message;
      var test = args.money;
      var data;
      if(!(this.running)){

        this.running = true;
        this.mon = args.money;
        if(!(fs.existsSync(file))){
          this.client.registry.resolveCommand('economy:money').run(message,'');
        }
        this.readMoney().then(function(res){
          var dat = res;
          var mes = message;
          var ar = test;
          data = res;
          check = client1.registry.resolveCommand('fun:slots').checkMoney(dat,mes,ar);
        })
        .catch(console.error);

        setTimeout(function(){
          var com = client1.registry.resolveCommand('fun:slots');
          if(check){
            if(com.slots()){
              var emoji1ob = mes.guild.emojis.find(x => x.name === com.emoji1);
              var emoji2ob = mes.guild.emojis.find(x => x.name === com.emoji2);
              var emoji3ob = mes.guild.emojis.find(x => x.name === com.emoji3);
              console.log('win' + emoji1ob);
              message.channel.sendMessage(emoji1ob + ' ' + emoji2ob + ' ' + emoji3ob);
              com.winner(message,com.mon);
              message.reply('You won, ' + com.winning1);
            }else{
              var emoji1ob = mes.guild.emojis.find(x => x.name === com.emoji1);
              var emoji2ob = mes.guild.emojis.find(x => x.name === com.emoji2);
              var emoji3ob = mes.guild.emojis.find(x => x.name === com.emoji3);
              message.channel.sendMessage(emoji1ob + ' ' + emoji2ob + ' ' + emoji3ob);
              message.reply('Try again!');
              com.loser(message,com.mon,data);
            }
          }else{
            console.log('failed');
          }
        }, 500);
      }else{
        message.reply('Someone else is using this machine. Try again!');
      }
    }
    setTimeout(function(){
      client1.registry.resolveCommand('admin:clean').run(message,args);
      client1.registry.resolveCommand('fun:slots').running = false;
    },1500);
  }

  readMoney(){
    return new Promise(function (fulfill, reject){
      fs.readFile(file, 'utf8', function (err,res){
        if(err) reject(err);
        else fulfill(res);
      });
    });
  }

  writeMoney(mes){
    fs.writeFileSync(file,mes);
  }

  checkMoney(data,message,args){
    var moneyList = data.split('  ');
    var playerMoney;
    var check = false;
    for(var i = 0; i<moneyList.length;i++){
      if(moneyList[i].includes(message.member.displayName.toLowerCase())){
        playerMoney = parseInt(moneyList[i].replace(message.member.displayName.toLowerCase(),''));
      }
    }
    if(playerMoney>=args && args != 0){
      check = true;
      /*
      playerMoney-=args;
      for(var g = 0; g<moneyList.length;g++){
        if(moneyList[g].includes(message.member.displayName.toLowerCase())){
          moneyList[g] = (message.member.displayName.toLowerCase() + playerMoney.toString() + '  ');
        }else{
          moneyList[g] = moneyList[g] + '  ';
        }

      */
    }else if(args < 0){
      check = false;
      message.reply("You can't bet 0!");
    }else{
      check = false;
      message.reply("You don't have that much money to bet!");
    }
    var final = moneyList.join('  ');
    while(final.includes(',')){
      final = final.replace(',','');
    }
    setTimeout(this.writeMoney, 1000,final);
    if(check){
      return true;
    }else{
      return false;
    }
  }

  slots(){
    var rand1 = Math.floor(Math.random()*emojis.length);
    var rand2 = Math.floor(Math.random()*emojis.length);
    var rand3 = Math.floor(Math.random()*emojis.length);
    this.emoji1 = emojis[rand1];
    this.emoji2 = emojis[rand2];
    this.emoji3 = emojis[rand3];

    if(this.emoji2 == this.emoji1 && this.emoji3 == this.emoji1){
      return true;
    }else{
      return false;
    }
  }

  winner(message,args){
    var playerMoney;
    var mes = message;
    var winnings = 0;
    var com = this.client.registry.resolveCommand('fun:slots');
    if(this.emoji1 == 'MEGAchamp'){
      winnings = (args * 12);
    }else if(this.emoji1 == 'royce'){
      winnings = (args * ((1865*17)));
    }else if(this.emoji1 == 'xd'){
      winnings = (args + 100000);
    }else if(this.emoji1 == 'moonman'){
      winnings = 1000000;
    }else if(this.emoji1 == 'nut'){
      winnings = (args * 10000);
    }
    this.winning1 = winnings;
    this.readMoney().then(function(res){
      var moneyList = res.split('  ');
      for(var i = 0; i<moneyList.length;i++){
        if(moneyList[i].includes(mes.member.displayName.toLowerCase())){
          playerMoney = parseInt(moneyList[i].replace(mes.member.displayName.toLowerCase(),''));
          playerMoney= playerMoney + winnings;
          moneyList[i] = (mes.member.displayName.toLowerCase() + playerMoney.toString());
        }else{

        }
      }
      var final = moneyList.join('  ');
      while(final.includes(',')){
        final = final.replace(',','');
      }
      setTimeout(com.writeMoney, 1000,final);
    })
    .catch(console.error);
    this.client.registry.resolveCommand('fun:slots').running = false;
  }
  loser(message,money,data){
    var moneyList = data.split('  ');
    for(var i = 0; i<moneyList.length;i++){
      if(moneyList[i].includes(message.member.displayName.toLowerCase())){
        var tempMoney = parseInt(moneyList[i].replace(message.member.displayName.toLowerCase(),''));
        tempMoney = tempMoney - money;
        moneyList[i] = (message.member.displayName.toLowerCase()+tempMoney.toString());
      }else{

      }
    }
    var final = moneyList.join('  ');
    while(final.includes(',')){
      final = final.replace(',','');
    }
    setTimeout(this.writeMoney, 1000,final);
  }

}

//End name
module.exports = SlotCommand;
