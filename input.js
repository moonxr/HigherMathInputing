var nodeLocation = document.getElementById('num0');
var numberOfKeyInputs = 0;
var numberOfFractions = 0;
var cursorAnimate = [];  // for flicker
var oLogosInput = [];  // keyInput
var number = 0;  // 中转，告诉LogosInput
var heightOfKeyInputs = [];
var widthOfFraction = [
{ "widthOfNumerator":0, "widthOfDenominator":0 }
];

function power(input1, input2){
	return 	'<div class="power">'+
    			'<div class="baseNumber">'+ input1 +'</div>'+
    			'<div class="indexNumber">'+ input2 +'</div>'+
    		'</div>';
}

function fraction(input1, input2){
	return 	'<div id ="mun'+ numberOfFractions++ +'" class="fraction">'+
    			'<div class="numerator">'+ input2 +'</div>'+
    			'<div class="denominator">'+ input1 +'</div>'+
    		'</div>';
}

function logarithm(input1, input2){
	return 	'<div class="logarithm">'+
				'<p>log</p>'+
    			'<div class="bgNumber">'+ input1 +'</div>'+
    			'<div class="antilog">'+ input2 +'</div>'+
    		'</div>';
}

function limit(input1, input2){
	return 	'<div class="ep_lim">' +
				'<div class="limit">lim</div>' +
				'<div class="approach">'+ input1 +'→'+ input2 +'</div>' +
			'</div>';
}

function keyInput(defaultValue){
	return 	'<div id ="num'+ ++numberOfKeyInputs +'" class="logosInput">'+
           	    '<div class="logosContent">'+ defaultValue +'</div>'+
                '<div class="logosCursor"></div>'+
   	            '<input type="text" class="logosInputGrid">'+
            '</div>';
}

function commonInput(defaultValue){
	return 	'<input type="text" class="inputGrid" value="'+ defaultValue +'">'
}

// LogosInput类(自定义的输入框)
function LogosInput(oContent, oCursor, oInputGrid){
	this.contentIn = oContent;
	this.cursor = oCursor;
	this.inputGrid = oInputGrid;
	this.num = 0;
}
LogosInput.prototype.focus = function(){
	this.inputGrid.focus();
	cursorAnimate[this.num] = true
	this.cursor.css("background-color","black");
	this.cursor.animate({width:4},300);
}
LogosInput.prototype.write = function(){
	var content = this.inputGrid.val();
	this.contentIn.html(content);
}
LogosInput.prototype.blur = function(){
	this.cursor.css({
		"background-color":"white",
		"width":"6px"
	});
	cursorAnimate[this.num] = false;
}

$(document).ready(function(){

	$("#lim").click(function(){
		if ($('#math_expression').has('.ep_lim').length==false){
			$('.ep_body').before(limit(commonInput("x"), commonInput("0")));
		}
		$("#num0").children("input").focus();
	});

	$("#mi").mouseup(function(){
		specialSymbolMouseup(power(commonInput("A"), commonInput("B")));
	});

	$("#fen").mouseup(function(){
		specialSymbolMouseup(fraction(commonInput("X"), commonInput("Y")));
	});

	$("#log").mouseup(function(){
		specialSymbolMouseup(logarithm(commonInput("A"), commonInput("B")));
	});

	$(".line:eq(1)").children().mouseup(function(event){
		operateSymbolMouseup();
	});

	$("#done").mouseup(function(){
		$(".logosInput").css("display","none");
		fractionBeautiful();
	});

	liveOfInputGrid();
	liveOfLogosInput();
});

function liveOfInputGrid(){
	$(".inputGrid").live({
		'keyup':changeLengthWhenKeyUp,
		'click':function(event){
			nodeLocation = event.currentTarget;
			$(nodeLocation).select();
		},
		'change':function(event){
			$(nodeLocation).css({"color":"#000","font-weight":"normal"});
		}
	});
}

function liveOfLogosInput(){
	$(".logosInput").live({
		"click":function(event){
			nodeLocation = event.currentTarget;
			var strId =  $(event.currentTarget).attr("id").slice(3);
			number = parseInt(strId);
			if (!oLogosInput[number]) {
				oLogosInput[number] = new LogosInput($(this).children(".logosContent"), $(this).children(".logosCursor"), $(this).children(".logosInputGrid"));
				oLogosInput[number].num = number;
			};
				
			oLogosInput[number].focus();
			flicker(number, oLogosInput[number].cursor);

			$(this).children(".logosInputGrid").keyup(function(){
				oLogosInput[number].write();
			});

			$(this).children(".logosInputGrid").blur(function(){
				oLogosInput[number].blur();
			});
		},
		"keydown":function(event){
			content = $(this).children(".logosContent").html();
			if (event.keyCode == 37) {    // 左移光标
				$(this).prev().before($(this));
				oLogosInput[number].focus();
				flicker(number, oLogosInput[number].cursor);
			} else if(event.keyCode == 39){    // 右移光标
				$(this).next().after($(this));
				oLogosInput[number].focus();
				flicker(number, oLogosInput[number].cursor);
			} else if(event.keyCode == 8){    // 按删除键
				if (content.length == 0) {
					$(this).prev().remove();
					fractionBeautiful();
				}
			} else if (event.keyCode == 13) {    // 按回车键
				if (content != "")	{
					$(this).before('<div class="operand">'+content+'</div>');
					$(this).children(".logosInputGrid").val("");
					$(this).children(".logosContent").html("");
					verticalCenter($(this).siblings(".operand"));
					fractionBeautiful();
				}
			}
		}
	});
}

