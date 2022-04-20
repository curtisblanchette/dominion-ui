import { IDashboardButton } from './dashboard.component';

const user = {
  get(roles: string | string[] | Array<string>) {
    if(typeof roles === 'string') {
      return this.data.filter((el: IDashboardButton) => el && el.roles && el.roles.includes(roles));
    }

    if(typeof roles === 'object') {
      return this.data.filter((el: IDashboardButton) => roles.filter(value => el && el.roles && el.roles.includes(value)))
    }
    return [];
  },
  data: [
    {
      'icon': 'fa-solid fa-down-long',
      'title': 'Inbound Call',
      'subtitle': 'Start intake for a caller on the line',
      'theme': 'orange',
      'roles': ['agent']
    }, {
      'icon': 'fa-solid fa-up-long',
      'title': 'Outbound Call',
      'subtitle': 'Follow up on existing opportunities.',
      'theme': 'purple',
      'roles': ['agent']
    },
    {
      'icon': 'fa-solid fa-file-lines',
      'title': 'Outcome Form',
      'subtitle': 'Fill an outcome form for a recent appointment',
      'theme': 'light',
      'roles': ['consultant']
    },
    {
      'icon': 'fa-solid fa-chart-pie',
      'title': 'Reports',
      'subtitle': 'Fill an outcome form for a recent appointment',
      'theme': 'light',
      'roles': ['consultant']
    },
    {
      'icon': 'fa-solid fa-chart-pie',
      'title': 'Reports',
      'subtitle': 'Fill an outcome form for a recent appointment',
      'theme': 'pitch',
      'roles': ['owner']
    }
  ]
}

const support = {
  get() { return this.data },
  data: [
    {
      'icon': 'fa-solid fa-lightbulb',
      'title': 'Consultant Courses',
      'subtitle': 'Learn something new, or brush up on your skills.',
      'theme': 'dark'
    },
    {
      'icon': 'fa-solid fa-bug',
      'title': 'Submit a Ticket',
      'subtitle': 'Found an issue? Submit a ticket or search for relevant answers.',
      'theme': 'dark'
    },
    {
      'icon': 'fa-solid fa-question',
      'title': 'Ask the Tribe',
      'subtitle': 'Discuss, share and learn from the 4iiz community.',
      'theme': 'dark'
    }
  ]
}

export const buttons = { user, support }
