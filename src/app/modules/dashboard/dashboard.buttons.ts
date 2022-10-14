import { IDashboardButton } from './dashboard.component';

const user = {
  get(roles: string | string[] | Array<string>) {
    if(typeof roles === 'string') {
      return this.data.filter((el: IDashboardButton) => el && el.roles && el.roles.includes(roles));
    }

    if(typeof roles === 'object') {
      return this.data.filter((el: IDashboardButton) => el && el.roles && el.roles.some(r=> roles.includes(r)));
    }
    return [];
  },
  data: [
    {
      icon: 'fa-solid fa-down-long',
      title: 'Inbound Call',
      subtitle: 'Start intake for a caller on the line',
      theme: 'orange',
      emitter: 'inbound',
      route: '/flow',
      roles: ['system', 'admin', 'owner', 'agent']
    }, {
      icon: 'fa-solid fa-up-long',
      title: 'Outbound Call',
      subtitle: 'Follow up on existing opportunities.',
      theme: 'purple',
      emitter: 'outbound',
      route: '/flow',
      roles: ['system', 'admin', 'owner', 'agent']
    },
    {
      icon: 'fa-solid fa-chart-pie',
      title: 'Total Pipeline Report',
      subtitle: 'Pipeline report',
      theme: 'light',
      route: '/reports/total-pipeline',
      roles: ['system', 'admin', 'owner', 'consultant']
    },
    {
      icon: 'fa-solid fa-chart-pie',
      title: 'Team Report',
      subtitle: 'Monitor the health of your firm',
      theme: 'light',
      route: '/reports/team',
      roles: ['system', 'admin', 'owner', 'consultant']
    },
    {
      icon: 'fa-solid fa-file-lines',
      title: 'Outcome Forms',
      subtitle: 'Fill an outcome form for a recent appointment',
      theme: 'pitch',
      route: '/no-outcome/list',
      roles: ['system', 'admin', 'owner']
    }
  ]
}

const support = {
  get() { return this.data },
  data: [
    {
      icon: 'fa-solid fa-lightbulb',
      title: 'Consultant Courses',
      subtitle: 'Learn something new, or brush up on your skills.',
      theme: 'dark',
      route: '/flow'
    },
    {
      icon: 'fa-solid fa-bug',
      title: 'Submit a Ticket',
      subtitle: 'Found an issue? Submit a ticket or search for relevant answers.',
      theme: 'dark',
      route: '/flow'
    },
    {
      icon: 'fa-solid fa-question',
      title: 'Ask the Tribe',
      subtitle: 'Discuss, share and learn from the 4iiz community.',
      theme: 'dark',
      route: '/flow'
    }
  ]
}

export const buttons = { user, support }
