
//kavanaugh-bayes.js
//
//This is the javascript for the Bayes' Rule Calculator for evaluating 
//the testimony of Christine Blasey Ford and Brett Kavanaugh before the
//United States Senate Judiciary Committee in September, 2018.
//
//With apologies!
//I had to bang this out in a limited amount of time starting with a few
//components from another project.  A real web engineer would do this 
//all much more elegantly!  I am especially regretful for the hacky way
//the layout is done.  I know this will not work right on a small screen,
//and I'm not even sure how it comes out in all browsers.
//-Eric Saund 
//10/2/2018
//


//http://stackoverflow.com/questions/823174/why-i-could-not-add-mousemove-event-after-mousedown-in-prototype
// declare the global bind() method for all functions
//
//Also, this is helpful.  See the answer by tarkabak Sept 26, 2012.
//http://stackoverflow.com/questions/310870/use-of-prototype-vs-this-in-javascript

		


Function.prototype.bind = function(obj) {
    var method = this,
    temp = function() {
        return method.apply(obj, arguments);
    };
    return temp;
} 


//Create the Slider prototype, just a slider
//orientation is 'horizontal' or 'vertical'
function Slider(id, x, y, width, height, min_value, max_value, callback){
	
	this.sliderElem = document.createElement("div");
	this.sliderElem.style.position = "absolute";

	this.sliderElem.style.left = x + "px";
	this.sliderElem.style.top = y + "px";
	this.sliderElem.style.width = width + "px";
	this.sliderElem.style.height = height + "px";
//	this.sliderElem.style.borderStyle = "solid";
//	this.sliderElem.style.borderWidth = "1px";
//	this.sliderElem.style.borderColor = "green";

	this.sliderElem.slider = this;
	this.id = id;
	this.callback = callback;
	
	if(width > height){
		this.orientation = 'horizontal';
	    this.scale_factor = width / (max_value - min_value);
	}
	else{
		this.orientation = 'vertical';
	    this.scale_factor = height / (max_value - min_value);
	}
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.min_value = min_value;
	this.max_value = max_value;
	this.slider_value = .5;  //override by TextSlider

	this.sliderTrack = document.createElement("div");
	this.sliderTrack.style.position = "absolute";


	if(this.orientation == 'horizontal'){
		this.sliderTrack.style.left = 0 + "px";
		this.sliderTrack.style.top = height/2-1 + "px";
		this.sliderTrack.style.width = width + "px";
		this.sliderTrack.style.height = "1px";
	}
	else{
		this.sliderTrack.style.left = width/2-1 + "px";
		this.sliderTrack.style.top = "0px";
		this.sliderTrack.style.width = "1px";
		this.sliderTrack.style.height = height + "px";
	}
	this.sliderTrack.style.borderStyle = "solid";
	this.sliderTrack.style.borderWidth = "1px";

	this.sliderHandle = document.createElement("div");
	this.sliderHandle.style.position = "absolute";
	this.sliderHandle.style.borderStyle = "solid";
	this.sliderHandle.style.borderWidth = "4px";
	this.sliderHandle.addEventListener("mouseenter", mouseEnterOnSliderElemLocal.bind(this), false);
	this.sliderHandle.addEventListener("mouseleave", mouseLeaveOnSliderElemLocal.bind(this), false);


	//console.log("hey this.slider_color: " + this.slider_color + " id: " + id + " color: " + id.slider_color);
	//console.log("this.sliderElem.slider: " + this.sliderElem.slider + " color: " + this.sliderElem.slider_color);
	if (this.slider_color == undefined){
		this.slider_color = "blue";  //overridden?
	}
	this.sliderHandle.style.borderColor = this.slider_color;
	this.sliderHandle.style.backgroundColor = this.slider_color;

	this.sliderElem.appendChild(this.sliderTrack);
	this.sliderElem.appendChild(this.sliderHandle);

	this.drawSliderHandle = function(slider_value){
		if(this.orientation == 'horizontal'){
			var handle_x = this.scale_factor * this.slider_value;
			handle_x = Math.max(0, Math.min(handle_x, this.width));  //to prevent the t sliders from going out of bounds
			this.sliderHandle.style.left = handle_x + "px";
			this.sliderHandle.style.top = "0px";
			this.sliderHandle.style.width = "1px";
			this.sliderHandle.style.height = this.height + "px";
		}
		else{
			var handle_y = this.scale_factor * (this.max_value - this.slider_value);
			this.sliderHandle.style.left = "0px";
			this.sliderHandle.style.top = handle_y + "px";
			this.sliderHandle.style.width = this.width + "px";
			this.sliderHandle.style.height = "1px";
		}
	};

	this.drawSliderHandle(this.slider_value);

	this.sliderElem.addEventListener("mousedown", mouseDownOnSliderElemLocal.bind(this), false); //this works!
	this.sliderElem.addEventListener("touchstart", mouseDownOnSliderElemLocal.bind(this), false); //this works!

	function mouseDownOnSliderElemLocal(ev){
		//do not allow a passive slider to become active for moving with the mouse
		if (this.slider_is_passive_p){  
			return;
		}
		mouseDownOnSliderElem(ev);
	};

	function mouseEnterOnSliderElemLocal(ev){
		//do not show pointer on a passive slider
		if (this.slider_is_passive_p){  
			return;
		}
		setCursor('pointer')
	};

	function mouseLeaveOnSliderElemLocal(ev){
		if (this.slider_is_passive_p){  
			return;
		}
		setCursor('default')
	};

	this.updateSliderForMouseMove = function(ev){
		if(this.orientation == 'horizontal'){
			if(ev.type == "touchmove"){
				this.mouse_press_x = ev.touches[0].pageX;
			}
			else{
				this.mouse_press_x = ev.pageX;
			}
			var dx = this.mouse_press_x - (panel_div_x + this.x);
			this.slider_value = dx / this.scale_factor;
			this.slider_value = Math.round(this.slider_value * 1000) / 1000.0;
			this.slider_value = Math.max(0, Math.min(1.0, this.slider_value)); 
		}
		else if(this.orientation == 'vertical'){
			if(ev.type == "touchmove"){
				this.mouse_press_y = ev.touches[0].pageY;
			}
			else{
				this.mouse_press_y = ev.pageY;
			}
			var dy = (panel_div_y + this.y + this.height) - this.mouse_press_y;
			this.slider_value = dy / this.scale_factor;
			this.slider_value = Math.round(this.slider_value * 1000) / 1000.0;
			this.slider_value = Math.max(0, Math.min(1.0, this.slider_value)); 
		}
		if(this.callback != null){
			this.drawSliderHandle(this.slider_value);
			this.callback.call(this, this.slider_value);
		}
	};

	this.setSliderValue = function(value){
		this.slider_value = value;
		this.drawSliderHandle();
	};

	this.getSliderValue = function(){
		return this.slider_value;
	};

	this.setSliderColor = function(color){
		this.slider_color = color;
		this.sliderHandle.style.borderColor = this.slider_color;
		this.sliderHandle.style.backgroundColor = this.slider_color;
	};

	//If a slider is passive, it cannot be moved directly by the mouse.
	this.slider_is_passive_p = false;

	this.setSliderIsPassiveP = function(passive_p){
		this.slider_is_passive_p = passive_p;
	}

}



