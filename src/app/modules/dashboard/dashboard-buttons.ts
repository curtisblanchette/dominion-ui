const userButtons = [
	{
		'icon' : 'fa-solid fa-down-long',
		'title' : 'Inbound Call',
		'subtitle' : 'Start intake for a caller on the line',
		'theme' : 'orange',
		'role' : ['agent']
	},
	{
		'icon' : 'fa-solid fa-up-long',
		'title' : 'Outbound Call',
		'subtitle' : 'Follow up on existing opportunities.',
		'theme' : 'purple',
		'role' : ['agent']
	},
	{
		'icon' : 'fa-solid fa-file-lines',
		'title' : 'Outcome Form',
		'subtitle' : 'Fill an outcome form for a recent appointment',
		'theme' : 'light',
		'role' : ['consultant']
	},
	{
		'icon' : 'fa-solid fa-chart-pie',
		'title' : 'Reports',
		'subtitle' : 'Fill an outcome form for a recent appointment',
		'theme' : 'light',
		'role' : ['consultant']
	},
	{
		'icon' : 'fa-solid fa-chart-pie',
		'title' : 'Reports',
		'subtitle' : 'Fill an outcome form for a recent appointment',
		'theme' : 'pitch',
		'role' : ['owner']
	}
];

const supportButtons =  [
	{
		'icon' : 'fa-solid fa-lightbulb',
		'title' : 'Consultant Courses',
		'subtitle' : 'Learn something new, or brush up on your skills.',
		'theme' : 'dark',
	},
	{
		'icon' : 'fa-solid fa-bug',
		'title' : 'Submit a Ticket',
		'subtitle' : 'Found an issue? Submit a ticket or search for relevant answers.',
		'theme' : 'dark',
	},
	{
		'icon' : 'fa-solid fa-question',
		'title' : 'Ask the Tribe',
		'subtitle' : 'Discuss, share and learn from the 4iiz community.',
		'theme' : 'dark',
	}
];

export function getButtonsForRole( roles:string | Array<string> ){
	let menu:Array<object> = [];
	userButtons.forEach( elm => {
		if( typeof roles == 'string' ){
			if( elm.role.includes(roles) ){
				menu.push(elm);
			}
		} else {
			const hasRole = roles.filter(value => elm.role.includes(value));
			if( hasRole.length ){
				menu.push(elm);
			}
		}
	});
	return menu;
}

export function getSupportButtons(){
	return supportButtons;
}