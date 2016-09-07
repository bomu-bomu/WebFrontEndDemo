<demoapp>
  <h2>Manage Source</h2>
  <ServerTable>
  </ServerTable>
  <hr/>
  <AddPanel></AddPanel>
  <ModalScreen if={modal}></ModalScreen>
  <Notification text="{status}"></Notification>
  
  this.modal = false
  showModal() {
    console.log("Show Modal")
    this.modal = true
    this.update()
  }
  hideModal() {
    this.modal = false
    this.update()
  }

  showNotification(type, text) {
    var noti = this.tags.notification
    noti.type = type
    this.status = text
    noti.show = true
    noti.update()
    Velocity(noti.noti, 'transition.slideDownIn', {duration: 200})
  }
</demoapp>
