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