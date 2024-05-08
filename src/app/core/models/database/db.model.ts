type TBroadcasting = Broadcasting;
type TBroadcastingdocument = Broadcastingdocument;
type TEstimate = Estimate;
type TVCommoncategory = VCommoncategory;
type TCommoncategory = Commoncategory;
type TAudit = Audit;
type TApproved = Approved;
type TMappingfield = Mappingfield;
type TMappingtable = Mappingtable;
type TMovieapproval = Movieapproval;
type TMovieapprovalDetail = MovieapprovalDetail;
type TPostproductionPlaning = PostproductionPlaning;
type TPostproductionProgress = PostproductionProgress;
type TPostproductionprogressMember = PostproductionprogressMember;
type TPreproductionExpense = PreproductionExpense;
type TPreproductionMember = PreproductionMember;
type TPreproductionPlaning = PreproductionPlaning;
type TPreproductionProgress = PreproductionProgress;
type TPreproductionprogressMember = PreproductionprogressMember;
type TPreproductionSegment = PreproductionSegment;
type TPreproductionsegmentMember = PreproductionsegmentMember;
type TTeam = Team;
type TTeamMember = TeamMember;
type TTopic = Topic;
type TTopicDocument = TopicDocument;
type TTopicMember = TopicMember;
type TUser = User;
type TUserRight = UserRight;
type TVideo = Video;
type TUserRole = UserRole;
type TRoleRight = RoleRight;
type TElasticField = ElasticField;
type TUploadPart = UploadPart;
type TReportCost = ReportCost;
type TReportProgress = ReportProgress;
type TVreportSegment = VreportSegment;
type TNotify = Notify;
type TVideoCompress = VideoCompress;
type TConfig = Config;
type TLog = Log;
type TDocument = Document;
type TDocumentFile = DocumentFile;
import { JsonObject, JsonProperty, JsonConverter, JsonConvert, JsonCustomConvert } from 'json2typescript';

@JsonConverter
export class NumberConverter implements JsonCustomConvert<number> {
    serialize(data: any): number {
        if (Number.isNaN(data)) {
            return data;
        } else {
            return Number(data);
        }
    }
    deserialize(data: any): number {
        if (typeof data === 'undefined' || data === null) {
            return data;
        }
        if (Number.isNaN(data)) {
            return data;
        } else {
            return Number(data);
        }
    }
}
@JsonConverter
export class StringConverter implements JsonCustomConvert<string> {
    serialize(data: any): string {
        if (data) {
            return data.toString();
        } else {
            return data;
        }
    }
    deserialize(data: any): string {
        if (data) {
            return data.toString();
        } else {
            return data;
        }
    }
}
@JsonConverter
export class BooleanConverter implements JsonCustomConvert<boolean> {
    serialize(data: any): boolean {
        if (typeof (data) === 'boolean') {
            return data;
        } else {
            return data;
        }
    }
    deserialize(data: any): boolean {
        if (typeof (data) === 'boolean') {
            return data;
        } else {
            return data;
        }
    }
}
@JsonConverter
export class DateTimeConverter implements JsonCustomConvert<Date> {
    serialize(date: Date): any {
        function pad(number: any) {
            if (number < 10) {
                return '0' + number;
            }
            return number;
        }
        return date.getFullYear() +
            '-' + pad(date.getMonth() + 1) +
            '-' + pad(date.getDate()) +
            'T' + pad(date.getHours()) +
            ':' + pad(date.getMinutes()) +
            ':' + pad(date.getSeconds()) +
            '.' + (date.getMilliseconds() / 1000).toFixed(3).slice(2, 5) +
            'Z';
    }
    deserialize(date: any): Date {
        const dReturn = new Date(date);
        if (dReturn.getFullYear() === 1970
            && dReturn.getMonth() === 0
            && dReturn.getDate() === 1) {
            return null as any;
        } else {
            return dReturn;
        }
    }
}
@JsonConverter
export class CommoncategoryConverter implements JsonCustomConvert<Commoncategory> {
    serialize(data: Commoncategory): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serialize(data);
    }
    deserialize(data: any): Commoncategory {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeObject(data, Commoncategory);
    }
}
@JsonConverter
export class PostproductionPlaningConverter implements JsonCustomConvert<PostproductionPlaning> {
    serialize(data: PostproductionPlaning): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serialize(data);
    }
    deserialize(data: any): PostproductionPlaning {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeObject(data, PostproductionPlaning);
    }
}
@JsonConverter
export class BroadcastingdocumentArrayConverter implements JsonCustomConvert<Broadcastingdocument[]> {
    serialize(data: Broadcastingdocument[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): Broadcastingdocument[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, Broadcastingdocument);
    }
}
@JsonConverter
export class BroadcastingConverter implements JsonCustomConvert<Broadcasting> {
    serialize(data: Broadcasting): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serialize(data);
    }
    deserialize(data: any): Broadcasting {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeObject(data, Broadcasting);
    }
}
@JsonConverter
export class UploadPartConverter implements JsonCustomConvert<UploadPart> {
    serialize(data: UploadPart): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serialize(data);
    }
    deserialize(data: any): UploadPart {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeObject(data, UploadPart);
    }
}
@JsonConverter
export class UserConverter implements JsonCustomConvert<User> {
    serialize(data: User): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serialize(data);
    }
    deserialize(data: any): User {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeObject(data, User);
    }
}
@JsonConverter
export class PreproductionPlaningConverter implements JsonCustomConvert<PreproductionPlaning> {
    serialize(data: PreproductionPlaning): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serialize(data);
    }
    deserialize(data: any): PreproductionPlaning {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeObject(data, PreproductionPlaning);
    }
}
@JsonConverter
export class BroadcastingArrayConverter implements JsonCustomConvert<Broadcasting[]> {
    serialize(data: Broadcasting[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): Broadcasting[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, Broadcasting);
    }
}
@JsonConverter
export class DocumentArrayConverter implements JsonCustomConvert<Document[]> {
    serialize(data: Document[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): Document[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, Document);
    }
}
@JsonConverter
export class PostproductionProgressArrayConverter implements JsonCustomConvert<PostproductionProgress[]> {
    serialize(data: PostproductionProgress[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): PostproductionProgress[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, PostproductionProgress);
    }
}
@JsonConverter
export class PreproductionPlaningArrayConverter implements JsonCustomConvert<PreproductionPlaning[]> {
    serialize(data: PreproductionPlaning[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): PreproductionPlaning[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, PreproductionPlaning);
    }
}
@JsonConverter
export class PreproductionProgressArrayConverter implements JsonCustomConvert<PreproductionProgress[]> {
    serialize(data: PreproductionProgress[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): PreproductionProgress[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, PreproductionProgress);
    }
}
@JsonConverter
export class PreproductionSegmentArrayConverter implements JsonCustomConvert<PreproductionSegment[]> {
    serialize(data: PreproductionSegment[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): PreproductionSegment[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, PreproductionSegment);
    }
}
@JsonConverter
export class RoleRightArrayConverter implements JsonCustomConvert<RoleRight[]> {
    serialize(data: RoleRight[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): RoleRight[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, RoleRight);
    }
}
@JsonConverter
export class TopicArrayConverter implements JsonCustomConvert<Topic[]> {
    serialize(data: Topic[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): Topic[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, Topic);
    }
}
@JsonConverter
export class UserRightArrayConverter implements JsonCustomConvert<UserRight[]> {
    serialize(data: UserRight[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): UserRight[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, UserRight);
    }
}
@JsonConverter
export class UserRoleArrayConverter implements JsonCustomConvert<UserRole[]> {
    serialize(data: UserRole[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): UserRole[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, UserRole);
    }
}
@JsonConverter
export class UserArrayConverter implements JsonCustomConvert<User[]> {
    serialize(data: User[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): User[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, User);
    }
}
@JsonConverter
export class MovieapprovalDetailArrayConverter implements JsonCustomConvert<MovieapprovalDetail[]> {
    serialize(data: MovieapprovalDetail[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): MovieapprovalDetail[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, MovieapprovalDetail);
    }
}
@JsonConverter
export class MovieapprovalConverter implements JsonCustomConvert<Movieapproval> {
    serialize(data: Movieapproval): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serialize(data);
    }
    deserialize(data: any): Movieapproval {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeObject(data, Movieapproval);
    }
}
@JsonConverter
export class MovieapprovalArrayConverter implements JsonCustomConvert<Movieapproval[]> {
    serialize(data: Movieapproval[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): Movieapproval[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, Movieapproval);
    }
}
@JsonConverter
export class PostproductionprogressMemberArrayConverter implements JsonCustomConvert<PostproductionprogressMember[]> {
    serialize(data: PostproductionprogressMember[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): PostproductionprogressMember[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, PostproductionprogressMember);
    }
}
@JsonConverter
export class PostproductionProgressConverter implements JsonCustomConvert<PostproductionProgress> {
    serialize(data: PostproductionProgress): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serialize(data);
    }
    deserialize(data: any): PostproductionProgress {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeObject(data, PostproductionProgress);
    }
}
@JsonConverter
export class PreproductionSegmentConverter implements JsonCustomConvert<PreproductionSegment> {
    serialize(data: PreproductionSegment): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serialize(data);
    }
    deserialize(data: any): PreproductionSegment {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeObject(data, PreproductionSegment);
    }
}
@JsonConverter
export class TeamConverter implements JsonCustomConvert<Team> {
    serialize(data: Team): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serialize(data);
    }
    deserialize(data: any): Team {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeObject(data, Team);
    }
}
@JsonConverter
export class TopicConverter implements JsonCustomConvert<Topic> {
    serialize(data: Topic): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serialize(data);
    }
    deserialize(data: any): Topic {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeObject(data, Topic);
    }
}
@JsonConverter
export class EstimateArrayConverter implements JsonCustomConvert<Estimate[]> {
    serialize(data: Estimate[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): Estimate[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, Estimate);
    }
}
@JsonConverter
export class PostproductionPlaningArrayConverter implements JsonCustomConvert<PostproductionPlaning[]> {
    serialize(data: PostproductionPlaning[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): PostproductionPlaning[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, PostproductionPlaning);
    }
}
@JsonConverter
export class PreproductionExpenseArrayConverter implements JsonCustomConvert<PreproductionExpense[]> {
    serialize(data: PreproductionExpense[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): PreproductionExpense[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, PreproductionExpense);
    }
}
@JsonConverter
export class PreproductionMemberArrayConverter implements JsonCustomConvert<PreproductionMember[]> {
    serialize(data: PreproductionMember[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): PreproductionMember[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, PreproductionMember);
    }
}
@JsonConverter
export class PreproductionprogressMemberArrayConverter implements JsonCustomConvert<PreproductionprogressMember[]> {
    serialize(data: PreproductionprogressMember[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): PreproductionprogressMember[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, PreproductionprogressMember);
    }
}
@JsonConverter
export class PreproductionProgressConverter implements JsonCustomConvert<PreproductionProgress> {
    serialize(data: PreproductionProgress): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serialize(data);
    }
    deserialize(data: any): PreproductionProgress {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeObject(data, PreproductionProgress);
    }
}
@JsonConverter
export class PreproductionsegmentMemberArrayConverter implements JsonCustomConvert<PreproductionsegmentMember[]> {
    serialize(data: PreproductionsegmentMember[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): PreproductionsegmentMember[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, PreproductionsegmentMember);
    }
}
@JsonConverter
export class TeamMemberArrayConverter implements JsonCustomConvert<TeamMember[]> {
    serialize(data: TeamMember[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): TeamMember[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, TeamMember);
    }
}
@JsonConverter
export class TopicDocumentArrayConverter implements JsonCustomConvert<TopicDocument[]> {
    serialize(data: TopicDocument[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): TopicDocument[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, TopicDocument);
    }
}
@JsonConverter
export class TopicMemberArrayConverter implements JsonCustomConvert<TopicMember[]> {
    serialize(data: TopicMember[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): TopicMember[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, TopicMember);
    }
}
@JsonConverter
export class NotifyArrayConverter implements JsonCustomConvert<Notify[]> {
    serialize(data: Notify[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): Notify[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, Notify);
    }
}
@JsonConverter
export class TeamArrayConverter implements JsonCustomConvert<Team[]> {
    serialize(data: Team[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): Team[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, Team);
    }
}
@JsonConverter
export class DocumentFileArrayConverter implements JsonCustomConvert<DocumentFile[]> {
    serialize(data: DocumentFile[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): DocumentFile[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, DocumentFile);
    }
}
@JsonConverter
export class VideoCompressArrayConverter implements JsonCustomConvert<VideoCompress[]> {
    serialize(data: VideoCompress[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): VideoCompress[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, VideoCompress);
    }
}
@JsonConverter
export class VideoArrayConverter implements JsonCustomConvert<Video[]> {
    serialize(data: Video[]): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serializeArray(data);
    }
    deserialize(data: any): Video[] {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeArray(data, Video);
    }
}
@JsonConverter
export class DocumentConverter implements JsonCustomConvert<Document> {
    serialize(data: Document): any {
        const jsonConvert = new JsonConvert();
        return jsonConvert.serialize(data);
    }
    deserialize(data: any): Document {
        const jsonConvert = new JsonConvert();
        return jsonConvert.deserializeObject(data, Document);
    }
}

