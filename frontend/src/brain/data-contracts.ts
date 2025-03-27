/** BackgroundRemovalResponse */
export interface BackgroundRemovalResponse {
  /** Image Id */
  image_id: string;
  /** Preview Url */
  preview_url: string;
}

/** Body_upload_image */
export interface BodyUploadImage {
  /**
   * File
   * @format binary
   */
  file: File;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** HealthResponse */
export interface HealthResponse {
  /** Status */
  status: string;
}

/** ImageProcessingResponse */
export interface ImageProcessingResponse {
  /** Processed Image Id */
  processed_image_id: string;
  /** Original Image Id */
  original_image_id: string;
  /** Preview Url */
  preview_url: string;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

export type CheckHealthData = HealthResponse;

export type UploadImageData = ImageProcessingResponse;

export type UploadImageError = HTTPValidationError;

export interface RemoveBackgroundEndpointParams {
  /** Image Id */
  imageId: string;
}

export type RemoveBackgroundEndpointData = BackgroundRemovalResponse;

export type RemoveBackgroundEndpointError = HTTPValidationError;