//Create the TextSlider prototype, add a text element to the slider
function TextSlider(id, x, y, width, height, min_value, max_value, callback, text_title, 
					slider_index, slider_color){
	//	this.baseSlider = Slider;
	Slider.call(this, id, x, y, width, height, min_value, max_value, callback);
	if (slider_color == undefined){
		this.setSliderColor("green");
	}
	else{
		this.setSliderColor(slider_color)
	}
//	var x_offset = -20;
	var x_offset = -20;
	var text_title_width = -5;
	this.slider_index = slider_index;
	this.slider_value = current_prob_table[slider_index];
	
	this.textTitle = document.createElement("div");
	this.textTitle.innerHTML = text_title;
	this.textTitle.style.position = "absolute";  //relative to the parent sliderElem
	this.textTitle.style.left = x_offset + "px";
	this.textTitle.style.top = height + 4 + "px";
	this.textTitle.style.width = text_title_width + "px";
	
	this.sliderElem.appendChild(this.textTitle);

	//this.valueText = document.createElement("div");
	this.valueText = document.createElement("input");
	this.valueText.setAttribute("type", "text");
//	this.valueText.innerHTML = this.slider_value;
	this.valueText.value = this.slider_value;
	this.valueText.style.position = "absolute";  //relative to the parent sliderElem
	//not pretty but the most expedient way to do it
	//if(text_title == 'alpha:'){
	//	this.valueText.style.left = x_offset + text_title_width + 50 + "px";
	//}
	//else{
	//	this.valueText.style.left = x_offset + text_title_width + 50 + "px";
	//}
	//this.valueText.style.top = height + 4 + "px";
	this.valueText.style.left = x_offset + -30 + "px";
	this.valueText.style.top = height - 18 + "px";
	this.valueText.style.width = 40 + "px";
	this.valueText.style.border = "1px solid lightgray";

	this.sliderElem.appendChild(this.valueText);

	this.valueText.addEventListener("keypress", handleTextInputLocal.bind(this), false);
	this.valueText.addEventListener("change", handleTextInputLocal.bind(this), false);

	
	function handleTextInputLocal(ev){
		if (!ev){ 
			ev = window.event;
		}
		var keyCode = ev.keyCode || ev.which;
		if (keyCode == '13' || ev.type == 'change'){
			var new_value = Number(this.valueText.value);
			new_value = Math.round(new_value * 1000) / 1000.0;
			new_value = Math.max(0.0, Math.min(1.0, new_value));
			this.slider_value = new_value;
			console.log("new value: " + new_value)
			current_prob_table[this.slider_index] = this.slider_value;
			complement_slider_idx = getComplementSliderIdx(this.slider_index);
			current_prob_table[complement_slider_idx] = 1.0 - this.slider_value;
			//console.log("idx: " + this.slider_index + " complement_idx: " + complement_slider_idx);
			computeProbs(current_prob_table);
			updateDrawSliderHandles();
		}
	}

	this.setSliderValue = function(value){
		this.slider_value = value;
		this.drawSliderHandle();
		//		this.valueText.innerHTML = value;
		value = Math.round(value * 1000) / 1000.0;
		this.valueText.value = value;
	}

	var super_updateSliderForMouseMove = this.updateSliderForMouseMove; //keep hold of the base class method
	
	//This is helpful.  See the answer by tarkabak Sept 26, 2012.
	//http://stackoverflow.com/questions/310870/use-of-prototype-vs-this-in-javascript
	this.updateSliderForMouseMove = function(ev){
		super_updateSliderForMouseMove.call(this, ev); 
		this.setSliderValue(this.getSliderValue());
	}


}

//is this different from below?
//TextSlider.prototype = new Slider();
//TextSlider.prototype.constructor = TextSlider;

TextSlider.prototype = Object.create(Slider.prototype);
TextSlider.prototype.constructor = TextSlider;





function mouseDownOnSliderElem(ev){
	var the_target = ev.target; //target could be a sliderElement, sliderTrack, or sliderHandle
	if(the_target.localName != 'input'){
			ev.preventDefault();        //needed for Firefox and IE11, not needed here for Chrome
	}
	var slider = the_target.slider;
	if(slider == undefined){
		slider = the_target.parentElement.slider;
		if(slider == undefined){
			console.log("slider undefined");
			return false;
		}
	}
	active_slider = slider;
	return false;
}




var active_slider = null;

function panelDivMouseMove(ev){
	ev.preventDefault();   //stop bubbling which causes objects on panel_div to be selected when the mouse is moved over them
	if(active_slider != null){
		active_slider.updateSliderForMouseMove(ev);
		return false;
	}
	else{
		return false;
	}
}

function panelDivMouseUp(ev){
	active_slider = null;
}

function panelDivMouseLeave(ev){
	active_slider = null;
}


function setCursor(cursor_type){
	document.body.style.cursor = cursor_type;
}



function addSlider(parent_element, id, x, y, slider_width, slider_length, min_value, max_value, callback){
	var slider = new Slider(id, x, y, slider_width, slider_length, min_value, max_value, callback);
	var slider_elem = slider.sliderElem;
	parent_element.appendChild(slider_elem);
	return slider;
}


function addTextSlider(parent_element, id, x, y, slider_width, slider_length, min_value, max_value, callback, title, slider_index, slider_color){
	var slider = new TextSlider(id, x, y, slider_width, slider_length, min_value, max_value, callback, title, slider_index, slider_color);
	var slider_elem = slider.sliderElem;
	parent_element.appendChild(slider_elem);
	return slider;
}


var panel_div_x;
var panel_div_y;



////////////////
//
//The Kavanaugh-Ford Testimony Bayes' Rule Calculation
//

var idx_fbg_given_kg = 0;     //prob F. believes K. guilty given K. really guilty
var idx_fbi_given_kg = 1;     //prob F. believes K. innocent given K. really guilty
var idx_fbg_given_ki = 2;     //prob F. believes K. guilty given K. really innocent
var idx_fbi_given_ki = 3;     //prob F. believes K. innocent given K. really innocent

var idx_kbg_given_kg = 4;     //prob F. believes K. guilty given K. really guilty
var idx_kbi_given_kg = 5;     //prob F. believes K. innocent given K. really guilty
var idx_kbg_given_ki = 6;     //prob F. believes K. guilty given K. really innocent
var idx_kbi_given_ki = 7;     //prob F. believes K. innocent given K. really innocent

var idx_ftc_given_fbg = 8;     //prob F. testifies calmly given F. believes K. guilty
var idx_fnt_given_fbg = 9;     //prob F. does not testify given F. believes K. guilty
var idx_ftc_given_fbi = 10;    //prob F. testifies calmly given F. believes K. innocent
var idx_fnt_given_fbi = 11;    //prob F. does not testify given F. believes K. innocent

var idx_kta_given_kbg = 12;    //prob K. testifies angrily given K. believes K. guilty
var idx_ktc_given_kbg = 13;    //prob K. testifies calmly given K. believes K. guilty
var idx_kta_given_kbi = 14;    //prob K. testifies angrily given K. believes K. innocent
var idx_ktc_given_kbi = 15;    //prob K. testifies calmly given K. believes K. innocent
var idx_kg = 16;               //prior prob K. guilty
var idx_ki = 17;               //prior prob K. innocent

var idx_fbg = 18;
var idx_fbi = 19;
var idx_kbg = 20;
var idx_kbi = 21;
var idx_ftc = 22;
var idx_ftc_given_kg = 23
var idx_ftc_given_ki = 24;
var idx_fnt = 25;
var idx_fnt_given_kg = 26
var idx_fnt_given_ki = 27;

var idx_kta = 28;
var idx_kta_given_kg = 29;
var idx_kta_given_ki = 30;

var idx_ktc 
var idx_ktc_given_kg = 31;
var idx_ktc_given_ki = 32;

