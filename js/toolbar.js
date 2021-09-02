const toolbar = {
	view:"toolbar",
	css:"webix_dark",
	height:45,
	cols:[
		{ view:"label", width:150, label:"Webix Time Tracker"},
		{},
		{ view:"label", width:190, label:webix.Date.dateToStr("%l %d %m %Y")(today_date) },
		{},
		{
			view:"toggle",
			width:130,
			offLabel:"Week Totals",
			onLabel:"Week Days",
			on:{
				onChange:toggleHandler
			}
		}
	]
};

function toggleHandler(value){
	const table = $$("table");
	const nav = $$("navigation");
	if(value){
		nav.hide();
		table.filter(); // unfilter datatable
		if(table.isColumnVisible("tracker"))
			table.hideColumn("tracker"); // hide column with buttons
	}else{
		nav.show(); // show column with buttons
		filterDatatable(); // filter the table by the date of active tab
	}
}
