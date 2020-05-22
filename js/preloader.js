GAME.Preloader = function (game) {};
GAME.Preloader.prototype = {
    preload: function () {
        this.game.stage.backgroundColor = '#16181a';
        //this.preloadMainBg = this.add.sprite( 0, 0, 'monster7');

        //this.load.setPreloadSprite(this.preloadMainBg);

        // Add a loading label on the screen
        var loadingLabel = game.add.text(game.world.centerX, 150, 'LOADING...',
        { font: '42px FingerPaint-Regular', fill: '#ffffff' });
        loadingLabel.anchor.setTo(0.5, 0.5);

        this.add.image(0, 0, 'menuBG');
        // Add the progress bar
        var progressBar = game.add.sprite(game.world.centerX - 344/2, 250, 'monster2');

        this.load.image("menuBack", "assets/back.png");
        this.load.image("bg", "assets/mainBG.png");
        this.load.image("levelsBG", "assets/bgLevels.jpg");

        game.load.image("menuPlay", "assets/play.png");
        this.load.image("menuScores", "assets/score.png");
        this.load.image("menuInfo", "assets/info.png");
        this.load.image("menuSoundOn", "assets/soundON.png");
        this.load.image("menuSoundOff", "assets/soundOFF.png");
        this.load.image("info_panel", "assets/infoPanel.jpg");

        // MONSTERS
        this.load.image("monster1", "assets/monster1.png");
        this.load.image("monster7", "assets/monster7.png");
        this.load.image("monster3", "assets/monster3.png");
        this.load.image("monster4", "assets/monster4.png");
        this.load.image("monster5", "assets/monster5.png");
        this.load.image("monster6", "assets/monster6.png");
        this.load.image("monster8", "assets/monster8.png");
        this.load.image("monster9", "assets/monster9.png");

        this.load.spritesheet("explosion", "assets/cartoon_smoke_up_strip.png", 256, 256);

        this.load.image("fearHUD", "assets/fearHUD2.png");
        this.load.image("fearBar", "assets/fearHUDFill2.png");
        this.load.image("divider", "assets/divider.png");
        this.load.image("na", "assets/na.png");

        this.load.spritesheet('rain', 'assets/rain2.png');

        this.load.image("modal", "assets/modal.png");
        this.load.image("modalHeader", "assets/modal_header.png");
        this.load.image("modalNext", "assets/modal_next.png");
        this.load.image("level1", "assets/level1.png");
        this.load.image("level2", "assets/level2.png");
        this.load.image("level3", "assets/level3.png");
        this.load.image("level4", "assets/level4.png");
        this.load.image("level5", "assets/level5.png");

        // bgs
        this.load.image("bg1", "assets/bg1.jpg");
        this.load.image("bg2", "assets/bg2.jpg");
        this.load.image("bg3", "assets/bg3.jpg");
        this.load.image("bg4", "assets/bg4.jpg");
        this.load.image("bg5", "assets/bg5.jpg");

        this.load.image("level2Locked", "assets/level2_locked.png");
        this.load.image("level3Locked", "assets/level3_locked.png");
        this.load.image("level4Locked", "assets/level4_locked.png");
        this.load.image("level5Locked", "assets/level5_locked.png");

        this.load.audio('track', ['assets/audio/track.ogg']);
        this.load.audio('music', 'assets/audio/music.ogg');
        
        this.load.audio('kill1', 'assets/audio/kill1.ogg');
        this.load.audio('kill2', 'assets/audio/kill2.ogg');
        this.load.audio('kill3', 'assets/audio/kill3.ogg');
        this.load.audio('kill4', 'assets/audio/kill4.ogg');
        
        this.load.audio('voice1', 'assets/audio/voice1.ogg');
        this.load.audio('voice2', 'assets/audio/voice2.ogg');
        this.load.audio('voice3', 'assets/audio/voice3.ogg');
        this.load.audio('voice4', 'assets/audio/voice4.ogg');
        this.load.audio('voice5', 'assets/audio/voice5.ogg');
        
        this.load.audio('laugh', 'assets/audio/laugh.ogg');
    },
    create: function () {
        getLocalSave();
        game.state.start('MainMenu');
    }
};

function getLocalSave() {
    var result = localStorage.getItem("nightcast-levels");

    if(result === null || result === undefined) {
        return false;
    }
    else {
        reg.levelEditor = JSON.parse(result);
    }
}