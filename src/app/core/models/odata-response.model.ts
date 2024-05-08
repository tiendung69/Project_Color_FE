import {
  JsonObject,
  JsonProperty,
  Any,
  ValueCheckingMode,
} from 'json2typescript';

@JsonObject('ODataResponse')
export class ODataResponse {
  @JsonProperty('@odata.context', String, true)
  context: String = undefined as any;

  @JsonProperty('@odata.etag', String, true)
  etag: String = undefined as any;

  @JsonProperty('@odata.nextLink', String, true)
  nextLink: String = undefined as any;

  @JsonProperty('@odata.count', Number, true)
  count: number = undefined as any;

  @JsonProperty('value', Any, true)
  value: any = undefined;
}