@JsonObject('Broadcasting')
export class Broadcasting {

    @JsonProperty('Id', NumberConverter, true)
    Id: number = undefined as any;

    @JsonProperty('PostProductionPlaningId', NumberConverter, true)
    PostProductionPlaningId: number = undefined as any;

    @JsonProperty('ChannelId', NumberConverter, true)
    ChannelId: number = undefined as any;

    @JsonProperty('BroadcastingTime', DateTimeConverter, true)
    BroadcastingTime: Date = undefined as any;

    @JsonProperty('Duration', NumberConverter, true)
    Duration: number = undefined as any;

    @JsonProperty('SubmissionTime', DateTimeConverter, true)
    SubmissionTime: Date = undefined as any;

    @JsonProperty('Reciever', StringConverter, true)
    Reciever: string = undefined as any;

    @JsonProperty('Channel', CommoncategoryConverter, true)
    Channel: Commoncategory = undefined as any;

    @JsonProperty('PostProductionPlaning', PostproductionPlaningConverter, true)
    PostProductionPlaning: PostproductionPlaning = undefined as any;

    @JsonProperty('Broadcastingdocuments', BroadcastingdocumentArrayConverter, true)
    Broadcastingdocuments: Broadcastingdocument[] = [] as any;

}

@JsonObject('Broadcastingdocument')
export class Broadcastingdocument {

    @JsonProperty('Id', NumberConverter, true)
    Id: number = undefined as any;

    @JsonProperty('BroadcastingId', NumberConverter, true)
    BroadcastingId: number = undefined as any;

    @JsonProperty('FileName', StringConverter, true)
    FileName: string = undefined as any;

    @JsonProperty('FileType', StringConverter, true)
    FileType: string = undefined as any;

    @JsonProperty('FileUrl', StringConverter, true)
    FileUrl: string = undefined as any;

    @JsonProperty('Description', StringConverter, true)
    Description: string = undefined as any;

    @JsonProperty('UploadPartId', NumberConverter, true)
    UploadPartId: number = undefined as any;

    @JsonProperty('Broadcasting', BroadcastingConverter, true)
    Broadcasting: Broadcasting = undefined as any;

    @JsonProperty('UploadPart', UploadPartConverter, true)
    UploadPart: UploadPart = undefined as any;

}

@JsonObject('Estimate')
export class Estimate {

    @JsonProperty('Id', NumberConverter, true)
    Id: number = undefined as any;

    @JsonProperty('PreProductPlaningId', NumberConverter, true)
    PreProductPlaningId: number = undefined as any;

    @JsonProperty('TaskName', StringConverter, true)
    TaskName: string = undefined as any;

