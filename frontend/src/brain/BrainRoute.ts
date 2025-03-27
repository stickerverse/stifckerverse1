import { BodyUploadImage, CheckHealthData, RemoveBackgroundEndpointData, UploadImageData } from "./data-contracts";

export namespace Brain {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  export namespace check_health {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CheckHealthData;
  }

  /**
   * @description Upload an image for processing in the sticker designer.
   * @tags dbtn/module:image_processor, dbtn/hasAuth
   * @name upload_image
   * @summary Upload Image
   * @request POST:/routes/upload
   */
  export namespace upload_image {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = BodyUploadImage;
    export type RequestHeaders = {};
    export type ResponseBody = UploadImageData;
  }

  /**
   * @description Remove the background from a previously uploaded image.
   * @tags dbtn/module:image_processor, dbtn/hasAuth
   * @name remove_background_endpoint
   * @summary Remove Background Endpoint
   * @request POST:/routes/remove-background/{image_id}
   */
  export namespace remove_background_endpoint {
    export type RequestParams = {
      /** Image Id */
      imageId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = RemoveBackgroundEndpointData;
  }
}