var idx_kg_given_ftc = 33;
var idx_ki_given_ftc = 34;
var idx_kg_given_kta = 35;
var idx_ki_given_kta = 36;
var idx_kg_given_ktc = 37;
var idx_ki_given_ktc = 38;

var idx_ftc_and_kta_given_kg = 39;
var idx_ftc_and_kta_given_ki = 40;
var idx_ftc_and_ktc_given_kg = 41;
var idx_ftc_and_ktc_given_ki = 42;

var idx_ftc_and_kta = 43;
var idx_ftc_and_ktc = 44;
var idx_fnt_and_kta = 45;
var idx_fnt_and_ktc = 46;

var idx_kg_given_ftc_and_kta = 47;
var idx_ki_given_ftc_and_kta = 48;
var idx_kg_given_ftc_and_ktc = 49;
var idx_ki_given_ftc_and_ktc = 50;

var idx_ftc_and_kta_given_kg = 51;
var idx_ftc_and_ktc_given_kg = 52;
var idx_fnt_and_kta_given_kg = 53;
var idx_fnt_and_ktc_given_kg = 54;

var idx_ftc_and_kta_given_ki = 55;
var idx_ftc_and_ktc_given_ki = 56;
var idx_fnt_and_kta_given_ki = 57;
var idx_fnt_and_ktc_given_ki = 58;

var idx_kg_given_ftc_and_kta_vert = 59;


function getComplementSliderIdx(slider_idx){
	if (slider_idx % 2 == 0){
		return slider_idx + 1;
	}
	return slider_idx - 1;
}



//Compute all intermediate coditional and posterior probabilities for
//the prob_table passed.  The first 18 variables are free parameters read
//from the table.  The remaining 40 are computed and stuffed back into 
//the table.
function computeProbs(prob_table){
    p_fbg_given_kg = prob_table[idx_fbg_given_kg];
    p_fbi_given_kg = prob_table[idx_fbi_given_kg];
    p_fbg_given_ki = prob_table[idx_fbg_given_ki];
    p_fbi_given_ki = prob_table[idx_fbi_given_ki];
    p_kbg_given_kg = prob_table[idx_kbg_given_kg];
    p_kbi_given_kg = prob_table[idx_kbi_given_kg];
    p_kbg_given_ki = prob_table[idx_kbg_given_ki];
    p_kbi_given_ki = prob_table[idx_kbi_given_ki];
    p_ftc_given_fbg = prob_table[idx_ftc_given_fbg];
    p_fnt_given_fbg = prob_table[idx_fnt_given_fbg];
    p_ftc_given_fbi = prob_table[idx_ftc_given_fbi];
    p_fnt_given_fbi = prob_table[idx_fnt_given_fbi];
    p_kta_given_kbg = prob_table[idx_kta_given_kbg];
    p_ktc_given_kbg = prob_table[idx_ktc_given_kbg];
    p_kta_given_kbi = prob_table[idx_kta_given_kbi];
    p_ktc_given_kbi = prob_table[idx_ktc_given_kbi];
    p_kg = prob_table[idx_kg];
	//console.log("p_kg: " + p_kg)
    p_ki = prob_table[idx_ki];

    p_fbg = p_fbg_given_kg * p_kg + p_fbg_given_ki * p_ki
    p_fbi = p_fbi_given_kg * p_kg + p_fbi_given_ki * p_ki

    p_kbg = p_kbg_given_kg * p_kg + p_kbg_given_ki * p_ki
    p_kbi = p_kbi_given_kg * p_kg + p_kbi_given_ki * p_ki

    p_ftc = p_ftc_given_fbg * p_fbg + p_ftc_given_fbi * p_fbi
    p_ftc_given_kg = p_ftc_given_fbg * p_fbg_given_kg + p_ftc_given_fbi * p_fbi_given_kg
    p_ftc_given_ki = p_ftc_given_fbg * p_fbg_given_ki + p_ftc_given_fbi * p_fbi_given_ki

    p_fnt = p_fnt_given_fbg * p_fbg + p_fnt_given_fbi * p_fbi
    p_fnt_given_kg = p_fnt_given_fbg * p_fbg_given_kg + p_fnt_given_fbi * p_fbi_given_kg
    p_fnt_given_ki = p_fnt_given_fbg * p_fbg_given_ki + p_fnt_given_fbi * p_fbi_given_ki
    
    p_kta = p_kta_given_kbg * p_kbg + p_kta_given_kbi * p_kbi
    p_kta_given_kg = p_kta_given_kbg * p_kbg_given_kg + p_kta_given_kbi * p_kbi_given_kg
    p_kta_given_ki = p_kta_given_kbg * p_kbg_given_ki + p_kta_given_kbi * p_kbi_given_ki
    
    p_ktc = p_ktc_given_kbg * p_kbg + p_ktc_given_kbi * p_kbi
    p_ktc_given_kg = p_ktc_given_kbg * p_kbg_given_kg + p_ktc_given_kbi * p_kbi_given_kg
    p_ktc_given_ki = p_ktc_given_kbg * p_kbg_given_ki + p_ktc_given_kbi * p_kbi_given_ki

	p_ftc = Math.max(p_ftc, .0000001)
	p_kta = Math.max(p_kta, .0000001)
	p_ktc = Math.max(p_ktc, .0000001)
    p_kg_given_ftc = p_ftc_given_kg * p_kg / p_ftc
    p_ki_given_ftc = p_ftc_given_ki * p_ki / p_ftc
    p_kg_given_kta = p_kta_given_kg * p_kg / p_kta
    p_ki_given_kta = p_kta_given_ki * p_ki / p_kta
    p_kg_given_ktc = p_ktc_given_kg * p_kg / p_ktc
    p_ki_given_ktc = p_ktc_given_ki * p_ki / p_ktc

    p_ftc_and_kta_given_kg = p_ftc_given_kg * p_kta_given_kg
    p_ftc_and_kta_given_ki = p_ftc_given_ki * p_kta_given_ki
    p_ftc_and_ktc_given_kg = p_ftc_given_kg * p_ktc_given_kg
    p_ftc_and_ktc_given_ki = p_ftc_given_ki * p_ktc_given_ki

    p_ftc_and_kta = p_ftc_given_kg * p_kta_given_kg * p_kg + p_ftc_given_ki * p_kta_given_ki * p_ki
    p_ftc_and_ktc = p_ftc_given_kg * p_ktc_given_kg * p_kg + p_ftc_given_ki * p_ktc_given_ki * p_ki
    p_fnt_and_kta = p_fnt_given_kg * p_kta_given_kg * p_kg + p_fnt_given_ki * p_kta_given_ki * p_ki
    p_fnt_and_ktc = p_fnt_given_kg * p_ktc_given_kg * p_kg + p_fnt_given_ki * p_ktc_given_ki * p_ki

	p_ftc_and_kta = Math.max(p_ftc_and_kta, .0000001)
	p_ftc_and_ktc = Math.max(p_ftc_and_ktc, .0000001)
    p_kg_given_ftc_and_kta = p_ftc_and_kta_given_kg * p_kg / p_ftc_and_kta
    p_ki_given_ftc_and_kta = p_ftc_and_kta_given_ki * p_ki / p_ftc_and_kta
    p_kg_given_ftc_and_ktc = p_ftc_and_ktc_given_kg * p_kg / p_ftc_and_ktc
    p_ki_given_ftc_and_ktc = p_ftc_and_ktc_given_ki * p_ki / p_ftc_and_ktc

    p_ftc_and_kta_given_kg = p_ftc_given_kg * p_kta_given_kg
    p_ftc_and_ktc_given_kg = p_ftc_given_kg * p_ktc_given_kg
    p_fnt_and_kta_given_kg = p_fnt_given_kg * p_kta_given_kg
    p_fnt_and_ktc_given_kg = p_fnt_given_kg * p_ktc_given_kg

    p_ftc_and_kta_given_ki = p_ftc_given_ki * p_kta_given_ki
    p_ftc_and_ktc_given_ki = p_ftc_given_ki * p_ktc_given_ki
    p_fnt_and_kta_given_ki = p_fnt_given_ki * p_kta_given_ki
    p_fnt_and_ktc_given_ki = p_fnt_given_ki * p_ktc_given_ki

	prob_table[idx_fbg] = p_fbg;
	prob_table[idx_fbi] = p_fbi;
	prob_table[idx_kbg] = p_kbg;
	prob_table[idx_kbi] = p_kbi;
	prob_table[idx_ftc] = p_ftc;
	prob_table[idx_ftc_given_kg] = p_ftc_given_kg;
	prob_table[idx_ftc_given_ki] = p_ftc_given_ki;
	prob_table[idx_fnt] = p_fnt;
	prob_table[idx_fnt_given_kg] = p_fnt_given_kg;
	prob_table[idx_fnt_given_ki] = p_fnt_given_ki;

	prob_table[idx_kta] = p_kta;
	prob_table[idx_kta_given_kg] = p_kta_given_kg;
	prob_table[idx_kta_given_ki] = p_kta_given_ki;

	prob_table[idx_ktc] = p_ktc;
	prob_table[idx_ktc_given_kg] = p_ktc_given_kg;
	prob_table[idx_ktc_given_ki] = p_ktc_given_ki;

	prob_table[idx_kg_given_ftc] = p_kg_given_ftc;
	prob_table[idx_ki_given_ftc] = p_ki_given_ftc;
	prob_table[idx_kg_given_kta] = p_kg_given_kta;
	prob_table[idx_ki_given_kta] = p_ki_given_kta;
	prob_table[idx_kg_given_ktc] = p_kg_given_ktc;
	prob_table[idx_ki_given_ktc] = p_ki_given_ktc;

	prob_table[idx_ftc_and_kta_given_kg] = p_ftc_and_kta_given_kg;
	prob_table[idx_ftc_and_kta_given_ki] = p_ftc_and_kta_given_ki;
	prob_table[idx_ftc_and_ktc_given_kg] = p_ftc_and_ktc_given_kg;
	prob_table[idx_ftc_and_ktc_given_ki] = p_ftc_and_ktc_given_ki;

	prob_table[idx_ftc_and_kta] = p_ftc_and_kta;
	prob_table[idx_ftc_and_ktc] = p_ftc_and_ktc;
	prob_table[idx_fnt_and_kta] = p_fnt_and_kta;
	prob_table[idx_fnt_and_ktc] = p_fnt_and_ktc;

	prob_table[idx_kg_given_ftc_and_kta] = p_kg_given_ftc_and_kta;
	prob_table[idx_kg_given_ftc_and_kta_vert] = p_kg_given_ftc_and_kta;  //show vert slider as well
	prob_table[idx_ki_given_ftc_and_kta] = p_ki_given_ftc_and_kta;
	prob_table[idx_kg_given_ftc_and_ktc] = p_kg_given_ftc_and_ktc;
	prob_table[idx_ki_given_ftc_and_ktc] = p_ki_given_ftc_and_ktc;

	prob_table[idx_ftc_and_kta_given_kg] = p_ftc_and_kta_given_kg;
	prob_table[idx_ftc_and_ktc_given_kg] = p_ftc_and_ktc_given_kg;
	prob_table[idx_fnt_and_kta_given_kg] = p_fnt_and_kta_given_kg;
	prob_table[idx_fnt_and_ktc_given_kg] = p_fnt_and_ktc_given_kg;

	prob_table[idx_ftc_and_kta_given_ki] = p_ftc_and_kta_given_ki;
	prob_table[idx_ftc_and_ktc_given_ki] = p_ftc_and_ktc_given_ki;
	prob_table[idx_fnt_and_kta_given_ki] = p_fnt_and_kta_given_ki;
	prob_table[idx_fnt_and_ktc_given_ki] = p_fnt_and_ktc_given_ki;

	//console.log("prob kg_given_ftc_and_kta: " + p_kg_given_ftc_and_kta);
}
	