    @JsonProperty('Description', StringConverter, true)
    Description: string = undefined as any;

    @JsonProperty('TimeEstimate', NumberConverter, true)
    TimeEstimate: number = undefined as any;

    @JsonProperty('HumanResourceEstimate', NumberConverter, true)
    HumanResourceEstimate: number = undefined as any;

    @JsonProperty('OtherResourceEstimate', NumberConverter, true)
    OtherResourceEstimate: number = undefined as any;

    @JsonProperty('Phase', NumberConverter, true)
    Phase: number = undefined as any;

    @JsonProperty('CreatedAt', DateTimeConverter, true)
    CreatedAt: Date = undefined as any;

    @JsonProperty('CreatedBy', NumberConverter, true)
    CreatedBy: number = undefined as any;

    @JsonProperty('CreatedByNavigation', UserConverter, true)
    CreatedByNavigation: User = undefined as any;

    @JsonProperty('PreProductPlaning', PreproductionPlaningConverter, true)
    PreProductPlaning: PreproductionPlaning = undefined as any;

}

@JsonObject('VCommoncategory')
export class VCommoncategory {

    @JsonProperty('Id', NumberConverter, true)
    Id: number = undefined as any;

    @JsonProperty('Name', StringConverter, true)
    Name: string = undefined as any;

    @JsonProperty('Type', NumberConverter, true)
    Type: number = undefined as any;

    @JsonProperty('Description', StringConverter, true)
    Description: string = undefined as any;

    @JsonProperty('ParentId', NumberConverter, true)
    ParentId: number = undefined as any;

    @JsonProperty('ParentName', StringConverter, true)
    ParentName: string = undefined as any;

    @JsonProperty('GrandId', NumberConverter, true)
    GrandId: number = undefined as any;

    @JsonProperty('Grand', StringConverter, true)
    Grand: string = undefined as any;

}

@JsonObject('Commoncategory')
export class Commoncategory {

    @JsonProperty('Id', NumberConverter, true)
    Id: number = undefined as any;

    @JsonProperty('Name', StringConverter, true)
    Name: string = undefined as any;

    @JsonProperty('Type', NumberConverter, true)
    Type: number = undefined as any;

    @JsonProperty('Description', StringConverter, true)
    Description: string = undefined as any;

    @JsonProperty('ParentId', NumberConverter, true)
    ParentId: number = undefined as any;

    @JsonProperty('Broadcastings', BroadcastingArrayConverter, true)
    Broadcastings: Broadcasting[] = [] as any;

    @JsonProperty('Documents', DocumentArrayConverter, true)
    Documents: Document[] = [] as any;

    @JsonProperty('PostproductionProgresses', PostproductionProgressArrayConverter, true)
    PostproductionProgresses: PostproductionProgress[] = [] as any;

    @JsonProperty('PreproductionPlanings', PreproductionPlaningArrayConverter, true)
    PreproductionPlanings: PreproductionPlaning[] = [] as any;

    @JsonProperty('PreproductionProgresses', PreproductionProgressArrayConverter, true)
    PreproductionProgresses: PreproductionProgress[] = [] as any;

    @JsonProperty('PreproductionSegmentCommunes', PreproductionSegmentArrayConverter, true)
    PreproductionSegmentCommunes: PreproductionSegment[] = [] as any;

    @JsonProperty('PreproductionSegmentDistricts', PreproductionSegmentArrayConverter, true)
    PreproductionSegmentDistricts: PreproductionSegment[] = [] as any;

    @JsonProperty('PreproductionSegmentProvinces', PreproductionSegmentArrayConverter, true)
    PreproductionSegmentProvinces: PreproductionSegment[] = [] as any;

    @JsonProperty('RoleRightRights', RoleRightArrayConverter, true)
    RoleRightRights: RoleRight[] = [] as any;

    @JsonProperty('RoleRightRoles', RoleRightArrayConverter, true)
    RoleRightRoles: RoleRight[] = [] as any;

    @JsonProperty('Topics', TopicArrayConverter, true)
    Topics: Topic[] = [] as any;

    @JsonProperty('UserRights', UserRightArrayConverter, true)
    UserRights: UserRight[] = [] as any;

    @JsonProperty('UserRoles', UserRoleArrayConverter, true)
    UserRoles: UserRole[] = [] as any;

    @JsonProperty('Users', UserArrayConverter, true)
    Users: User[] = [] as any;

}

@JsonObject('Audit')
export class Audit {

    @JsonProperty('Id', NumberConverter, true)
    Id: number = undefined as any;

    @JsonProperty('ProcessedAt', DateTimeConverter, true)
    ProcessedAt: Date = undefined as any;

    @JsonProperty('Type', NumberConverter, true)
    Type: number = undefined as any;

    @JsonProperty('UserName', StringConverter, true)
    UserName: string = undefined as any;

    @JsonProperty('EntityName', StringConverter, true)
    EntityName: string = undefined as any;

    @JsonProperty('EntityId', NumberConverter, true)
    EntityId: number = undefined as any;

    @JsonProperty('AuditData', StringConverter, true)
    AuditData: string = undefined as any;

    @JsonProperty('Action', StringConverter, true)
    Action: string = undefined as any;

}

@JsonObject('Approved')
export class Approved {

    @JsonProperty('Id', NumberConverter, true)
    Id: number = undefined as any;

    @JsonProperty('ObjectId', NumberConverter, true)
    ObjectId: number = undefined as any;

    @JsonProperty('ProcessedAt', DateTimeConverter, true)
    ProcessedAt: Date = undefined as any;

    @JsonProperty('ProcessedBy', NumberConverter, true)
    ProcessedBy: number = undefined as any;

    @JsonProperty('Comment', StringConverter, true)
    Comment: string = undefined as any;

    @JsonProperty('Result', NumberConverter, true)
    Result: number = undefined as any;

    @JsonProperty('ObjectType', NumberConverter, true)
    ObjectType: number = undefined as any;

}

@JsonObject('Mappingfield')
export class Mappingfield {

    @JsonProperty('Id', NumberConverter, true)
    Id: number = undefined as any;

    @JsonProperty('Table', StringConverter, true)
    Table: string = undefined as any;

    @JsonProperty('OriginField', StringConverter, true)
    OriginField: string = undefined as any;

    @JsonProperty('NewField', StringConverter, true)
    NewField: string = undefined as any;

}

@JsonObject('Mappingtable')
export class Mappingtable {

    @JsonProperty('Id', NumberConverter, true)
    Id: number = undefined as any;

    @JsonProperty('OriginTable', StringConverter, true)
    OriginTable: string = undefined as any;

    @JsonProperty('NewTable', StringConverter, true)
    NewTable: string = undefined as any;

}

@JsonObject('Movieapproval')
export class Movieapproval {

    @JsonProperty('Id', NumberConverter, true)
    Id: number = undefined as any;

    @JsonProperty('PostProductionPlaningId', NumberConverter, true)
    PostProductionPlaningId: number = undefined as any;

    @JsonProperty('ApprovalDate', DateTimeConverter, true)
    ApprovalDate: Date = undefined as any;

    @JsonProperty('Content', StringConverter, true)
    Content: string = undefined as any;

    @JsonProperty('Comment', StringConverter, true)
    Comment: string = undefined as any;

    @JsonProperty('Suggested', StringConverter, true)
    Suggested: string = undefined as any;

    @JsonProperty('Status', NumberConverter, true)
    Status: number = undefined as any;

    @JsonProperty('No', NumberConverter, true)
    No: number = undefined as any;

    @JsonProperty('StartAt', DateTimeConverter, true)
    StartAt: Date = undefined as any;

    @JsonProperty('EndAt', DateTimeConverter, true)
    EndAt: Date = undefined as any;

    @JsonProperty('PostProductionPlaning', PostproductionPlaningConverter, true)
    PostProductionPlaning: PostproductionPlaning = undefined as any;

    @JsonProperty('MovieapprovalDetails', MovieapprovalDetailArrayConverter, true)
    MovieapprovalDetails: MovieapprovalDetail[] = [] as any;

}