function operateSymbolMouseup(){
	if ($(nodeLocation).parent().parent().attr("class") != "fraction") {
		if (!haveBracketAlready()) addBracket();
	}		
	if ($(nodeLocation).attr("type")=="text"){
		var content = $(nodeLocation).val();
		if (content.length) $(nodeLocation).before('<div class="operand">'+content+'</div>');
		$(nodeLocation).before('<div class="operate">'+$(event.currentTarget).children().first().html()+'</div>');
		$(nodeLocation).before(keyInput(""));
		$(nodeLocation).remove();
		var whichOne = "#num" + numberOfKeyInputs.toString();
   		$(whichOne).click();
	} else {
		var content = $(nodeLocation).children(".logosContent").html();
		if (content.length) $(nodeLocation).before('<div class="operand">'+content+'</div>');
		$(nodeLocation).before('<div class="operate">'+$(event.currentTarget).children().first().html()+'</div>');
		$(nodeLocation).children(".logosInputGrid").val("");
		$(nodeLocation).children(".logosContent").html("");
		$(nodeLocation).click();
	}
	verticalCenter($(nodeLocation).siblings(".operate"));
	verticalCenter($(nodeLocation).siblings(".operand"));
	fractionBeautiful();
}

function specialSymbolMouseup(symbolFunction){
	var heightNow = [];
	$(nodeLocation).before(symbolFunction);
	if ($(nodeLocation).parent().attr("class")=="baseNumber" || $(nodeLocation).parent().attr("class")=="antilog") {
		if (!haveBracketAlready()) addBracket();
	}
	fractionBeautiful();
	powerBeautiful();

	if ($(nodeLocation).attr("type")=="text") {
		$(nodeLocation).before(keyInput(""));
		$(nodeLocation).remove();
		var whichOne = "#num" + numberOfKeyInputs.toString();
   		$(whichOne).click();
	} else{
		$(nodeLocation).click();
	}
	
	$(".logosInput").each(function(){
		var index = parseInt($(this).attr("id").slice(3));
		heightNow[index] = $(this).parent().css("height");
		if (heightNow[index] != heightOfKeyInputs[index]) {
			$(this).parent().children().each(function(){
				verticalCenter($(this));
				heightOfKeyInputs[index] = heightNow[index];
			});
		}
	});

	verticalCenter($(nodeLocation).prev());
}


/* 辅助函数 */
function changeLengthWhenKeyUp(event){
	var numberNow = $(event.currentTarget).val().length;
	var lengthNow;
	if (numberNow == 0) {
		lengthNow = 10;
	} else {
		lengthNow = numberNow * 10;
	}
	$(event.currentTarget).css("width",lengthNow + "px");
}

function addBracket(){
	$(nodeLocation).parent().children().first().before('<div class="operate_bracket">(</div>');
	$(nodeLocation).parent().children().last().after('<div class="operate_bracket">)</div>');
	verticalCenter($(nodeLocation).siblings(".operate_bracket"));
}

function haveBracketAlready(){
	if ($(nodeLocation).parent().has(".operate_bracket").length) {
		return true;
	} else {
		return false;
	}
}

function flicker(i, cursor){
	if (cursorAnimate[i]) {
		cursor.fadeIn(500);
		cursor.fadeOut(500,function(){
			flicker(i, cursor);
		});	
	} else {
		cursor.fadeTo(300,1);
	}
}

function verticalCenter($which){
	var containerheight = parseInt($which.parent().css("height"));
	var selfHeight = parseInt($which.css("height"));
  	$which.css("margin-top",(containerheight-selfHeight)/2 + "px");
}

function fractionBeautiful() {
	var index;
	var length;
	var numeratorLength;
	var denominatorLength;
	var fractionLengthNow;
	var $numerator;
	var $denominator;
	$(".fraction").each(function(){
		index = parseInt($(this).attr("id").slice(3));
		numeratorLength = parseInt($(this).children(".numerator").css("width"));
		denominatorLength = parseInt($(this).children(".denominator").css("width"));
		fractionLengthNow = numeratorLength>denominatorLength ? numeratorLength:denominatorLength;
		$numerator = $(this).children(".numerator");
		$denominator = $(this).children(".denominator");
		if (fractionLengthNow != widthOfFraction[index]) {
			length = Math.abs(numeratorLength-denominatorLength)/2+2;
			if (numeratorLength > denominatorLength) {
				$denominator.css("padding-left",length + "px");
			} else {
				length = (fractionLengthNow-numeratorLength)/2
				$numerator.css({
					"padding-left":length + "px",
					"padding-right":length + "px"
				});
			}
			widthOfFraction[index] = fractionLengthNow;
		}
	});
}

function powerBeautiful() {
	var $power = $(nodeLocation).parent().parent();
	var $baseNumber = $power.children(".baseNumber");
	var $indexNumber = $power.children(".indexNumber");
	var indexNumberHeight = parseInt($indexNumber.css("height"));
	if ($indexNumber.children().length>1 && $baseNumber.children().length==1) {
		$baseNumber.children().css({
			"font-size":"17px",
			"width":"16px",
			"height":"16px"
		});
	}
	$baseNumber.css("padding-top",indexNumberHeight/2 + "px");
}











