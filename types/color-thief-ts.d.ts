declare module "color-thief-ts" {
  export default class ColorThief {
    getColorAsync(imageUrl: string): Promise<[number, number, number]>;
    getPaletteAsync(imageUrl: string, colorCount?: number): Promise<[number, number, number][]>;
  }
}