@JsonObject('MovieapprovalDetail')
export class MovieapprovalDetail {

    @JsonProperty('Id', NumberConverter, true)
    Id: number = undefined as any;

    @JsonProperty('MovieApprovalId', NumberConverter, true)
    MovieApprovalId: number = undefined as any;

    @JsonProperty('UserId', NumberConverter, true)
    UserId: number = undefined as any;

    @JsonProperty('Comment', StringConverter, true)
    Comment: string = undefined as any;

    @JsonProperty('Suggested', StringConverter, true)
    Suggested: string = undefined as any;

    @JsonProperty('Status', NumberConverter, true)
    Status: number = undefined as any;

    @JsonProperty('Role', StringConverter, true)
    Role: string = undefined as any;

    @JsonProperty('MovieApproval', MovieapprovalConverter, true)
    MovieApproval: Movieapproval = undefined as any;

    @JsonProperty('User', UserConverter, true)
    User: User = undefined as any;

}

@JsonObject('PostproductionPlaning')
export class PostproductionPlaning {

    @JsonProperty('Id', NumberConverter, true)
    Id: number = undefined as any;

    @JsonProperty('PreProductionId', NumberConverter, true)
    PreProductionId: number = undefined as any;

    @JsonProperty('FromDate', DateTimeConverter, true)
    FromDate: Date = undefined as any;

    @JsonProperty('ToDate', DateTimeConverter, true)
    ToDate: Date = undefined as any;

    @JsonProperty('WorkContent', StringConverter, true)
    WorkContent: string = undefined as any;

    @JsonProperty('Budget', NumberConverter, true)
    Budget: number = undefined as any;

    @JsonProperty('Status', NumberConverter, true)
    Status: number = undefined as any;

    @JsonProperty('CloseDate', DateTimeConverter, true)
    CloseDate: Date = undefined as any;

    @JsonProperty('CloseReason', StringConverter, true)
    CloseReason: string = undefined as any;

    @JsonProperty('CloseNote', StringConverter, true)
    CloseNote: string = undefined as any;

    @JsonProperty('PreProduction', PreproductionPlaningConverter, true)
    PreProduction: PreproductionPlaning = undefined as any;

    @JsonProperty('Broadcastings', BroadcastingArrayConverter, true)
    Broadcastings: Broadcasting[] = [] as any;

    @JsonProperty('Movieapprovals', MovieapprovalArrayConverter, true)
    Movieapprovals: Movieapproval[] = [] as any;

    @JsonProperty('PostproductionProgresses', PostproductionProgressArrayConverter, true)
    PostproductionProgresses: PostproductionProgress[] = [] as any;

}

@JsonObject('PostproductionProgress')
export class PostproductionProgress {

    @JsonProperty('Id', NumberConverter, true)
    Id: number = undefined as any;

    @JsonProperty('PostProductionId', NumberConverter, true)
    PostProductionId: number = undefined as any;

    @JsonProperty('CreatedBy', NumberConverter, true)
    CreatedBy: number = undefined as any;

    @JsonProperty('CreatedAt', DateTimeConverter, true)
    CreatedAt: Date = undefined as any;

    @JsonProperty('FromDate', DateTimeConverter, true)
    FromDate: Date = undefined as any;

    @JsonProperty('ToDate', DateTimeConverter, true)
    ToDate: Date = undefined as any;

    @JsonProperty('TotalProgress', NumberConverter, true)
    TotalProgress: number = undefined as any;

    @JsonProperty('Expense', NumberConverter, true)
    Expense: number = undefined as any;

    @JsonProperty('Note', StringConverter, true)
    Note: string = undefined as any;

    @JsonProperty('IsFinished', BooleanConverter, true)
    IsFinished: boolean = undefined as any;

    @JsonProperty('ExpenseType', NumberConverter, true)
    ExpenseType: number = undefined as any;

    @JsonProperty('ExpenseTypeNavigation', CommoncategoryConverter, true)
    ExpenseTypeNavigation: Commoncategory = undefined as any;

    @JsonProperty('PostProduction', PostproductionPlaningConverter, true)
    PostProduction: PostproductionPlaning = undefined as any;

    @JsonProperty('PostproductionprogressMembers', PostproductionprogressMemberArrayConverter, true)
    PostproductionprogressMembers: PostproductionprogressMember[] = [] as any;

}

@JsonObject('PostproductionprogressMember')
export class PostproductionprogressMember {

    @JsonProperty('Id', NumberConverter, true)
    Id: number = undefined as any;

    @JsonProperty('PostProductionProgressId', NumberConverter, true)
    PostProductionProgressId: number = undefined as any;

    @JsonProperty('UserId', NumberConverter, true)
    UserId: number = undefined as any;

    @JsonProperty('Role', StringConverter, true)
    Role: string = undefined as any;

    @JsonProperty('Comment', StringConverter, true)
    Comment: string = undefined as any;

    @JsonProperty('Status', NumberConverter, true)
    Status: number = undefined as any;

    @JsonProperty('PercentCompleted', NumberConverter, true)
    PercentCompleted: number = undefined as any;

    @JsonProperty('PostProductionProgress', PostproductionProgressConverter, true)
    PostProductionProgress: PostproductionProgress = undefined as any;

    @JsonProperty('User', UserConverter, true)
    User: User = undefined as any;

}

@JsonObject('PreproductionExpense')
export class PreproductionExpense {

    @JsonProperty('Id', NumberConverter, true)
    Id: number = undefined as any;

    @JsonProperty('PreProductionId', NumberConverter, true)
    PreProductionId: number = undefined as any;

    @JsonProperty('SegmentId', NumberConverter, true)
    SegmentId: number = undefined as any;

    @JsonProperty('CreatedAt', DateTimeConverter, true)
    CreatedAt: Date = undefined as any;

    @JsonProperty('CreatedBy', NumberConverter, true)
    CreatedBy: number = undefined as any;

    @JsonProperty('ExpenseType', NumberConverter, true)
    ExpenseType: number = undefined as any;

    @JsonProperty('Amount', NumberConverter, true)
    Amount: number = undefined as any;

    @JsonProperty('Reason', StringConverter, true)
    Reason: string = undefined as any;

    @JsonProperty('Note', StringConverter, true)
    Note: string = undefined as any;

    @JsonProperty('PreProduction', PreproductionPlaningConverter, true)
    PreProduction: PreproductionPlaning = undefined as any;

    @JsonProperty('Segment', PreproductionSegmentConverter, true)
    Segment: PreproductionSegment = undefined as any;

}

@JsonObject('PreproductionMember')
export class PreproductionMember {

    @JsonProperty('Id', NumberConverter, true)
    Id: number = undefined as any;

    @JsonProperty('PreProductionId', NumberConverter, true)
    PreProductionId: number = undefined as any;

    @JsonProperty('MemberId', NumberConverter, true)
    MemberId: number = undefined as any;

    @JsonProperty('Role', StringConverter, true)
    Role: string = undefined as any;

    @JsonProperty('Description', StringConverter, true)
    Description: string = undefined as any;

    @JsonProperty('Member', UserConverter, true)
    Member: User = undefined as any;

    @JsonProperty('PreProduction', PreproductionPlaningConverter, true)
    PreProduction: PreproductionPlaning = undefined as any;

}

@JsonObject('PreproductionPlaning')
export class PreproductionPlaning {

    @JsonProperty('Id', NumberConverter, true)
    Id: number = undefined as any;

    @JsonProperty('TopicId', NumberConverter, true)
    TopicId: number = undefined as any;

    @JsonProperty('CreatedBy', NumberConverter, true)
    CreatedBy: number = undefined as any;

    @JsonProperty('CreatedAt', DateTimeConverter, true)
    CreatedAt: Date = undefined as any;

    @JsonProperty('Budget', NumberConverter, true)
    Budget: number = undefined as any;

    @JsonProperty('ApprovedMember', NumberConverter, true)
    ApprovedMember: number = undefined as any;

