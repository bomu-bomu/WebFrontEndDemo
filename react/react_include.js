var Header = React.createClass({
  render: function () {
    return (
      <div className='header'>
        <h1>Test Service</h1>
      </div>
    )
  }
})

var Sidebar = React.createClass({
  render: function () {
    return (
      <div className='sidebar'>
      <ReactRouter.Link to='/server'>Server</ReactRouter.Link>
      <br/>
      <ReactRouter.Link to='/test'>Test</ReactRouter.Link>
      </div>
    )
  }
})

var Footer = React.createClass({
  render: function () {
    return (
      <div className='footer'>CopyRight Demo</div>
    )
  }
})

var ListApp = React.createClass({
  getInitialState: function () {
    return {
      items: [
        {
          address: '192.168.1.1',
          type: 'a1',
          prefer: false,
          burst: false,
          select: false
        }
      ],
      modal: false,
      flashbar: {
        text: null,
        type: 'info'
      }
    }
  },

  onUpdate: function (val) {
    var items = this.state.items
    console.log(val)
    if (val.address.trim() !== '') {
      items.push(val)
      this.setState({items: items})
      this.refs.notification.openNoti('info', 'Add Source sucessfully')
    } else {
      this.refs.notification.openNoti('error', 'Empty source')
    }
  },

  onDelete: function () {
    var items = this.state.items
    var delete_list = items.filter(function (entry) {
      return entry.select
    })
    if (delete_list.length > 0) {
      items = items.filter(function (entry) {
        return !entry.select
      })
      this.setState({items: items})
    } else {
      this.openModal()
    }
  },

  onModify: function () {
    this.openModal()
  },

  toggleType: function (address) {
    var items = this.state.items
    items.forEach(function (x, y) {
      if (x.address === address) {
        x.type = (x.type === 'a1') ? 'a2' : 'a1'
      }
    })
    this.setState(items)
  },

  toggleSelect: function (address) {
    var items = this.state.items
    items.forEach(function (x, y) {
      if (x.address === address) {
        x.select = !x.select
      }
    })

    this.setState(items)
  },

  togglePrefer: function (address) {
    var items = this.state.items
    items.forEach(function (x, y) {
      if (x.address === address) {
        x.prefer = !x.prefer
      } else {
        x.prefer = false
      }
    })

    this.setState(items)
  },

  toggleBurst: function (address) {
    var items = this.state.items
    items.forEach(function (x, y) {
      if (x.address === address) {
        x.burst = !x.burst
      }
    })

    this.setState(items)
  },

  openModal: function () {
    this.refs.modal_dialog.openDialog()
  },

  render: function () {
    return (
      <span>
        <Header></Header>
        <Sidebar></Sidebar>
        <div className='content'>
          <br/>
          <ServerTable
            timesource={this.state.items}
            onTypeChange={this.toggleType}
            onSelect={this.toggleSelect}
            onDelete={this.onDelete}
            onModify={this.onModify}
            onPrefer={this.togglePrefer}
            onBurst={this.toggleBurst}
          />
          <hr/>
          <AddPanel onUpdate={this.onUpdate}/>
          <ModalScreen ref='modal_dialog'/>
          <Notification ref='notification'/>
        </div>
        <Footer/>
      </span>
    )
  }
})

var ServerTable = React.createClass({
  render: function () {
    return (
      <div>
      <table className='dataTable'>
        <thead>
        <tr>
          <th>Source</th>
          <th>Type</th>
          <th>Prefer</th>
          <th>Burst</th>
        </tr>
        </thead>
        <SourceEntry items={this.props.timesource} onSelect={this.props.onSelect} onType={this.props.onTypeChange} onPrefer={this.props.onPrefer} onBurst={this.props.onBurst}/>
      </table>
      <ControlButton onDelete={this.props.onDelete} onModal={this.props.onModal} onModify={this.props.onModify}/>
      </div>
    )
  }
})

var SourceEntry = React.createClass({
  toggleType: function (address, e) {
    this.props.onType(address)
  },
  toggleSelect: function (address, e) {
    this.props.onSelect(address)
  },
  clickPrefer: function (address, e) {
    this.props.onPrefer(address)
  },
  clickBurst: function (address, e) {
    this.props.onBurst(address)
  },
  createRow: function (item) {
    return (
      <tr key={item.address} className={item.select ? 'selected' : 'noselect'} >
        <td className='dataTable' onClick={this.toggleSelect.bind(this, item.address)}>{item.address}</td>
        <td className='dataTable' onClick={this.toggleType.bind(this, item.address)}>{item.type}</td>
        <td className='dataTable'><input type='checkbox' name='prefer' checked={item.prefer} onClick={this.clickPrefer.bind(this, item.address)}/></td>
        <td className='dataTable'><input type='checkbox' name='burst' checked={item.burst} onClick={this.clickBurst.bind(this, item.address)}/></td>
      </tr>
    )
  },
  render: function () {
    return (
      <tbody>
        {this.props.items.map(this.createRow)}
      </tbody>
    )
  }
})

