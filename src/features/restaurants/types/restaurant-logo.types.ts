export type UploadRestaurantLogoInput = {
  file: File;
};

export type UploadRestaurantLogoResult = {
  path: string;
  publicUrl: string;
};

export type DeleteRestaurantLogoInput = {
  publicUrl: string;
};
