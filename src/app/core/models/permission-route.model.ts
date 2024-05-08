import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject('PermissionRouteModel')
export class PermissionRouteModel {
  @JsonProperty('Key', String, true)
  Key: String = undefined as any;

  @JsonProperty('Name', String, true)
  Name: String = undefined as any;

  @JsonProperty('ParentKey', String, true)
  ParentKey: String = undefined as any;
}
