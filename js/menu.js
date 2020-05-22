GAME.Menu = function(game) {};

GAME.Menu.prototype = {
    create: function() {
        this.add.image(0, 0, 'menuBG');
        this.startButton = game.add.button((game.width/2) - 243, 360, 'menuPlay', this.startGame, this);
        this.infoButton = this.add.button((game.width/2) - 170, this.startButton.y + 110, 'menuScores', this.startScores, this);
        this.soundButton = this.add.button((game.width/2) - 127, this.infoButton.y + 110, 'menuSoundOn', this.toggleSound, this);

        this.scoresButton = this.add.button((game.width/2) - 184, this.soundButton.y + 110, 'menuInfo', this.startInfo, this);

        reg.track = game.add.audio('track');
        reg.track.loop = true;

        if (reg.sound === true) {
            reg.track.play();
        }
        
        music = game.add.audio('music', 1, true);
        
        killsSfx =[
            game.add.audio('kill1'),
            game.add.audio('kill2'),
            game.add.audio('kill3'),
            game.add.audio('kill4')
        ];

        voices = [
            game.add.audio('voice1'),
            game.add.audio('voice2'),
            game.add.audio('voice3'),
            game.add.audio('voice4'),
            game.add.audio('voice5')
        ];

        laughSfx = game.add.audio('laugh');
        
    },
    startGame: function() {
        reg.track.stop();
        game.state.start('Levels');
    },
    startScores: function () {
        game.state.start('Scores');
    },
    toggleSound: function() {
        reg.sound = (reg.sound === true) ? false : true;

        if(reg.sound === false) {
            this.soundButton.loadTexture("menuSoundOff",0);
            reg.track.stop();
        }
        else {
            this.soundButton.loadTexture("menuSoundOn",0);
            reg.track.play();
        }
    },
    startInfo: function() {
        game.state.start('Info');
    }
};