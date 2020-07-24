
var si = {
	
	played: 0, level: 1, score: 0, boardSize: 700, population: 20, speed: 1500,
	expert: {1: 50, 2: 35, 3: 28, 4: 25, 5: 14},

	init : function(){
		
		si.playable = true;
		si.over = false;
		si.board = new Array();
		si.killed = new Array();
		si.keyMap = new Array();
		si.myInterval = 0;
		si.starInterval = 0;
		si.leftInterval = -1;
		si.rightInterval = -1;
		si.shotInterval = -1;
		si.monsters = 0;
		si.lines = 0;
		si.shots = 0;
		si.timer = 0
		si.shotRatio = 0;
		si.killedRatio = 0;
		si.expertise = parseFloat($('input[type=radio][name=gp]:checked').val());
		si.megashot = parseFloat($('input[type=radio][name=megashot]:checked').val());
		si.squareSize = si.expert[si.expertise];
		si.nbSq = si.boardSize/si.squareSize;
		si.maxLines = 50+si.level*10;
		si.shotRatioNeeded = 0.5+(si.level/100);
		si.killedRatioNeeded = 0.5+(si.level/100);	
		si.mySquare = { width: 50, height: 20, shotW: 5, shotH: 10 };
		si.mySquare.left = (si.boardSize/2)-(si.mySquare.width/2)-(si.squareSize/2)*(1-(si.boardSize/si.squareSize)%2);
		si.mySquare.top = si.boardSize-si.mySquare.height-10;
		si.mySquare.step = si.squareSize;
		si.popluation = si.population-si.level+1;
		$('#score').html("Score: "+si.score);
		$('#played').html("Parties: "+si.played);
		$('#lines').html("Lignes: "+si.lines);
		$('#level').html("Niveau: "+si.level);
		$('#monsters').html("Monstres crÃ©Ã©s: "+si.monsters);
		$('#killed').html("TuÃ©s: "+si.killed.length);
		$('#shots').html("Tirs: "+si.shots);
		$('#board').css({ width: si.boardSize+'px', height: si.boardSize+'px' }).html('<div id="board_bg"></div>');
		$('#board_bg').css({ width: si.boardSize+'px', height: si.squareSize*si.maxLines+'px', top: (-si.squareSize*si.maxLines+si.boardSize) +'px' });
		$('#board').append("<div id='mySquare' style='left: " + si.mySquare.left + "px; top: " + si.mySquare.top + "px; width: " + si.mySquare.width + "px; height: " + si.mySquare.height + "px;'><div id='mySquareCl'></div><div id='mySquareCr'></div></div>");
		$("input[type=radio]").attr('disabled','disabled');
		$("input[type=button]").removeAttr('disabled');
		$('#pause_btn').css({display: 'block'});
		$('#resume_btn').css({display: 'none'});
		
		if(si.played > 0){
			si.gameRoutine();
		}
		else{
			si.population = si.nbSq;
			$('#game_object').append("<div id='info'><p>Tente de protéger tes données<br /><br /><br /><br /><a id='restart' href='#'>Tente d'égaler Edward Snowden</a></p></div>");
			$("input[type=radio]").removeAttr('disabled');
			$("input[type=button]").attr('disabled','disabled');
			$('#restart').click(function(){ si.gameRestart(); });
		}
		si.played++;
		si.keyMapper();
		$('#abandon_btn').click(function(){ si.gameOver() });
		$('#pause_btn').click(function() { si.gamePause() }).css({display: 'block'});
		$('#resume_btn').click(function() { si.gameResume() }).css({display: 'none'});
	},
	
	
	gameRoutine: function(){
		
		si.addStars();
		si.myInterval = setInterval(function() {

			if(si.lines >= (si.maxLines)) {
				si.gameComplete();
			}
			else{
				si.checkGameOver();
				si.addSqareLine();
				si.lines++;
			}

			si.shotRatio = ((si.killed.length/si.shots).toPrecision(2))*100;
			si.killedRatio = ((si.killed.length/si.monsters).toPrecision(2))*100;
			$('#played').html("Parties: "+si.played);
			$('#lines').html("Lignes: "+si.lines);
			$('#monsters').html("Monstres crÃ©Ã©s: "+si.monsters);
			$('#shot_ratio').html("R/tirs: "+si.shotRatio.toString().substr(0, 3)+"%");
			$('#killed_ratio').html("R/tuÃ©s: "+si.killedRatio.toString().substr(0, 3)+"%");
			
		}, si.speed-(si.level*50*si.expertise));
		
		si.starInterval = setInterval(function() { $('#board_bg').css({top: "+=1px"}); }, 120);
	},


	gameComplete: function(){
	
		clearInterval(si.myInterval);
		clearInterval(si.starInterval);
		si.playable = false;
		si.over = true;
		$("input[type=radio]").removeAttr('disabled');
		$("input[type=button]").attr('disabled','disabled');
		
		if(si.shotRatio < si.shotRatioNeeded){
			$('#game_object').append("<div id='info'><p>Votre ratio de monstres par tirs est trop bas!: "+si.shotdRatio+"<br />Le niveau demande: "+si.shotRatioNeeded+"<br /><a id='restart' href='#'>Recommencer</a></p></div>");
		}
		else if(si.killedRatio < si.killedRatioNeeded){
			$('#game_object').append("<div id='info'><p>Votre ratio de monstres tuÃ©s en tout est trop bas!: "+si.killedRatio+
			"<br />Le niveau demande: "+si.killedRatioNeeded+"<br /><a id='restart' href='#'>Recommencer</a></p></div>");
		}
		else{
			si.level++;
			si.score += si.killed.length;
			$('#score').html("Score: "+si.score);
			$('#game_object').append("<div id='info'><p> Bien joué pour cette fois ! <br />Ratio tuÃ©s/balles: "+si.shotRatio+" <br />Ratio tuÃ©s/vivants: "+si.killedRatio+"<br />Continuons... <br /><a id='restart' href='#'>Allon-y!</a></p></div>");
		}
		$('#restart').click(function(){ si.gameRestart(); });
	},


	gameOver: function(){
		if(si.over == true) return false;
		
		clearInterval(si.myInterval);
		clearInterval(si.starInterval);
		$('#game_object').append("<div id='info'><p>GAME OVER<br /><br /><a id='restart' href='#'>Recommencer</a></p><br /><br />Changer le niveau ? ==>></div>");
		$("input[type=radio]").removeAttr('disabled');
		$("input[type=button]").attr('disabled','disabled');
		si.score = 0;
		si.over = true;
		si.playable = false;
		$('#restart').click(function(){ si.gameRestart(); });
	},
	
	
	gameRestart : function(){
		si.init();
		$('#info').remove();
	},


	shotListener: function(){
		
		if(si.keyMap[32] == false || si.playable != true) return;
		if(si.megashot == 1 && $('.shot').css("left") != undefined) return;
		
		//event.preventDefault();
		var gsl = si.shots++;
		$('#shots').html("Tirs: "+(gsl+1));
		var myPos = parseFloat($('#mySquare').css("left"));
		shotPos = myPos + si.mySquare.width/2 -2;
		var shotSquare = 0
		var shotTop = 0;
		
		$('.invaders').each(function(){
			
			var id = '#'+$(this).attr("id");
			var idAry = id.split("_");
			var column = idAry[1];
			var line = idAry[0].substr(2, idAry[0].length-2);
			var pos = column*si.squareSize;
			var posDiff = shotPos-pos;
			
			if(posDiff >= 0 && posDiff <= si.squareSize){
				shotSquare = { id: id, column: column, line: line };
				return false;
			}
		});
		
		if(shotSquare !== 0 && $.inArray(shotSquare.id, si.killed) === -1)
		{
			shotTop = parseFloat($(shotSquare.id).css("top"));
			si.killed.push(shotSquare.id);
			
			setTimeout(function(){
				$(shotSquare.id).remove();
				$('#board').append("<div class='fading' style='left: " + (shotSquare.column*si.squareSize) + "px; top: " + shotTop + "px; width: "+si.squareSize+"px; height: "+si.squareSize+"px;'></div>");
				$('.fading').delay(50).fadeOut(70, function(){ $('.fading').remove() });
			}, (si.mySquare.top-shotTop)/2);			
		}
				
		$('#board').append("<div class='shot' id='shot_"+gsl+"' style='left: " + shotPos + "px; top: " + si.mySquare.top + "px; width: "+si.mySquare.shotW+"px; height: "+si.mySquare.shotH+"px;'></div>");
		$('#shot_'+gsl).animate({ top: shotTop }, (si.mySquare.top-shotTop)/2, function(){ $('#shot_'+gsl).remove(); });
		$('#killed').html("TuÃ©s: "+si.killed.length);
	},


	moveMySquareListener: function(dir){
		
		if(si.playable != true) return;
			
		var myPos = parseFloat($('#mySquare').css("left"));
		var halfSquareSize = si.squareSize/2;
		var halfMySquare = si.mySquare.width/2;

		if(dir == 37){
			(myPos <= halfSquareSize)? 
				myPos = -halfMySquare+halfSquareSize : myPos = "-="+si.mySquare.step+"px";
			$('#mySquare').css("left", myPos);
		}
		else if(dir == 39) {
			(myPos >= si.boardSize-halfMySquare-halfSquareSize)? 
				myPos = si.boardSize-halfMySquare-halfSquareSize : myPos = "+="+si.mySquare.step+"px";				
			$('#mySquare').css("left", myPos);	
		}
	},


	addSqareLine: function() {

		var aSq = new Array();
		
		for(var i=0; i<si.nbSq; i++) {
			aSq[i] = Math.floor(Math.random()*si.population);
			if(aSq[i] === 1) si.monsters++;
		}
		
		si.board.push(aSq);	
		$('.invaders').remove();

		for(var i=0; i<si.board.length; i++) {
			for(var j=0; j<si.nbSq; j++) {

				if(si.board[i][j] === 1 && $.inArray("#i"+ i +"_"+ j, si.killed) === -1){
					$('#board').append("<div id='i"+ i +"_"+ j +"' class='invaders' style='left: " + (j*si.squareSize) + "px; top: " + ((si.board.length-i)*si.squareSize-si.squareSize) + "px; width: "+si.squareSize+"px; height: "+si.squareSize+"px;'></div>");
				}
			}
		}
	},


	addStars: function() {

		for (var i=0; i<si.maxLines*4; i++) {
				$('#board_bg').append("<div class='star' style='background: #fff; left: " + Math.floor(Math.random()*si.boardSize) + "px; top: " + Math.floor(Math.random()*(si.squareSize*si.maxLines)) + "px; width: 1px; height: 1px;'></div>");
		}
	},


	checkGameOver: function() {
	
		if(si.over == true || (si.board.length < si.nbSq)) return;
			
		var finalLine = si.board.length-si.nbSq;
		
		for(var j=0; j<si.board[finalLine].length; j++) {

			if(si.board[finalLine][j] == 1 && $.inArray("#i"+ finalLine +"_"+j, si.killed) === -1){
				
				si.gameOver();
			}
		}
	},


	gamePause: function(){
	
		if(si.playable == false) return false; 
		
		si.playable = false;
		clearInterval(si.myInterval);
		clearInterval(si.starInterval);
		$('#pause_btn').css({display: 'none'});
		$('#resume_btn').css({display: 'block'});
	},


	gameResume: function(){
	
		if(si.playable == true) return false; 
		
		si.playable = true;
		si.myInterval = setInterval(function() { si.gameRoutine(); }, si.speed-(si.level*50*si.expertise));
		si.starInterval = setInterval(function() { $('#board_bg').css({top: "+=1px"}); }, 120);
		$('#pause_btn').css({display: 'block'});
		$('#resume_btn').css({display: 'none'});
	},
	
	
	keyMapper: function(){ 
		
		keys = [32, 37, 39];
		si.keyMap[32] = false;
		si.keyMap[37] = false;
		si.keyMap[39] = false;
		si.moveMySquareListener();

		$(document).keydown(function(event) {
			if($.inArray(event.keyCode, keys) === -1) return;
			
			if(si.keyMap[event.keyCode] == false){
				si.keyMap[event.keyCode] = +new Date();
			}
			
			if(si.keyMap[32] != false && si.shotInterval === -1){
				si.shotListener();
				si.shotInterval = setInterval(function() {
					if(si.keyMap[32] != false){
						si.shotListener();
					} else clearInterval(si.shotInterval);
				}, 250);
			}
			if(si.keyMap[37] != false && si.leftInterval === -1){
				if(si.rightInterval === -1){
					si.moveMySquareListener(37);
					si.leftInterval = setInterval(function() {
						if(si.keyMap[37] != false){
							si.moveMySquareListener(37);
						} else clearInterval(si.leftInterval);
					}, 100);
				}
			}	
			else if(si.keyMap[39] != false && si.rightInterval === -1){
				if(si.leftInterval === -1){
					si.moveMySquareListener(39);
					si.rightInterval = setInterval(function() {
						if(si.keyMap[39] != false){
							si.moveMySquareListener(39);
						} else clearInterval(si.rightInterval);
					}, 100);
				}
			}			
		});
			
		$(document).keyup(function(event) {
			if($.inArray(event.keyCode, keys) === -1) return;
			
			if(si.keyMap[event.keyCode] != false){
				si.keyMap[event.keyCode] = false;
				
				if(event.keyCode == 32){
					clearInterval(si.shotInterval);
					si.shotInterval = -1;
				}
				if(event.keyCode == 37){
					clearInterval(si.leftInterval);
					si.leftInterval = -1;
				}
				if(event.keyCode == 39){
					clearInterval(si.rightInterval);
					si.rightInterval = -1;
				}
			}
		});
	}
};

$(document).ready(function(){ si.init(); });

