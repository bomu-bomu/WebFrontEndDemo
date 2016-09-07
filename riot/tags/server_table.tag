<ServerTable>
  <table class='dataTable'>
    <tr>
      <th>Source</th>
      <th>Type</th>
      <th>Prefer</th>
      <th>Burst</th>
    </tr>
    <tr each={ demoList } class= { selected: select}>
      <td class="dataTable" onclick={parent.toggle_select}>{address}</td>
      <td class="dataTable" onclick="{parent.toggle_type}">{type}</td>
      <td class="dataTable"><input type="radio" name="prefer" checked={prefer}/></td>
      <td class="dataTable"><input type="checkbox" checked={burst}/></td>
    </tr>
  </table>
  <ControlButton></ControlButton>

  this.demoList = []
  this.demoList.push({address: '192.168.1.1', type: 'a1', prefer: false, burst: false, select: false})
  toggle_type(e) {
    var item = e.item
    item.type = (item.type == 'a1') ? 'a2' : 'a1'
  }
  toggle_select(e) {
    console.log(e.item)
    var item = e.item
    item.select = !item.select
  }
  add(e) {
    this.demoList.push(e)
    this.update()
  }

  delete(e) {
    var list = this.demoList
    var delete_list = list.filter(function(entry) {
                        return entry.select
                      })
    if (delete_list.length > 0) {
      this.demoList = list.filter(function(entry) {
                        return !entry.select
                      })
      this.update()
    } else {
      this.parent.showModal()
    }
  }

  this.on('unmount', function() {
    this.demoList = null
  })
</ServerTable>
