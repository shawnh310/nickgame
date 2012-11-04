

var g_config =
{
    fps: 30,
    track_centers:[],
    treasure_score: 100
}

var g_scores = 0;

var g_canvas = null;

var g_treasure =
{
    x: 0,
    y: 0,
    img: null,
    width: 100,
    height: 100,
    drop_speed: 360,
    current_track:0,

    init: function()
    {
        this.img = new Image();
        this.img.src = "logo.png";

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
            g_scores += g_config.treasure_score;
            this.restart();
            return;
        }

        if ( this.y >= g_canvas.height )
        {
            this.restart();
        }
    },

    restart: function()
    {
        this.current_track = Math.floor( Math.random()*12 ) % 3;
        this.x = g_config.track_centers[ this.current_track ] - this.width/2;
        this.y = 0;
    }
}

var g_player = {
    x: 0,
    y: 0,
    width: 50,
    height: 50,
    current_track: 0,
    img: null,
    init: function()
    {
        this.img = new Image();
        this.img.src = "nick.jpg";

        this.current_track = 0;
        this.x = g_config.track_centers[ this.current_track ] - this.width/2;
        this.y = g_canvas.height - this.height;
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

function create_canvas()
{
    var width = 480;
    var height = 320;

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
}

function draw_score()
{
    g_canvas.fillStyle = "#AAA";

    g_canvas.fillText(g_scores,40,50,100);
}

function draw()
{
    g_canvas.clearRect(0,0,g_canvas.width,g_canvas.height);

    g_treasure.draw();
    g_player.draw();

    draw_score();
}

function game_loop()
{
    update();
    draw();
}

function compute_track_centers()
{
    var max_width = Math.max( g_treasure.width, g_player.width );

    g_config.track_centers.push( max_width/2 );

    g_config.track_centers.push( g_canvas.width/2 );

    g_config.track_centers.push( g_canvas.width - max_width/2 );
}

function init()
{
    create_canvas();

    compute_track_centers();

    g_treasure.init();
    g_player.init();

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
