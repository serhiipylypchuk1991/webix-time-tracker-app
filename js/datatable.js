let tracker_state = 0;

const datatable = {
	view:"datatable",
	id:"table",
	footer:true,
	scheme:{
		$init:function(obj){
			obj.$interval = 0;
			obj.date = webix.i18n.dateFormatDate(obj.date);
		}
	},
	columns:[
		{ id:"task", header:"Task", fillspace:true, footer:{ text:"Total:" } },
		{ id:"project", header:"Project", width:170 },
		{ id:"department", header:"Department", width:170, template:"<span class='mdi mdi-tag'></span> #department#", cssFormat:markDepartment },
		{ id:"date", header:"Date", width:170, format:webix.Date.dateToStr("%D %d %m %Y") },
		{ id:"time", header:"Time", width:100, template:function(obj){ return timeToString(obj.time) }, cssFormat:markTime, footer:{ content:"totalTime" } },
		{ id:"tracker", header:"Tracker", width:70, template:togglePlayPauseButton }
	],
	onClick:{
		toggleplaypause:togglePlayPauseHandler
	},
	url:"./data/data.json",
	ready:function(){
		filterDatatable();
	}
};

// play/pause toggle button handler
function togglePlayPauseHandler(e, id){
	if(tracker_state == id.row){
		pauseTimer.call(this); // pause current timer if any
	}else{
		pauseTimer.call(this); // pause previous timer if any
		playTimer.call(this, id.row); // play new tracker
	}
	return false; // stop events propagation
}

// create play/pause toggle button
function togglePlayPauseButton(obj){
	return `<span class="webix_button webix_primary toggleplaypause webix_icon mdi ${obj.$isRunning ? "mdi-pause-circle" : "mdi-play-circle"} "></span>`;
}

// return time in string format
function timeToString(time){
	if(time){
		const diffInHrs = time / 3600000;
		const hh = Math.floor(diffInHrs);

		const diffInMin = (diffInHrs - hh) * 60;
		const mm = Math.floor(diffInMin);

		const diffInSec = (diffInMin - mm) * 60;
		const ss = Math.floor(diffInSec);

		const formattedHH = webix.Date.toFixed(hh);
		const formattedMM = webix.Date.toFixed(mm);
		const formattedSS = webix.Date.toFixed(ss);

		return `${formattedHH}:${formattedMM}:${formattedSS}`;
	}else{
		return "00:00:00";
	}
}

// play timer
function playTimer(row_id){
	const item = this.getItem(row_id);
	let time = item.time,
	interval = item.$interval;
	start = Date.now() - time;

	interval = setInterval( () => {
		time = Date.now() - start;
		this.updateItem(row_id, { time:time });
	}, 1000); // update 1 time per second

	this.updateItem(row_id, { $isRunning:true, $interval:interval });
	tracker_state = id.row; // redefine state
}

// pause timer
function pauseTimer(){
	if(tracker_state){
		const interval = this.getItem(tracker_state).$interval; // get timer id
		clearInterval(interval); // stop timer
		this.updateItem(tracker_state, { $isRunning:false }); // switch toggle button to play state
		tracker_state = 0; // reset state
	}
}

// mark departments
function markDepartment(value, obj){
	if(obj.department == "Development"){
		return { "color":"green" };
	}else if(obj.department == "QA"){
		return { "color":"orange" };
	}else{
		return { "color":"blue" };
	}
}

// mark active time
function markTime(value, obj){
	if(obj.$isRunning){
		return { "color":"red" };
	}else{
		return { "color":"black" };
	}
}

// create new filter to count the total time and transfer it into the string format
webix.ui.datafilter.totalTime = webix.extend({
	refresh:function(master, node, value){
		let result = 0;
		master.mapCells(null, value.columnId, null, 1, function(value){
			value = value*1;
			if(!isNaN(value))
			result+=value;
			return value;
		});
		node.innerHTML = timeToString(result);
	}
}, webix.ui.datafilter.summColumn);