    @JsonProperty('Status', NumberConverter, true)
    Status: number = undefined as any;

    @JsonProperty('CloseDate', DateTimeConverter, true)
    CloseDate: Date = undefined as any;

    @JsonProperty('CloseExpense', NumberConverter, true)
    CloseExpense: number = undefined as any;

    @JsonProperty('CloseNote', StringConverter, true)
    CloseNote: string = undefined as any;

    @JsonProperty('CloseReason', StringConverter, true)
    CloseReason: string = undefined as any;

    @JsonProperty('TeamId', NumberConverter, true)
    TeamId: number = undefined as any;

    @JsonProperty('Name', StringConverter, true)
    Name: string = undefined as any;

    @JsonProperty('Description', StringConverter, true)
    Description: string = undefined as any;

    @JsonProperty('Scenario', StringConverter, true)
    Scenario: string = undefined as any;

    @JsonProperty('CategoryId', NumberConverter, true)
    CategoryId: number = undefined as any;

    @JsonProperty('ApprovedMemberNavigation', UserConverter, true)
    ApprovedMemberNavigation: User = undefined as any;

    @JsonProperty('Category', CommoncategoryConverter, true)
    Category: Commoncategory = undefined as any;

    @JsonProperty('Team', TeamConverter, true)
    Team: Team = undefined as any;

    @JsonProperty('Topic', TopicConverter, true)
    Topic: Topic = undefined as any;

    @JsonProperty('Estimates', EstimateArrayConverter, true)
    Estimates: Estimate[] = [] as any;

    @JsonProperty('PostproductionPlanings', PostproductionPlaningArrayConverter, true)
    PostproductionPlanings: PostproductionPlaning[] = [] as any;

    @JsonProperty('PreproductionExpenses', PreproductionExpenseArrayConverter, true)
    PreproductionExpenses: PreproductionExpense[] = [] as any;

    @JsonProperty('PreproductionMembers', PreproductionMemberArrayConverter, true)
    PreproductionMembers: PreproductionMember[] = [] as any;

    @JsonProperty('PreproductionProgresses', PreproductionProgressArrayConverter, true)
    PreproductionProgresses: PreproductionProgress[] = [] as any;

    @JsonProperty('PreproductionSegments', PreproductionSegmentArrayConverter, true)
    PreproductionSegments: PreproductionSegment[] = [] as any;

}

@JsonObject('PreproductionProgress')
export class PreproductionProgress {

    @JsonProperty('Id', NumberConverter, true)
    Id: number = undefined as any;

    @JsonProperty('PreProductionId', NumberConverter, true)
    PreProductionId: number = undefined as any;

    @JsonProperty('SegmentId', NumberConverter, true)
    SegmentId: number = undefined as any;

    @JsonProperty('CreatedBy', NumberConverter, true)
    CreatedBy: number = undefined as any;

    @JsonProperty('CreatedAt', DateTimeConverter, true)
    CreatedAt: Date = undefined as any;

    @JsonProperty('FromDate', DateTimeConverter, true)
    FromDate: Date = undefined as any;

    @JsonProperty('Note', StringConverter, true)
    Note: string = undefined as any;

    @JsonProperty('SegmentProgress', NumberConverter, true)
    SegmentProgress: number = undefined as any;

    @JsonProperty('TotalProgress', NumberConverter, true)
    TotalProgress: number = undefined as any;

    @JsonProperty('ToDate', DateTimeConverter, true)
    ToDate: Date = undefined as any;

    @JsonProperty('Expense', NumberConverter, true)
    Expense: number = undefined as any;

    @JsonProperty('Status', NumberConverter, true)
    Status: number = undefined as any;

    @JsonProperty('ExpenseType', NumberConverter, true)
    ExpenseType: number = undefined as any;

    @JsonProperty('ExpenseTypeNavigation', CommoncategoryConverter, true)
    ExpenseTypeNavigation: Commoncategory = undefined as any;

    @JsonProperty('PreProduction', PreproductionPlaningConverter, true)
    PreProduction: PreproductionPlaning = undefined as any;

    @JsonProperty('Segment', PreproductionSegmentConverter, true)
    Segment: PreproductionSegment = undefined as any;

    @JsonProperty('PreproductionprogressMembers', PreproductionprogressMemberArrayConverter, true)
    PreproductionprogressMembers: PreproductionprogressMember[] = [] as any;

}

@JsonObject('PreproductionprogressMember')
export class PreproductionprogressMember {

    @JsonProperty('Id', NumberConverter, true)
    Id: number = undefined as any;

    @JsonProperty('PreProductionProgressId', NumberConverter, true)
    PreProductionProgressId: number = undefined as any;

    @JsonProperty('UserId', NumberConverter, true)
    UserId: number = undefined as any;

    @JsonProperty('Role', StringConverter, true)
    Role: string = undefined as any;

    @JsonProperty('Comment', StringConverter, true)
    Comment: string = undefined as any;

    @JsonProperty('Status', NumberConverter, true)
    Status: number = undefined as any;

    @JsonProperty('PercentComplete', NumberConverter, true)
    PercentComplete: number = undefined as any;

    @JsonProperty('PreProductionProgress', PreproductionProgressConverter, true)
    PreProductionProgress: PreproductionProgress = undefined as any;

    @JsonProperty('User', UserConverter, true)
    User: User = undefined as any;

}

@JsonObject('PreproductionSegment')
export class PreproductionSegment {

    @JsonProperty('Id', NumberConverter, true)
    Id: number = undefined as any;

    @JsonProperty('PreProductionId', NumberConverter, true)
    PreProductionId: number = undefined as any;

    @JsonProperty('ProvinceId', NumberConverter, true)
    ProvinceId: number = undefined as any;

    @JsonProperty('DistrictId', NumberConverter, true)
    DistrictId: number = undefined as any;

    @JsonProperty('CommuneId', NumberConverter, true)
    CommuneId: number = undefined as any;

    @JsonProperty('Address', StringConverter, true)
    Address: string = undefined as any;

    @JsonProperty('FromDate', DateTimeConverter, true)
    FromDate: Date = undefined as any;

    @JsonProperty('ToDate', DateTimeConverter, true)
    ToDate: Date = undefined as any;

    @JsonProperty('Budget', NumberConverter, true)
    Budget: number = undefined as any;

    @JsonProperty('Status', NumberConverter, true)
    Status: number = undefined as any;

    @JsonProperty('Scenario', StringConverter, true)
    Scenario: string = undefined as any;

    @JsonProperty('Commune', CommoncategoryConverter, true)
    Commune: Commoncategory = undefined as any;

    @JsonProperty('District', CommoncategoryConverter, true)
    District: Commoncategory = undefined as any;

    @JsonProperty('PreProduction', PreproductionPlaningConverter, true)
    PreProduction: PreproductionPlaning = undefined as any;

    @JsonProperty('Province', CommoncategoryConverter, true)
    Province: Commoncategory = undefined as any;

    @JsonProperty('PreproductionExpenses', PreproductionExpenseArrayConverter, true)
    PreproductionExpenses: PreproductionExpense[] = [] as any;

    @JsonProperty('PreproductionProgresses', PreproductionProgressArrayConverter, true)
    PreproductionProgresses: PreproductionProgress[] = [] as any;

    @JsonProperty('PreproductionsegmentMembers', PreproductionsegmentMemberArrayConverter, true)
    PreproductionsegmentMembers: PreproductionsegmentMember[] = [] as any;

}

@JsonObject('PreproductionsegmentMember')
export class PreproductionsegmentMember {

    @JsonProperty('Id', NumberConverter, true)
    Id: number = undefined as any;

    @JsonProperty('PreProductionSegmentId', NumberConverter, true)
    PreProductionSegmentId: number = undefined as any;

    @JsonProperty('UserId', NumberConverter, true)
    UserId: number = undefined as any;

    @JsonProperty('Role', StringConverter, true)
    Role: string = undefined as any;

    @JsonProperty('Description', StringConverter, true)
    Description: string = undefined as any;

