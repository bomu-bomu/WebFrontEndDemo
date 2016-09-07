<Notification>
  <div id="noti" class="notification {type}" if={show} onclick={closeNoti}>
    {opts.text}
  </div>
  this.type = "info"
  this.show = false
  var noti = this 

  closeNoti() {
    if (noti.timeout) {
      clearTimeout(noti.timeout)
    }
    Velocity(noti.noti, 'transition.slideDownOut', {
      duration: 200,
      complete: function() {
        console.log("Finish Transition")
        // Move noti.show into this callback
        // Because then we use onclick the component will update
        // immediately as we set noti.show to false
        noti.show = false
        noti.update()
      }
    })
  }

  this.on('updated', function() {
    if (noti.show) {
      console.log("Set Noti Close")
      if (noti.timeout) {
        clearTimeout(noti.timeout)
      }
      noti.timeout = setTimeout(noti.closeNoti, 2000)
    }
  })
  
</Notification>
