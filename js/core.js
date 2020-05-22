GAME.Main = function (game) {};

var blast = false;
var gameStop = false;
var enemiesDestroyed = 0;
var enemiesBonus = 0;

// Setup the example
GAME.Main.prototype = {
    create: function () {
        // Set stage background color
        game.stage.backgroundColor = 0x121212;
        game.add.image(0, 0, reg.backgrounds["level" + String(reg.currentLevel)]);

        // The radius of the circle of light
        this.LIGHT_RADIUS = 150 - (reg.currentLevel * 10);

        //reg.LIGHT_RADIUS = this.LIGHT_RADIUS;

        makeItRain();
        initAd();

        // Create the shadow texture
        this.shadowTexture = this.game.add.bitmapData(this.game.width, this.game.height);

        // Create an object that will use the bitmap as a texture
        var lightSprite = this.game.add.image(0, 0, this.shadowTexture);

        // Set the blend mode to MULTIPLY. This will darken the colors of
        // everything below this sprite.
        lightSprite.blendMode = Phaser.blendModes.MULTIPLY;

        // Simulate a pointer click/tap input at the center of the stage
        // when the example begins running.

        game.input.activePointer.x = this.game.width / 2;
        game.input.activePointer.y = this.game.height / 2;

        // Show FPS
        game.time.advancedTiming = true;

        // Create a white rectangle that we'll use to represent the flash
        this.flash = this.game.add.graphics(0, 0);
        this.flash.beginFill(0xffffff, 1);
        this.flash.drawRect(0, 0, this.game.width, this.game.height);
        this.flash.endFill();
        this.flash.alpha = 0;

        reg.flash = this.flash;

        this.game.world.setBounds(-10, -10, this.game.width + 20, this.game.height + 20);

        /////////////////////
        reg.availableGhosts = ["monster1", "monster2", "monster3", "monster4", "monster5", "monster6", "monster7", "monster8", "monster9"];
        reg.enemiesSpawned = 0;
        reg.mainScore = 0;
        gameStop = false;
        enemiesDestroyed = 0;

        // create fear factor HUD
        createHUD();
        reg.explosionGroup = game.add.group();

        // create modals
        // createModal("game-over");
        //createModal("level");

        setTimeout(toggleBlast, 4000);

        initTimer();
        initScoreTimer();

        reg.shadowTexture = lightSprite;
        game.world.bringToTop(reg.shadowTexture);
        game.world.bringToTop(reg.hudGroup);
  
        numberLabel = this.game.add.text(25, 5, Number(reg.enemiesSpawned) + '/' + Number(reg.levelEditor["level" + reg.currentLevel].enemies), {
            font: '34px FingerPaint-Regular',
            fill: '#d3d3d3',
            fontWeight: 'normal',
            align: 'center'
        });
        
        scoreLabel = this.game.add.text(245, 10, "Score: " + reg.mainScore, {
            font: '36px FingerPaint-Regular',
            fill: '#f7f7f7',
            fontWeight: 'normal',
            align: 'center'
        });

        game.world.bringToTop(numberLabel);
        game.world.bringToTop(scoreLabel);
 
    },
    update: function () {
        // Update the shadow texture each frame
        this.updateShadowTexture(blast);
    },
    updateShadowTexture: function (blast) {

        if (gameStop === true) {
            return false;
        }

        // This function updates the shadow texture (this.shadowTexture).
        // First, it fills the entire texture with a dark shadow color.
        // Then it draws a white circle centered on the pointer position.
        // Because the texture is drawn to the screen using the MULTIPLY
        // blend mode, the dark areas of the texture make all of the colors
        // underneath it darker, while the white area is unaffected.

        // Draw shadow

        if (blast === true) {
            this.shadowTexture.context.fillStyle = 'rgb(120, 120, 120)';
        } else {
            this.shadowTexture.context.fillStyle = 'rgb(0, 0, 0)';
        }
        this.shadowTexture.context.fillRect(0, 0, this.game.width, this.game.height);

        var posY = game.input.activePointer.y;
        var poX = game.input.activePointer.x;

        // Draw circle of light with a soft edge
        var gradient = this.shadowTexture.context.createRadialGradient(
            poX, posY, this.LIGHT_RADIUS * 0.75, poX, posY, this.LIGHT_RADIUS
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');

        this.shadowTexture.context.beginPath();
        this.shadowTexture.context.fillStyle = gradient;
        this.shadowTexture.context.arc(poX, posY, this.LIGHT_RADIUS, 0, Math.PI * 2);
        this.shadowTexture.context.fill();

        // This just tells the engine it should update the texture cache
        this.shadowTexture.dirty = true;
        game.world.bringToTop(reg.shadowTexture);
        game.world.bringToTop(reg.hudGroup);
        game.world.bringToTop(numberLabel);
        game.world.bringToTop(scoreLabel);
    },
    render: function () {}
};

/**
 * [initTimer description]
 * @return {[type]} [description]
 */
function initTimer() {
    reg.timer = {};
    var _time = game.rnd.integerInRange(reg.levelEditor["level" + reg.currentLevel].minInterval, reg.levelEditor["level" + reg.currentLevel].maxInterval);

    reg.timer = game.time.events.loop(_time, function () {
        createGhost();
        //updateScore();
    }, this, []);

    return reg.timer;
}

function initScoreTimer() {
    reg.scoreTimer = {};
    /*reg.scoreTimer = game.time.events.loop(300, function () {
        reg.mainScore += 1;
    }, this, []);
    */

    return reg.scoreTimer;
}

/**
 * [removeTimer description]
 * @return {[type]} [description]
 */
function removeTimer() {
    gameStop = true;
    game.time.events.remove(reg.timer);
    game.time.events.remove(reg.scoreTimer);
    game.time.events.remove(reg.timerBlast);
    saveScore();
}

/**
 * [makeItRain description]
 * @return {[type]} [description]
 */
function makeItRain() {
    var emitter = game.add.emitter(game.world.centerX, -300, 1600);

    emitter.width = game.world.width + (game.world.width);
    emitter.angle = 15; // uncomment to set an angle for the rain.

    emitter.makeParticles('rain');

    emitter.minParticleScale = 0.2;
    emitter.maxParticleScale = 0.6;

    emitter.setYSpeed(490, 700);
    emitter.setXSpeed(-6, 6);
    emitter.setAlpha(0.4, 1, 0);

    emitter.start(false, 2000, 0, 0);
}

/**
 * [createGhost description]
 * @return {[type]} [description]
 */
function createGhost() {

    //window.console.log(Number(reg.levelEditor["level" + reg.currentLevel].enemies), Number(enemiesDestroyed));
    if (Number(reg.levelEditor["level" + reg.currentLevel].enemies) <= Number(enemiesDestroyed)) {
        
        game.tweens.pauseAll();
        game.tweens.removeAll();
        removeTimer();

        var nextOpen = openNextLevel();

        if (nextOpen === true) {
            createModal("level");
            showModal("level");
        } else if (nextOpen === false) {
            createModal("no-level");
            showModal("no-level");
        }
        return false;
    }

    if (Number(reg.levelEditor["level" + reg.currentLevel].enemies) <= Number(reg.enemiesSpawned)) {
        return false;
    }

    var index = game.rnd.integerInRange(0, reg.availableGhosts.length - 1);

    var selectedGhost = reg.availableGhosts[index];

    var item = game.add.sprite((game.width / 2), (game.height / 2) + 40, selectedGhost);
    var scale = game.rnd.realInRange(0.2, 0.6);
        
    var chance = game.rnd.integerInRange(0, 2);
    if (chance == 1){
        voices[game.rnd.integerInRange(0, voices.length-1)].play();
    }
    item.scale.x = scale;
    item.scale.y = scale;
    item.id = selectedGhost;
    item.alpha = 0;
    item.x = game.rnd.integerInRange(40, game.width - 80);
    item.y = game.rnd.integerInRange(110, game.height - 120);
    item.id = game.rnd.uuid();
    item.anchor.setTo(0.5, 0.5);
    item.inputEnabled = true;
    item.events.onInputDown.add(attackGhost, this);

    var smallTween = game.add.tween(item).to({
        y: item.y + game.rnd.integerInRange(10, 30)
    }, game.rnd.integerInRange(1180, 1500), Phaser.Easing.Circular.none, true, 0, 1200, -1, true);

    var tween2 = game.add.tween(item).to({
        alpha: 0.7
    }, 1000, Phaser.Easing.Quintic.Out, true, 0, 0, false);

    //tween._target = item;
    var tween = game.add.tween(item.scale).to({
        y: 0.88,
        x: 0.88
    }, 19000, Phaser.Easing.Cubic.Out, true, 0, 0, false);
    item.tweenObj = tween;
    item.smallTween = smallTween;
    tween.pause();

    tween2.onComplete.add(function (e) {
        var tween3 = game.add.tween(item).to({
            alpha: 1
        }, 5600, Phaser.Easing.Sinusoidal.Out, true, 0, 0, false);

        tween.resume();

        tween.data = item.id;

        tween.onComplete.add(function (e) {
            setTimeout(function (args) {

                if (reg.fearBar.width >= (reg.hud.width - 34)) {
                    window.console.log("Game Over!");
                } else {
                    reg.fearBar.width += 1;
                }

                args[0].kill();
                enemiesDestroyed += 1;
                tween.stop();
            }, Math.round(reg.animationSpeed / 4) - 10, [item]);
        });

        tween.onUpdateCallback(function (e) {
            game.world.bringToTop(reg.shadowTexture);
            game.world.bringToTop(reg.hudGroup);
            game.world.bringToTop(numberLabel);
            game.world.bringToTop(scoreLabel);
            checkPosition(item.x, e.data, item, e);
        }, item);

    }, item);

    reg.enemiesSpawned += 1;
}

/**
 * [checkPosition description]
 * @param  {[type]} x     [description]
 * @param  {[type]} data  [description]
 * @param  {[type]} item  [description]
 * @param  {[type]} event [description]
 * @return {[type]}       [description]
 */
function checkPosition(x, data, item, event) {

    if (reg.fearBar.width >= (reg.hud.width - 34)) {

        game.tweens.pauseAll();
        game.tweens.removeAll();
        removeTimer();

        //window.console.log("Game Over!");

        createModal("game-over");
        showModal("game-over");
        music.stop();
        
        laughSfx.play();

        return false;
    }

    reg.fearBar.width += reg.levelEditor["level" + reg.currentLevel].fearPerFrame;

}

/**
 * [toggleBlast description]
 * @return {[type]} [description]
 */
function toggleBlast() {
    if (blast === false) {
        blast = true;
        shockAndAwe();
        setTimeout(toggleBlast, 120);
    } else {
        setTimeout(function () {
            blast = false;
            reg.timerBlast = {};
            var _time = game.rnd.integerInRange(5500, 18000);

            reg.timerBlast = game.time.events.add(game.rnd.integerInRange(5000, 14000), toggleBlast, this);

            //setTimeout(toggleBlast, game.rnd.integerInRange(6000, 19000));
        }, 60);
    }
}

function shockAndAwe() {
    // Create the flash
    reg.flash.alpha = 1;
    game.add.tween(reg.flash)
        .to({
            alpha: 0
        }, 180, Phaser.Easing.Cubic.In)
        .start();

    // Shake the camera by moving it up and down 5 times really fast
    game.camera.y = 0;
    game.add.tween(game.camera)
        .to({
            y: -10
        }, 80, Phaser.Easing.Sinusoidal.InOut, false, 0, 5, true)
        .start();
}

function createHUD() {

    var hudGroup = game.add.group();
    var posX = (game.width / 2) - (322 / 2);
    var posY = game.height - 117;

    reg.fearBar = game.add.image(posX + 32, posY + 30, "fearBar");
    reg.hud = game.add.image(posX, posY, 'fearHUD');

    reg.fearBar.width = 0;

    hudGroup.add(reg.fearBar);
    hudGroup.add(reg.hud);

    reg.hudGroup = hudGroup;
}

/**
 * [createModal description]
 * @param  {[type]} type [description]
 * @return {[type]}      [description]
 */
function createModal(type) {

    var modalGroup = game.add.group();

    var modal = game.add.graphics(game.width, game.height);
    modal.beginFill("0x000000", 0.7);
    modal.x = 0;
    modal.y = 0;
    modal.drawRect(0, 0, game.width, game.height);

    var modalPanel = game.add.image((game.width / 2 - (550 / 2)), (game.height / 2 - (400 / 2)), "modal");

    if (type === "game-over") {
        var gameLabel = this.game.add.text(0, 0, "GAME OVER", {
            font: '46px FingerPaint-Regular',
            fill: '#ffffff',
            fontWeight: 'normal',
            align: 'center'
        });

        gameLabel.update();
        gameLabel.x = (game.width / 2) - (gameLabel.width / 2);
        gameLabel.y = modalPanel.y + 40;

        var gameLabel1 = this.game.add.text(0, 0, "Repeat Level?", {
            font: '40px FingerPaint-Regular',
            fill: '#ffffff',
            fontWeight: 'normal',
            align: 'center'
        });

        gameLabel1.update();
        gameLabel1.x = (game.width / 2) - (gameLabel.width / 2);
        gameLabel1.y = gameLabel.y + gameLabel.height + 20;

        // -----------

        var gameLabel2 = this.game.add.text(0, 0, "Return to Menu", {
            font: '40px FingerPaint-Regular',
            fill: '#ffffff',
            fontWeight: 'normal',
            align: 'center'
        });

        gameLabel2.update();
        gameLabel2.x = (game.width / 2) - (gameLabel2.width / 2);
        gameLabel2.y = gameLabel1.y + gameLabel1.height + 20;

        gameLabel2.inputEnabled = true;
        gameLabel2.events.onInputDown.add(function () {
            //this.game.state.start('MainMenu');
            game.state.start('MainMenu');
        }, this);

        gameLabel1.inputEnabled = true;
        gameLabel1.events.onInputDown.add(function () {
            //this.game.state.start('Game');
            game.state.start('Game');
        }, this);

        modalGroup.add(modal);
        modalGroup.add(modalPanel);
        modalGroup.add(gameLabel);
        modalGroup.add(gameLabel1);
        modalGroup.add(gameLabel2);

    } else if (type === "level") {

        var modalHeader = game.add.image((game.width / 2) - (305 / 2), modalPanel.y + 40, "modalHeader");

        // -----------

        var gameLabel2 = this.game.add.text(0, 0, "Return to Menu", {
            font: '40px FingerPaint-Regular',
            fill: '#ffffff',
            fontWeight: 'normal',
            align: 'center'
        });

        gameLabel2.update();
        gameLabel2.x = (game.width / 2) - (gameLabel2.width / 2);
        gameLabel2.y = modalHeader.y + modalHeader.height + 20;

        // ------------

        var scoreLabel = this.game.add.text(0, 0, "Score: " + reg.score, {
            font: '40px FingerPaint-Regular',
            fill: '#ffffff',
            fontWeight: 'normal',
            align: 'center'
        });

        scoreLabel.update();
        scoreLabel.x = (game.width / 2) - (scoreLabel.width / 2);
        scoreLabel.y = gameLabel2.y + gameLabel2.height + 20;
        
       var fearBonusLabel = this.game.add.text(0, 0, "(Fear bonus: " + (reg.score - enemiesBonus) + ")", {
            font: '36px FingerPaint-Regular',
            fill: '#f7f7f7',
            fontWeight: 'normal',
            align: 'center'
        });
        
        //fearBonusLabel.update();
        fearBonusLabel.x = (game.width / 2) - (fearBonusLabel.width / 2);
        fearBonusLabel.y = scoreLabel.y + scoreLabel.height + 20;

        // ------------

        var modalNext = game.add.image((game.width / 2) - (244 / 2), scoreLabel.y + 
        scoreLabel.height + fearBonusLabel.height
         + 40, "modalNext");

        gameLabel2.inputEnabled = true;
        gameLabel2.events.onInputDown.add(function () {
            //this.game.state.start('MainMenu');
            game.state.start('MainMenu');
        }, this);

        modalNext.inputEnabled = true;
        modalNext.events.onInputDown.add(function () {

            reg.currentLevel += 1;
            game.state.start('Levels');
            try{
                if(AdMob) AdMob.showInterstitial();
            } catch(e){}
            
            enemiesBonus = 0;

        }, this);

        /*gameLabel.inputEnabled = true;
        gameLabel.events.onInputDown.add(function () {
            //this.game.state.start('Game');
            transitionPlugin.to('Game');
        }, this);*/

        modalGroup.add(modal);
        modalGroup.add(modalPanel);
        modalGroup.add(modalHeader);
        //modalGroup.add(gameLabel);
        modalGroup.add(gameLabel2);
        modalGroup.add(scoreLabel);
        modalGroup.add(modalNext);
        modalGroup.add(fearBonusLabel);
    } else if (type === "no-level") {
        var modalHeader = game.add.image((game.width / 2) - (305 / 2), modalPanel.y + 40, "modalHeader");

        // -----------

        var gameLabel2 = this.game.add.text(0, 0, "Return to Menu", {
            font: '40px FingerPaint-Regular',
            fill: '#ffffff',
            fontWeight: 'normal',
            align: 'center'
        });

        gameLabel2.update();
        gameLabel2.x = (game.width / 2) - (gameLabel2.width / 2);
        gameLabel2.y = modalHeader.y + modalHeader.height + 20;

        // ------------

        var scoreLabel = this.game.add.text(0, 0, "Score: " + reg.score, {
            font: '40px FingerPaint-Regular',
            fill: '#ffffff',
            fontWeight: 'normal',
            align: 'center'
        });

        scoreLabel.update();
        scoreLabel.x = (game.width / 2) - (scoreLabel.width / 2);
        scoreLabel.y = gameLabel2.y + gameLabel2.height + 20;

        // ------------

        gameLabel2.inputEnabled = true;
        gameLabel2.events.onInputDown.add(function () {
            //this.game.state.start('MainMenu');
            game.state.start('MainMenu');
        }, this);


        modalGroup.add(modal);
        modalGroup.add(modalPanel);
        modalGroup.add(modalHeader);
        modalGroup.add(gameLabel2);
        modalGroup.add(scoreLabel);
    }

    modalGroup.visible = false;

    reg.modal[type] = modalGroup;
}

function getExplosion(x, y, scale) {
    // Try to get a used explosion from the explosionGroup.
    // If an explosion isn't available, create a new one and add it to the group.
    // Setup new explosions so that they animate and kill themselves when the
    // animation is complete.
    // Get the first dead explosion from the explosionGroup
    var explosion = reg.explosionGroup.getFirstDead();

    // If there aren't any available, create a new one
    if (explosion === null) {
        explosion = game.add.sprite(0, 0, 'explosion');
        explosion.anchor.setTo(0.5, 0.5);

        // Add an animation for the explosion that kills the sprite when the
        // animation is complete
        var animation = explosion.animations.add('boom', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34], 40, false);

        animation.killOnComplete = true;

        // Add the explosion sprite to the group
        reg.explosionGroup.add(explosion);
    }

    // Revive the explosion (set it's alive property to true)
    // You can also define a onRevived event handler in your explosion objects
    // to do stuff when they are revived.
    explosion.revive();

    // Move the explosion to the given coordinates
    explosion.x = x;
    explosion.y = y;
    explosion.scale.x = scale;
    explosion.scale.y = scale;

    // Set rotation of the explosion at random for a little variety
    explosion.angle = game.rnd.integerInRange(0, 360);

    // Play the animation
    explosion.animations.play('boom');

    // Return the explosion itself in case we want to do anything else with it
    return explosion;
}

