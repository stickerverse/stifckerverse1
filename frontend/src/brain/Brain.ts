import {
  BodyUploadImage,
  CheckHealthData,
  RemoveBackgroundEndpointData,
  RemoveBackgroundEndpointError,
  RemoveBackgroundEndpointParams,
  UploadImageData,
  UploadImageError,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Brain<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   *
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  check_health = (params: RequestParams = {}) =>
    this.request<CheckHealthData, any>({
      path: `/_healthz`,
      method: "GET",
      ...params,
    });

  /**
   * @description Upload an image for processing in the sticker designer.
   *
   * @tags dbtn/module:image_processor, dbtn/hasAuth
   * @name upload_image
   * @summary Upload Image
   * @request POST:/routes/upload
   */
  upload_image = (data: BodyUploadImage, params: RequestParams = {}) =>
    this.request<UploadImageData, UploadImageError>({
      path: `/routes/upload`,
      method: "POST",
      body: data,
      type: ContentType.FormData,
      ...params,
    });

  /**
   * @description Remove the background from a previously uploaded image.
   *
   * @tags dbtn/module:image_processor, dbtn/hasAuth
   * @name remove_background_endpoint
   * @summary Remove Background Endpoint
   * @request POST:/routes/remove-background/{image_id}
   */
  remove_background_endpoint = ({ imageId, ...query }: RemoveBackgroundEndpointParams, params: RequestParams = {}) =>
    this.request<RemoveBackgroundEndpointData, RemoveBackgroundEndpointError>({
      path: `/routes/remove-background/${imageId}`,
      method: "POST",
      ...params,
    });
}