    @JsonProperty('PreProductionSegment', PreproductionSegmentConverter, true)
    PreProductionSegment: PreproductionSegment = undefined as any;

    @JsonProperty('User', UserConverter, true)
    User: User = undefined as any;

}

@JsonObject('Team')
export class Team {

    @JsonProperty('Id', NumberConverter, true)
    Id: number = undefined as any;

    @JsonProperty('Name', StringConverter, true)
    Name: string = undefined as any;

    @JsonProperty('Description', StringConverter, true)
    Description: string = undefined as any;

    @JsonProperty('LeaderId', NumberConverter, true)
    LeaderId: number = undefined as any;

    @JsonProperty('Leader', UserConverter, true)
    Leader: User = undefined as any;

    @JsonProperty('PreproductionPlanings', PreproductionPlaningArrayConverter, true)
    PreproductionPlanings: PreproductionPlaning[] = [] as any;

    @JsonProperty('TeamMembers', TeamMemberArrayConverter, true)
    TeamMembers: TeamMember[] = [] as any;

}

@JsonObject('TeamMember')
export class TeamMember {

    @JsonProperty('Id', NumberConverter, true)
    Id: number = undefined as any;

    @JsonProperty('UserId', NumberConverter, true)
    UserId: number = undefined as any;

    @JsonProperty('TeamId', NumberConverter, true)
    TeamId: number = undefined as any;

    @JsonProperty('Role', StringConverter, true)
    Role: string = undefined as any;

    @JsonProperty('Team', TeamConverter, true)
    Team: Team = undefined as any;

    @JsonProperty('User', UserConverter, true)
    User: User = undefined as any;

}

@JsonObject('Topic')
export class Topic {

    @JsonProperty('Id', NumberConverter, true)
    Id: number = undefined as any;

    @JsonProperty('Name', StringConverter, true)
    Name: string = undefined as any;

    @JsonProperty('Description', StringConverter, true)
    Description: string = undefined as any;

    @JsonProperty('Scenario', StringConverter, true)
    Scenario: string = undefined as any;

    @JsonProperty('EstimatedBegin', DateTimeConverter, true)
    EstimatedBegin: Date = undefined as any;

    @JsonProperty('EstimatedEnd', DateTimeConverter, true)
    EstimatedEnd: Date = undefined as any;

    @JsonProperty('EstimatedBroadcasting', DateTimeConverter, true)
    EstimatedBroadcasting: Date = undefined as any;

    @JsonProperty('EstimatedBudget', NumberConverter, true)
    EstimatedBudget: number = undefined as any;

    @JsonProperty('CreatedAt', DateTimeConverter, true)
    CreatedAt: Date = undefined as any;

    @JsonProperty('CreatedBy', NumberConverter, true)
    CreatedBy: number = undefined as any;

    @JsonProperty('Status', NumberConverter, true)
    Status: number = undefined as any;

    @JsonProperty('Type', NumberConverter, true)
    Type: number = undefined as any;

    @JsonProperty('ParentId', NumberConverter, true)
    ParentId: number = undefined as any;

    @JsonProperty('EstimatedCost', NumberConverter, true)
    EstimatedCost: number = undefined as any;

    @JsonProperty('CategoryId', NumberConverter, true)
    CategoryId: number = undefined as any;

    @JsonProperty('Category', CommoncategoryConverter, true)
    Category: Commoncategory = undefined as any;

    @JsonProperty('PreproductionPlanings', PreproductionPlaningArrayConverter, true)
    PreproductionPlanings: PreproductionPlaning[] = [] as any;

    @JsonProperty('TopicDocuments', TopicDocumentArrayConverter, true)
    TopicDocuments: TopicDocument[] = [] as any;

    @JsonProperty('TopicMembers', TopicMemberArrayConverter, true)
    TopicMembers: TopicMember[] = [] as any;

}

@JsonObject('TopicDocument')
export class TopicDocument {

    @JsonProperty('Id', NumberConverter, true)
    Id: number = undefined as any;

    @JsonProperty('TopicId', NumberConverter, true)
    TopicId: number = undefined as any;

    @JsonProperty('Key', StringConverter, true)
    Key: string = undefined as any;

    @JsonProperty('Value', StringConverter, true)
    Value: string = undefined as any;

    @JsonProperty('Description', StringConverter, true)
    Description: string = undefined as any;

    @JsonProperty('FileUrl', StringConverter, true)
    FileUrl: string = undefined as any;

    @JsonProperty('UploadPartId', NumberConverter, true)
    UploadPartId: number = undefined as any;

    @JsonProperty('Topic', TopicConverter, true)
    Topic: Topic = undefined as any;

    @JsonProperty('UploadPart', UploadPartConverter, true)
    UploadPart: UploadPart = undefined as any;

}

@JsonObject('TopicMember')
export class TopicMember {

    @JsonProperty('Id', NumberConverter, true)
    Id: number = undefined as any;

    @JsonProperty('TopicId', NumberConverter, true)
    TopicId: number = undefined as any;

    @JsonProperty('MemberId', NumberConverter, true)
    MemberId: number = undefined as any;

    @JsonProperty('Role', StringConverter, true)
    Role: string = undefined as any;

    @JsonProperty('Description', StringConverter, true)
    Description: string = undefined as any;

    @JsonProperty('Member', UserConverter, true)
    Member: User = undefined as any;

    @JsonProperty('Topic', TopicConverter, true)
    Topic: Topic = undefined as any;

}

@JsonObject('User')
export class User {

    @JsonProperty('Id', NumberConverter, true)
    Id: number = undefined as any;

    @JsonProperty('FirstName', StringConverter, true)
    FirstName: string = undefined as any;

    @JsonProperty('LastName', StringConverter, true)
    LastName: string = undefined as any;

    @JsonProperty('Email', StringConverter, true)
    Email: string = undefined as any;

    @JsonProperty('UserName', StringConverter, true)
    UserName: string = undefined as any;

    @JsonProperty('PassWord', StringConverter, true)
    PassWord: string = undefined as any;

    @JsonProperty('Tel', StringConverter, true)
    Tel: string = undefined as any;

    @JsonProperty('DepartId', NumberConverter, true)
    DepartId: number = undefined as any;

    @JsonProperty('Status', NumberConverter, true)
    Status: number = undefined as any;

    @JsonProperty('Depart', CommoncategoryConverter, true)
    Depart: Commoncategory = undefined as any;

    @JsonProperty('Documents', DocumentArrayConverter, true)
    Documents: Document[] = [] as any;

    @JsonProperty('Estimates', EstimateArrayConverter, true)
    Estimates: Estimate[] = [] as any;

    @JsonProperty('MovieapprovalDetails', MovieapprovalDetailArrayConverter, true)
    MovieapprovalDetails: MovieapprovalDetail[] = [] as any;

    @JsonProperty('NotifySenders', NotifyArrayConverter, true)
    NotifySenders: Notify[] = [] as any;

    @JsonProperty('NotifyUsers', NotifyArrayConverter, true)
    NotifyUsers: Notify[] = [] as any;

    @JsonProperty('PostproductionprogressMembers', PostproductionprogressMemberArrayConverter, true)
    PostproductionprogressMembers: PostproductionprogressMember[] = [] as any;

    @JsonProperty('PreproductionMembers', PreproductionMemberArrayConverter, true)
    PreproductionMembers: PreproductionMember[] = [] as any;

    @JsonProperty('PreproductionPlanings', PreproductionPlaningArrayConverter, true)
    PreproductionPlanings: PreproductionPlaning[] = [] as any;

    @JsonProperty('PreproductionprogressMembers', PreproductionprogressMemberArrayConverter, true)
    PreproductionprogressMembers: PreproductionprogressMember[] = [] as any;

    @JsonProperty('PreproductionsegmentMembers', PreproductionsegmentMemberArrayConverter, true)
    PreproductionsegmentMembers: PreproductionsegmentMember[] = [] as any;

    @JsonProperty('TeamMembers', TeamMemberArrayConverter, true)
    TeamMembers: TeamMember[] = [] as any;