/**
 * [showModal description]
 * @param  {[type]} type [description]
 * @return {[type]}      [description]
 */
function showModal(type) {
    game.world.bringToTop(reg.modal[type]);
    reg.modal[type].visible = true;
}

/**
 * [hideModal description]
 * @param  {[type]} type [description]
 * @return {[type]}      [description]
 */
function hideModal(type) {

}

/**
 * [saveScore description]
 * @return {[type]} [description]
 */
function saveScore() {

    // enemies x10 and the remaining fear as bonus
    var remainingFear = (reg.hud.width-34) - Math.round(reg.fearBar.width);
    reg.score = enemiesBonus + remainingFear;

    if (Number(reg.levelEditor["level" + reg.currentLevel].bestScore) < reg.score) {
        reg.levelEditor["level" + reg.currentLevel].bestScore = reg.score;
    }

    localStorage.setItem("nightcast-levels", JSON.stringify(reg.levelEditor));
}

/**
 * [openNextLevel description]
 * @return {[type]} [description]
 */
function openNextLevel() {
    if (String(Number(reg.currentLevel + 1)) === "6") {
        return false;
    }

    reg.levelEditor["level" + String(Number(reg.currentLevel + 1))].status = "open";

    localStorage.setItem("nightcast-levels", JSON.stringify(reg.levelEditor));

    return true;
}

