// 図鑑（標本）データ。Specimen がこの配列を描画し，クリックで CodexModal が開く。

export type SpecimenKind = 'plant' | 'creature' | 'relic' | 'unknown';

export interface CatalogEntry {
  id: string;
  code: string; // 手帳の標本番号
  name: string; // 名称
  kind: SpecimenKind;
  layerIndex: number;
  classification: string; // 分類
  note: string; // 観察記
  color: string; // 発光色
  // 3D 配置
  p: number; // progress 上の位置（深さ）
  x: number;
  z: number;
  size: number;
}

export const CATALOG: CatalogEntry[] = [
  // 1. 光の森林層
  {
    id: 'lumibell',
    code: 'No.012',
    name: '灯靡（ともしなびき）',
    kind: 'plant',
    layerIndex: 1,
    classification: '発光地衣 / 群生',
    note: '触れると鈴のように微かに鳴る、と古い手記にある。光は呼吸のように明滅し、近づく者の脈に同調するという。可憐だが、夜通し見つめてはいけない。',
    color: '#a8f0c8',
    p: 0.16,
    x: -3.2,
    z: -2.0,
    size: 1.0,
  },
  {
    id: 'sporecap',
    code: 'No.018',
    name: '眠り胞子茸',
    kind: 'plant',
    layerIndex: 1,
    classification: '菌類 / 浮遊胞子',
    note: '傘から立ちのぼる胞子は甘い匂いを持つ。吸い込んだ探窟者は決まって「優しい誰か」に呼ばれた、と語る。誰も、その声の主を覚えていない。',
    color: '#d6ffe8',
    p: 0.24,
    x: 3.6,
    z: -1.0,
    size: 0.9,
  },

  // 2. 奇妙な生物の層
  {
    id: 'driftlamp',
    code: 'No.041',
    name: '漂灯虫（ひょうとうちゅう）',
    kind: 'creature',
    layerIndex: 2,
    classification: '浮遊生物 / 単独',
    note: '提灯のような体を持ち、ひとりでに微笑むように発光部が歪む。捕えようとすると、こちらの名を小声で呼ぶ。標本化は推奨されない。',
    color: '#c9b8ff',
    p: 0.37,
    x: 3.0,
    z: -2.6,
    size: 1.1,
  },
  {
    id: 'pearleye',
    code: 'No.047',
    name: '真珠のまなこ',
    kind: 'creature',
    layerIndex: 2,
    classification: '不明 / 群体',
    note: 'いくつもの白い球が連なって漂う。瞬きをしない。観察者が視線を外した瞬間にだけ、わずかに近づいているという報告が三件ある。',
    color: '#e7deff',
    p: 0.46,
    x: -3.8,
    z: -1.6,
    size: 1.0,
  },

  // 3. 古代遺跡層
  {
    id: 'lullglyph',
    code: 'No.063',
    name: '子守の碑文',
    kind: 'relic',
    layerIndex: 3,
    classification: '遺物 / 石碑',
    note: '童歌のような旋律が刻まれている。解読すると子守唄だが、最後の一節だけが欠けている。欠けた部分を口ずさめた者は、まだいない。',
    color: '#ffd49a',
    p: 0.58,
    x: -3.4,
    z: -2.2,
    size: 1.2,
  },
  {
    id: 'toyaltar',
    code: 'No.069',
    name: '玩具の祭壇',
    kind: 'relic',
    layerIndex: 3,
    classification: '遺物 / 構造物',
    note: '小さな木彫りの動物が整然と並ぶ。どれも此処にいない生き物の姿。配置は数百年変わらないのに、いつ来ても埃ひとつない。',
    color: '#ffe7c2',
    p: 0.66,
    x: 3.4,
    z: -1.4,
    size: 1.15,
  },

  // 4. 深層
  {
    id: 'hollowbloom',
    code: 'No.084',
    name: '虚（うろ）の花',
    kind: 'plant',
    layerIndex: 4,
    classification: '発光植物 / 単生',
    note: '花弁の内側に、覗いた者自身の幼い頃の声が反響する。摘んではならない。摘んだ手記の主は、その先のページを書いていない。',
    color: '#6fd6ff',
    p: 0.79,
    x: -3.0,
    z: -2.4,
    size: 1.0,
  },
  {
    id: 'stillwarden',
    code: 'No.090',
    name: '静かな番（つがい）',
    kind: 'creature',
    layerIndex: 4,
    classification: '大型 / 不動',
    note: '微動だにしない一対の発光体。生死は不明。間を通り抜けると、背後でゆっくりと向きを変える音がする。決して、振り返らないこと。',
    color: '#9fe6ff',
    p: 0.86,
    x: 3.2,
    z: -2.0,
    size: 1.3,
  },

  // 5. 名称不明領域
  {
    id: 'nameless',
    code: 'No.0??',
    name: '——',
    kind: 'unknown',
    layerIndex: 5,
    classification: '記録不能',
    note: 'これを書いている今も、名を思い出せない。可憐だったと思う。怖かったとも思う。手が、ひとりでに次の行を書こうとする。やめておく。',
    color: '#ff9ccb',
    p: 0.95,
    x: 0.0,
    z: -2.8,
    size: 1.4,
  },
];
