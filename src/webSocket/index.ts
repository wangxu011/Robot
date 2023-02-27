export default class Socket {
  private ws: WebSocket | null
  private wsName: string
  private url: string
  private subscribeMap: object

  private connectCount: number // 尝试建立连接的次数
  
  constructor(url, name) {
    this.ws = null
    this.url = url
    this.wsName = name
    this.subscribeMap = {}
    this.connectCount = 0
    this.connect()
  }
  
  /**
   * 
   * @returns 连接WebSocket
   */
  connect() {
    this.connectCount ++
    if(!this.url) return console.error('ws url is required!')
    this.ws = new WebSocket(this.url)
    this.ws.onopen = this.onOpen
    this.ws.onmessage = this.onMessage
    this.ws.onclose = this.onClose
    this.ws.onerror = this.onError
  }

  /**
   * 关闭连接
   */
  close() {
    if(this.ws) {
      this.ws.close()
    }
  }

  /**
   * 订阅接收的消息
   * @param name | 订阅的方法名称
   * @param callback | 处理的回调函数
   */
  subscribe(name: string, callback: Function) {
    if(name in this.subscribeMap) {
      return
    }else {
      this.subscribeMap[name] = callback
    }
  }

  /**
   * 取消订阅
   * @param name 
   */
  unsubscribe(name: string) {
    if(name in this.subscribeMap) {
      delete this.subscribeMap[name]
    }
  }  

  /**
   * 向服务端发送消息
   * @param req 
   */
  send(req: object) {
    setTimeout(() => {
      if(this.isConnected()) {
        console.log('send msg: ', req)
        this.ws?.send(JSON.stringify(req))
      }else {
        this.send(req)
      }
    }, 300)
  }

  /**
   * 
   * @returns 判断当前的webSocket是否为链接状态
   */
  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN
  }

  onOpen = () => {
    console.log(`${this.wsName} connection opened ...`)
  }

  onMessage = (evt) => {
    if(this.wsName !== 'camera') {
      console.log(this.wsName + ' messge: ', evt)
    }
    this.handleCallBack(evt)
  }

  handleCallBack = (data) => {
    // 如果是摄像头回显，直接返回即可
    if(this.wsName === 'camera') {
      if('faceCapture' in this.subscribeMap)
        this.subscribeMap['faceCapture'](data)
    }else {
      // 摄像头业务逻辑处理
      // 返回数据体结构：{ 'Service': 'name', 'Body': { data }}
      const res = JSON.parse(data.data)
      if(res.Service in this.subscribeMap)
        this.subscribeMap[res.Service](res.Body)
    }
  }

  onClose = () => {
    console.log(`${this.wsName} connection closed ...`)
    this.ws = null
  }

  onError = (err) => {
    console.error(`${this.wsName} error: ${err}`)
    this.ws?.close()
    // 重连机制
    if(this.connectCount < 3) {
      console.log(`connect count: ${this.connectCount}, reconnecting...`)
      this.connect()
    }
  }
}