/// EVENT LISTENERS

function attackGhost(e) {
    var item = String(e.id);
    var thisEnemyBonus = Math.round(20 / e.scale.x);
    enemiesBonus += thisEnemyBonus;
    scoreLabel.text = 'Score: ' + enemiesBonus;

    var tweenedText = this.game.add.text(e.x, e.y, thisEnemyBonus, {
        font: '24px FingerPaint-Regular',
        fill: '#ffffff',
        fontWeight: 'normal',
        align: 'center'
    });
    
    var tweenTextY = game.add.tween(tweenedText).to({y: 0}, 3000, Phaser.Easing.Circular.none, true, 0, 1200, -1, true);
    var tweenTextAlpha = game.add.tween(tweenedText).to({alpha: 0}, 3000, Phaser.Easing.Quintic.Out, true, 0, 0, false);

    e.tweenObj.stop();
    e.smallTween.stop();
    
    killsSfx[game.rnd.integerInRange(0, killsSfx.length-1)].play();

    var scale = e.scale.x + 0.2;
    getExplosion( (Math.round(e.x) + (Math.round(e.width/2)-(128 * scale)) ), Math.round(e.y) + (Math.round(e.height/2)- (128 * scale)), scale );
    e.kill();
    enemiesDestroyed += 1;
    numberLabel.text = enemiesDestroyed + '/' + Number(reg.levelEditor["level" + reg.currentLevel].enemies);
    
}

