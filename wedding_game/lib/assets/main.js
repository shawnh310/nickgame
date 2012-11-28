var g_config =
{
    fps: 30,
    track_centers:[],
    golden_ratio: 0.1,
    treasure_score: 100,
    gold_treasure_score: 300,
    width: 800,
    height: 700,
    life: 3,
    time: 30,
    drop_speed: 160,
    difficulty: 1
}

var g_game_stats =
{
    score : 0,
    remaining_time: g_config.time
}

var g_game_states =
{
    WAIT_FOR_START : 0,
    RUNNING : 1,
    END : 2
};

var g_current_game_state;

var g_canvas = null;

var g_game_over_sound = new Audio("assets/Super_Mario_Bros_Die_Sound_Effect.wav");
var g_game_complete_sound = new Audio("assets/Angry_Birds_Level_Complete_Sound_Effect.wav");

var g_treasure =
{
    x: 0,
    y: 0,
    img: null,
    width: 100,
    height: 100,
    drop_speed: g_config.drop_speed,
    current_track:0,
    sound: null,

    init: function()
    {
        this.img = new Image();
        this.img.src = "assets/logo.png";

        this.sound = new Audio("assets/Pacman_Eating_Cherry_Sound_Effect.wav");

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
            g_game_stats.score += this.treasure_score;

            this.sound.play();

            this.restart();
            return;
        }

        if ( (this.y+this.height) >= g_background.max_screen_y )
        {
            g_player.life--;
            if ( g_player.life == 0 )
            {
                g_current_game_state = g_game_states.END;
                return;
            }

            g_player.miss_catch_sound.play();

            this.restart();
        }
    },

    restart: function()
    {
	if (Math.random() < g_config.golden_ratio) 
	{
		this.img.src = "assets/logo_gold.gif";
		this.treasure_score = g_config.gold_treasure_score;
		this.drop_speed = g_config.drop_speed * 2;
	} else {
		this.img.src = "assets/logo.png";
		this.treasure_score = g_config.treasure_score;
		this.drop_speed = g_config.drop_speed;
		//difficulty = 1 + game_time + score
		difficulty = (1+ (g_config.time - g_game_stats.remaining_time) / g_config.time + g_game_stats.score / 2000);
		this.drop_speed *= difficulty;
	}

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
        this.img.src = "assets/nick-5.png";

        this.life_img = new Image();
        this.life_img.src = "assets/nick-6.png";

        this.miss_catch_sound = new Audio("assets/Pacman_Dies_Sound_Effect.wav");

        this.current_track = 1;
        this.x = g_config.track_centers[ this.current_track ] - this.width/2;
        this.y = g_background.max_screen_y - this.height;
    },

    restart: function()
    {
        this.current_track = 1;
        this.x = g_config.track_centers[ this.current_track ] - this.width/2;

        this.life = g_config.life;
    },

    draw: function()
    {
        g_canvas.drawImage(this.img, this.x, this.y, this.width, this.height);
    },

    move_left: function()
    {
	if(this.current_track > 0) // substract only if current_track > 0
	    this.current_track = this.current_track -1;
        this.x = g_config.track_centers[ this.current_track ] - this.width/2;
    },

    move_right: function()
    {
	if(this.current_track < 2) // increase only if current_track < 2
		this.current_track = this.current_track +1;
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
        this.img.src = "assets/arcade.png"

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

var g_flash_message =
{
    cur_time : 0,
    msg : null,

    restart : function()
    {
        this.cur_time = 0;
    },

    update : function(elapsed_time)
    {
        this.cur_time += elapsed_time;
    },

    draw : function()
    {
        g_canvas.font = "bold 20px arcade_font";

        g_canvas.textAlign = 'center';

        if ( Math.floor( this.cur_time ) % 2 == 0 )
        {
            g_canvas.fillStyle = "#555555";
            g_canvas.fillText( this.msg,
                (g_background.min_screen_x + g_background.max_screen_x) / 2,
                (g_background.min_screen_y + g_background.max_screen_y)/2, 200);
        }
        else
        {

        }
    }
}


var g_rank =
{
    cur_time : 0,

    restart : function()
    {
        this.cur_time = 0;
    },

    update : function(elapsed_time)
    {
        this.cur_time += elapsed_time;
    },

    draw : function()
    {
        g_canvas.font = "bold 20px arcade_font";

        var y_gap = (g_background.max_screen_y - g_background.min_screen_y) / (g_rank_json.list.length*2+1);

        var cur_y = g_background.min_screen_y + y_gap;
        for ( var i = 0; i < g_rank_json.list.length; i++ )
        {
            if ( i == g_rank_json.your_index )
            {
                if ( Math.floor( this.cur_time ) % 2 == 0 )
                {
                    var name  = g_rank_json.list[i].name;
                    var score = g_rank_json.list[i].score;
                    var rank = g_rank_json.list[i].rank;

                    g_canvas.fillStyle = "#FF0000";

                    g_canvas.textAlign = "left";
                    g_canvas.fillText( "Rank " + rank,
                        g_background.min_screen_x + 20,
                        cur_y, 200);

                    g_canvas.textAlign = "center";
                    g_canvas.fillText( name,
                        (g_background.max_screen_x+g_background.min_screen_x)/2,
                        cur_y, 200);

                    g_canvas.textAlign = "right";
                    g_canvas.fillText( score,
                        g_background.max_screen_x,
                        cur_y, 200);
                }
                else
                {

                }
            }
            else
            {
                var name  = g_rank_json.list[i].name;
                var score = g_rank_json.list[i].score;
                var rank = g_rank_json.list[i].rank;

                g_canvas.fillStyle = "#AAAAAA";

                g_canvas.textAlign = "left";
                g_canvas.fillText( "Rank " + rank,
                    g_background.min_screen_x + 20,
                    cur_y, 200);

                g_canvas.textAlign = "center";
                g_canvas.fillText( name,
                    (g_background.max_screen_x+g_background.min_screen_x)/2,
                    cur_y, 200);

                g_canvas.textAlign = "right";
                g_canvas.fillText( score,
                    g_background.max_screen_x,
                    cur_y, 200);
            }


            cur_y += y_gap * 2;
        }
    }
}

var g_timer =
{
    last_update_time : -1,
    elapsed_time : -1,

    update : function()
    {
        var cur_time = new Date().getTime() / 1000.0;

        if ( this.last_update_time == -1 )
        {
            this.last_update_time = cur_time;
        }
        else
        {
            this.elapsed_time = cur_time - this.last_update_time;
            this.last_update_time = cur_time;
        }
    },

    getElapsedTime : function()
    {
        if ( this.elapsed_time == -1 )
        {
            return 1.0 / g_config.fps;
        }
        else
        {
            return this.elapsed_time;
        }
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


function update_wait_for_start()
{
    var elapsed_time = g_timer.getElapsedTime();

    g_flash_message.update(elapsed_time);
}

function update_running()
{
    var elapsed_time = g_timer.getElapsedTime();

    g_treasure.update(elapsed_time);

    g_game_stats.remaining_time -= elapsed_time;
    if ( g_game_stats.remaining_time <= 0 )
    {
        g_current_game_state = g_game_states.END;
        g_game_stats.remaining_time = 0;
    }
}

var g_end_state = 0;
var g_rank_json = null;
var g_name = null;
function update_end()
{
    if ( g_end_state == 0 )
    {
        if ( g_player.life == 0)
        {
            if ( g_game_over_sound.paused )
            {
                g_game_over_sound.play();
                g_game_over_sound.addEventListener('ended', function(){g_end_state = 1;});
            }
        }
        else
        {
            if ( g_game_complete_sound.paused )
            {
                g_game_complete_sound.play();
                g_game_complete_sound.addEventListener('ended', function(){g_end_state = 1;});
            }
        }
    }
    else if ( g_end_state == 1 )
    {
        g_end_state = 2;

        g_name = prompt("Enter your name : ", "your name here");

        $.ajax({
            url: "/game/submit_score",
            type: "post",
            data: { name: g_name, score: g_game_stats.score},

            success: function(response, textStatus, jqXHR)
            {
            },

            error: function(jqXHR, textStatus, errorThrown)
            {
            },

            complete: function(data)
            {
                if ( data.responseText == "success" )
                {
                    g_end_state = 3;
                }
                else
                {
                    alert("name already existed");
                    g_end_state = 1;
                }
            }
        });
    }
    else if ( g_end_state == 2 )
    {
    }
    else if ( g_end_state == 3 )
    {
        g_end_state = 4;
        console.debug(g_name);
        $.ajax({
            url: "/game/get_rank",
            type: "post",
            data: {name: g_name},
            dataType: "json",

            success: function(response, textStatus, jqXHR)
            {
            },

            error: function(jqXHR, textStatus, errorThrown)
            {
            },

            complete: function(data)
            {
                g_end_state = 5;
                g_rank_json = JSON.parse(data.responseText);
            }
        });
    }
    else if ( g_end_state == 4 )
    {

    }
    else if ( g_end_state == 5 )
    {
        g_rank.update(g_timer.getElapsedTime());
    }
}


function update()
{
    g_timer.update();

    switch ( g_current_game_state )
    {
        case g_game_states.WAIT_FOR_START:
            update_wait_for_start();
            break;

        case g_game_states.RUNNING:
            update_running();
            break;

        case g_game_states.END:
            update_end();
            break;
    }
}

function draw_info()
{
    g_canvas.font = "bold 20px arcade_font";

    g_canvas.textAlign = "left";
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

function draw_wait_for_start()
{
    g_canvas.clearRect(0,0,g_canvas.width,g_canvas.height);

    g_background.draw();

    draw_info();

    g_flash_message.draw();
}

function draw_running()
{
    g_canvas.clearRect(0,0,g_canvas.width,g_canvas.height);

    g_background.draw();

    g_treasure.draw();

    g_player.draw();

    draw_info();
}

function draw_end()
{
    if ( g_end_state == 5 )
    {
        g_canvas.clearRect(0,0,g_canvas.width,g_canvas.height);
        g_background.draw();
        g_rank.draw();
    }
    else
    {
        g_canvas.clearRect(0,0,g_canvas.width,g_canvas.height);

        g_background.draw();

        g_treasure.draw();

        g_player.draw();

        draw_info();
    }
}


function draw()
{
    switch ( g_current_game_state )
    {
        case g_game_states.WAIT_FOR_START:
            draw_wait_for_start();
            break;

        case g_game_states.RUNNING:
            draw_running();
            break;

        case g_game_states.END:
            draw_end();
            break;
    }
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


var g_start_sound = new Audio("assets/Pacman_Opening_Song_Sound_Effect.wav");
function left_key_handler()
{
    switch ( g_current_game_state )
    {
        case g_game_states.WAIT_FOR_START:
            if ( g_start_sound.paused )
            {
                g_start_sound.play();
                g_start_sound.addEventListener('ended', function(){g_current_game_state = g_game_states.RUNNING;});
                g_flash_message.msg = "READY!"
            }
            break;
        case g_game_states.RUNNING:
            g_player.move_left();
            break;
        case g_game_states.END:
            if ( g_end_state == 5 )
            {
                restart();
            }
            break;
    }
}

function right_key_handler()
{
    switch ( g_current_game_state )
    {
        case g_game_states.WAIT_FOR_START:
            if ( g_start_sound.paused )
            {
                g_start_sound.play();
                g_start_sound.addEventListener('ended', function(){g_current_game_state = g_game_states.RUNNING;});
                g_flash_message.msg = "READY!"
            }
            break;
        case g_game_states.RUNNING:
            g_player.move_right();
            break;
        case g_game_states.END:
            if ( g_end_state == 5 )
            {
                restart();
            }
            break;
    }
}

function down_key_handler()
{
    switch ( g_current_game_state )
    {
        case g_game_states.WAIT_FOR_START:
            if ( g_start_sound.paused )
            {
                g_start_sound.play();
                g_start_sound.addEventListener('ended', function(){g_current_game_state = g_game_states.RUNNING;});
                g_flash_message.msg = "READY!"
            }
            break;
        case g_game_states.RUNNING:
            g_player.move_mid();
            break;
        case g_game_states.END:
            if ( g_end_state == 5 )
            {
                restart();
            }
            break;
    }
}

function restart()
{
    g_current_game_state = g_game_states.WAIT_FOR_START;

    g_end_state = 0;

    g_flash_message.msg = "PRESS ANY KEY TO START";

    g_treasure.restart();

    g_player.restart();

    g_game_stats.score = 0;
    g_game_stats.remaining_time = g_config.time;
}

function init()
{
    g_current_game_state = g_game_states.WAIT_FOR_START;

    create_canvas();

    g_background.init();

    g_flash_message.msg = "PRESS ANY KEY TO START";

    compute_track_centers();

    g_treasure.init();
    g_player.init();

    $(document).bind("keydown.left", function()
    {
        left_key_handler();
    });

    $(document).bind("keydown.right", function()
    {
        right_key_handler();
    });

    $(document).bind("keydown.down", function()
    {
        down_key_handler();
    });
}

function onload()
{
    init();

    setInterval("game_loop()",1/g_config.fps);
}
