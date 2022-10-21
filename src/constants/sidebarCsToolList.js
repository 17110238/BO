// List CS-TOOL SIDEBAR
export const ListCsToolSidebar = [
  {
    title: 'Customer Support',
    scope: [ 'bo.supportTicket.update', 'bo.supportTicket.dashboard'],
    showChildren: false,
    children: [
      // {
      //   title: 'Thêm ticket',
      //   path: '/cham-soc-khach-hang/them-ticket',
      //   urlActive: ['/'],
      //   icon: 'pm pm-transaction',
      //   scope: ['bo.supportTicket.create'],
      //   //scope : null
      // },
      {
        title: 'Ticket nội bộ',
        path: '/cham-soc-khach-hang',
        urlActive: ['/'],
        icon: 'icon-fa fas fa-comment-alt-lines',
        scope: ['bo.supportTicket.update'],
        //scope : null
      },
      {
        title: 'Ticket dashboard',
        path: '/cham-soc-khach-hang/ticket',
        urlActive: ['/'],
        icon: 'icon-fa fas fa-handshake fa-sm',
        scope: ['bo.supportTicket.dashboard'],
        //scope : null
      },
    ],
  },
];

export default ListCsToolSidebar;
