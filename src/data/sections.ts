export interface SectionLink {
  id: string;
  num: string;
  label: string;
}

export const sections: SectionLink[] = [
  { id: "features", num: "01", label: "特性" },
  { id: "install", num: "02", label: "安装" },
  { id: "adapters", num: "03", label: "适配器" },
  { id: "usage", num: "04", label: "用法" },
  { id: "parsing", num: "05", label: "解析" },
  { id: "defaults", num: "06", label: "默认值" },
  { id: "options", num: "07", label: "选项" },
  { id: "multi", num: "08", label: "多键查询" },
  { id: "server", num: "09", label: "服务端" },
  { id: "testing", num: "10", label: "测试" },
  { id: "debug", num: "11", label: "调试" },
];