function resetAchievements() {
    reg.levelEditor = JSON.parse('{"level1":{"levelName":"Level - 1","status":"open","bestScore":"0","enemies":"25","minInterval":1000,"maxInterval":3600,"fearPerFrame":0.06},"level2":{"levelName":"Level - 2","status":"closed","bestScore":"0","enemies":"38","minInterval":1100,"maxInterval":3200,"fearPerFrame":0.08},"level3":{"levelName":"Level - 3","status":"closed","bestScore":"0","enemies":"45","minInterval":1000,"maxInterval":3000,"fearPerFrame":0.09},"level4":{"levelName":"Level - 4","status":"closed","bestScore":"0","enemies":"55","minInterval":1200,"maxInterval":3000,"fearPerFrame":0.1},"level5":{"levelName":"Level - 5","status":"closed","bestScore":"0","enemies":"80","minInterval":800,"maxInterval":3000,"fearPerFrame":0.15}}');
}

function initAd(){
    var admobid = {};

    admobid = {
        interstitial: 'ca-app-pub-9795366520625065/2045371435'
    };
    
    try{
        if(AdMob) AdMob.prepareInterstitial( {adId:admobid.interstitial, autoShow:false, isTesting:false} );
    } catch(e){}
}

// Setup game
var game = new Phaser.Game(640, 960, Phaser.CANVAS, 'game');
game.state.add('Boot', GAME.Boot);
game.state.add('Preloader', GAME.Preloader);
game.state.add('Scores', GAME.Scores);
game.state.add('Info', GAME.Info);
game.state.add('MainMenu', GAME.Menu);
game.state.add("Levels", GAME.Levels);
game.state.add('Game', GAME.Main);

game.state.start('Boot');