//Starting probs for various political viewpoints.

//Neutral
var prob_table_p5 = [0.5, 0.5, 0.5, 0.5, 
					 0.5, 0.5, 0.5, 0.5, 
					 0.5, 0.5, 0.5, 0.5, 
					 0.5, 0.5, 0.5, 0.5, 
					 0.5, 0.5];

var prob_table_red = [1.0, 0.0, 0.5, 0.5, 
					  0.5, 0.5, 0.0, 1.0,
					  0.5, 0.5, 0.5, 0.5, 
					  0.8, 0.2, 0.5, 0.5, 
					  .01, .99];

var prob_table_blue = [1.0, 0.0, 0.1, 0.9, 
					   0.8, 0.2, 0.0, 1.0,
					   0.5, 0.5, 0.01, 0.99, 
					   0.8, 0.2, 0.3, 0.7, 
					   .2, .8];

//Start off with everything neutral.
var current_prob_table = [.5, .5, .5, .5,
						  .5, .5, .5, .5,
						  .5, .5, .5, .5,
						  .5, .5, .5, .5,
						  .5, .5];


//free variables
var slider_fbg_given_kg;
var slider_fbi_given_kg;
var slider_fbg_given_ki;
var slider_fbi_given_ki;
var slider_kbg_given_kg;
var slider_kbi_given_kg;
var slider_kbg_given_ki;
var slider_kbi_given_ki;
var slider_ftc_given_fbg;
var slider_fnt_given_fbg;
var slider_ftc_given_fbi;
var slider_fnt_given_fbi;
var slider_kta_given_kbg;
var slider_ktc_given_kbg;
var slider_kta_given_kbi;
var slider_ktc_given_kbi;
var slider_kg;
var slider_ki;

//computed variables
var slider_kg_given_ftc
var slider_kg_given_kta
var slider_kg_given_ktc
var slider_kg_given_ftc_and_kta
var slider_kg_given_ftc_and_ktc


//This would all be more elegant and concise using function constructors,
//but I don't have time to figure that out so let's just keep it simple for now.
function slider_fbg_given_kg_Callback(slider_value){
	var idx = idx_fbg_given_kg;
	current_prob_table[idx_fbg_given_kg] = slider_value;
	current_prob_table[idx_fbi_given_kg] = 1.0 - slider_value;
	computeProbs(current_prob_table);
	updateDrawSliderHandles();
}

function slider_fbi_given_kg_Callback(slider_value){
	var idx = idx_fbi_given_kg;
	current_prob_table[idx_fbi_given_kg] = slider_value;
	current_prob_table[idx_fbg_given_kg] = 1.0 - slider_value;
	computeProbs(current_prob_table);
	updateDrawSliderHandles();
}

function slider_fbg_given_ki_Callback(slider_value){
	var idx = idx_fbg_given_ki;
	current_prob_table[idx_fbg_given_ki] = slider_value;
	current_prob_table[idx_fbi_given_ki] = 1.0 - slider_value;
	computeProbs(current_prob_table);
	updateDrawSliderHandles();
}

