type HZ = {
  mapHost: string,
  apiHost: string,
  orgaFlag: string,
  orgaKey: string
}

type Leaflet = {
  mapWidth: number,
  mapHeight: number,
  originX: number,
  originY: number,
  resolution: number,
  mapPath: string
}

type WS = {
  camera: string,
  cameraBiz: string
}

type Config = {
  leaflet: Leaflet,
  rtMap: Object,
  hz: HZ,
  ws: WS
  returnHomeTimeout: number,
  fidsIP: string
}

declare const config: Config

interface Window {
  cefQuery: any,    // 使用原生cef与客户端通信时，依托的对象
  cefMethods: any,  // 将所有JS提供给C++调用的方法全部挂载到此对象上
}