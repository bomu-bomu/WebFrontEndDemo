var Demo = {
  view: function (ctrl, args) {
    return [
      Header,
      Menu,
      DemoServerApp
    ]
  }
}

var DemoServerApp = {
  view: function (ctrl, args) {
    return m('div', [
      m('h2', 'Manage Source'),
      m(ServerTable),
      m('hr'),
      m(AddPanel),
      DemoServerApp.modal ? m(ModalScreen) : null,
      Notification.text ? Notification : null
    ])
  }
}

DemoServerApp.modal = null
DemoServerApp.status = null

DemoServerApp.TSource = function (data) {
  this.address = m.prop(data.address)
  this.type = m.prop(data.type)
  this.prefer = m.prop(data.prefer)
  this.burst = m.prop(data.burst)
  this.selected = m.prop(data.selected || false)
  this.toggle = function () {
    if (this.type() === 'a1') {
      this.type('a2')
    } else {
      this.type('a1')
    }
  }
}

DemoServerApp.TSourceList = Array

var server = new DemoServerApp.TSource({address: '192.168.1.1', type: 'a1', prefer: false, burst: false})
server.toggle()

var list = DemoServerApp.TSourceList()
list.push(server)

//  Server Table Component
var ServerTable = {
  controller: function () {
    var ctrl = this
    ctrl.add = function () {
    }
    ctrl.delete = function () {
      var delete_list = list.filter(function (entry) { return entry.selected() })
      if (delete_list.length > 0) {
        list = list.filter(function (entry) { return !entry.selected() })
      } else {
        DemoServerApp.modal = true
      }
    }
  },
  view: function (ctrl) {
    return m('table.dataTable', [
      m(TableHeader),
      m('tbody',
      list.map(function (task, index) {
        return m(ServerItem, task)
      })),
      m(ControlButton, {ondelete: ctrl.delete.bind(this)})
    ])
  }
}

var TableHeader = {
  view: function () {
    return m('tr', [
      m('th', 'Source'),
      m('th', 'Type'),
      m('th', 'Prefer'),
      m('th', 'Burst')
    ])
  }
}

// Server Item Component
var ServerItem = {
  model: function (args, extra) {
    this.selected = m.prop(false)
  },
  controller: function (data) {
    this.item = data
    return {
      is_select: this.item.selected,
      select: function () {
        this.item.selected(!this.item.selected())
      }.bind(this)
    }
  },
  view: function (ctrl, item) {
    var row_style = 'noselect'
    if (ctrl.is_select()) {
      row_style = 'selected'
    }
    return m('tr', {class: row_style}, [
      m('td.dataTable', {onclick: function () { ctrl.select() }}, [
        item.address()
      ]),
      m('td.dataTable', [
        m('div', { id: 'menu-button', onclick: function () { item.toggle() } }, item.type())
      ]),
      m('td.dataTable', [
        m('input[type=radio]', {onclick: m.withAttr('checked', item.prefer), checked: item.prefer(), name: 'prefer', value: item.address()})
      ]),
      m('td.dataTable', [
        m('input[type=checkbox]', {onclick: m.withAttr('checked', item.burst), checked: item.burst()})
      ])
    ])
  }
}

var ControlButton = {
  view: function (ctrl, args) {
    return m('div', [
      m('input[type=button]', {value: 'Delete', onclick: args.ondelete}),
      m('input[type=button]', {value: 'Modify', onclick: function () { DemoServerApp.modal = true }})
    ])
  }
}

var _element = new DemoServerApp.TSource({address: '', type: 'a1', prefer: false, burst: false})
var AddPanel = {
  model: function (name) {
    this.name = m.prop(name)
  },
  controller: function (data) {
    return {
      add: function () {
        if (_element.address() !== '') {
          list.push(_element)
          _element = new DemoServerApp.TSource({address: '', type: 'a1', prefer: false, burst: false})
          Notification.type = 'info'
          Notification.text = 'Add source successfully'
        } else {
          Notification.type = 'error'
          Notification.text = 'Please specify source.'
        }
      },
      element: new AddPanel.model('test')
    }
  },
  view: function (ctrl) {
    return m('div', m('fieldset', [
      m('legend', 'Add new source'),
      m('input[type=text]', {onkeyup: m.withAttr('value', _element.address), value: _element.address(), placeholder: 'Source'}),
      m('br'),
      m('input[type=checkbox]', {onclick: m.withAttr('checked', _element.prefer), checked: _element.prefer()}),
      'Prefer',
      m('br'),
      m('input[type=checkbox]', {onclick: m.withAttr('checked', _element.burst), checked: _element.burst()}),
      'Burst',
      m('br'),
      m('input[type=button]', {onclick: ctrl.add, value: 'Add'})
    ]))
  }
}

var ModalScreen = {
  controller: function () {
    return {
      close: function () {
        DemoServerApp.modal = null
      }
    }
  },
  view: function (ctrl, args) {
    return m('div.modal_screen', {
      onclick: function () {
        console.log('screen')
        ctrl.close()
      }
    },
    ModalDialog)
  }
}

var ModalDialog = {
  view: function (ctrl) {
    return m('.dialog', {onclick: function (e) { e.stopPropagation() }}, [
      m('span.close', {onclick: function (e) { DemoServerApp.modal = null; e.stopPropagation() }}, 'x'),
      m('p', 'no data select')
    ])
  }
}

var Notification = {
  controller: function (options) {
    this.entry = function (el, init, context) {
      if (!init) {
        Velocity(el, 'transition.slideDownIn', {duration: 200})
      }
    }
    this.exit = function (callback) {
      return function (el) {
        console.log(el.constructor.name)
        if (el.constructor.name === 'MouseEvent') {
          el = el.target
        }
        m.redraw.strategy('none')
        Velocity(el, 'transition.slideDownOut', {
          complete: function () {
            m.startComputation()
            callback()
            m.endComputation()
          }
        })
      }
    }
  },
  view: function (ctrl) {
    return Notification.text ? m('.notification ' + Notification.type, {
      config: function (element, i, c) {
        ctrl.entry(element, i, c)
        setTimeout(function () {
          ctrl.exit(function () {
            Notification.text = null
          }).bind(this)(element)
        }, 2000)
      },
      onclick: ctrl.exit(function () {
        Notification.text = null
      }).bind(this)
    }, Notification.text) : null
  }
}
Notification.text = null
Notification.type = 'info'

var Header = {
  view: function () {
    return m('div.header', m('h1', 'Test Service'))
  }
}

var Menu = {
  view: function () {
    return m('div.sidebar', [
      m("a[href='/server']", {config: m.route}, 'Server'),
      m('br'),
      m("a[href='/test']", {config: m.route}, 'Test')
    ])
  }
}

var Gps = {
  view: function () {
    return m('div', 'Test')
  }
}
var GPSApp = {
  view: function () {
    return [
      Header,
      Menu,
      Gps
    ]
  }
}
m.route.mode = 'hash'
m.route(document.body, '/server', {
  '/server': Demo,
  '/test': GPSApp
})