function slider_fbi_given_ki_Callback(slider_value){
	var idx = idx_fbi_given_ki;
	current_prob_table[idx_fbi_given_ki] = slider_value;
	current_prob_table[idx_fbg_given_ki] = 1.0 - slider_value;
	computeProbs(current_prob_table);
	updateDrawSliderHandles();
}

function slider_kbg_given_kg_Callback(slider_value){
	var idx = idx_kbg_given_kg;
	current_prob_table[idx_kbg_given_kg] = slider_value;
	current_prob_table[idx_kbi_given_kg] = 1.0 - slider_value;
	computeProbs(current_prob_table);
	updateDrawSliderHandles();
}

function slider_kbi_given_kg_Callback(slider_value){
	var idx = idx_kbi_given_kg;
	current_prob_table[idx_kbi_given_kg] = slider_value;
	current_prob_table[idx_kbg_given_kg] = 1.0 - slider_value;
	computeProbs(current_prob_table);
	updateDrawSliderHandles();
}

function slider_kbg_given_ki_Callback(slider_value){
	var idx = idx_kbg_given_ki;
	current_prob_table[idx_kbg_given_ki] = slider_value;
	current_prob_table[idx_kbi_given_ki] = 1.0 - slider_value;
	computeProbs(current_prob_table);
	updateDrawSliderHandles();
}

function slider_kbi_given_ki_Callback(slider_value){
	var idx = idx_kbi_given_ki;
	current_prob_table[idx_kbi_given_ki] = slider_value;
	current_prob_table[idx_kb0_given_ki] = 1.0 - slider_value;
	computeProbs(current_prob_table);
	updateDrawSliderHandles();
}

function slider_ftc_given_fbg_Callback(slider_value){
	var idx = idx_ftc_given_fbg;
	current_prob_table[idx_ftc_given_fbg] = slider_value;
	current_prob_table[idx_fnt_given_fbg] = 1.0 - slider_value;
	computeProbs(current_prob_table);
	updateDrawSliderHandles();
}

function slider_fnt_given_fbg_Callback(slider_value){
	var idx = idx_fnt_given_fbg;
	current_prob_table[idx_fnt_given_fbg] = slider_value;
	current_prob_table[idx_ftc_given_fbg] = 1.0 - slider_value;
	computeProbs(current_prob_table);
	updateDrawSliderHandles();
}

function slider_ftc_given_fbi_Callback(slider_value){
	var idx = idx_ftc_given_fbi;
	current_prob_table[idx_ftc_given_fbi] = slider_value;
	current_prob_table[idx_fnt_given_fbi] = 1.0 - slider_value;
	computeProbs(current_prob_table);
	updateDrawSliderHandles();
}

function slider_fnt_given_fbi_Callback(slider_value){
	var idx = idx_fnt_given_fbi;
	current_prob_table[idx_fnt_given_fbi] = slider_value;
	current_prob_table[idx_ftc_given_fbi] = 1.0 - slider_value;
	computeProbs(current_prob_table);
	updateDrawSliderHandles();
}

function slider_kta_given_kbg_Callback(slider_value){
	var idx = idx_kta_given_kbg;
	current_prob_table[idx_kta_given_kbg] = slider_value;
	current_prob_table[idx_ktc_given_kbg] = 1.0 - slider_value;
	computeProbs(current_prob_table);
	updateDrawSliderHandles();
}

function slider_ktc_given_kbg_Callback(slider_value){
	var idx = idx_ktc_given_kbg;
	current_prob_table[idx_ktc_given_kbg] = slider_value;
	current_prob_table[idx_kta_given_kbg] = 1.0 - slider_value;
	computeProbs(current_prob_table);
	updateDrawSliderHandles();
}

function slider_kta_given_kbi_Callback(slider_value){
	var idx = idx_kta_given_kbi;
	current_prob_table[idx_kta_given_kbi] = slider_value;
	current_prob_table[idx_ktc_given_kbi] = 1.0 - slider_value;
	computeProbs(current_prob_table);
	updateDrawSliderHandles();
}

function slider_ktc_given_kbi_Callback(slider_value){
	var idx = idx_ktc_given_kbi;
	current_prob_table[idx_ktc_given_kbi] = slider_value;
	current_prob_table[idx_kta_given_kbi] = 1.0 - slider_value;
	computeProbs(current_prob_table);
	updateDrawSliderHandles();
}

function slider_kg_Callback(slider_value){
	var idx = idx_kg;
	current_prob_table[idx_kg] = slider_value;
	current_prob_table[idx_ki] = 1.0 - slider_value;
	computeProbs(current_prob_table);
	updateDrawSliderHandles();
}

function slider_ki_Callback(slider_value){
	var idx = idx_ki;
	current_prob_table[idx_ki] = slider_value;
	current_prob_table[idx_kg] = 1.0 - slider_value;
	computeProbs(current_prob_table);
	updateDrawSliderHandles();
}


function updateDrawSliderHandles(){
	for(var idx = 0; idx < slider_array.length; idx++){
		var slider = slider_array[idx];
		if(slider != null){
			slider.setSliderValue(current_prob_table[idx]);
			slider.drawSliderHandle();
		}
	}
}



//
////////////////


////////////////
//
//The layout.  Ugh!
//


var slider_array = [];
var guide_overlay_div;


var slider_fbg_given_kg;
var slider_fbi_given_kg;
var slider_fbg_given_ki;
var slider_fbi_given_ki;

var slider_kbg_given_kg;
var slider_kbi_given_kg;
var slider_kbg_given_ki;
var slider_kbi_given_ki;

var slider_ftc_given_fbg;
var slider_fnt_given_fbg;
var slider_ftc_given_fbi;
var slider_fnt_given_fbi;

var slider_kta_given_kbg;
var slider_ktc_given_kbg;
var slider_kta_given_kbi;
var slider_ktc_given_kbi;

var slider_kg;
var slider_ki;


function createElementFromHTML(htmlString, x, y, color) {
	var div = document.createElement('div');
	div.style.position = "absolute";
	div.style.left = x;
	div.style.top = y;
	div.style.color = color;
	div.innerHTML = htmlString.trim();
	//return div.firstChild; 
	return div
}

function createHLineDiv(x, y, width, height, color){
	hline_div = document.createElement('div')
	hline_div.style.position = "absolute";
	hline_div.style.borderStyle = "solid";
	hline_div.style.borderWidth = "1px";
	hline_div.style.left = x;
	hline_div.style.top = y;
	hline_div.style.width = width;
	hline_div.style.height = height;
	hline_div.style.color = color;
	return hline_div;
}



function closeInfoPopup(event){
	console.log('closeInfoPopup: ' + event);
	info_div = event.target.parentElement;
	info_div.style.display = "none";
	//info_div.parentElement.removeChild(info_div);
}



function createQMElement(x, y, target_div_id){
	qm_element = document.createElement("img");
	qm_element.setAttribute("src", "./figs/qm-icon2.png");
	qm_element.style.position = "absolute";
	qm_element.style.left = x;
	qm_element.style.top = y;
	qm_element.style.width = 20;
	qm_element.style.height = 20;
	qm_element.addEventListener("mouseenter", function(){
		setCursor('pointer')
	});
	qm_element.addEventListener("mouseleave", function(){
		setCursor('default')
	});
	qm_element.target_div_id = target_div_id;

	qm_element.addEventListener("click", function(){
		console.log("qm click target_div_id: " + this.target_div_id)
		var info_div = document.getElementById(this.target_div_id)
		console.log('info_div: ' + info_div)
		var panel_div = document.getElementById('panel-div');
		info_div.style.left = this.style.left;
		info_div.style.top = this.style.top;
		info_div.style.display = "block";
		panel_div.appendChild(info_div);
	});

	return qm_element;
}




