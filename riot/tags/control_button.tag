<ControlButton>
  <div>
    <input type="button" value="Delete" onClick="{delete}"/>
    <input type="button" value="Modify" onClick="{modify}"/>
  </div>
  delete(e) {
    this.parent.delete(e)
  }

  modify(e) {
    console.log(this.parent)
    this.parent.parent.showModal()
  }
</ControlButton>
