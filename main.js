var g_config =
{
    fps: 30,
    track_centers:[],
    treasure_score: 100,
    width: 1000,
    height: 700,
    life: 3,
    time: 60
}

var g_game_stats =
{
    score : 0,
    remaining_time: g_config.time
}

g_bg_music = null;

var g_canvas = null;

var g_treasure =
{
    x: 0,
    y: 0,
    img: null,
    width: 100,
    height: 100,
    drop_speed: 160,
    current_track:0,
    sound: null,

    init: function()
    {
        this.img = new Image();
        this.img.src = "logo.png";

        this.sound = new Audio("Pacman_Eating_Cherry_Sound_Effect.mp3");

        this.restart();
    },

    draw: function() {
        g_canvas.fillStyle = this.color;
        g_canvas.drawImage(this.img, this.x, this.y,100,100);
    },

    update: function( elapsed_time )
    {
        this.y += elapsed_time * this.drop_speed;

        if ( (this.y+this.height) >= g_player.y && this.current_track==g_player.current_track)
        {
            g_game_stats.score += g_config.treasure_score;

            this.sound.play();

            this.restart();
            return;
        }

        if ( (this.y+this.height) >= g_background.max_screen_y )
        {
            g_player.life--;
            if ( g_player.life == -1 )
                g_player.life = g_config.life;

            g_player.miss_catch_sound.play();

            this.restart();
        }
    },

    restart: function()
    {
        this.current_track = Math.floor( Math.random()*12 ) % 3;
        this.x = g_config.track_centers[ this.current_track ] - this.width/2;
        this.y = g_background.min_screen_y;
    }
}

var g_player = {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    current_track: 0,
    img: null,
    life: g_config.life,
    life_img: null,
    miss_catch_sound: null,

    init: function()
    {
        this.img = new Image();
        this.img.src = "nick-5.png";

        this.life_img = new Image();
        this.life_img.src = "nick-6.png";

        this.miss_catch_sound = new Audio("Pacman_Dies_Sound_Effect.mp3");

        this.current_track = 0;
        this.x = g_config.track_centers[ this.current_track ] - this.width/2;
        this.y = g_background.max_screen_y - this.height;
    },

    draw: function()
    {
        g_canvas.drawImage(this.img, this.x, this.y, this.width, this.height);
    },

    move_left: function()
    {
        this.current_track = 0;
        this.x = g_config.track_centers[ this.current_track ] - this.width/2;
    },

    move_right: function()
    {
        this.current_track = 2;
        this.x = g_config.track_centers[ this.current_track ] - this.width/2;
    },

    move_mid: function()
    {
        this.current_track = 1;
        this.x = g_config.track_centers[ this.current_track ] - this.width/2;
    }
};

var g_background =
{
    img : null,
    min_screen_x : 40,
    min_screen_y : 107,
    max_screen_x : 255,
    max_screen_y : 344,
    init : function()
    {
        this.img = new Image();
        this.img.src = "arcade.png"

        var x_scale = g_config.width / this.img.width;
        var y_scale = g_config.height / this.img.height;

        this.min_screen_x *= x_scale;
        this.max_screen_x *= x_scale;
        this.min_screen_y *= y_scale;
        this.max_screen_y *= y_scale;
    },

    draw: function()
    {
        g_canvas.drawImage(this.img, 0,0, g_canvas.width, g_canvas.height);
    }
}


function create_canvas()
{
    var width = g_config.width;
    var height = g_config.height;

    var canvasElement = $("<canvas id='main_canvas' width='" + width +
        "' height='" + height + "'></canvas>");
    g_canvas = canvasElement.get(0).getContext("2d");

    g_canvas.width = width;
    g_canvas.height = height;
    canvasElement.appendTo('body');
}

function update()
{
    var elapsed_time = 1.0 / g_config.fps;

    g_treasure.update(elapsed_time);

    g_game_stats.remaining_time -= elapsed_time;
    if ( g_game_stats.remaining_time < 0 )
        g_game_stats.remaining_time = g_config.time;
}

function draw_info()
{
    g_canvas.font = "bold 20px arcade_font";

    g_canvas.fillStyle = "#FF0000";
    g_canvas.fillText("SCORE", g_background.min_screen_x + 30, g_background.min_screen_y + 30, 50);

    g_canvas.fillStyle = "#000000";
    g_canvas.fillText(g_game_stats.score, g_background.min_screen_x + 30, g_background.min_screen_y + 60, 50);



    g_canvas.fillStyle = "#FF0000";
    g_canvas.fillText("TIME", g_background.min_screen_x + 130, g_background.min_screen_y + 30, 50);

    g_canvas.fillStyle = "#000000";
    g_canvas.fillText( Math.floor( g_game_stats.remaining_time ), g_background.min_screen_x + 140, g_background.min_screen_y + 60, 50);



    var life_gap = 90;
    for ( var i = 0; i < g_player.life; i++ )
    {
        g_canvas.drawImage(g_player.life_img, g_background.max_screen_x - 90 - 10 - life_gap * i, g_background.min_screen_y + 10, 90, 50);
    }

}


function draw()
{
    g_canvas.clearRect(0,0,g_canvas.width,g_canvas.height);

    g_background.draw();

    g_treasure.draw();
    g_player.draw();

    draw_info();
}

function game_loop()
{
    update();
    draw();
}

function compute_track_centers()
{
    var max_width = Math.max( g_treasure.width, g_player.width );

    g_config.track_centers.push( g_background.min_screen_x + max_width/2 );

    g_config.track_centers.push( g_background.min_screen_x + (g_background.max_screen_x-g_background.min_screen_x)/2 );

    g_config.track_centers.push( g_background.min_screen_x + (g_background.max_screen_x-g_background.min_screen_x) - max_width/2 );
}

function init()
{
    create_canvas();

    g_background.init();

    compute_track_centers();

    g_treasure.init();
    g_player.init();

    g_bg_music = new Audio("Pacman_Opening_Song_Sound_Effect.mp3");
    g_bg_music.play();

    $(document).bind("keydown.left", function()
    {
        g_player.move_left();
    });

    $(document).bind("keydown.right", function()
    {
        g_player.move_right();
    });

    $(document).bind("keydown.down", function()
    {
        g_player.move_mid();
    });
}

function onload()
{
    init();

    setInterval("game_loop()",33);
}
