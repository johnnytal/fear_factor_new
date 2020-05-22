GAME.Levels = function (game) {

};

GAME.Levels.prototype = {
    create: function () {

        //getLocalSave();
        this.add.image(0, 0, 'levelsBG');
        this.menuButton = this.add.button((game.width / 2) - 53, game.height - 120, 'menuBack', this.startMenu, this);

        var counter = 0;
        var that = this;

        $.each(reg.levelEditor, function (key, value) {
            var item;

            if (counter === 0) {
                item = that.add.image((counter * 110) + 75, 150, key);
                item.id = key;
                item = that.add.image((counter * 110) + (counter * 75) + 75, 150, key);
                    item.id = key;
                    item.inputEnabled = true;
                    item.events.onInputDown.add(function (e) {
                        reg.currentLevel = Number(String(e.id).replace("level",""));
                        //window.console.log(e, "Move to level: "+e.id);
                        music.play();
                        game.state.start('Game');
                    }, this);
            } else if (counter < 3) {
                if (value.status === "open") {
                    item = that.add.image((counter * 110) + (counter * 75) + 75, 150, key);
                    item.id = key;
                    item.inputEnabled = true;
                    item.events.onInputDown.add(function (e) {
                        reg.currentLevel = Number(String(e.id).replace("level",""));
                        //window.console.log(e, "Move to level: "+e.id);
                        music.play();
                        game.state.start('Game');
                    }, this);
                } else {
                    item = that.add.image((counter * 110) + (counter * 75) + 75, 150, key + "Locked");
                    item.id = key;
                }
            } else {
                if (value.status === "open") {
                    item = that.add.image(((counter - 2) * 110) + ((counter - 2) * 55) + 10, 300, key);
                    item.id = key;
                    item.inputEnabled = true;
                    item.events.onInputDown.add(function (e) {
                        reg.currentLevel = Number(String(e.id).replace("level",""));
                        //window.console.log(e, "Move to level: "+e.id);
                        game.state.start('Game');
                        music.play();
                    }, this);
                } else {
                    item = that.add.image(((counter - 2) * 110) + ((counter - 2) * 55) + 10, 300, key + "Locked");
                    item.id = key;
                }
            }
            counter += 1;
        });

    },
    startMenu: function () {
        game.state.start('MainMenu');
    }
};

