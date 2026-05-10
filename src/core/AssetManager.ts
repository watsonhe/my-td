class AssetManagerImpl {
  private images = new Map<string, HTMLImageElement>();

  async loadImage(key: string, url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.images.set(key, img);
        resolve(img);
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  getImage(key: string): HTMLImageElement | undefined {
    return this.images.get(key);
  }
}

export const AssetManager = new AssetManagerImpl();