    @JsonProperty('Teams', TeamArrayConverter, true)
    Teams: Team[] = [] as any;

    @JsonProperty('TopicMembers', TopicMemberArrayConverter, true)
    TopicMembers: TopicMember[] = [] as any;

    @JsonProperty('UserRights', UserRightArrayConverter, true)
    UserRights: UserRight[] = [] as any;

    @JsonProperty('UserRoles', UserRoleArrayConverter, true)
    UserRoles: UserRole[] = [] as any;

}

@JsonObject('UserRight')
export class UserRight {

    @JsonProperty('Id', NumberConverter, true)
    Id: number = undefined as any;

    @JsonProperty('RightId', NumberConverter, true)
    RightId: number = undefined as any;

    @JsonProperty('UserId', NumberConverter, true)
    UserId: number = undefined as any;

    @JsonProperty('Right', CommoncategoryConverter, true)
    Right: Commoncategory = undefined as any;

    @JsonProperty('User', UserConverter, true)
    User: User = undefined as any;

}

@JsonObject('Video')
export class Video {

    @JsonProperty('Id', NumberConverter, true)
    Id: number = undefined as any;

    @JsonProperty('ObjectId', NumberConverter, true)
    ObjectId: number = undefined as any;

    @JsonProperty('ObjectType', NumberConverter, true)
    ObjectType: number = undefined as any;

    @JsonProperty('VideoName', StringConverter, true)
    VideoName: string = undefined as any;

    @JsonProperty('VideoUrl', StringConverter, true)
    VideoUrl: string = undefined as any;

    @JsonProperty('VideoLength', NumberConverter, true)
    VideoLength: number = undefined as any;

    @JsonProperty('VideoSize', NumberConverter, true)
    VideoSize: number = undefined as any;

    @JsonProperty('Note', StringConverter, true)
    Note: string = undefined as any;

    @JsonProperty('UploadPartId', NumberConverter, true)
    UploadPartId: number = undefined as any;

    @JsonProperty('UploadPart', UploadPartConverter, true)
    UploadPart: UploadPart = undefined as any;

}

@JsonObject('UserRole')
export class UserRole {

    @JsonProperty('Id', NumberConverter, true)
    Id: number = undefined as any;

    @JsonProperty('UserId', NumberConverter, true)
    UserId: number = undefined as any;

    @JsonProperty('RoleId', NumberConverter, true)
    RoleId: number = undefined as any;

    @JsonProperty('Role', CommoncategoryConverter, true)
    Role: Commoncategory = undefined as any;

    @JsonProperty('User', UserConverter, true)
    User: User = undefined as any;

}

@JsonObject('RoleRight')
export class RoleRight {

    @JsonProperty('Id', NumberConverter, true)
    Id: number = undefined as any;

    @JsonProperty('RoleId', NumberConverter, true)
    RoleId: number = undefined as any;

    @JsonProperty('RightId', NumberConverter, true)
    RightId: number = undefined as any;

    @JsonProperty('Right', CommoncategoryConverter, true)
    Right: Commoncategory = undefined as any;

    @JsonProperty('Role', CommoncategoryConverter, true)
    Role: Commoncategory = undefined as any;

}

@JsonObject('ElasticField')
export class ElasticField {

    @JsonProperty('Id', NumberConverter, true)
    Id: number = undefined as any;

    @JsonProperty('TableName', StringConverter, true)
    TableName: string = undefined as any;

    @JsonProperty('FieldName', StringConverter, true)
    FieldName: string = undefined as any;

}

@JsonObject('UploadPart')
export class UploadPart {

    @JsonProperty('Id', NumberConverter, true)
    Id: number = undefined as any;

    @JsonProperty('FileName', StringConverter, true)
    FileName: string = undefined as any;

    @JsonProperty('FileSize', NumberConverter, true)
    FileSize: number = undefined as any;

    @JsonProperty('TokenId', StringConverter, true)
    TokenId: string = undefined as any;

    @JsonProperty('FileLocation', StringConverter, true)
    FileLocation: string = undefined as any;

    @JsonProperty('TimeBeginUpload', DateTimeConverter, true)
    TimeBeginUpload: Date = undefined as any;

    @JsonProperty('TimeFinishUpload', DateTimeConverter, true)
    TimeFinishUpload: Date = undefined as any;

    @JsonProperty('CreatedById', NumberConverter, true)
    CreatedById: number = undefined as any;

    @JsonProperty('CreatedAt', DateTimeConverter, true)
    CreatedAt: Date = undefined as any;

    @JsonProperty('NumberOfChunks', NumberConverter, true)
    NumberOfChunks: number = undefined as any;

    @JsonProperty('Title', StringConverter, true)
    Title: string = undefined as any;

    @JsonProperty('Description', StringConverter, true)
    Description: string = undefined as any;

    @JsonProperty('FileType', NumberConverter, true)
    FileType: number = undefined as any;

    @JsonProperty('Broadcastingdocuments', BroadcastingdocumentArrayConverter, true)
    Broadcastingdocuments: Broadcastingdocument[] = [] as any;

    @JsonProperty('DocumentFiles', DocumentFileArrayConverter, true)
    DocumentFiles: DocumentFile[] = [] as any;

    @JsonProperty('TopicDocuments', TopicDocumentArrayConverter, true)
    TopicDocuments: TopicDocument[] = [] as any;

    @JsonProperty('VideoCompresses', VideoCompressArrayConverter, true)
    VideoCompresses: VideoCompress[] = [] as any;

    @JsonProperty('Videos', VideoArrayConverter, true)
    Videos: Video[] = [] as any;

}

@JsonObject('ReportCost')
export class ReportCost {

    @JsonProperty('Id', NumberConverter, true)
    Id: number = undefined as any;

    @JsonProperty('OutName', StringConverter, true)
    OutName: string = undefined as any;

    @JsonProperty('MinEstimatedBegin', DateTimeConverter, true)
    MinEstimatedBegin: Date = undefined as any;

    @JsonProperty('EstimatedEnd', DateTimeConverter, true)
    EstimatedEnd: Date = undefined as any;

    @JsonProperty('Type', NumberConverter, true)
    Type: number = undefined as any;

    @JsonProperty('TopicName', StringConverter, true)
    TopicName: string = undefined as any;

    @JsonProperty('UserName', StringConverter, true)
    UserName: string = undefined as any;

    @JsonProperty('EstimatedBudget', NumberConverter, true)
    EstimatedBudget: number = undefined as any;

    @JsonProperty('TopicStatus', NumberConverter, true)
    TopicStatus: number = undefined as any;

    @JsonProperty('PreProductionPlanName', StringConverter, true)
    PreProductionPlanName: string = undefined as any;

    @JsonProperty('PreProductionPlanStatus', NumberConverter, true)
    PreProductionPlanStatus: number = undefined as any;

    @JsonProperty('PostProductionFromDate', DateTimeConverter, true)
    PostProductionFromDate: Date = undefined as any;

    @JsonProperty('PostProductionStatus', NumberConverter, true)
    PostProductionStatus: number = undefined as any;

    @JsonProperty('PostProductionToDate', DateTimeConverter, true)
    PostProductionToDate: Date = undefined as any;

    @JsonProperty('SumExpense', NumberConverter, true)
    SumExpense: number = undefined as any;

    @JsonProperty('ExpenseDifference', NumberConverter, true)
    ExpenseDifference: number = undefined as any;

    @JsonProperty('PercentageDifference', NumberConverter, true)
    PercentageDifference: number = undefined as any;

}

@JsonObject('ReportProgress')
export class ReportProgress {

    @JsonProperty('Id', NumberConverter, true)
    Id: number = undefined as any;

    @JsonProperty('OutlineName', StringConverter, true)
    OutlineName: string = undefined as any;

    @JsonProperty('MinEstimatedBegin', DateTimeConverter, true)
    MinEstimatedBegin: Date = undefined as any;

    @JsonProperty('EstimatedEnd', DateTimeConverter, true)
    EstimatedEnd: Date = undefined as any;

