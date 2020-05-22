reg = {
    score: (localStorage.getItem('bestScore') === undefined) ? localStorage.getItem('bestScore') : 0,
    mainScore: "",
    sound: true,
    availableGhosts: [],
    animationSpeed: 5000,
    creationSpeed: 1600,
    pointsRate: 50,
    modal : {

    },
    achievements: {

    },
    easings: [
    Phaser.Easing.Cubic.InOut,
    Phaser.Easing.Sinusoidal.In,
    Phaser.Easing.Quadratic.InOut,
    Phaser.Easing.Quartic.Out,
    Phaser.Easing.Linear,
    Phaser.Easing.Cubic.In,
    Phaser.Easing.Quintic.Out,
    Phaser.Easing.Quintic.InOut
    ],
    mainEasing: Phaser.Easing.Cubic.InOut,
    currentLevel:"1",
    backgrounds: {
        "level1": "bg1",
        "level2": "bg2",
        "level3": "bg3",
        "level4": "bg4",
        "level5": "bg5",
    },
    levelEditor: {
        "level1":{
            levelName: "Level - 1",
            status: "open",
            bestScore: "0",
            enemies: "12",
            minInterval: 1000,
            maxInterval: 3600,
            fearPerFrame: 0.06,
            flashRadius: 160
        },
        "level2":{
            levelName: "Level - 2",
            status: "closed",
            bestScore: "0",
            enemies: "24",
            minInterval: 1100,
            maxInterval: 3400,
            fearPerFrame: 0.065,
            flashRadius: 140
        },
        "level3":{
            levelName: "Level - 3",
            status: "closed",
            bestScore: "0",
            enemies: "36",
            minInterval: 1000,
            maxInterval: 3200,
            fearPerFrame: 0.065,
            flashRadius: 130
        },
        "level4":{
            levelName: "Level - 4",
            status: "closed",
            bestScore: "0",
            enemies: "48",
            minInterval: 1400,
            maxInterval: 3100,
            fearPerFrame: 0.075,
            flashRadius: 120
        },
        "level5":{
            levelName: "Level - 5",
            status: "closed",
            bestScore: "0",
            enemies: "60",
            minInterval: 900,
            maxInterval: 2800,
            fearPerFrame: 0.09,
            flashRadius: 100
        }
    }
};