function setupPanelKB(){
	var panel_div = document.getElementById("panel-div");
	var panel_div_rect = panel_div.getBoundingClientRect();
	panel_div_x = panel_div_rect.left + window.pageXOffset;
	panel_div_y = panel_div_rect.top + window.pageYOffset;
	var panel_bg_fb = document.getElementById("panel-bg-fb");
	var panel_bg_ft = document.getElementById("panel-bg-ft");
	var panel_bg_prior = document.getElementById("panel-bg-prior");
	var slider_x = 90
	var text_x = 90
	var y_pos = 20
	var text_slider_delta_y = 60
	var delta_y1 = 40
	var delta_y2 = 20
	var delta_y3 = 30
	var slider_height = 20
	var slider_width = 600

	var red_button = document.createElement("button");
	red_button.textContent = "Red Assumptions";
	red_button.style.position = "absolute";
	red_button.style.left = "400px";
	red_button.style.top = "5px";
	red_button.style.width = "160px";
	red_button.style.height = "30px";
	red_button.style.backgroundColor = "pink";
	red_button.style.zIndex = "11";
	red_button.addEventListener("click", function(){
		current_prob_table = prob_table_red.slice();
		computeProbs(current_prob_table);
		updateDrawSliderHandles();
	});
	panel_div.appendChild(red_button);

	var red_button = document.createElement("button");
	red_button.textContent = "Blue Assumptions";
	red_button.style.position = "absolute";
	red_button.style.left = "580px";
	red_button.style.top = "5px";
	red_button.style.width = "160px";
	red_button.style.height = "30px";
	red_button.style.backgroundColor = "lightblue";
	red_button.style.zIndex = "11";
	red_button.addEventListener("click", function(){
		current_prob_table = prob_table_blue.slice();
		computeProbs(current_prob_table);
		updateDrawSliderHandles();
	});
	panel_div.appendChild(red_button);

	//prob F.'s belief given K. guilty
	text_div = createElementFromHTML("<b>Ford Belief State:</b><br>Assume Kavanaugh in fact <b>did</b> assault Ford.  What is the probability she <em>believes</em> it happened?", text_x, y_pos);
	panel_div.appendChild(text_div);
	y_pos += delta_y1;
	text_div = createElementFromHTML("She blocked it out of mind", text_x, y_pos, "gray");
	panel_div.appendChild(text_div);
	text_div = createElementFromHTML("She remembers it vividly", text_x + slider_width - 140, y_pos, "gray");
	panel_div.appendChild(text_div);
	y_pos += delta_y2;
	slider_fbg_given_kg = addTextSlider(panel_div, 'slider_fbg_given_kg', slider_x, y_pos, 
										slider_width, slider_height, 
										0, 1, slider_fbg_given_kg_Callback, "", idx_fbg_given_kg);
	slider_array[idx_fbg_given_kg] = slider_fbg_given_kg;
	text_div = createElementFromHTML("<em>p( FBG | KG )</em>", text_x + slider_width + 30, y_pos)
	panel_div.appendChild(text_div);

	//prob F.'s belief given K. innocent
	y_pos += delta_y3;
	text_div = createElementFromHTML("Assume Kavanaugh in fact <b>did not</b> assault Ford.  What is the probability she would otherwise <em>believe</em> he did?", text_x, y_pos);
	panel_div.appendChild(text_div);
	y_pos += delta_y2;
	text_div = createElementFromHTML("She would know that nothing happened", text_x, y_pos, "gray");
	panel_div.appendChild(text_div);
	text_div = createElementFromHTML("She would mistakenly believe that he assaulted her", text_x + slider_width - 280, y_pos, "gray");
	panel_div.appendChild(text_div);
	y_pos += delta_y2;
	slider_fbg_given_ki = addTextSlider(panel_div, 'slider_fbg_given_ki', slider_x, y_pos, 
										slider_width, slider_height, 
										0, 1, slider_fbg_given_ki_Callback, "", idx_fbg_given_ki);
	slider_array[idx_fbg_given_ki] = slider_fbg_given_ki;
	text_div = createElementFromHTML("<em>p( FBG | KI )</em>", text_x + slider_width + 30, y_pos)

	//prob K.'s belief given K. guilty
	y_pos += delta_y2;
	y_pos += delta_y2;
	panel_div.appendChild(text_div);
	panel_bg_fb.style.height = y_pos-10;
	text_div = createElementFromHTML("<b>Kavanaugh Belief State:</b><br>Assume Kavanaugh in fact <b>did</b> assault Ford.  What is the probability he <em>remembers</em> he did it?", text_x, y_pos);
	panel_div.appendChild(text_div);
	y_pos += delta_y1;
	text_div = createElementFromHTML("He believes he's innocent", text_x, y_pos, "gray");
	panel_div.appendChild(text_div);
	text_div = createElementFromHTML("He knows he did it", text_x + slider_width - 100, y_pos, "gray");
	panel_div.appendChild(text_div);
	y_pos += delta_y2;
	slider_kbg_given_kg = addTextSlider(panel_div, 'slider_kbg_given_kg', slider_x, y_pos, 
										slider_width, slider_height, 
										0, 1, slider_kbg_given_kg_Callback, "", idx_kbg_given_kg);
	slider_array[idx_kbg_given_kg] = slider_kbg_given_kg;
	text_div = createElementFromHTML("<em>p( KBG | KG )</em>", text_x + slider_width + 30, y_pos)
	panel_div.appendChild(text_div);

	//prob K.'s belief given K. innocent
	y_pos += delta_y3;
	text_div = createElementFromHTML("Assume Kavanaugh in fact <b>did not</b> assault Ford.  What is the probability he <em>believes</em> he did it?", text_x, y_pos);
	panel_div.appendChild(text_div);
	y_pos += delta_y2;
	text_div = createElementFromHTML("He knows he's innocent", text_x, y_pos, "gray");
	panel_div.appendChild(text_div);
	text_div = createElementFromHTML("He believes he did it", text_x + slider_width - 100, y_pos, "gray");
	panel_div.appendChild(text_div);
	y_pos += delta_y2;
	slider_kbg_given_ki = addTextSlider(panel_div, 'slider_kbg_given_ki', slider_x, y_pos, 
										slider_width, slider_height, 
										0, 1, slider_kbg_given_ki_Callback, "", idx_kbg_given_ki);
	slider_array[idx_kbg_given_ki] = slider_kbg_given_ki;
	text_div = createElementFromHTML("<em>p( KBG | KI )</em>", text_x + slider_width + 30, y_pos)
	panel_div.appendChild(text_div);

	//prob F. testifies given F. believes K. is guilty 
	y_pos += delta_y2;
	panel_bg_ft_top = y_pos + 15;
	panel_bg_ft.style.top = panel_bg_ft_top;
	y_pos += delta_y2;
	text_div = createElementFromHTML("<b>Ford Testimony:</b><br>Assume Ford <em>believes</em> Kavanaugh <b>did</b> assault her.  What is the probability her testimony would come forth?", text_x, y_pos);
	panel_div.appendChild(text_div);
	qm_element = createQMElement(text_x + 120, y_pos, 'fb-info');
	panel_div.appendChild(qm_element);
	y_pos += delta_y1;
	text_div = createElementFromHTML("No testimony.", text_x, y_pos, "gray");
	panel_div.appendChild(text_div);
	text_div = createElementFromHTML("Testimony.", text_x + slider_width - 60, y_pos, "gray");
	panel_div.appendChild(text_div);
	y_pos += delta_y2;
	slider_ftc_given_fbg = addTextSlider(panel_div, 'slider_ftc_given_fbg', slider_x, y_pos, 
										 slider_width, slider_height, 
										 0, 1, slider_ftc_given_fbg_Callback, "", idx_ftc_given_fbg);
	slider_array[idx_ftc_given_fbg] = slider_ftc_given_fbg;
	text_div = createElementFromHTML("<em>p( FTC | FBG )</em>", text_x + slider_width + 30, y_pos)
	panel_div.appendChild(text_div);

	//prob F. testifies given F. believes K. is innocent
	y_pos += delta_y3;
	text_div = createElementFromHTML("Assume Ford <em>believes</em> Kavanaugh <b>did not</b> assault her.  What is the probability her testimony would come forth?", text_x, y_pos);
	panel_div.appendChild(text_div);
	y_pos += delta_y2;
	text_div = createElementFromHTML("No testimony.", text_x, y_pos, "gray");
	panel_div.appendChild(text_div);
	text_div = createElementFromHTML("Testimony.", text_x + slider_width - 60, y_pos, "gray");
	panel_div.appendChild(text_div);
	y_pos += delta_y2;
	slider_ftc_given_fbi = addTextSlider(panel_div, 'slider_ftc_given_fbi', slider_x, y_pos, 
										 slider_width, slider_height, 
										 0, 1, slider_ftc_given_fbi_Callback, "", idx_ftc_given_fbi);
	slider_array[idx_ftc_given_fbi] = slider_ftc_given_fbi;
	text_div = createElementFromHTML("<em>p( FTC | FBI )</em>", text_x + slider_width + 30, y_pos)
	panel_div.appendChild(text_div);

	//prob K.'s testimony is angry given K. believes K. is guilty
	y_pos += delta_y2;

	height = y_pos - panel_bg_ft_top + 15
	console.log("height: " + height)
	panel_bg_ft.style.height = height

	y_pos += delta_y2;
	text_div = createElementFromHTML("<b>Kavanaugh Testimony:</b><br>Assume Kavanaugh <em>believes</em> he <b>did</b> assault Ford.  What is the probability his testimony would be angry?", text_x, y_pos);
	panel_div.appendChild(text_div);
	qm_element = createQMElement(text_x + 164, y_pos, 'kt-info');
	panel_div.appendChild(qm_element);
	y_pos += delta_y1;
	text_div = createElementFromHTML("Calm", text_x, y_pos, "gray");
	panel_div.appendChild(text_div);
	text_div = createElementFromHTML("Angry", text_x + slider_width - 40, y_pos, "gray");
	panel_div.appendChild(text_div);
	y_pos += delta_y2;
	slider_kta_given_kbg = addTextSlider(panel_div, 'slider_kta_given_kbg', slider_x, y_pos, 
										 slider_width, slider_height, 
										 0, 1, slider_kta_given_kbg_Callback, "", idx_kta_given_kbg);
	slider_array[idx_kta_given_kbg] = slider_kta_given_kbg;
	text_div = createElementFromHTML("<em>p( KTA | KBG )</em>", text_x + slider_width + 30, y_pos)
	panel_div.appendChild(text_div);

	//prob K.'s testimony is angry given K. believes K. is innocent
	y_pos += delta_y3;
	text_div = createElementFromHTML("Assume Kavanaugh <em>believes</em> he <b>did not</b> assault Ford.  What is the probability his testimony would be angry?", text_x, y_pos);
	panel_div.appendChild(text_div);
	y_pos += delta_y2;
	text_div = createElementFromHTML("Calm", text_x, y_pos, "gray");
	panel_div.appendChild(text_div);
	text_div = createElementFromHTML("Angry", text_x + slider_width - 40, y_pos, "gray");
	panel_div.appendChild(text_div);
	y_pos += delta_y2;
	slider_kta_given_kbi = addTextSlider(panel_div, 'slider_kta_given_kbi', slider_x, y_pos, 
										 slider_width, slider_height, 
										 0, 1, slider_kta_given_kbi_Callback, "", idx_kta_given_kbi);
	slider_array[idx_kta_given_kbi] = slider_kta_given_kbi;
	text_div = createElementFromHTML("<em>p( KTC | KBI )</em>", text_x + slider_width + 30, y_pos)
	panel_div.appendChild(text_div);


	//prior prob. K is guilty had not Ford's assertion come forward
	y_pos += delta_y2;
	panel_bg_prior_top = y_pos + 15;
	panel_bg_prior.style.top = panel_bg_prior_top;

	y_pos += delta_y2;
	text_div = createElementFromHTML("<b>Prior Probability of Assault:</b> <br>Assume Ford's testimony had not come forward. What is the probability Kavanaugh assaulted<br>someone as she describes?", text_x, y_pos);
	panel_div.appendChild(text_div);
	y_pos += delta_y2;
	y_pos += delta_y1;
	text_div = createElementFromHTML("No, this was not his behavior", text_x, y_pos, "gray");
	panel_div.appendChild(text_div);
	text_div = createElementFromHTML("Yes, he did this sort of thing", text_x + slider_width - 150, y_pos, "gray");
	panel_div.appendChild(text_div);
	y_pos += delta_y2;
	slider_kg = addTextSlider(panel_div, 'slider_kg', slider_x, y_pos, slider_width, slider_height, 
							  0, 1, slider_kg_Callback, "", idx_kg);
	slider_array[idx_kg] = slider_kg;
	text_div = createElementFromHTML("<em>p( KG )</em>", text_x + slider_width + 30, y_pos)
	panel_div.appendChild(text_div);

	y_pos += delta_y3
	y_pos += delta_y2

	panel_bg_prior.style.height = y_pos - panel_bg_prior_top;

	hline_div = createHLineDiv(0, y_pos, panel_div_rect.width, 1, "darkviolet");
	panel_div.appendChild(hline_div);

	//computed posterior prob K. is guilty given F. testimony alone
	y_pos += delta_y2;
	y_pos += delta_y2;
	text_div = createElementFromHTML("<b>All Posterior Probabilities:</b><br>Probability Kavanaugh assaulted Ford based on Ford's testimony alone.", text_x, y_pos);
	panel_div.appendChild(text_div);
	y_pos += delta_y1
	text_div = createElementFromHTML("He's innocent", text_x, y_pos, "gray");
	panel_div.appendChild(text_div);
	text_div = createElementFromHTML("He's guilty", text_x + slider_width - 50, y_pos, "gray");
	panel_div.appendChild(text_div);
	y_pos += delta_y2;
	slider_kg_given_ftc = addTextSlider(panel_div, 'slider_kg_given_ftc', slider_x, y_pos, 
										slider_width, slider_height, 
										0, 1, null, "", idx_kg_given_ftc, "darkviolet");
	slider_kg_given_ftc.setSliderIsPassiveP(true);
	//0, 1, slider_kg_given_ftc_Callback, "", 0);
	slider_array[idx_kg_given_ftc] = slider_kg_given_ftc;
	text_div = createElementFromHTML("<em>p( KG | FTC)</em>", text_x + slider_width + 30, y_pos)
	panel_div.appendChild(text_div);

	//computed posterior prob K. is guilty given K. angry testimony alone
	y_pos += delta_y2
	y_pos += delta_y2
	text_div = createElementFromHTML("<br>Probability Kavanaugh assaulted Ford based on Kavanaugh's testimony being angry in tone.", text_x, y_pos);
	panel_div.appendChild(text_div);
	y_pos += delta_y2
	y_pos += delta_y2
	text_div = createElementFromHTML("He's innocent", text_x, y_pos, "gray");
	panel_div.appendChild(text_div);
	text_div = createElementFromHTML("He's guilty", text_x + slider_width - 50, y_pos, "gray");
	panel_div.appendChild(text_div);
	y_pos += delta_y2;
	slider_kg_given_kta = addTextSlider(panel_div, 'slider_kg_given_kta', slider_x, y_pos, 
										slider_width, slider_height, 
										0, 1, null, "", idx_kg_given_kta, "darkviolet");
	slider_kg_given_kta.setSliderIsPassiveP(true);
	//0, 1, slider_kg_given_kta_Callback, "", 0);
	slider_array[idx_kg_given_kta] = slider_kg_given_kta;
	text_div = createElementFromHTML("<em>p( KG | KTA)</em>", text_x + slider_width + 30, y_pos)
	panel_div.appendChild(text_div);

	//computed posterior prob K. is guilty given K. calm testimony alone (counterfactual)
	y_pos += delta_y2
	y_pos += delta_y2
	text_div = createElementFromHTML("<br>Probability Kavanaugh assaulted Ford based on Kavanaugh's testimony had it been calm in tone.", text_x, y_pos);
	panel_div.appendChild(text_div);
	y_pos += delta_y2
	y_pos += delta_y2
	text_div = createElementFromHTML("He's innocent", text_x, y_pos, "gray");
	panel_div.appendChild(text_div);
	text_div = createElementFromHTML("He's guilty", text_x + slider_width - 50, y_pos, "gray");
	panel_div.appendChild(text_div);
	y_pos += delta_y2;
	slider_kg_given_ktc = addTextSlider(panel_div, 'slider_kg_given_ktc', slider_x, y_pos, 
										slider_width, slider_height, 
										0, 1, null, "", idx_kg_given_ktc, "darkviolet");
	slider_kg_given_ktc.setSliderIsPassiveP(true);
	//0, 1, slider_kg_given_ktc_Callback, "", 0);
	slider_array[idx_kg_given_ktc] = slider_kg_given_ktc;
	text_div = createElementFromHTML("<em>p( KG | KTC)</em>", text_x + slider_width + 30, y_pos)
	panel_div.appendChild(text_div);

	//computed posterior prob K. is guilty given F. testimony and K. angry testimony
	y_pos += delta_y2
	y_pos += delta_y2
	text_div = createElementFromHTML("<br>Probability Kavanaugh assaulted Ford based on both Ford's testimony and Kavanaugh's angry testimony.", text_x, y_pos);
	panel_div.appendChild(text_div);
	y_pos += delta_y2
	y_pos += delta_y2
	text_div = createElementFromHTML("He's innocent", text_x, y_pos, "gray");
	panel_div.appendChild(text_div);
	text_div = createElementFromHTML("He's guilty", text_x + slider_width - 50, y_pos, "gray");
	panel_div.appendChild(text_div);
	y_pos += delta_y2;
	slider_kg_given_ftc_and_kta = addTextSlider(panel_div, 'slider_kg_given_ftc_and_kta', 
												slider_x, y_pos, 
												slider_width, slider_height, 
												0, 1, null, "", idx_kg_given_ftc_and_kta, "darkviolet");
	slider_kg_given_ftc_and_kta.setSliderIsPassiveP(true);
	slider_array[idx_kg_given_ftc_and_kta] = slider_kg_given_ftc_and_kta;
	text_div = createElementFromHTML("<em>p( KG | FTC,KTA)</em>", text_x + slider_width + 30, y_pos)
	panel_div.appendChild(text_div);

	//computed posterior prob K. is guilty given F. testimony and K. calm testimony (counterfactual)
	y_pos += delta_y2
	y_pos += delta_y2
	text_div = createElementFromHTML("<br>Probability Kavanaugh assaulted Ford based on both Ford's testimony and Kavanaugh's had it been calm.", text_x, y_pos);
	panel_div.appendChild(text_div);
	y_pos += delta_y2
	y_pos += delta_y2
	text_div = createElementFromHTML("He's innocent", text_x, y_pos, "gray");
	panel_div.appendChild(text_div);
	text_div = createElementFromHTML("He's guilty", text_x + slider_width - 50, y_pos, "gray");
	panel_div.appendChild(text_div);
	y_pos += delta_y2;
	slider_kg_given_ftc_and_ktc = addTextSlider(panel_div, 'slider_kg_given_ftc_and_ktc', 
												slider_x, y_pos, 
												slider_width, slider_height, 
												0, 1, null, "", idx_kg_given_ftc_and_ktc, "darkviolet");
	slider_kg_given_ftc_and_ktc.setSliderIsPassiveP(true);
	slider_array[idx_kg_given_ftc_and_ktc] = slider_kg_given_ftc_and_ktc;
	text_div = createElementFromHTML("<em>p( KG | FTC,KTC)</em>", text_x + slider_width + 30, y_pos)
	panel_div.appendChild(text_div);

	panel_div.addEventListener("mousemove", panelDivMouseMove, false);
	panel_div.addEventListener("mouseup", panelDivMouseUp, false);
	panel_div.addEventListener("mouseleave", panelDivMouseLeave, false);

	//this is just not gonna work on a tablet
	//panel_div.addEventListener("touchmove", panelDivMouseMove, false);
	//panel_div.addEventListener("touchend", panelDivMouseUp, false);

	//current_prob_table = prob_table_red.slice();
	current_prob_table = prob_table_p5.slice();
	computeProbs(current_prob_table);
	updateDrawSliderHandles();

	//console.log("panel_div height: " + $(panel_div).height());

	//Additional slider on the right showing main posterior prob.
	y_pos += 60;
	panel_div.style.height = y_pos;
	//panel_div.style.height = "100%";
	//panel_div.style.height = "auto";
	//console.log("panel_div height: " + $(panel_div).height());

	var panel_div2 = document.getElementById("panel-div2");
	var panel_div_pos = $(panel_div).position();
	//var panel_div_rect = panel_div.getBoundingClientRect();
	//panel_div2.style.top = panel_div_rect.top;
	panel_div2.style.top = panel_div_pos.top;
	panel_div2.style.height = 600;

	text_x = 20;
	text_y = 0;
	text_div = createElementFromHTML("<br><b>Posterior Probability Kavanaugh assaulted Ford based on both Ford's testimony and Kavanaugh's<br> angry testimony.</b>", text_x, text_y);
	//text_div.style.position = "relative";
	panel_div2.appendChild(text_div);
	slider_kg_given_ftc_and_kta_vert = addTextSlider(panel_div2, 'slider_kg_given_ftc_and_kta_vert', 
													 100, 140,
													 slider_height, 400,
													 0, 1, null, "", idx_kg_given_ftc_and_kta_vert, "darkviolet");
	slider_kg_given_ftc_and_kta_vert.setSliderIsPassiveP(true);
	slider_array[idx_kg_given_ftc_and_kta_vert] = slider_kg_given_ftc_and_kta_vert;

	text_x = 140;
	y_pos = 130
	text_div = createElementFromHTML("Kavanaugh guilty", text_x, y_pos, "gray");
	panel_div2.appendChild(text_div);

	text_x = 140;
	y_pos = 530
	text_div = createElementFromHTML("Kavanaugh innocent", text_x, y_pos, "gray");
	panel_div2.appendChild(text_div);

	text_x = 70;
	y_pos = 564;
	text_div = createElementFromHTML("<em>p( KG | FTC,KTA)</em>", text_x, y_pos);
	panel_div2.appendChild(text_div);
}

//
//
//////////


setupPanelKB();