var ControlButton = React.createClass({
  onDelete: function () {
    this.props.onDelete()
  },
  onModify: function () {
    this.props.onModify()
  },
  render: function () {
    return (
      <div>
        <input type='button' value='Delete' onClick={this.onDelete}/>
        <input type='button' value='Modify' onClick={this.onModify}/>
      </div>
    )
  }
})

var AddPanel = React.createClass({

  getInitialState: function () {
    return {
      address: '',
      type: 'server',
      prefer: false,
      burst: false
    }
  },

  onChange: function (item, e) {
    var nextState = {}
    nextState[item] = e.target.value
    this.setState(nextState)
  },

  onCheck: function (item, e) {
    var nextState = {}
    nextState[item] = e.target.checked
    this.setState(nextState)
  },

  update: function () {
    this.props.onUpdate({
      address: this.state.address,
      type: this.state.type,
      prefer: this.state.prefer,
      burst: this.state.burst
    })
    this.setState(this.getInitialState())
  },

  render: function () {
    var item = this.state
    return (
      <div>
        <fieldset>
          <legend>Add new source</legend>
          <input type='text' placeholder='Source' value={item.address} onChange={this.onChange.bind(this, 'address')}/>
          <br/>
          <input type='checkbox' checked={item.prefer} onClick={this.onCheck.bind(this, 'prefer')}/>Prefer
          <br/>
          <input type='checkbox' checked={item.burst} onClick={this.onCheck.bind(this, 'burst')}/>Burst
          <br/>
          <input type='button' value='Add' onClick={this.update}/>
        </fieldset>
      </div>
    )
  }
})

var ModalScreen = React.createClass({
  getInitialState: function () {
    return {
      show: false
    }
  },
  closeDialog: function (e) {
    this.setState({show: false})
  },
  openDialog: function (e) {
    this.setState({show: true})
  },
  render: function () {
    var dialog
    if (this.state.show) {
      dialog =
      <div className='modal_screen' onClick={this.closeDialog}>
        <ModalDialog onClose={this.closeDialog}/>
      </div>
    } else {
      dialog = <div></div>
    }
    return dialog
  }
})

var ModalDialog = React.createClass({
  stopPropagate: function (e) {
    e.stopPropagation()
  },
  render: function () {
    return (
      <div className='dialog' onClick={this.stopPropagate}>
        <span className='close' onClick={this.props.onClose}>X</span>
        <p>No data select</p>
      </div>
    )
  }
})

var Notification = React.createClass({
  getInitialState: function () {
    return {
      level: 'info',
      text: null,
      timeout: null
    }
  },
  closeNoti: function () {
    var current = this
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
    Velocity(this.refs.noti, 'transition.slideDownOut', {
      duration: 200,
      complete: function () {
        current.setState({text: null})
      }
    })
  },
  openNoti: function (level, text) {
    this.setState({
      level: level,
      text: text
    })
  },

  timeout: null,

  shouldComponentUpdate: function (nextP, nextS) {
    return nextS.text !== this.state.text
  },

  componentDidUpdate: function (props, state) {
    if (props.text !== '') {
      if (this.timeout) {
        clearTimeout(this.timeout)
        this.timeout = null
      }
      Velocity(this.refs.noti, 'transition.slideDownIn', {duration: 200})
      this.timeout = setTimeout(this.closeNoti, 2000)
    }
  },

  render: function () {
    var klass = 'notification '
    if (!this.state.text) {
      return null
    }

    if (this.state.level === 'info') {
      klass = klass + 'info'
    } else if (this.state.level === 'error') {
      klass = klass + 'error'
    }
    return (
      <div id='noti' className={klass} onClick={this.closeNoti} ref='noti'>
        {this.state.text}
      </div>
    )
  }
})

var TestApp = React.createClass({
  render: function () {
    return (
      <div>
        <Header></Header>
        <Sidebar></Sidebar>
        <div>Test</div>
      </div>
    )
  }
})

var hashHistory = ReactRouter.hashHistory
var App = React.createClass({
  render: function () {
    return (
      <ReactRouter.Router history={hashHistory}>
        <ReactRouter.Route path='/' component={ListApp} />
        <ReactRouter.Route path='/server' component={ListApp} />
        <ReactRouter.Route path='/test' component={TestApp} />
      </ReactRouter.Router>
    )
  }
})

ReactDOM.render(
  <App></App>,
  document.getElementById('example')
)