    @JsonProperty('Type', NumberConverter, true)
    Type: number = undefined as any;

    @JsonProperty('TopicName', StringConverter, true)
    TopicName: string = undefined as any;

    @JsonProperty('UserName', StringConverter, true)
    UserName: string = undefined as any;

    @JsonProperty('TopicStatus', NumberConverter, true)
    TopicStatus: number = undefined as any;

    @JsonProperty('PreProductionPlanName', StringConverter, true)
    PreProductionPlanName: string = undefined as any;

    @JsonProperty('PreProductionPlanStatus', NumberConverter, true)
    PreProductionPlanStatus: number = undefined as any;

    @JsonProperty('PostProductionFromDate', DateTimeConverter, true)
    PostProductionFromDate: Date = undefined as any;

    @JsonProperty('PostProductionStatus', NumberConverter, true)
    PostProductionStatus: number = undefined as any;

    @JsonProperty('PostProductionToDate', DateTimeConverter, true)
    PostProductionToDate: Date = undefined as any;

    @JsonProperty('TotalProgress', NumberConverter, true)
    TotalProgress: number = undefined as any;

}

@JsonObject('VreportSegment')
export class VreportSegment {

    @JsonProperty('Id', NumberConverter, true)
    Id: number = undefined as any;

    @JsonProperty('Scenario', StringConverter, true)
    Scenario: string = undefined as any;

    @JsonProperty('Name', StringConverter, true)
    Name: string = undefined as any;

    @JsonProperty('Address', StringConverter, true)
    Address: string = undefined as any;

    @JsonProperty('ProvinceId', StringConverter, true)
    ProvinceId: string = undefined as any;

    @JsonProperty('DistrictId', StringConverter, true)
    DistrictId: string = undefined as any;

    @JsonProperty('CommuneId', StringConverter, true)
    CommuneId: string = undefined as any;

    @JsonProperty('EstimatedStartDateSegment', DateTimeConverter, true)
    EstimatedStartDateSegment: Date = undefined as any;

    @JsonProperty('EstimatedEndDateSegment', DateTimeConverter, true)
    EstimatedEndDateSegment: Date = undefined as any;

    @JsonProperty('BudgetSegment', NumberConverter, true)
    BudgetSegment: number = undefined as any;

    @JsonProperty('SegmentStatus', NumberConverter, true)
    SegmentStatus: number = undefined as any;

    @JsonProperty('SegmentProgress', NumberConverter, true)
    SegmentProgress: number = undefined as any;

    @JsonProperty('StartDate', DateTimeConverter, true)
    StartDate: Date = undefined as any;

    @JsonProperty('EndDate', DateTimeConverter, true)
    EndDate: Date = undefined as any;

    @JsonProperty('StatusProgress', NumberConverter, true)
    StatusProgress: number = undefined as any;

    @JsonProperty('Note', StringConverter, true)
    Note: string = undefined as any;

}

@JsonObject('Notify')
export class Notify {

    @JsonProperty('Id', NumberConverter, true)
    Id: number = undefined as any;

    @JsonProperty('SenderId', NumberConverter, true)
    SenderId: number = undefined as any;

    @JsonProperty('CreatedAt', DateTimeConverter, true)
    CreatedAt: Date = undefined as any;

    @JsonProperty('UserId', NumberConverter, true)
    UserId: number = undefined as any;

    @JsonProperty('ActionType', NumberConverter, true)
    ActionType: number = undefined as any;

    @JsonProperty('ObjectType', NumberConverter, true)
    ObjectType: number = undefined as any;

    @JsonProperty('ObjectId', NumberConverter, true)
    ObjectId: number = undefined as any;

    @JsonProperty('Title', StringConverter, true)
    Title: string = undefined as any;

    @JsonProperty('Detail', StringConverter, true)
    Detail: string = undefined as any;

    @JsonProperty('Status', NumberConverter, true)
    Status: number = undefined as any;

    @JsonProperty('Sender', UserConverter, true)
    Sender: User = undefined as any;

    @JsonProperty('User', UserConverter, true)
    User: User = undefined as any;

}

@JsonObject('VideoCompress')
export class VideoCompress {

    @JsonProperty('Id', NumberConverter, true)
    Id: number = undefined as any;

    @JsonProperty('UploadPartId', NumberConverter, true)
    UploadPartId: number = undefined as any;

    @JsonProperty('CreatedAt', DateTimeConverter, true)
    CreatedAt: Date = undefined as any;

    @JsonProperty('CreatedById', NumberConverter, true)
    CreatedById: number = undefined as any;

    @JsonProperty('FileName', StringConverter, true)
    FileName: string = undefined as any;

    @JsonProperty('FileSize', NumberConverter, true)
    FileSize: number = undefined as any;

    @JsonProperty('FileLocation', StringConverter, true)
    FileLocation: string = undefined as any;

    @JsonProperty('Url', StringConverter, true)
    Url: string = undefined as any;

    @JsonProperty('VideoSize', NumberConverter, true)
    VideoSize: number = undefined as any;

    @JsonProperty('UploadPart', UploadPartConverter, true)
    UploadPart: UploadPart = undefined as any;

}

@JsonObject('Config')
export class Config {

    @JsonProperty('Id', NumberConverter, true)
    Id: number = undefined as any;

    @JsonProperty('TokenExpire', NumberConverter, true)
    TokenExpire: number = undefined as any;

    @JsonProperty('PageSize', NumberConverter, true)
    PageSize: number = undefined as any;

    @JsonProperty('LogDir', StringConverter, true)
    LogDir: string = undefined as any;

    @JsonProperty('MaxFileSize', NumberConverter, true)
    MaxFileSize: number = undefined as any;

    @JsonProperty('AllowFileType', StringConverter, true)
    AllowFileType: string = undefined as any;

}

@JsonObject('Log')
export class Log {

    @JsonProperty('Id', NumberConverter, true)
    Id: number = undefined as any;

    @JsonProperty('Date', DateTimeConverter, true)
    Date: Date = undefined as any;

    @JsonProperty('Thread', StringConverter, true)
    Thread: string = undefined as any;

    @JsonProperty('Level', StringConverter, true)
    Level: string = undefined as any;

    @JsonProperty('Logger', StringConverter, true)
    Logger: string = undefined as any;

    @JsonProperty('Message', StringConverter, true)
    Message: string = undefined as any;

    @JsonProperty('Exception', StringConverter, true)
    Exception: string = undefined as any;

}

@JsonObject('Document')
export class Document {

    @JsonProperty('Id', NumberConverter, true)
    Id: number = undefined as any;

    @JsonProperty('UserId', NumberConverter, true)
    UserId: number = undefined as any;

    @JsonProperty('CreatedAt', DateTimeConverter, true)
    CreatedAt: Date = undefined as any;

    @JsonProperty('DocName', StringConverter, true)
    DocName: string = undefined as any;

    @JsonProperty('Description', StringConverter, true)
    Description: string = undefined as any;

    @JsonProperty('DocType', NumberConverter, true)
    DocType: number = undefined as any;

    @JsonProperty('DocTypeNavigation', CommoncategoryConverter, true)
    DocTypeNavigation: Commoncategory = undefined as any;

    @JsonProperty('User', UserConverter, true)
    User: User = undefined as any;

    @JsonProperty('DocumentFiles', DocumentFileArrayConverter, true)
    DocumentFiles: DocumentFile[] = [] as any;

}

@JsonObject('DocumentFile')
export class DocumentFile {

    @JsonProperty('Id', NumberConverter, true)
    Id: number = undefined as any;

    @JsonProperty('DocumentId', NumberConverter, true)
    DocumentId: number = undefined as any;

    @JsonProperty('UploadPartId', NumberConverter, true)
    UploadPartId: number = undefined as any;

    @JsonProperty('Document', DocumentConverter, true)
    Document: Document = undefined as any;

    @JsonProperty('UploadPart', UploadPartConverter, true)
    UploadPart: UploadPart = undefined as any;

}
