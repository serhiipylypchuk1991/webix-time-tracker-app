const day_num = today_date.getDay(); // get the day index of today date
const week_start = webix.Date.weekStart(today_date); // get the week start date
const options = webix.i18n.calendar.dayFull.map((day, i) => {
	return {
		id: i,
		value: day,
		icon: i == day_num ? "mdi mdi-calendar-today" :"",
		date: webix.Date.add(week_start, i, "day", true)
	}
});

const tabbar = {
	view:"tabbar",
	id:"tabbar",
	borderless:true,
	height:45,
	value:day_num,
	options:options,
	on:{
		onChange:filterDatatable
	}
};

const subbar = {
	id:"navigation",
	cols:[
		{ view:"icon", icon:"wxi-angle-left", width:45, tooltip:"Previous week" },
		tabbar,
		{ view:"icon", icon:"wxi-angle-right", width:45, tooltip:"Next week" }
	]
};

// filter the datatable content by date
function filterDatatable(){
	const tabbar = $$("tabbar");

	const value = tabbar.getValue(); // get active tab id
	const current_date = tabbar.getOption(value).date;  // get active tab date

	const table = $$("table");
	const isVisible = table.isColumnVisible("tracker"); // get column visibility

	if(webix.Date.equal(today_date, current_date)){
		if(!isVisible)
			table.showColumn("tracker"); //show column
	}else if (isVisible)
		table.hideColumn("tracker"); // hide column

	table.filter(function(obj){
		return webix.Date.equal(obj.date, current_date); // filter the table by the date of active tab
	});
}
