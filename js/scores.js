GAME.Scores = function (game) {};

GAME.Scores.prototype = {
    create: function () {
        this.add.image(0, 0, 'levelsBG');

        checkTotalScore();
        checkTotalAchievements();

        var gameScoreLabel = this.game.add.text(
            0 , 80, 'Best Scores per Level: ', {
                font: '46px FingerPaint-Regular',
                fill: '#ffffff',
                fontWeight: 'bold',
                align:'center'
            });

        gameScoreLabel.update();
        gameScoreLabel.x = (game.width / 2) - (gameScoreLabel.width / 2);

        this.menuButton = this.add.button((game.width/2) - 53, game.height - 150, 'menuBack', this.startMenu, this);

        ///////////////////////////

        var counter = 0;
        var that = this;
        $.each(reg.levelEditor, function(key, value) {

            var gameScore = that.game.add.text(130, 280, value.levelName, {
                font: '42px FingerPaint-Regular',
                fill: '#ffffff',
                fontWeight: 'normal',
                align:'center'
            });

            gameScore.anchor.setTo(0.5, 0.5);

            gameScore.update();
            gameScore.x = 130;
            gameScore.y = (110 * counter) + 220;

            that.add.image( 0, (110 * counter)+230, 'divider');

            if(Number(value.bestScore) <= 0) {
                that.add.image(game.width-150, (110*counter)+210, "na");
            }
            else {
                var gameScore2 = that.game.add.text(game.width - 150, (110 * counter) + 210, value.bestScore, {
                font: '42px FingerPaint-Regular',
                fill: '#ffffff',
                fontWeight: 'normal',
                align:'center'
            });

            gameScore2.anchor.setTo(0.5, 0.5);

            gameScore2.update();
            gameScore2.x = game.width - 120;
            gameScore2.y = (110 * counter) + 210;
            }

            counter += 1;

        });


        },
        hide: function () {

        },
        startMenu: function () {
            game.state.start('MainMenu');
        }
    };

    function checkStatus(value) {
        if(value.status === "closed") {
            return '#a0a0a0';
        }
        else {
            return '#D70000';
        }
    }

    function checkTotalScore() {

    }

    function checkTotalAchievements() {


    }